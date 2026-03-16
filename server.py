from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import bcrypt
import time

app = Flask(__name__)
CORS(app)






#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# Her defineres de forkellige fukntioner, som skal bruges senere
#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

#Når serveren modtager en POST-forespørgsel til "/login", vil denne funktion blive kaldt.
@app.post("/login")
def login():
    Modtag username og password fra klienten. Check i "data/users.json" om brugeren findes. Hvis ja, føj gemte salt til passwordet og hash det. Sammenlign det med det gemte hash. Hvis de matcher, retuner en succesbesked, ellers en fejlbesked.






#Når serveren modtager en GET-forespørgsel til "/rooms", vil denne funktion blive kaldt. Den henter alle rum fra "data/rooms.json" og returnerer dem som JSON, så klienten kan vise en liste over tilgængelige rum.
@app.get("/rooms")
def get_rooms();
    Hent alle rum fra "\data", tjek whitelist for hvert rum. Retuner alle rum, som klienten har adgang til.
    


#Når serveren modtager en GET-forespørgsel til "/messages", vil denne funktion blive kaldt. Den henter alle beskeder fra "data/messages.json" og returnerer dem som JSON.
@app.get("/messages")
def get_message():
    Check hvilket rum der er vagt. Retuner alle beskeder i det rum. Kør en loop hver 3 sek, og tjek om der er nye beskeder i det rum. Hvis der er, retuner dem til klienten.




#Når serveren modtager en POST-forespørgsel til "/messages", vil denne funktion blive kaldt. 
@app.post("/messages")
def post_message():
Check hvilket rum der er vagt. Gem klientens tilsendte "ciphertext" i det valgte rum, noter også timestamp. 
I f-eks "data/rum1.json". 






#Dette starter Flask-serveren 
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)