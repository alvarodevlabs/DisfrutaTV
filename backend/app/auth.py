from flask import Blueprint, jsonify, request, url_for, current_app
from . import db, mail
from .models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message

auth_bp = Blueprint('auth', __name__)

def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Restablecer contraseña',
                  sender=current_app.config['MAIL_DEFAULT_SENDER'],
                  recipients=[user.email])
    msg.body = f'''Para restablecer tu contraseña, visita el siguiente enlace:
{url_for('auth.reset_token', token=token, _external=True)}

Si no realizaste esta solicitud, simplemente ignora este correo.
'''
    mail.send(msg)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya está registrado"}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado con éxito"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    access_token = create_access_token(identity={
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })
    return jsonify(access_token=access_token), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_request():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    
    if user:
        send_reset_email(user)
    
    return jsonify({"message": "Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña."}), 200

@auth_bp.route('/reset-password/<token>', methods=['POST'])
def reset_token(token):
    user = User.verify_reset_token(token)
    if user is None:
        return jsonify({"error": "El token es inválido o ha expirado."}), 400

    data = request.get_json()
    password = data.get('password')

    if not password:
        return jsonify({"error": "La contraseña es requerida."}), 400

    user.set_password(password)
    db.session.commit()

    return jsonify({"message": "Tu contraseña ha sido actualizada exitosamente."}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt_identity()
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200
