from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models.user import db, User
from errors import APIError
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            raise APIError('No se proporcionaron datos', 400)
        
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                raise APIError(f'Campo requerido: {field}', 400)
        
        if User.query.filter_by(email=data['email']).first():
            raise APIError('Email ya registrado', 400)

        # Generar username automáticamente si no se recibe
        username = data.get('username') or data['email'].split('@')[0]

        user = User(
            email=data['email'],
            username=username,
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Crear tokens de acceso y refresco
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Usuario registrado exitosamente',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 201
        
    except APIError as e:
        raise e
    except Exception as e:
        raise APIError('Error al registrar usuario', 500)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            raise APIError('No se proporcionaron datos', 400)
        
        if 'email' not in data or 'password' not in data:
            raise APIError('Email y contraseña son requeridos', 400)
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            raise APIError('Credenciales inválidas', 401)
        
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )
        refresh_token = create_refresh_token(
            identity=user.id,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Login exitoso',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        })
        
    except APIError as e:
        raise e
    except Exception as e:
        raise APIError('Error al iniciar sesión', 500)

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            raise APIError('Usuario no encontrado', 404)
            
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )
        
        return jsonify({
            'status': 'success',
            'access_token': access_token
        })
        
    except APIError as e:
        raise e
    except Exception as e:
        raise APIError('Error al refrescar el token', 500)

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            raise APIError('Usuario no encontrado', 404)
            
        return jsonify({
            'status': 'success',
            'user': user.to_dict()
        })
        
    except APIError as e:
        raise e
    except Exception as e:
        raise APIError('Error al obtener información del usuario', 500) 