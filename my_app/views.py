from my_app import app
from flask import render_template, request, redirect
import requests

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/composition")
def composition():
    return render_template("composition.html")
