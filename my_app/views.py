import os
from my_app import app
from flask import render_template, request, redirect, flash, url_for, session, send_from_directory
from werkzeug.utils import secure_filename

import uuid

import requests


#@app.route('/favicon.ico')
#def favicon():
#    return send_from_directory(os.path.join(app.root_path, 'static'),
#                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/composition")
def composition():
    return render_template("composition.html")

@app.route("/login")
def login():
    return render_template("login.html")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file:
            filename = str(uuid.uuid4().hex) + ".wav"
            #filename = secure_filename(file.filename)
            print(os.getcwd());
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            #file.save(os.path.join('../static/audio/', filename))
            return filename
    return 'unkown error occured'
