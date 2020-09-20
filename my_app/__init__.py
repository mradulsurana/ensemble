import os
from flask import Flask, session, request, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = 'my_app/static/audio/'
ALLOWED_EXTENSIONS = {'wav','mp3'}

app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
db = SQLAlchemy(app)

class Composition(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    compname = db.Column(db.String(20))
    creator = db.Column(db.String(20))
    about = db.Column(db.String(200))
    filepath = db.Column(db.String(200))

db.create_all()

#load main config
app.config.from_pyfile('../config.py')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

import my_app.views
