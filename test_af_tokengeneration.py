from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import json
import bcrypt
import time
import secrets
def login():       
  #her gør vi hvad der skulle gøres i login-funktionen hvis vi SKAL benytte bcrypt.
    save_json("data/users.json", {"temp_token": secrets.token_urlsafe(32)}) #her tilføjer vi en temp_token, som skal bruges til at tjekke om brugeren er logget ind i de følgende funktioner. temp_token bliver genereret med secrets-modulet, som generer en URL-sikker (Hvad det så end betyder) token, der er 32 bytes lang.
    userloggedin = true
    redirect("/inbox")
    return jsonify({"message": "Login successful"}), 200 