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
                # --- FÁCEIS ---
                Pergunta(texto="Qual é o maior planeta do nosso sistema solar?", alternativas="Terra|Saturno|Júpiter|Marte", resposta_correta=2, dificuldade="facil", explicacao="Júpiter é um gigante gasoso tão colossal que caberiam mais de 1.300 Terras dentro dele!"),
                Pergunta(texto="Qual planeta é conhecido como o 'Planeta Vermelho'?", alternativas="Vênus|Marte|Mercúrio|Júpiter", resposta_correta=1, dificuldade="facil", explicacao="Marte é vermelho devido à grande quantidade de óxido de ferro (basicamente ferrugem) cobrindo sua superfície."),
                Pergunta(texto="Quem foi o primeiro ser humano a viajar para o espaço?", alternativas="Neil Armstrong|Yuri Gagarin|Buzz Aldrin|Marcos Pontes", resposta_correta=1, dificuldade="facil", explicacao="O cosmonauta soviético Yuri Gagarin fez história em 1961, orbitando a Terra e declarando: 'A Terra é azul!'"),
                Pergunta(texto="Qual é a estrela mais próxima da Terra?", alternativas="Alpha Centauri|Sirius|Sol|Betelgeuse", resposta_correta=2, dificuldade="facil", explicacao="Pegadinha! O Sol é a nossa estrela local. Sem ele, nosso planeta seria uma rocha de gelo sem vida."),
                Pergunta(texto="Qual planeta tem os anéis mais visíveis?", alternativas="Urano|Saturno|Netuno|Júpiter", resposta_correta=1, dificuldade="facil", explicacao="Saturno tem o sistema de anéis mais espetacular, feito de bilhões de pedaços de gelo, rocha e poeira."),
                Pergunta(texto="Qual planeta é famoso pelos seus anéis?", alternativas="Urano|Netuno|Júpiter|Saturno", resposta_correta=3, dificuldade="facil", explicacao="Saturno! Os anéis são tão finos que, vistos de lado, quase desaparecem."),
                Pergunta(texto="Quem foi a primeira pessoa a pisar na Lua?", alternativas="Yuri Gagarin|Buzz Aldrin|Neil Armstrong|Michael Collins", resposta_correta=2, dificuldade="facil", explicacao="Neil Armstrong deu o famoso 'pequeno passo para um homem, mas um salto gigante para a humanidade' em 1969."),
                Pergunta(texto="Qual é o nome da nossa galáxia?", alternativas="Andrômeda|Via Láctea|Sombrero|Triângulo", resposta_correta=1, dificuldade="facil", explicacao="Via Láctea! Na mitologia grega, a faixa brilhante de estrelas no céu era vista como 'leite derramado'."),
                Pergunta(texto="Qual galáxia é a vizinha mais próxima da Via Láctea?", alternativas="Andrômeda|Sombrero|Girassol|Triângulo", resposta_correta=0, dificuldade="facil", explicacao="Andrômeda está em rota de colisão com a Via Láctea, mas não se preocupe: isso só vai acontecer daqui a 4 bilhões de anos."),
                Pergunta(texto="Qual é o planeta mais quente do sistema solar?", alternativas="Mercúrio|Vênus|Marte|Júpiter", resposta_correta=1, dificuldade="facil", explicacao="Apesar de Mercúrio ser o mais próximo do Sol, a densa atmosfera de Vênus cria um efeito estufa extremo, derretendo até chumbo!"),

                # --- MÉDIAS ---
                Pergunta(texto="Qual o nome do primeiro satélite artificial lançado ao espaço?", alternativas="Apollo 11|Sputnik 1|Voyager 1|Hubble", resposta_correta=1, dificuldade="medio", explicacao="O Sputnik 1, lançado pelos soviéticos em 1957, deu início à famosa Corrida Espacial."),
                Pergunta(texto="O que é um buraco negro?", alternativas="Uma estrela brilhante|Um planeta gasoso|Uma região de gravidade infinita|Um cometa", resposta_correta=2, dificuldade="medio", explicacao="É uma região no espaço onde a matéria foi esmagada num ponto tão pequeno que a gravidade suga até a luz!"),
                Pergunta(texto="Qual é a unidade usada para medir distâncias no espaço?", alternativas="Quilômetro|Ano-luz|Milha Espacial|Parsec", resposta_correta=1, dificuldade="medio", explicacao="O ano-luz mede a distância que a luz viaja em um ano terrestre, o equivalente a quase 9,5 trilhões de quilômetros."),
                Pergunta(texto="Qual telescópio famoso foi lançado em 1990?", alternativas="James Webb|Kepler|Spitzer|Hubble", resposta_correta=3, dificuldade="medio", explicacao="O Hubble revolucionou a astronomia ao ficar acima das nuvens e da poluição da Terra, capturando imagens nítidas do universo profundo."),
                Pergunta(texto="Qual é a estrela mais próxima da Terra (depois do Sol)?", alternativas="Sirius|Proxima Centauri|Betelgeuse|Vega", resposta_correta=1, dificuldade="medio", explicacao="Proxima Centauri está a cerca de 4,24 anos-luz daqui. Se viajássemos na nave mais rápida já construída, levaríamos dezenas de milhares de anos para chegar!"),
                Pergunta(texto="O que é uma supernova?", alternativas="Uma estrela recém-nascida|Uma galáxia anã|A explosão de uma estrela|Um tipo de cometa", resposta_correta=2, dificuldade="medio", explicacao="É a explosão colossal e brilhante que ocorre no fim da vida de uma estrela muito massiva."),
                Pergunta(texto="O que é o cinturão de asteroides?", alternativas="Um anel ao redor de Júpiter|Uma região entre Marte e Júpiter|O limite do sistema solar|Um grupo de estrelas", resposta_correta=1, dificuldade="medio", explicacao="É um 'anel' de escombros espaciais (restos da formação do sistema solar) que orbitam o Sol entre Marte e Júpiter."),
                Pergunta(texto="Qual é a idade estimada do Universo observável?", alternativas="4,5 bilhões de anos|13,8 bilhões de anos|93 bilhões de anos|100 milhões de anos", resposta_correta=1, dificuldade="medio", explicacao="Cientistas calculam que o Big Bang, o evento que deu origem ao universo, ocorreu há cerca de 13,8 bilhões de anos."),

                # --- DIFÍCEIS ---
                Pergunta(texto="O que é um pulsar?", alternativas="Um exoplaneta gigante|Uma estrela de nêutrons altamente magnetizada|Um buraco negro em rotação|Uma anã branca pulsante", resposta_correta=1, dificuldade="dificil", explicacao="Pulsares são estrelas de nêutrons que giram absurdamente rápido, emitindo feixes de radiação eletromagnética como se fossem faróis cósmicos."),
                Pergunta(texto="Onde se localiza o Cinturão de Kuiper?", alternativas="Entre Marte e Júpiter|Entre a Terra e Marte|No centro da Via Láctea|Além da órbita de Netuno", resposta_correta=3, dificuldade="dificil", explicacao="É uma imensa área gelada além de Netuno, lar de planetas anões como Plutão e berço de muitos cometas."),
                Pergunta(texto="Qual lua do Sistema Solar é conhecida por ter uma atmosfera densa e lagos de metano líquido?", alternativas="Europa|Ganimedes|Titã|Encélado", resposta_correta=2, dificuldade="dificil", explicacao="Titã, a maior lua de Saturno, tem nuvens, chuva e lagos, mas em vez de água, chove metano e etano líquidos!"),
                Pergunta(texto="Como é chamada a fronteira ao redor de um buraco negro da qual nem a luz consegue escapar?", alternativas="Singularidade|Disco de Acreção|Horizonte de Eventos|Ergosfera", resposta_correta=2, dificuldade="dificil", explicacao="O Horizonte de Eventos é o 'ponto de não retorno'. Uma vez cruzado, você precisaria ser mais rápido que a luz para voltar, o que é impossível."),
                Pergunta(texto="O que é a Radiação Cósmica de Fundo em Micro-ondas?", alternativas="Emissão de buracos negros|O eco luminoso do Big Bang|Radiação de supernovas|A luz de galáxias distantes", resposta_correta=1, dificuldade="dificil", explicacao="É a energia fóssil e esfriada do próprio Big Bang, um 'brilho' antigo que ainda permeia todo o universo."),
                Pergunta(texto="Onde fica o Monte Olimpo (Olympus Mons), o maior vulcão conhecido do Sistema Solar?", alternativas="Vênus|Marte|Io (Lua de Júpiter)|Terra", resposta_correta=1, dificuldade="dificil", explicacao="Fica em Marte! Ele é três vezes mais alto que o Monte Everest e largo o suficiente para cobrir todo o estado de São Paulo."),
                Pergunta(texto="Qual sonda espacial carrega um 'Disco de Ouro' com sons e imagens da Terra para possíveis civilizações alienígenas?", alternativas="Cassini|New Horizons|Pioneer 10|Voyager 1", resposta_correta=3, dificuldade="dificil", explicacao="Lançada em 1977, a Voyager 1 leva um disco banhado a ouro contendo saudações em dezenas de línguas, sons da natureza e músicas."),
                Pergunta(texto="Qual é o exoplaneta mais próximo conhecido do nosso Sistema Solar?", alternativas="Kepler-452b|TRAPPIST-1e|Proxima Centauri b|Gliese 581g", resposta_correta=2, dificuldade="dificil", explicacao="Ele orbita a estrela Proxima Centauri e, por estar na zona habitável de sua estrela, pode ter água líquida em sua superfície."),
                Pergunta(texto="Aproximadamente qual porcentagem do Universo é composta por Matéria Escura e Energia Escura juntas?", alternativas="25%|50%|70%|95%", resposta_correta=3, dificuldade="dificil", explicacao="Incrível, não? Tudo o que conhecemos (estrelas, planetas, você) compõe apenas cerca de 5% do universo. O restante é um mistério obscuro.")
            ]
            db.session.add_all(perguntas_iniciais)
            db.session.commit()
            print("Banco de dados SQLite populado com as 27 perguntas com sucesso!")
            
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)