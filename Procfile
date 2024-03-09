release: python manage.py migrate
web: gunicorn bog.asgi:application -k uvicorn.workers.UvicornWorker --timeout 600
