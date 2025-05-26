from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.document import Document
from models.user import db
import os
import uuid

documents_bp = Blueprint('documents', __name__)

# Configuración de tipos de archivo permitidos y sus tamaños máximos (en bytes)
ALLOWED_EXTENSIONS = {
    # Documentos
    'pdf': 10 * 1024 * 1024,  # 10MB
    'doc': 10 * 1024 * 1024,  # 10MB
    'docx': 10 * 1024 * 1024,  # 10MB
    'txt': 1 * 1024 * 1024,   # 1MB
    'rtf': 5 * 1024 * 1024,   # 5MB
    
    # Imágenes
    'jpg': 5 * 1024 * 1024,   # 5MB
    'jpeg': 5 * 1024 * 1024,  # 5MB
    'png': 5 * 1024 * 1024,   # 5MB
    'gif': 5 * 1024 * 1024,   # 5MB
    'webp': 5 * 1024 * 1024,  # 5MB
    
    # Audio
    'mp3': 20 * 1024 * 1024,  # 20MB
    'wav': 20 * 1024 * 1024,  # 20MB
    'ogg': 20 * 1024 * 1024,  # 20MB
    
    # Video
    'mp4': 50 * 1024 * 1024,  # 50MB
    'avi': 50 * 1024 * 1024,  # 50MB
    'mov': 50 * 1024 * 1024,  # 50MB
    
    # Otros
    'zip': 20 * 1024 * 1024,  # 20MB
    'rar': 20 * 1024 * 1024,  # 20MB
    '7z': 20 * 1024 * 1024,   # 20MB
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_max_size(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    return ALLOWED_EXTENSIONS.get(ext, 0)

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    if 'file' not in request.files:
        return jsonify({'error': 'No se proporcionó ningún archivo'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipo de archivo no permitido'}), 400

    # Verificar tamaño del archivo
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    max_size = get_max_size(file.filename)
    if file_size > max_size:
        return jsonify({
            'error': f'El archivo excede el tamaño máximo permitido de {max_size / (1024 * 1024)}MB'
        }), 400

    user_id = get_jwt_identity()
    description = request.form.get('description', '')
    is_public = request.form.get('is_public', 'false').lower() == 'true'

    # Generar nombre único para el archivo
    original_filename = secure_filename(file.filename)
    file_ext = original_filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    
    # Crear directorio si no existe
    upload_dir = os.path.join('uploads', 'documents', str(user_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, unique_filename)
    file.save(file_path)

    document = Document(
        filename=unique_filename,
        original_filename=original_filename,
        file_path=file_path,
        file_type=file_ext,
        file_size=file_size,
        description=description,
        is_public=is_public,
        user_id=user_id
    )

    db.session.add(document)
    db.session.commit()

    return jsonify(document.to_dict()), 201

@documents_bp.route('/', methods=['GET'])
@jwt_required()
def get_documents():
    user_id = get_jwt_identity()
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify([doc.to_dict() for doc in documents])

@documents_bp.route('/<int:document_id>', methods=['GET'])
@jwt_required()
def get_document(document_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first_or_404()
    return jsonify(document.to_dict())

@documents_bp.route('/<int:document_id>', methods=['PUT'])
@jwt_required()
def update_document(document_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first_or_404()
    
    data = request.get_json()
    if 'description' in data:
        document.description = data['description']
    if 'is_public' in data:
        document.is_public = data['is_public']
    
    db.session.commit()
    return jsonify(document.to_dict())

@documents_bp.route('/<int:document_id>', methods=['DELETE'])
@jwt_required()
def delete_document(document_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first_or_404()
    
    # Eliminar archivo físico
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.session.delete(document)
    db.session.commit()
    return '', 204

@documents_bp.route('/<int:document_id>/download', methods=['GET'])
@jwt_required()
def download_document(document_id):
    user_id = get_jwt_identity()
    document = Document.query.filter_by(id=document_id, user_id=user_id).first_or_404()
    
    if not os.path.exists(document.file_path):
        return jsonify({'error': 'Archivo no encontrado'}), 404
    
    return send_file(
        document.file_path,
        as_attachment=True,
        download_name=document.original_filename
    ) 