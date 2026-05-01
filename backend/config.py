import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env para o ambiente
load_dotenv()

class Config:
    # Busca a chave secreta do .env, com um fallback de segurança
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'chave-super-secreta-fallback'
    
    # Busca a URI do banco (SQLite para testes, depois MySQL)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI') or 'sqlite:///quiz_espaco.db'
    
    # Desativa avisos desnecessários do SQLAlchemy que consomem memória
    SQLALCHEMY_TRACK_MODIFICATIONS = False