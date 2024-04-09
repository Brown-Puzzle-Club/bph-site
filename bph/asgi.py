"""
ASGI config for bph project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

import django.urls
from dotenv import load_dotenv

load_dotenv()


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bph.settings")

print(os.environ.get("DJANGO_SETTINGS_MODULE"))

import django

django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.db import database_sync_to_async
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from .routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application
from django.urls import re_path

from .routing import eventstream_urlpatterns


@database_sync_to_async
def get_user(token):
    try:
        return Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # convert query string to dict
        query_string = dict(
            [
                tuple(x.split("="))
                for x in scope["query_string"].decode("utf-8").split("&")
            ]
        )
        user = await get_user(query_string.get("token"))
        scope["user"] = user

        return await self.app(scope, receive, send)


application = ProtocolTypeRouter(
    {
        "http": URLRouter(
            eventstream_urlpatterns + [re_path(r"", get_asgi_application())]
        ),
        "websocket": TokenAuthMiddleware(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
