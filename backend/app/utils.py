from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        print(f"Identity from JWT: {identity}")
        role = identity.get('role') if isinstance(identity, dict) else None
        print(f"User role: {role}")
        if role != 'admin':
            return jsonify({"error": "Acceso denegado: se requiere rol de administrador"}), 403
        return fn(*args, **kwargs)
    return wrapper
