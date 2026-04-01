from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import json
import bcrypt
import time

app = Flask(__name__)
CORS(app)




#Hjælper funktion: Tjek token
def check_token(): 
    data = request.get_json() #oversætter indkommende json data via HTTP, til python sprog. Laver det til en dictionary, så vi kan tilgå det med keys.
    token = data.get("temp_token") #Det der er blevet modtaget fra klienten markeret som "temp_token" i JSON, bliver nu tildelt variablen "token".
    with open("data/users.json", "r") as f:  #Skulle der ske fejl under åbningen af filen, bruger vi "with" - kommandoen, som automatisk lukker filen efter brug, selv hvis der opstår en fejl. Det er en god praksis for at undgå memory leaks.\
        userjson = json.load(f)  #users.json er converteret till en python-liste, som vi nu kan tilgå, og aflæse

    user = None #vi starter med at sætte user til None, og hvis vi finder en matchende token i users.json, vil vi opdatere user variablen til at indeholde det korrekte brugernavn. Hvis vi ikke finder en matchende token, vil user forblive None, og vi kan håndtere det som en ugyldig token senere i koden.
    token_to_user = {u["temp_token"]: u["user"] for u in userjson} #Her laver vi en "dictionary comprehension", hvor hver "temp_token" i userjson bliver en key, og hver "user" bliver den tilsvarende value. Resultatet er en dictionary, hvor vi hurtigt kan slå et token op for at finde det tilhørende brugernavn.
    
    user = token_to_user.get(token) #Her tildeler vi variablen "user" til det brugernavn, som tokenet tilhører
   
    if user is None:
            return jsonify({"error": "Invalid token"}), 401 
    return user


# Hjælper function: read JSON
def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

# Hjælper function: write JSON
def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)




def get_rooms():
    user = check_token() #Her kalder vi vores helper function "check_token" for at finde ud af hvilken bruger der har sendt forespørgslen. Hvis tokenet er ugyldigt, vil check_token returnere en fejlbesked, og funktionen vil ikke fortsætte.
    if isinstance(user, tuple):  #Lige nu så bliver user returneret som en tuple hvis tokenet er ugylldigt. Dette tjekker vi for her, VED IKKE HVORFOR DET LØSER PROBLEMET, MEN DET GØR DET.
        return user
    with open("data/"+user+".json", "r") as f:
        user_rooms = json.load(f)
        groups = [item["groupname"] for item in user_rooms]  # groups har nu værdien ["rum1", "rum2", "rum3", "rum4", "rum5"] og er nu en "list"
    return jsonify({"groups": groups}), 200 #Her sendes gruppelisten tilbage til klienten i JSON-format. Klienten kan nu bruge denne liste til at vise de tilgængelige rum for brugeren.


app = Flask(__name__)
CORS(app)

@app.post("/get_rooms")
def api_get_rooms():
    return get_rooms()

if __name__ == "__main__":
    app.run(debug=True)


# VI SKAL ÆNDRE I USER.JSON HVER GANG BRUGEREN LOGGER IND, FOR AT GIVE EN TOMPORARY TOKEN, OG SLETTE DEN NÅR DE LOGGER UD. 
# DET ER DET DER GØR AT VI KAN TJEKKE OM DE ER LOGGET IND, OG HVILKEN BRUGER DER ER LOGGET IND. 
# HVIS DE IKKE ER LOGGET IND, SÅ VIL CHECK_TOKEN FUNKTIONEN RETURNERE EN FEJL, OG VI KAN HÅNDTERE DET I GET_ROOMS FUNKTIONEN, SÅ VI IKKE PRØVER AT LÆSE EN FIL DER IKKE FINDES.
# VED IKKE OM DETTE ER EN GOD LØSNING. MEN DET VIRKER!!!!
# START SERVEREN HER I VISUAL CODE, DEREFTER:
# KØR PÅ MAC/LINUX TERMINAL:
# curl -X POST http://127.0.0.1:5000/get_rooms      -H "Content-Type: application/json"      -d '{"temp_token": "yappayappayappa"}'
# WINDOWS:
# curl -Method POST -Uri "http://127.0.0.1:5000/get_rooms" -Body '{"temp_token":"yappayappayappa"}' -ContentType "application/json"
# FOR AT TESTE, OM VI FÅR DE RUM TILBAGE SOM NICK HAR.
# SE DET VIRKE