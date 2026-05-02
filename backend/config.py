import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Removemos o fallback. Se a SECRET_KEY não existir no .env, o Python 
    # vai estourar um erro "KeyError" e o container não vai subir, avisando do problema.
    SECRET_KEY = os.environ['SECRET_KEY']
    
    # Fazemos o mesmo para o banco de dados.
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URI']
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False