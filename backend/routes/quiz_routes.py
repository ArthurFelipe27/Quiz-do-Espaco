import random
import html # NOVO IMPORT DE SEGURANÇA
from flask import Blueprint, jsonify, request
from models.modelos import db, Pergunta, Pontuacao
from extensions import limiter

# Criando o Blueprint para as rotas do quiz
quiz_bp = Blueprint('quiz_routes', __name__)

@quiz_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "modulo": "Rotas separadas com sucesso!"}), 200

@quiz_bp.route('/api/perguntas', methods=['GET'])
def get_perguntas():
    modo = request.args.get('modo', 'facil')
    
    faceis = Pergunta.query.filter_by(dificuldade='facil').all()
    medias = Pergunta.query.filter_by(dificuldade='medio').all()
    dificeis = Pergunta.query.filter_by(dificuldade='dificil').all()
    
    random.shuffle(faceis)
    random.shuffle(medias)
    random.shuffle(dificeis)
    
    selecionadas = []
    
    if modo == 'facil':
        selecionadas = faceis[:10]
    elif modo == 'medio':
        selecionadas = medias[:6] + faceis[:4]
    elif modo == 'dificil':
        selecionadas = dificeis[:8] + medias[:2]
        
    # Mistura as 10 selecionadas para o jogador não saber quando vem a fácil ou a média
    random.shuffle(selecionadas)
    
    resultado = []
    for p in selecionadas:
        resultado.append({
            "id": p.id,
            "pergunta": p.texto,
            "alternativas": p.alternativas.split('|'),
            "respostaCorreta": p.resposta_correta,
            "dificuldade": p.dificuldade # Enviamos a dificuldade para o Javascript calcular
        })
        
    return jsonify(resultado), 200

@quiz_bp.route('/api/pontuacao', methods=['POST'])
@limiter.limit("3 per minute") # REGRA ESTRITA: Máximo de 3 pontuações por minuto por IP!
def salvar_pontuacao():
    dados = request.get_json()
    
    if not dados or 'pontos' not in dados:
        return jsonify({"erro": "Dados inválidos"}), 400
        
    nome_sujo = dados.get('nome', 'Astronauta Anônimo')
    nome_limpo = html.escape(str(nome_sujo))[:15] 
    pontos = dados.get('pontos', 0)
    
    nova_pontuacao = Pontuacao(nome_usuario=nome_limpo, pontos=pontos)
    db.session.add(nova_pontuacao)
    db.session.commit()
    
    return jsonify({"mensagem": "Pontuação salva com segurança!", "id": nova_pontuacao.id}), 201

@quiz_bp.route('/api/ranking', methods=['GET'])
def get_ranking():
    # Pega os 5 maiores pontuadores em ordem decrescente (do maior pro menor)
    top_5 = Pontuacao.query.order_by(Pontuacao.pontos.desc()).limit(5).all()
    
    resultado = []
    for p in top_5:
        resultado.append({
            "nome": p.nome_usuario,
            "pontos": p.pontos
        })
        
    return jsonify(resultado), 200