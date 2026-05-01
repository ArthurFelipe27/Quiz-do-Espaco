from flask import Flask
from flask_cors import CORS
from config import Config
from models.modelos import db, Pergunta
from routes.quiz_routes import quiz_bp

def create_app():
    app = Flask(__name__)
    
    # Aplica as configurações do config.py
    app.config.from_object(Config)
    
    # Habilita o CORS para o frontend (Netlify/Localhost) conseguir acessar
    CORS(app)
    
    # Conecta o banco de dados à aplicação
    db.init_app(app)
    
    # Registra o Blueprint com as rotas
    app.register_blueprint(quiz_bp)
    
    # Cria as tabelas e insere os dados de teste (Seed)
    with app.app_context():
        db.create_all()
        
        # Só insere as perguntas se a tabela estiver vazia
        if not Pergunta.query.first():
            p1 = Pergunta(texto="Qual é o maior planeta do nosso sistema solar?", alternativas="Terra|Saturno|Júpiter|Marte", resposta_correta=2)
            p2 = Pergunta(texto="Qual galáxia é a vizinha mais próxima da Via Láctea?", alternativas="Andrômeda|Sombrero|Girassol|Triângulo", resposta_correta=0)
            p3 = Pergunta(texto="Qual o nome do primeiro satélite artificial lançado ao espaço?", alternativas="Apollo 11|Sputnik 1|Voyager 1|Hubble", resposta_correta=1)
            
            db.session.add_all([p1, p2, p3])
            db.session.commit()
            print("Banco de dados SQLite populado com sucesso!")
            
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)