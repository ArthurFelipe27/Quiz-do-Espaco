import random
from flask import Blueprint, jsonify, request
from models.modelos import db, Pergunta, Pontuacao

# Criando o Blueprint para as rotas do quiz
quiz_bp = Blueprint('quiz_routes', __name__)

@quiz_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "modulo": "Rotas separadas com sucesso!"}), 200

@quiz_bp.route('/api/perguntas', methods=['GET'])
def get_perguntas():
    # Pega TODAS as perguntas do banco de dados
    todas_perguntas = Pergunta.query.all()
    
    # Embaralha as perguntas de forma aleatória
    random.shuffle(todas_perguntas)
    
    # Seleciona apenas as 10 primeiras (ou menos, se o banco for menor)
    perguntas_rodada = todas_perguntas[:10]
    
    resultado = []
    
    for p in perguntas_rodada:
        resultado.append({
            "id": p.id,
            "pergunta": p.texto,
            "alternativas": p.alternativas.split('|'),
            "respostaCorreta": p.resposta_correta
        })
        
    return jsonify(resultado), 200

@quiz_bp.route('/api/pontuacao', methods=['POST'])
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