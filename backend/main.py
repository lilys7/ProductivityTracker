from datetime import datetime
import random
import string
from fastapi import FastAPI, HTTPException
import uvicorn
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from dotenv import load_dotenv

from database import connect_db, close_db, get_db
import hashlib

load_dotenv()
app = FastAPI()

origins = [
    "http://localhost:5173",
    # add url here later (deployed frontend)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

#add a quest ID as well to keep track of xp counts
class QuestRequest(BaseModel):
    userId: str
    title: str
    xp: int
    completed: bool = False

class DuelCreateRequest(BaseModel):
    #duel creator
    userId: str

    # habit + goal settings
    habit: str          # "sleep", "hydration", etc
    targetHours: int
    duration: str      #"24h", "48h", "72h", "7d"

    # group + opponent (string for now; no group backend yet)
    groupId: Optional[str] = None
    opponentId: Optional[str] = None
    opponentName: str

class GroupCreateRequest(BaseModel):
    name: str
    userId: str  # creator/owner

class GroupJoinRequest(BaseModel):
    userId: str
    code: str

class DuelAcceptRequest(BaseModel):
    userId: str

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def generate_group_code(length: int = 5) -> str:
    """Return a random alphanumeric code like 'A1B2C'."""
    alphabet = string.ascii_uppercase + string.digits
    return "".join(random.choice(alphabet) for _ in range(length))

@app.on_event("startup")
async def on_startup():
    await connect_db()


@app.on_event("shutdown")
async def on_shutdown():
    await close_db()


@app.get("/")
def root():
    return {"Hello": "backend running"}


@app.post("/auth/register")
async def register(payload: RegisterRequest):
    """
    Create a new user account.
    If the email already exists, return 400.
    """
    db = get_db()

    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists.",
        )

    doc = {
        "email": payload.email,
        "password": hash_password(payload.password),
        "created_at": datetime.utcnow().isoformat(),
        "xp": 0
    }
    result = await db.users.insert_one(doc)

    return {
        "id": str(result.inserted_id),
        "email": doc["email"],
        "created_at": doc["created_at"],
        "xp": doc["xp"]
    }

#quests adding
@app.post("/quests")
async def create_quest(quest: QuestRequest):
    db = get_db()
    data = quest.dict()
    result = await db.quests.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


#fetch quests
@app.get("/quests/{userId}")
async def list_quests(userId: str):
    db = get_db()
    quests = await db.quests.find({"userId": userId}).to_list(100)
    # convert _id to string
    for q in quests:
        q["_id"] = str(q["_id"])
    return quests

#when user completes a quest, make sure the xp value in the database is updated as well
@app.post("/quests/complete/{questId}")
async def complete_quest(questId: str):
    db = get_db()

    quest = await db.quests.find_one({"_id": ObjectId(questId)})
    if not quest:
        raise HTTPException(404, "Quest not found")

    # mark quest complete
    await db.quests.update_one(
        {"_id": ObjectId(questId)},
        {"$set": {"completed": True}}
    )

    # increment user xp
    await db.users.update_one(
        {"_id": ObjectId(quest["userId"])},
        {"$inc": {"xp": quest["xp"]}}
    )

    return {"ok": True}



