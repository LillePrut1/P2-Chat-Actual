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



#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# Her defineres de forkellige fukntioner, som skal bruges senere
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

#Når serveren modtager en POST-forespørgsel til "/login", vil denne funktion blive kaldt.

#Check om brugeren er logget ind. Hvis ikke, send videre til /login. Hvis sandt, hent inbox og rum for denne bruger, og retuner det til klienten.
if userloggedin == false:
     redirect("/login")



@app.post("/register")
#Vi modtager input fra klienten, og konverterer det til python sprog. Derefter tjekker vi om brugeren allerede finde is /users.json. Hvis ikke, konverterer vi passwordet til bytes, hasher med bcrypt der genererer salt, og gemmer derefter "user, hashedpw, publickey" i /users.json.
def register():  
        user = data.get("user")
        password = data.get("password")
        publickey = data.get("publickey")
        if any(u["user"] == user for u in load_json("data/users.json")):
            return jsonify({"error": "Brugernavn allerede taget"}), 400
        else: 
            #her Krypterer vi med bcrypt. bcrypt håndterer både hashing og salt. Vi tænker at skifte til at gøre det manuelt med SHA256 og os.urandom
            password_bytes = password.encode("utf-8")
            hashedpw = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
            save_json("data/users.json", {"user": user, "hashedpw": hashedpw, "publickey": publickey})


    

@app.post("/login")
def login():
#Modtag username og password fra klienten. Check i "data/users.json" om brugeren findes. Hvis ja, føj gemte salt til passwordet og hash det. Sammenlign det med det gemte hash. Hvis de matcher, retuner en succesbesked, ellers en fejlbesked.
#Send bruger videre til "/inbox" endpointet for at hente en liste over tilgængelige rum.
        
#her gør vi hvad der skulle gøres i login-funktionen hvis vi SKAL benytte bcrypt.
        bcrypt.checkpw(password_bytes, hashedpw):
            return jsonify({"message": "Login successful"}), 200

EFTER BRUGEREN ER LOGGET IND, SKAL BRUGEREN TILDELES EN LOGIN-TOKEN, SOM SKAL SENDES MED I HVER FØLGENDE FORESPØRGSEL FOR AT BEVISE AT DE ER LOGGET IND. DENNE TOKEN KAN VÆRE EN SIMPEL STRING, DER GENERERES VED LOGIN OG GEMMES I MINNET PÅ SERVEREN SAMMEN MED BRUGERNAVNET. NÅR EN FORESpørgsel MODTAGES, TJEKKER SERVEREN OM TOKENET ER GYLDIGT OG HØRER TIL DEN RIGTIGE BRUGER, FØR DEN UDFØRER DEN ANBEFALTE HANDLING.

userloggedin = true
redirect("/inbox")


#Når serveren modtager en GET-forespørgsel til "/rooms", vil denne funktion blive kaldt. 
#Den tjekker din login-token for at finde ud af hvilken bruger vi har at gøre med. Den tilgår nu brugerens personlige fil i "data/username.json" for at tjekke hvilke rum brugeren er medlem af. 
#Disse rum gemmes som en python-liste og tildeler "groups" denne værdi         
@app.get("/rooms")
def get_rooms():
    user = check_token() #Her kalder vi vores helper function "check_token" for at finde ud af hvilken bruger der har sendt forespørgslen. Hvis tokenet er ugyldigt, vil check_token returnere en fejlbesked, og funktionen vil ikke fortsætte.
    with open("data/"+user+".json", "r") as f:
        user_rooms = json.load(f)
        groups = [item["groupname"] for item in user_rooms]  # groups har nu værdien ["rum1", "rum2", "rum3", "rum4", "rum5"] og er nu en "list"
    return jsonify({"groups": groups}), 200 #Her sendes gruppelisten tilbage til klienten i JSON-format. Klienten kan nu bruge denne liste til at vise de tilgængelige rum for brugeren.



# !!!!!!!!!Fra linje 75-87 håndterer vi tokens. Dette kan sikkert genbruges, overvej at lave det til en helper function, så vi ikke skal skrive det hver gang vi skal tjekke token.!!!!!!!!


#Dette var hvordan vi håndterede login-token før 
"""""
   for user_data in userjson:
        if user_data.get("temp_token") == token:
            user = user_data["user"]
            break
    if user is None:
        return jsonify({"error": "Invalid token"}), 401
"""



    Tjek login-token for at finde ud af hvilken bruger vi har at gøre med. Tjek nu brugrens medlemsskab for hvert rum. Retuner alle rum, som klienten har adgang til.
    


#Når serveren modtager en GET-forespørgsel til "/messages", vil denne funktion blive kaldt. Den henter alle beskeder fra "data/messages.json" og returnerer dem som JSON.
@app.get("/messages")
def get_message():
   




#Når serveren modtager en POST-forespørgsel til "/messages", vil denne funktion blive kaldt. 
@app.post("/messages")
def post_message():
Check hvilket rum der er vagt. Gem klientens tilsendte "ciphertext" i det valgte rum, noter også timestamp. 
I f-eks "data/rum1.json". 



    def nonce_gen ():
    Generer et unikt nonce for hver besked.Genererer også et timestamp til beskeden. Returner nonce'et.


    def checksign ():
    Tjek om beskeden er signeret korrekt. Hvis ja, gem besked, ellers retuner en fejlbesked.



@app.post("/group_delete")
def group_delete():
    Check om brugeren har administrative rettigheder i det valgte rum. Hvis ja, slet "rum.json". Retuner en succesbesked, ellers en fejlbesked.


@app.post("/group_add")
def group_add():
    Check om gruppen eksisterer. Hvis ja, retuner fejlbeskedd "navn allerede brugt". Hvis nej, generer rum, giv brugeren administrative rettigheder i det rum, og retuner en succesbesked.
    def group_keygen():
        Vent på klienten har generet en "encrypted group key" og sendt den til serveren. Når den modtages, gem den i "data/rumX.json". Gem også brugerens public-krypterede group key i "data/users.json" sammen med brugernavnet. Retuner en succesbesked.
    def group_idgen():
        Generer et unikt group ID for rummet. Returner group ID'et.
    


@app.post("/group_add_user")
def group_add_user():
    Check om brugeren har administrative rettigheder i det valgte rum. Hvis ja, tilføj den nye bruger til "rum.json" og retuner en succesbesked, ellers retuner en fejlbesked.
    def public_key_fetch_save():
        Fetch den nyes bruger public key fra "data/users.json".  Sen pubic-key til klienten, så den kan kryptere group key'en for den nye bruger. Når den modtages, gem den i "data/rumX.json" sammen med brugernavnet. Retuner en succesbesked.


@app.post("/group_remove_user")
def group_remove_user():
    Check om brugeren har administrative rettigheder i det valgte rum. Hvis ja, fjern den valgte bruger fra "rum.json" og returner en succesbesked, ellers returner en fejlbesked.
    def group_key_update():
        Vent på klienten har generet en "new group key" og sendt den til serveren. herefter fetcher vi alle tillbageværende rummets brugeres publlic keys. disse sendes til klienten, som er ved at administrere. vi afventer at klienten krypterer group key med alle public keys og gemmer herefter de krypterede group keys i "rumX.json". Retuner en succesbesked.




 def group_keygen():






#Dette starter Flask-serveren 
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)


