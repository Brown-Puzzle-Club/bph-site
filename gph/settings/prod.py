from .base import *

DEBUG = False

IS_TEST = False

# Used for constructing URLs; include the protocol and trailing
# slash (e.g. 'https://galacticpuzzlehunt.com/')
DOMAIN = 'https://www.brownpuzzlehunt.com/'

# List of places you're serving from, e.g.
# ['galacticpuzzlehunt.com', 'gph.example.com']; or just ['*']
ALLOWED_HOSTS = ['www.brownpuzzlehunt.com']

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
