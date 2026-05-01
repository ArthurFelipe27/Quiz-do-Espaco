from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configurando o SQLite para testes locais
# No futuro, mudaremos apenas esta URL para conectar ao MySQL!
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_espaco.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ==========================================
# MODELAGEM DO BANCO DE DADOS (TABELAS)
# ==========================================
class Pergunta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    texto = db.Column(db.String(255), nullable=False)
    # Vamos salvar as alternativas separadas por um pipe "|" para simplificar
    alternativas = db.Column(db.String(500), nullable=False) 
    resposta_correta = db.Column(db.Integer, nullable=False)

class Pontuacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_usuario = db.Column(db.String(50), nullable=False)
    pontos = db.Column(db.Integer, nullable=False)

# ==========================================
# INICIALIZAÇÃO E DADOS DE TESTE (SEED)
# ==========================================
with app.app_context():
    db.create_all() # Cria o arquivo quiz_espaco.db e as tabelas
    
    # Se o banco estiver vazio, insere perguntas de teste
    if not Pergunta.query.first():
        p1 = Pergunta(
            texto="Qual é o maior planeta do nosso sistema solar?", 
            alternativas="Terra|Saturno|Júpiter|Marte", 
            resposta_correta=2
        )
        p2 = Pergunta(
            texto="Qual galáxia é a vizinha mais próxima da Via Láctea?", 
            alternativas="Andrômeda|Sombrero|Girassol|Triângulo", 
            resposta_correta=0
        )
        p3 = Pergunta(
            texto="Qual o nome do primeiro satélite artificial lançado ao espaço?",
            alternativas="Apollo 11|Sputnik 1|Voyager 1|Hubble",
            resposta_correta=1
        )
        db.session.add_all([p1, p2, p3])
        db.session.commit()
        print("Banco de dados populado com sucesso!")

# ==========================================
# ROTAS DA API
# ==========================================
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "banco": "conectado"}), 200

@app.route('/api/perguntas', methods=['GET'])
def get_perguntas():
    perguntas = Pergunta.query.all()
    resultado = []
    
    for p in perguntas:
        resultado.append({
            "id": p.id,
            "pergunta": p.texto,
            "alternativas": p.alternativas.split('|'), # Transforma a string de volta em Array
            "respostaCorreta": p.resposta_correta
        })
        
    return jsonify(resultado), 200

@app.route('/api/pontuacao', methods=['POST'])
def salvar_pontuacao():
    dados = request.get_json()
    
    if not dados or 'pontos' not in dados:
        return jsonify({"erro": "Dados inválidos"}), 400
        
    nome = dados.get('nome', 'Astronauta Anônimo')
    pontos = dados.get('pontos', 0)
    
    nova_pontuacao = Pontuacao(nome_usuario=nome, pontos=pontos)
    db.session.add(nova_pontuacao)
    db.session.commit()
    
    return jsonify({"mensagem": "Pontuação salva com sucesso!", "id": nova_pontuacao.id}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)