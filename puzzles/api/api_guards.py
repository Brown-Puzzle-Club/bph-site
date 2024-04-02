from functools import wraps
from rest_framework.response import Response
from rest_framework.request import Request

# all function decorators can go here.

def require_admin(func):
    @wraps(func)
    def wrapper(request: Request, *args, **kwargs):
        if not request._request.context.is_admin:
            return Response(
                {"error": "You are not authorized to perform this action."}, status=403
            )
        return func(request, *args, **kwargs)

    return wrapper
