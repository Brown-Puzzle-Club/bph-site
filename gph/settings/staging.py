from .base import *

DEBUG = True

IS_TEST = False

# Used for constructing URLs; include the protocol and trailing
# slash (e.g. 'https://galacticpuzzlehunt.com/')
DOMAIN = 'https://brownpuzzlehunt.com/'

# List of places you're serving from, e.g.
# ['galacticpuzzlehunt.com', 'gph.example.com']; or just ['*']
ALLOWED_HOSTS = ['brownpuzzlehunt.com']

EMAIL_SUBJECT_PREFIX = '[\u2708\u2708\u2708STAGING\u2708\u2708\u2708] '
