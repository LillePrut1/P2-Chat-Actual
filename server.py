from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import bcrypt
import secrets
import time
import os

app = Flask(__name__)
CORS(app)

# ======================
# HELPERS
# ======================

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def check_token():
    data = request.get_json()
    token = data.get("token")

    users = load_json("data/users.json")

    user = next((u for u in users if u.get("temp_token") == token), None)

    if not user:
        return None

    return user


# ======================
# AUTH
# ======================

@app.post("/login")
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    users = load_json("data/users.json")

    user = next((u for u in users if u["user"] == username), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if password != "1234":
        return jsonify({"error": "Wrong password"}), 401

    token = secrets.token_urlsafe(32)
    user["temp_token"] = token

    save_json("data/users.json", users)

    return jsonify({"token": token})


# ======================
# GET ROOMS
# ======================

@app.post("/rooms")
def get_rooms():
    user = check_token()
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    username = user["user"]
    groups = []

    for file in os.listdir("data"):
        if file.startswith("rum") and file.endswith(".json"):
            group = load_json("data/" + file)

            if isinstance(group, dict) and "members" in group:
                if any(m["user"] == username for m in group["members"]):
                    groups.append(group["groupname"])

    return jsonify({"groups": groups})


# ======================
# GET MESSAGES
# ======================

@app.post("/messages")
def get_messages():
    user = check_token()
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    group = data.get("group")

    group_data = load_json(f"data/{group}.json")

    if not any(m["user"] == user["user"] for m in group_data.get("members", [])):
        return jsonify({"error": "Not in group"}), 403

    path = f"data/messages/{group}.json"
    messages = load_json(path)

    return jsonify({"messages": messages})


# ======================
# SEND MESSAGE
# ======================

@app.post("/send")
def send_message():
    user = check_token()
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    group = data.get("group")
    ciphertext = data.get("ciphertext")

    msg = {
        "sender": user["user"],
        "ciphertext": ciphertext,
        "timestamp": time.time()
    }

    path = f"data/messages/{group}.json"
    messages = load_json(path)
    messages.append(msg)

    save_json(path, messages)

    return jsonify({"status": "ok"})


# ======================
# START SERVER
# ======================

if __name__ == "__main__":
    app.run(port=8000, debug=True)