from .base import *

DEBUG = True

# Development database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Development CORS settings
CORS_ALLOW_ALL_ORIGINS = True

# Development email backend
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
