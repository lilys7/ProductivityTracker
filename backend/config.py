import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from a local .env file if present, even when run from repo root
load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")

# Mongo connection settings, accepting multiple common env var names so local/hosted URIs both work.
MONGO_URL = (
    os.getenv("MONGO_URL")
    or os.getenv("MONGODB_URI")
    or os.getenv("MONGO_URI")
    or "mongodb://localhost:27017"
)
MONGO_DB = (
    os.getenv("MONGO_DB")
    or os.getenv("MONGODB_DB_NAME")
    or os.getenv("MONGODB_DATABASE")
    or "productivitytracker"
)
