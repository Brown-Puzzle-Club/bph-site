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


def require_auth(func):
    @wraps(func)
    def wrapper(request: Request, *args, **kwargs):
        print(request.user)
        if not request._request.user.is_authenticated:
            return Response(
                {"error": "You must be logged in to perform this action."}, status=401
            )
        return func(request, *args, **kwargs)

    return wrapper