@app.post("/groups")
async def create_group(payload: GroupCreateRequest):
    """Create a new group with a random 5-char code and add creator as member."""
    db = get_db()

    # generate a unique code
    code = None
    max_attempts = 10
    for _ in range(max_attempts):
        candidate = generate_group_code(5)
        exists = await db.groups.find_one({"code": candidate})
        if not exists:
            code = candidate
            break
    if code is None:
        raise HTTPException(status_code=500, detail="Unable to generate group code.")

    doc = {
        "name": payload.name.strip(),
        "code": code,
        "ownerId": payload.userId,
        "members": [payload.userId],
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await db.groups.insert_one(doc)
    # also record membership on the user document
    try:
        await db.users.update_one(
            {"_id": ObjectId(payload.userId)},
            {"$addToSet": {"groups": str(result.inserted_id)}},
        )
    except Exception:
        # ignore silently if userId is not a valid ObjectId; group still created
        pass
    return {
        "id": str(result.inserted_id),
        "name": doc["name"],
        "code": doc["code"],
        "ownerId": doc["ownerId"],
        "members": doc["members"],
    }


@app.post("/groups/join")
async def join_group(payload: GroupJoinRequest):
    """Join an existing group via code."""
    db = get_db()
    code = payload.code.strip().upper()
    group = await db.groups.find_one({"code": code})
    if not group:
        raise HTTPException(status_code=404, detail="Group code not found.")

    await db.groups.update_one(
        {"_id": group["_id"]},
        {"$addToSet": {"members": payload.userId}},
    )
    try:
        await db.users.update_one(
            {"_id": ObjectId(payload.userId)},
            {"$addToSet": {"groups": str(group["_id"])}},
        )
    except Exception:
        pass

    # return updated group info
    updated = await db.groups.find_one({"_id": group["_id"]})
    return {
        "id": str(updated["_id"]),
        "name": updated["name"],
        "code": updated["code"],
        "ownerId": updated.get("ownerId"),
        "members": updated.get("members", []),
    }


@app.get("/groups/{userId}")
async def list_groups(userId: str):
    """List groups a user belongs to."""
    db = get_db()
    groups = await db.groups.find({"members": userId}).to_list(50)
    resp = []
    for g in groups:
        resp.append({
            "id": str(g["_id"]),
            "name": g.get("name"),
            "code": g.get("code"),
            "ownerId": g.get("ownerId"),
            "members": g.get("members", []),
        })
    return resp


@app.get("/groups/{groupId}/members")
async def list_group_members(groupId: str):
    """Return member info (id + email) for a group."""
    db = get_db()
    try:
        group = await db.groups.find_one({"_id": ObjectId(groupId)})
    except Exception:
        group = None
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")

    member_ids_raw = group.get("members", [])
    object_ids = []
    for mid in member_ids_raw:
        try:
            object_ids.append(ObjectId(mid))
        except Exception:
            continue

    members = []
    if object_ids:
        users = await db.users.find({"_id": {"$in": object_ids}}).to_list(len(object_ids))
        for u in users:
            members.append({
                "id": str(u["_id"]),
                "email": u.get("email"),
            })
    return {"groupId": groupId, "members": members}


#user auth and login endpoint
@app.post("/auth/login")
async def login(payload: LoginRequest):
    """
    Login existing user.
    - If user does NOT exist -> 404
    - If password is wrong -> 401
    - Otherwise, return user info
    """
    db = get_db()

    existing = await db.users.find_one({"email": payload.email})
    if not existing:
        raise HTTPException(
            status_code=404,
            detail="No account found with that email.",
        )

    hashed = hash_password(payload.password)
    if existing.get("password") != hashed:
        raise HTTPException(
            status_code=401,
            detail="Incorrect password.",
        )

    return {
        "id": str(existing["_id"]),
        "email": existing["email"],
        "created_at": existing.get("created_at"),
    }

@app.get("/leaderboard")
async def leaderboard():
    db = get_db()
    users = await db.users.find().sort("xp", -1).to_list(50)
    for u in users:
        u["_id"] = str(u["_id"])
    return users


#duel creation endpoint 
@app.post("/duels")
async def create_duel(duel: DuelCreateRequest):
    #create new duel, store at pending with no progress
    db = get_db()
    data = duel.dict()

    # If a group is provided, ensure opponent is in that group
    if data.get("groupId"):
        try:
            group = await db.groups.find_one({"_id": ObjectId(data["groupId"])})
        except Exception:
            group = None
        if not group:
            raise HTTPException(status_code=404, detail="Group not found.")
        members = group.get("members", [])
        if data.get("opponentId") not in members:
            raise HTTPException(status_code=400, detail="Opponent must be in the group.")

    # basic fields
    # Example XP formula: 250 base + 10 * targetHours
    xp = 250 + 10 * data["targetHours"]

    doc = {
        "userId": data["userId"],           # creator of the duel
        "habit": data["habit"],             # e.g. "sleep"
        "targetHours": data["targetHours"],
        "duration": data["duration"],
        "groupId": data.get("groupId"),
        "opponentId": data.get("opponentId"),
        "opponentName": data["opponentName"],
        "xp": xp,
        "status": "pending",                # start pending
        "youPct": 0,                        # % progress for creator
        "oppPct": 0,                        # % progress for opponent
        "result": None,                     # "won"/"lost" later
        "created_at": datetime.utcnow().isoformat(),
    }

    result = await db.duels.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@app.get("/duels/{userId}")
async def list_duels(userId: str):
    """
    Return duels where the user is either the creator or the opponent.
    Also returns perspective-adjusted progress fields so UI can use `youPct`.
    """
    db = get_db()
    duels = await db.duels.find({"$or": [{"userId": userId}, {"opponentId": userId}]}).to_list(100)

    ui_duels = []
    for d in duels:
        habit_raw = d.get("habit", "")
        habit_label = habit_raw.capitalize() if habit_raw else ""
        viewer_role = "creator" if d.get("userId") == userId else "opponent"

        # adjust progress so "you" is always the viewer
        if viewer_role == "creator":
            you_pct = d.get("youPct", 0)
            opp_pct = d.get("oppPct", 0)
            opponent_label = d.get("opponentName", "Friend")
        else:
            you_pct = d.get("oppPct", 0)
            opp_pct = d.get("youPct", 0)
            opponent_label = "Challenger"

        ui_duels.append({
            "id": str(d["_id"]),
            "title": f"{habit_label} Duel" if habit_label else d.get("title", "Habit Duel"),
            "habit": habit_label,
            "opponent": opponent_label,
            "xp": d.get("xp", 250),
            "timeLeft": "24h left",
            "status": d.get("status", "pending"),
            "youPct": you_pct,
            "oppPct": opp_pct,
            "result": d.get("result"),
            "viewerRole": viewer_role,
        })

    return ui_duels


@app.post("/duels/{duelId}/accept")
async def accept_duel(duelId: str, payload: DuelAcceptRequest):
    """Opponent accepts a pending duel, moving it to active."""
    db = get_db()
    try:
        duel = await db.duels.find_one({"_id": ObjectId(duelId)})
    except Exception:
        duel = None
    if not duel:
        raise HTTPException(status_code=404, detail="Duel not found.")
    if duel.get("status") != "pending":
        raise HTTPException(status_code=400, detail="Duel is not pending.")
    if duel.get("opponentId") != payload.userId:
        raise HTTPException(status_code=403, detail="Only the invited opponent can accept.")

    await db.duels.update_one(
        {"_id": duel["_id"]},
        {"$set": {"status": "active", "accepted_at": datetime.utcnow().isoformat()}},
    )

    updated = await db.duels.find_one({"_id": duel["_id"]})
    return {
        "id": str(updated["_id"]),
        "status": updated.get("status"),
        "accepted_at": updated.get("accepted_at"),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
