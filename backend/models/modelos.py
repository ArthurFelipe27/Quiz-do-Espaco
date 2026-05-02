from flask_sqlalchemy import SQLAlchemy

# Inicializamos o banco aqui, sem atrelar diretamente ao app ainda
db = SQLAlchemy()

class Pergunta(db.Model):
    __tablename__ = 'perguntas'
    
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(255), nullable=False)
    alternativas = db.Column(db.String(500), nullable=False) 
    resposta_correta = db.Column(db.Integer, nullable=False)
    dificuldade = db.Column(db.String(20), nullable=False, default='facil') # <- NOVA COLUNA AQUI
    explicacao = db.Column(db.Text, nullable=True) # <-- NOVA COLUNA

class Pontuacao(db.Model):
    __tablename__ = 'pontuacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    nome_usuario = db.Column(db.String(50), nullable=False)
    pontos = db.Column(db.Integer, nullable=False)