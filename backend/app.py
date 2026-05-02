from flask import Flask
from flask_cors import CORS
from config import Config
from models.modelos import db, Pergunta
from extensions import limiter # Puxando do novo arquivo
from routes.quiz_routes import quiz_bp # Importação normal no topo!

def create_app():
    app = Flask(__name__)
    
    app.config.from_object(Config)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz_espaco.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    
    # Inicializa os módulos passando a variável app
    db.init_app(app)
    limiter.init_app(app)
    
    app.register_blueprint(quiz_bp)
    
    with app.app_context():
        db.create_all()
        
        if not Pergunta.query.first():
            perguntas_iniciais = [
                # --- FÁCEIS (10 perguntas) ---
                Pergunta(texto="Qual é o maior planeta do nosso sistema solar?", alternativas="Terra|Saturno|Júpiter|Marte", resposta_correta=2, dificuldade="facil"),
                Pergunta(texto="Qual planeta é conhecido como o 'Planeta Vermelho'?", alternativas="Vênus|Marte|Mercúrio|Júpiter", resposta_correta=1, dificuldade="facil"),
                Pergunta(texto="Quem foi o primeiro ser humano a viajar para o espaço?", alternativas="Neil Armstrong|Yuri Gagarin|Buzz Aldrin|Marcos Pontes", resposta_correta=1, dificuldade="facil"),
                Pergunta(texto="Qual é a estrela mais próxima da Terra?", alternativas="Alpha Centauri|Sirius|Sol|Betelgeuse", resposta_correta=2, dificuldade="facil"),
                Pergunta(texto="Qual planeta tem os anéis mais visíveis?", alternativas="Urano|Saturno|Netuno|Júpiter", resposta_correta=1, dificuldade="facil"),
                Pergunta(texto="Qual planeta é famoso pelos seus anéis?", alternativas="Urano|Netuno|Júpiter|Saturno", resposta_correta=3, dificuldade="facil"),
                Pergunta(texto="Quem foi a primeira pessoa a pisar na Lua?", alternativas="Yuri Gagarin|Buzz Aldrin|Neil Armstrong|Michael Collins", resposta_correta=2, dificuldade="facil"),
                Pergunta(texto="Qual é o nome da nossa galáxia?", alternativas="Andrômeda|Via Láctea|Sombrero|Triângulo", resposta_correta=1, dificuldade="facil"),
                Pergunta(texto="Qual galáxia é a vizinha mais próxima da Via Láctea?", alternativas="Andrômeda|Sombrero|Girassol|Triângulo", resposta_correta=0, dificuldade="facil"),
                Pergunta(texto="Qual é o planeta mais quente do sistema solar?", alternativas="Mercúrio|Vênus|Marte|Júpiter", resposta_correta=1, dificuldade="facil"),

                # --- MÉDIAS (8 perguntas) ---
                Pergunta(texto="Qual o nome do primeiro satélite artificial lançado ao espaço?", alternativas="Apollo 11|Sputnik 1|Voyager 1|Hubble", resposta_correta=1, dificuldade="medio"),
                Pergunta(texto="O que é um buraco negro?", alternativas="Uma estrela brilhante|Um planeta gasoso|Uma região de gravidade infinita|Um cometa", resposta_correta=2, dificuldade="medio"),
                Pergunta(texto="Qual é a unidade usada para medir distâncias no espaço?", alternativas="Quilômetro|Ano-luz|Milha Espacial|Parsec", resposta_correta=1, dificuldade="medio"),
                Pergunta(texto="Qual telescópio famoso foi lançado em 1990?", alternativas="James Webb|Kepler|Spitzer|Hubble", resposta_correta=3, dificuldade="medio"),
                Pergunta(texto="Qual é a estrela mais próxima da Terra (depois do Sol)?", alternativas="Sirius|Proxima Centauri|Betelgeuse|Vega", resposta_correta=1, dificuldade="medio"),
                Pergunta(texto="O que é uma supernova?", alternativas="Uma estrela recém-nascida|Uma galáxia anã|A explosão de uma estrela|Um tipo de cometa", resposta_correta=2, dificuldade="medio"),
                Pergunta(texto="O que é o cinturão de asteroides?", alternativas="Um anel ao redor de Júpiter|Uma região entre Marte e Júpiter|O limite do sistema solar|Um grupo de estrelas", resposta_correta=1, dificuldade="medio"),
                Pergunta(texto="Qual é a idade estimada do Universo observável?", alternativas="4,5 bilhões de anos|13,8 bilhões de anos|93 bilhões de anos|100 milhões de anos", resposta_correta=1, dificuldade="medio"),

                # --- DIFÍCEIS (9 perguntas) ---
                Pergunta(texto="O que é um pulsar?", alternativas="Um exoplaneta gigante|Uma estrela de nêutrons altamente magnetizada|Um buraco negro em rotação|Uma anã branca pulsante", resposta_correta=1, dificuldade="dificil"),
                Pergunta(texto="Onde se localiza o Cinturão de Kuiper?", alternativas="Entre Marte e Júpiter|Entre a Terra e Marte|No centro da Via Láctea|Além da órbita de Netuno", resposta_correta=3, dificuldade="dificil"),
                Pergunta(texto="Qual lua do Sistema Solar é conhecida por ter uma atmosfera densa e lagos de metano líquido?", alternativas="Europa|Ganimedes|Titã|Encélado", resposta_correta=2, dificuldade="dificil"),
                Pergunta(texto="Como é chamada a fronteira ao redor de um buraco negro da qual nem a luz consegue escapar?", alternativas="Singularidade|Disco de Acreção|Horizonte de Eventos|Ergosfera", resposta_correta=2, dificuldade="dificil"),
                Pergunta(texto="O que é a Radiação Cósmica de Fundo em Micro-ondas?", alternativas="Emissão de buracos negros|O eco luminoso do Big Bang|Radiação de supernovas|A luz de galáxias distantes", resposta_correta=1, dificuldade="dificil"),
                Pergunta(texto="Onde fica o Monte Olimpo (Olympus Mons), o maior vulcão conhecido do Sistema Solar?", alternativas="Vênus|Marte|Io (Lua de Júpiter)|Terra", resposta_correta=1, dificuldade="dificil"),
                Pergunta(texto="Qual sonda espacial carrega um 'Disco de Ouro' com sons e imagens da Terra para possíveis civilizações alienígenas?", alternativas="Cassini|New Horizons|Pioneer 10|Voyager 1", resposta_correta=3, dificuldade="dificil"),
                Pergunta(texto="Qual é o exoplaneta mais próximo conhecido do nosso Sistema Solar?", alternativas="Kepler-452b|TRAPPIST-1e|Proxima Centauri b|Gliese 581g", resposta_correta=2, dificuldade="dificil"),
                Pergunta(texto="Aproximadamente qual porcentagem do Universo é composta por Matéria Escura e Energia Escura juntas?", alternativas="25%|50%|70%|95%", resposta_correta=3, dificuldade="dificil")
            ]
            db.session.add_all(perguntas_iniciais)
            db.session.commit()
            print("Banco de dados SQLite populado com as 27 perguntas com sucesso!")
            
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)