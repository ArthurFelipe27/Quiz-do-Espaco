const fallbackInfo = {
    "Júpiter (planeta)": {
        texto: "Júpiter é o maior planeta do Sistema Solar, composto principalmente de hidrogênio e hélio, conhecido por sua Grande Mancha Vermelha.",
        imagem: "img/banco-de-imgs/Jupiter.png"
    },
    "Marte (planeta)": {
        texto: "Marte é o quarto planeta do Sistema Solar, conhecido como o Planeta Vermelho devido à sua superfície rica em óxido de ferro.",
        imagem: "img/banco-de-imgs/Marte.png"
    },
    "Sol": {
        texto: "O Sol é a estrela central do Sistema Solar e a principal fonte de luz e energia da Terra.",
        imagem: "img/banco-de-imgs/Sol.png"
    },
    "Yuri Gagarin": {
        texto: "Yuri Gagarin foi o primeiro ser humano a viajar ao espaço, em 1961, a bordo da espaçonave Vostok 1.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Yuri_Gagarin_1961.jpg"
    },
    "Anéis de Saturno": {
        texto: "Os anéis de Saturno são compostos por bilhões de partículas de gelo e rocha, sendo os mais visíveis do Sistema Solar.",
        imagem: "img/banco-de-imgs/Saturno.png"
    },
    "Lua": {
        texto: "A Lua é o único satélite natural da Terra e o corpo celeste mais próximo do nosso planeta.",
        imagem: "img/banco-de-imgs/Lua.png"
    },
    "Via Láctea": {
        texto: "A Via Láctea é a galáxia espiral onde o Sistema Solar está localizado.",
        imagem: "img/banco-de-imgs/Via-Lactea.png"
    },
    "Grande Mancha Vermelha": {
        texto: "A Grande Mancha Vermelha é uma gigantesca tempestade anticiclônica na atmosfera de Júpiter, maior que a Terra.",
        imagem: "img/banco-de-imgs/Mancha Vermelha.png"
    },
    "Vênus (planeta)": {
        texto: "Vênus é o segundo planeta a partir do Sol e o mais quente do Sistema Solar, devido ao seu efeito estufa intenso.",
        imagem: "img/banco-de-imgs/Venus.png"
    },
    "Valentina Tereshkova": {
        texto: "Valentina Tereshkova foi a primeira mulher a viajar ao espaço, em 1963, a bordo da Vostok 6.",
        imagem: "https://upload.wikimedia.org/wikipedia/commons/6/61/Tereshkova.jpg"
    },
    "Netuno (planeta)": {
        texto: "Netuno é o oitavo planeta do Sistema Solar, conhecido por seus ventos supersônicos e coloração azul intensa.",
        imagem: "img/banco-de-imgs/Netuno.png"
    },
    "Voyager 1": {
        texto: "Voyager 1 é uma sonda espacial lançada em 1977 que se tornou o primeiro objeto feito pelo homem a entrar no espaço interestelar.",
        imagem: "img/banco-de-imgs/Voyager-1.png"
    },
    "Ceres (asteroide)": {
        texto: "Ceres é o maior objeto do cinturão de asteroides entre Marte e Júpiter e é classificado como planeta anão.",
        imagem: "img/banco-de-imgs/Ceres.png"
    },
    "Urano (planeta)": {
        texto: "Urano é o sétimo planeta do Sistema Solar, com rotação inclinada e aparência azulada devido ao metano na atmosfera.",
        imagem: "img/banco-de-imgs/Urano.png"
    },
    "Buraco negro": {
        texto: "Buracos negros são regiões do espaço com gravidade tão intensa que nem a luz pode escapar.",
        imagem: "img/banco-de-imgs/Buraco-negro.png"
    },
    "Distância Terra para o Sol": {
        texto: "A distância média da Terra ao Sol é de aproximadamente 150 milhões de quilômetros.",
        imagem: "img/banco-de-imgs/Distancia-terra-sol.png"
    },
    "Apollo 11": {
        texto: "A Apollo 11 foi a missão da NASA que levou o primeiro homem à Lua, Neil Armstrong, em 1969.",
        imagem: "img/banco-de-imgs/Apollo11.png"
    },
    "Venus (planeta)": {
        texto: "Vênus tem um dia mais longo que seu ano: leva mais tempo para girar em torno de si do que para orbitar o Sol.",
        imagem: "img/banco-de-imgs/Venus.png"
    },
    "Titã (lua)": {
        texto: "Titã é a maior lua de Saturno, e possui uma atmosfera densa composta principalmente de nitrogênio.",
        imagem: "img/banco-de-imgs/Tita.png"
    },
    "Sputnik 1": {
        texto: "Sputnik 1 foi o primeiro satélite artificial lançado pela União Soviética em 1957, marcando o início da era espacial.",
        imagem: "img/banco-de-imgs/Sputnik1.png"
    },
    "Hidrogenio (elemento)": {
        texto: "O hidrogênio é o elemento mais abundante no Sol e no universo, sendo o combustível das estrelas.",
        imagem: "img/banco-de-imgs/Hidrogenio.png"
    },
    "Saturno (planeta)": {
        texto: "Saturno é um gigante gasoso conhecido por seu sistema de anéis e por possuir mais de 80 luas conhecidas.",
        imagem: "img/banco-de-imgs/Saturno.png"
    },
    "Supernova": {
        texto: "Uma supernova é uma explosão estelar extremamente energética que ocorre no fim da vida de uma estrela massiva.",
        imagem: "img/banco-de-imgs/Supernova.png"
    },
    "Plutão": {
        texto: "Plutão é um planeta anão localizado no Cinturão de Kuiper, anteriormente considerado o nono planeta do Sistema Solar.",
        imagem: "img/banco-de-imgs/Plutao.png"
    },
    "Telescópio espacial Hubble": {
        texto: "O Hubble é um telescópio espacial lançado em 1990, que permite observações sem a interferência da atmosfera terrestre.",
        imagem: "img/banco-de-imgs/Hublle.png"
    },
    "planetas anões": {
        texto: "Planetas anões são corpos celestes que orbitam o Sol, mas não têm massa suficiente para limpar sua órbita, como Plutão, Ceres e Eris.",
        imagem: "img/banco-de-imgs/Planetas-anoes.png"
    },
    "Exoplaneta": {
        texto: "Exoplanetas são planetas que orbitam estrelas fora do Sistema Solar.",
        imagem: "img/banco-de-imgs/Exoplaneta.png"
    },
    "Galáxia de Andrômeda": {
        texto: "A Galáxia de Andrômeda é a galáxia espiral mais próxima da Via Láctea e está a 2,5 milhões de anos-luz da Terra.",
        imagem: "img/banco-de-imgs/Andromeda.png"
    },
    "Estrela de nêutrons": {
        texto: "Uma estrela de nêutrons é o núcleo extremamente denso deixado pelo colapso de uma estrela massiva.",
        imagem: "img/banco-de-imgs/Estrela-de-Neutrons.png"
    },
    "Sojourner (rover)": {
        texto: "O Sojourner foi o primeiro rover a explorar Marte com sucesso, parte da missão Mars Pathfinder em 1997.",
        imagem: "img/banco-de-imgs/Sojourner.png"
    },
    "Estação Espacial Internacional": {
        texto: "A ISS é um laboratório em órbita onde astronautas de diferentes países realizam pesquisas científicas.",
        imagem: "img/banco-de-imgs/ISS.png"
    },
    "Monte Olimpo (Marte)": {
        texto: "O Monte Olimpo é o maior vulcão conhecido do Sistema Solar, localizado em Marte.",
        imagem: "img/banco-de-imgs/Monte-Olimpo.png"
    },
    "Cinturão de Kuiper": {
        texto: "O Cinturão de Kuiper é uma região além de Netuno repleta de pequenos corpos gelados e planetas anões.",
        imagem: "img/banco-de-imgs/Cinturao-Kuiper.png"
    },
    "Campo magnético de Júpiter": {
        texto: "Júpiter possui o campo magnético mais poderoso do Sistema Solar, 20 mil vezes mais forte que o da Terra.",
        imagem: "img/banco-de-imgs/Campo-Magnetico-Jupiter.png"
    },
    "Galáxia elíptica": {
        texto: "Galáxias elípticas são massas de estrelas com formato arredondado ou oval e pouca formação estelar.",
        imagem: "img/banco-de-imgs/Galaxia-Eliptica.png"
    },
    "Órbita de Plutão": {
        texto: "Plutão leva cerca de 248 anos terrestres para completar uma órbita ao redor do Sol.",
        imagem: "img/banco-de-imgs/Plutao-Orbita.png"
    },
    "Aurora boreal": {
        texto: "A aurora boreal é um fenômeno luminoso causado pela interação do vento solar com o campo magnético da Terra.",
        imagem: "img/banco-de-imgs/Aurora-Boreal.png"
    },
    "Telescópio Espacial James Webb": {
        texto: "O James Webb é o sucessor do Hubble, projetado para estudar o universo em infravermelho.",
        imagem: "img/banco-de-imgs/James-Webb.png"
    },
    "Mercúrio (planeta)": {
        texto: "Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol.",
        imagem: "img/banco-de-imgs/Mercurio.png"
    },
    "Nuvem de Oort": {
        texto: "A Nuvem de Oort é uma região hipotética no limite do Sistema Solar com trilhões de cometas.",
        imagem: "img/banco-de-imgs/Nuvem-Oort.png"
    },
    "Luna 3": {
        texto: "Luna 3 foi uma missão soviética em 1959 que fotografou o lado oculto da Lua pela primeira vez.",
        imagem: "img/banco-de-imgs/Luna-3.png"
    }
};
