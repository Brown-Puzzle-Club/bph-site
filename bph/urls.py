"""bph URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from urllib.parse import quote_plus, unquote_plus

from django.urls import path, re_path, include, register_converter
from django.contrib import admin


class QuotedStringConverter:
    regex = "[^/]+"

    def to_python(self, value):
        return unquote_plus(value)

    def to_url(self, value):
        return quote_plus(value, safe="")


register_converter(QuotedStringConverter, "quotedstr")

urlpatterns = [
    re_path(r"^admin/", admin.site.urls),
    path("api/", include("puzzles.api.urls")),
    # impersonate doesn't work cross origin :(
    # re_path(r"^impersonate/", include("impersonate.urls")),
    # all other paths go to React client router
]
