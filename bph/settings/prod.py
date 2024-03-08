from .base import *

DEBUG = False

IS_TEST = False

# Used for constructing URLs; include the protocol and trailing
# slash (e.g. 'https://galacticpuzzlehunt.com/')
DOMAIN = 'https://www.brownpuzzlehunt.com/'

# List of places you're serving from, e.g.
# ['galacticpuzzlehunt.com', 'bph.example.com']; or just ['*']
ALLOWED_HOSTS = ['www.brownpuzzlehunt.com','174.138.34.115','127.0.0.1','0.0.0.0','localhost']

# Google Analytics
GA_CODE = '''
<script async src="https://www.googletagmanager.com/gtag/js?id=G-24DY5C1PC8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-24DY5C1PC8');
</script>
'''

DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.postgresql_psycopg2',
         'NAME': 'bphdb',
         'USER': 'bph', 
         'PASSWORD': 'puzzle_hunting_is_so_cool',
         'HOST': 'localhost', # '127.0.0.1' probably works also
         'PORT': '5432',
     }
 }

