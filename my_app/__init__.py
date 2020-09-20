import os
from flask import Flask, session, request, flash, redirect, url_for
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = '../static/audio'
ALLOWED_EXTENSIONS = {'wav','mp3'}

app = Flask(__name__)

#load main config
app.config.from_pyfile('../config.py')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

import my_app.views
