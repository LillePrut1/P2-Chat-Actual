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

#Hjælper funktion: Tjek token
def check_token(): 
    data = request.get_json() #oversætter indkommende json data via HTTP, til python sprog. Laver det til en dictionary, så vi kan tilgå det med keys.
    token = data.get("temp_token") #Det der er blevet modtaget fra klienten markeret som "temp_token" i JSON, bliver nu tildelt variablen "token".
    with open("data/users.json", "r") as f:  #Skulle der ske fejl under åbningen af filen, bruger vi "with" - kommandoen, som automatisk lukker filen efter brug, selv hvis der opstår en fejl. Det er en god praksis for at undgå memory leaks.\
        userjson = json.load(f)  #users.json er converteret till en python-liste, som vi nu kan tilgå, og aflæse

    user = None #vi starter med at sætte user til None, og hvis vi finder en matchende token i users.json, vil vi opdatere user variablen til at indeholde det korrekte brugernavn. Hvis vi ikke finder en matchende token, vil user forblive None, og vi kan håndtere det som en ugyldig token senere i koden.
    token_to_user = {
        u.get("temp_token"): u["user"]
         for u in userjson if u.get("temp_token")
     } #Her laver vi en "dictionary comprehension", hvor hver "temp_token" i userjson bliver en key, og hver "user" bliver den tilsvarende value. Resultatet er en dictionary, hvor vi hurtigt kan slå et token op for at finde det tilhørende brugernavn.
    
    user = token_to_user.get(token) #Her tildeler vi variablen "user" til det brugernavn, som tokenet tilhører
   
    if user is None:
            return jsonify({"error": "Invalid token"}), 401 
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
# create group
# ======================

@app.post("/create_group")
def create_group():
    user = check_token()
    if not user:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    group_name = data.get("group")

    path = f"data/{group_name}.json"

    if os.path.exists(path):
        return jsonify({"error": "Group already exists"}), 400

    # create group file
    group_data = {
        "groupname": group_name,
        "members": [
            {"user": user["user"]}
        ]
    }

    save_json(path, group_data)

    # create message file
    os.makedirs("data/messages", exist_ok=True)
    save_json(f"data/messages/{group_name}.json", [])

    return jsonify({"status": "created"})


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