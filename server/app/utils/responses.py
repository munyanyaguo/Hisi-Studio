from flask import jsonify
from typing import Any, Dict, Optional

def success_response(
        data: Any = None,
        message: str = "Success",
        status_code: int = 200
) -> tuple:
    response = {
        'success': True,
        'message': message,
        'data': data
    }
    return jsonify(response), status_code


def error_response(
        message: str = "An error occurred",
        errors: Optional[Dict] = None,
        status_code: int = 400
) -> tuple:
    response = {
        'success': False,
        'message': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), status_code


def validation_error_response(errors: Dict) -> tuple:
    return error_response(
        message="Validation failed",
        errors=errors,
        status_code=400
    )


def unauthorized_response(message: str = "Unauthorized") -> tuple:
    return error_response(message=message, status_code=401)


def forbidden_response(message: str = "Forbidden") -> tuple:
    return error_response(message=message, status_code=403)


def not_found_response(message: str = "Resource not found") -> tuple:
    return error_response(message=message, status_code=404)


def server_error_response(message: str = "Internal server error") -> tuple:
    return error_response(message=message, status_code=500)