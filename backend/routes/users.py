from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User, db
import os
from werkzeug.utils import secure_filename

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify(user.to_dict())

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    
    if 'username' in data:
        # Verificar si el username ya existe
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'El nombre de usuario ya está en uso'}), 400
        user.username = data['username']
    
    if 'bio' in data:
        user.bio = data['bio']

    db.session.commit()
    return jsonify(user.to_dict())

@users_bp.route('/profile/picture', methods=['POST'])
@jwt_required()
def update_profile_picture():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    if 'picture' not in request.files:
        return jsonify({'error': 'No se ha enviado ninguna imagen'}), 400

    file = request.files['picture']
    if file.filename == '':
        return jsonify({'error': 'No se ha seleccionado ninguna imagen'}), 400

    if file:
        filename = secure_filename(file.filename)
        # Generar un nombre único para el archivo
        unique_filename = f"{user_id}_{filename}"
        file_path = os.path.join('uploads', 'profile_pictures', unique_filename)
        
        # Asegurar que el directorio existe
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        file.save(file_path)
        user.profile_picture = file_path
        db.session.commit()
        
        return jsonify({
            'message': 'Imagen de perfil actualizada',
            'profile_picture': file_path
        })

@users_bp.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    # Eliminar archivos asociados
    if user.profile_picture:
        try:
            os.remove(user.profile_picture)
        except:
            pass  # Ignorar errores al eliminar archivos

    # Eliminar documentos
    for doc in user.documents:
        try:
            os.remove(doc.file_path)
        except:
            pass
        db.session.delete(doc)

    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'Perfil eliminado correctamente'}) 