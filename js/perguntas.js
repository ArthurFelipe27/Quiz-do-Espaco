const bancoDePerguntas = [
    {
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        respostas: ["Terra", "Júpiter", "Marte", "Saturno"],
        correta: 1,
        termoExtra: "Júpiter (planeta)"
    },
    {
        pergunta: "Qual planeta é conhecido como o Planeta Vermelho?",
        respostas: ["Vênus", "Marte", "Mercúrio", "Saturno"],
        correta: 1,
        termoExtra: "Marte (planeta)"
    },
    {
        pergunta: "Qual é a estrela mais próxima da Terra?",
        respostas: ["Alfa Centauri", "Proxima Centauri", "Sol", "Sirius"],
        correta: 2,
        termoExtra: "Sol"
    },
    {
        pergunta: "Quem foi o primeiro humano a viajar ao espaço?",
        respostas: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Valentina Tereshkova"],
        correta: 2,
        termoExtra: "Yuri Gagarin"
    },
    {
        pergunta: "Qual planeta possui um sistema de anéis mais visível?",
        respostas: ["Júpiter", "Urano", "Saturno", "Netuno"],
        correta: 2,
        termoExtra: "Anéis de Saturno"
    },
    {
        pergunta: "Qual é o nome do maior satélite natural da Terra?",
        respostas: ["Europa", "Lua", "Fobos", "Titã"],
        correta: 1,
        termoExtra: "Lua"
    },
    {
        pergunta: "Em que galáxia está localizado o Sistema Solar?",
        respostas: ["Galáxia de Andrômeda", "Via Láctea", "Nuvem de Magalhães", "Galáxia do Triângulo"],
        correta: 1,
        termoExtra: "Via Láctea"
    },
    {
        pergunta: "Qual planeta é conhecido por ter a maior tempestade do Sistema Solar, a Grande Mancha Vermelha?",
        respostas: ["Júpiter", "Saturno", "Netuno", "Urano"],
        correta: 0,
        termoExtra: "Grande Mancha Vermelha"
    },
    {
        pergunta: "Qual é o planeta mais quente do Sistema Solar?",
        respostas: ["Mercúrio", "Vênus", "Marte", "Júpiter"],
        correta: 1,
        termoExtra: "Vênus (planeta)"
    },
    {
        pergunta: "Qual é o nome da primeira mulher astronauta a ir ao espaço?",
        respostas: ["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Peggy Whitson"],
        correta: 1,
        termoExtra: "Valentina Tereshkova"
    },
    {
        pergunta: "Qual é o planeta conhecido por ter ventos supersônicos?",
        respostas: ["Netuno", "Saturno", "Urano", "Marte"],
        correta: 0,
        termoExtra: "Netuno (planeta)"
    },
    {
        pergunta: "Qual sonda foi a primeira a sair do Sistema Solar?",
        respostas: ["Voyager 1", "Pioneer 10", "New Horizons", "Cassini"],
        correta: 0,
        termoExtra: "Voyager 1"
    },
    {
        pergunta: "Qual é o maior asteroide do cinturão de asteroides?",
        respostas: ["Vesta", "Ceres", "Pallas", "Hygiea"],
        correta: 1,
        termoExtra: "Ceres (asteroide)"
    },
    {
        pergunta: "Qual planeta é conhecido por ter um grande ponto azul?",
        respostas: ["Terra", "Netuno", "Urano", "Marte"],
        correta: 2,
        termoExtra: "Urano (planeta)"
    },
    {
        pergunta: "Qual é a principal característica dos buracos negros?",
        respostas: ["Emitir luz intensa", "Ter gravidade tão forte que nada escapa", "Ser uma estrela gigante", "Ter superfície sólida"],
        correta: 1,
        termoExtra: "Buraco negro"
    },
    {
        pergunta: "Qual a distância média da Terra ao Sol?",
        respostas: ["150 milhões de km", "384 mil km", "1 bilhão de km", "27 milhões de km"],
        correta: 0,
        termoExtra: "Distância Terra-Sol"
    },
    {
        pergunta: "Qual missão levou o primeiro homem à Lua?",
        respostas: ["Apollo 11", "Apollo 13", "Gemini 4", "Mercury 7"],
        correta: 0,
        termoExtra: "Apollo 11"
    },
    {
        pergunta: "Qual planeta tem um dia mais longo que seu ano?",
        respostas: ["Vênus", "Marte", "Mercúrio", "Júpiter"],
        correta: 0,
        termoExtra: "Vênus (planeta)"
    },
    {
        pergunta: "Qual é o nome da maior lua de Saturno?",
        respostas: ["Titã", "Encélado", "Mimas", "Reia"],
        correta: 0,
        termoExtra: "Titã (lua)"
    },
    {
        pergunta: "Qual foi o primeiro satélite artificial lançado pela humanidade?",
        respostas: ["Sputnik 1", "Explorer 1", "Vanguard 1", "Lunik 1"],
        correta: 0,
        termoExtra: "Sputnik 1"
    },
    {
        pergunta: "Qual planeta é conhecido como o ‘gigante gasoso’ azul?",
        respostas: ["Netuno", "Saturno", "Júpiter", "Urano"],
        correta: 0,
        termoExtra: "Netuno (planeta)"
    },
    {
        pergunta: "Qual elemento é mais abundante no Sol?",
        respostas: ["Hidrogênio", "Hélio", "Oxigênio", "Carbono"],
        correta: 0,
        termoExtra: "Composição do Sol"
    },
    {
        pergunta: "Qual planeta possui a maior quantidade de luas conhecidas?",
        respostas: ["Júpiter", "Saturno", "Marte", "Urano"],
        correta: 1,
        termoExtra: "Saturno (planeta)"
    },
    {
        pergunta: "O que é uma supernova?",
        respostas: ["Colapso de uma estrela gigante", "Formação de um planeta", "Explosão de um buraco negro", "Aumento da luz solar"],
        correta: 0,
        termoExtra: "Supernova"
    },
    {
        pergunta: "Qual planeta tem a menor gravidade superficial?",
        respostas: ["Marte", "Mercúrio", "Plutão", "Netuno"],
        correta: 2,
        termoExtra: "Plutão"
    },
    {
        pergunta: "Qual a função principal do telescópio espacial Hubble?",
        respostas: ["Observar o espaço sem interferência da atmosfera", "Enviar sinais para satélites", "Monitorar a Terra", "Estudar a Lua"],
        correta: 0,
        termoExtra: "Telescópio espacial Hubble"
    },
    {
        pergunta: "O que é a Via Láctea?",
        respostas: ["A galáxia onde o Sistema Solar está localizado", "Um tipo de planeta", "Um cometa famoso", "Um satélite natural"],
        correta: 0,
        termoExtra: "Via Láctea"
    },
    {
        pergunta: "Qual planeta é conhecido como o ‘planeta anão’?",
        respostas: ["Plutão", "Ceres", "Eris", "Todos os anteriores"],
        correta: 3,
        termoExtra: "Planetas anões"
    }
];