from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
#from sqlalchemy.orm import  Mapped, mapped_column
from flask_migrate import Migrate
#from datetime import datetime

from database import db
from models import User
from forms import UserForm


app = Flask(__name__)


USER_DB = 'postgres'
USER_PASSWORD = '123456'
SERVER_DB = 'localhost'
NAME_DB = 'chatbot'
FULL_URL_DB=f'postgresql://{USER_DB}:{USER_PASSWORD}@{SERVER_DB}/{NAME_DB}'

app.config['SQLALCHEMY_DATABASE_URI'] = FULL_URL_DB


db.init_app(app)
#Migrar el modelo
migrate = Migrate()
migrate.init_app(app, db)

app.config['SECRET_KEY'] = 'LlaveSecreta'


@app.route('/inicio')
def inicio():
    user_id = request.cookies.get('user_id')
    user = User.query.get(user_id) if user_id else None
    return render_template('inicio.html', user=user)


#Iniciar la sesion con algun usuario de la base de datos
@app.route('/sesion', methods=['GET', 'POST'])
def sesion():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Buscar al usuario en la base de datos
        user = User.query.filter_by(email=email).first()

        # Comparar directamente la contraseña
        if user and user.password == password:
            # Crear una respuesta y establecer una cookie
            response = make_response(redirect(url_for('inicio')))
            response.set_cookie('user_id', str(user.id), httponly=True)  # Cookie segura
            return response
        else:
             # Mostrar mensaje de error si las credenciales son incorrectas
            flash('Correo o contraseña incorrectos', 'error')

    return render_template('sesion.html')


#Mantener la sesion iniciada 
@app.route('/is_logged_in', methods=['GET'])
def is_logged_in():
    user_id = request.cookies.get('user_id')  # Obtener la cookie
    if user_id:
        user = User.query.get(user_id)
        if user:
            return jsonify({'logged_in': True, 'user': {'id': user.id, 'name': user.name}})
    return jsonify({'logged_in': False})


@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(redirect(url_for('sesion')))  # Redirigir a la página de inicio de sesión
    response.delete_cookie('user_id')  # Eliminar la cookie
    return response




@app.route('/Upload', methods=['GET', 'POST'])
def upload():
    pass



        
@app.route('/login', methods=['GET', 'POST'])
def insertar_user():
    user = User()  # Crear una instancia del modelo User
    userForm = UserForm(obj=user)  # Crear el formulario basado en el modelo
    if request.method == 'POST' and userForm.validate_on_submit():
        userForm.populate_obj(user)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('inicio'))

    return render_template('addUser.html', form=userForm)
    
    