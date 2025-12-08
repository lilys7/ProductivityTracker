import os
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URL, MONGO_DB


client: AsyncIOMotorClient | None = None
db = None

async def connect_db():
  """Initialize the Mongo client once on app startup."""
  global client, db
  if client is None:
    client = AsyncIOMotorClient(
            MONGO_URL,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
    db = client[MONGO_DB]


async def close_db():
  """Close the Mongo client on shutdown."""
  global client
  if client:
    client.close()
    client = None


def get_db():
  if db is None:
    raise RuntimeError("Database not initialized")
  return db
