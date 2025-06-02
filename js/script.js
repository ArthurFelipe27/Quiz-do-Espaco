// Quiz do Espaço com sistema de pontos e info extra
const quiz = [
  {
    pergunta: "Qual é o maior planeta do Sistema Solar?",
    respostas: ["Terra", "Júpiter", "Marte", "Saturno"],
    correta: 1,
    termoExtra: "Planeta Júpiter"
  },
  {
    pergunta: "Qual planeta é conhecido como o Planeta Vermelho?",
    respostas: ["Vênus", "Marte", "Mercúrio", "Saturno"],
    correta: 1,
    termoExtra: "Planeta Marte"
  },
  {
    pergunta: "Qual é o satélite natural da Terra?",
    respostas: ["Lua", "Fobos", "Deimos", "Europa"],
    correta: 0,
    termoExtra: "Lua"
  },
  {
    pergunta: "Qual planeta tem os famosos anéis?",
    respostas: ["Netuno", "Urano", "Saturno", "Júpiter"],
    correta: 2,
    termoExtra: "Saturno"
  },
  {
    pergunta: "O Sol é classificado como qual tipo de estrela?",
    respostas: ["Anã Amarela", "Gigante Vermelha", "Supernova", "Estrela de Neutrons"],
    correta: 0,
    termoExtra: "Sol"
  },
  {
    pergunta: "Qual é o planeta mais próximo do Sol?",
    respostas: ["Mercúrio", "Vênus", "Terra", "Marte"],
    correta: 0,
    termoExtra: "Planeta Mercúrio"
  },
  {
    pergunta: "Qual planeta é conhecido por seus ventos mais rápidos do Sistema Solar?",
    respostas: ["Netuno", "Júpiter", "Saturno", "Urano"],
    correta: 0,
    termoExtra: "Planeta Netuno"
  },
  {
    pergunta: "Quantos planetas existem no Sistema Solar?",
    respostas: ["7", "8", "9", "10"],
    correta: 1,
    termoExtra: "Sistema Solar"
  },
  {
    pergunta: "Qual planeta é chamado de 'Planeta Azul' devido à sua cor característica?",
    respostas: ["Terra", "Netuno", "Urano", "Vênus"],
    correta: 1,
    termoExtra: "Planeta Netuno"
  },
  {
    pergunta: "Qual é o nome da galáxia onde vivemos?",
    respostas: ["Andrômeda", "Via Láctea", "Triângulo", "Messier 87"],
    correta: 1,
    termoExtra: "Via Láctea"
  },
  {
    pergunta: "Qual planeta possui a maior montanha conhecida no Sistema Solar, o Olympus Mons?",
    respostas: ["Marte", "Júpiter", "Terra", "Vênus"],
    correta: 0,
    termoExtra: "Olympus Mons"
  },
  {
    pergunta: "Qual é o principal componente da atmosfera de Vênus?",
    respostas: ["Oxigênio", "Dióxido de carbono", "Nitrogênio", "Metano"],
    correta: 1,
    termoExtra: "Atmosfera de Vênus"
  },
  {
    pergunta: "Qual é o nome do rover que está explorando Marte desde 2012?",
    respostas: ["Spirit", "Opportunity", "Curiosity", "Perseverance"],
    correta: 2,
    termoExtra: "Curiosity (rover)"
  },
  {
    pergunta: "Qual é o nome do fenômeno em que a Lua bloqueia completamente o Sol?",
    respostas: ["Eclipse lunar", "Eclipse solar", "Aurora boreal", "Aurora austral"],
    correta: 1,
    termoExtra: "Eclipse solar"
  },
  {
    pergunta: "Qual é a temperatura média da superfície do Sol?",
    respostas: ["5.500°C", "3.000°C", "10.000°C", "15.000°C"],
    correta: 0,
    termoExtra: "Temperatura do Sol"
  },
  {
    pergunta: "Qual planeta é conhecido por ter um dia mais longo que seu ano?",
    respostas: ["Vênus", "Marte", "Mercúrio", "Terra"],
    correta: 0,
    termoExtra: "Planeta Vênus"
  },
  {
    pergunta: "Qual é o nome da sonda espacial que foi a primeira a deixar o Sistema Solar?",
    respostas: ["Voyager 1", "Pioneer 10", "Cassini", "New Horizons"],
    correta: 0,
    termoExtra: "Voyager 1"
  },
  {
    pergunta: "Qual planeta é conhecido como o 'Gigante Gasoso' mais próximo da Terra?",
    respostas: ["Júpiter", "Saturno", "Urano", "Netuno"],
    correta: 0,
    termoExtra: "Planeta Júpiter"
  },
  {
    pergunta: "Qual é o nome da unidade de medida usada para distâncias astronômicas?",
    respostas: ["Ano-luz", "Parsec", "Quilômetro", "Astronômica Unidade"],
    correta: 3,
    termoExtra: "Unidade Astronômica"
  },
  {
    pergunta: "Qual é o nome do telescópio espacial lançado em 1990 que revolucionou a astronomia?",
    respostas: ["Hubble", "Spitzer", "Kepler", "James Webb"],
    correta: 0,
    termoExtra: "Telescópio espacial Hubble"
  },
  {
    pergunta: "Qual planeta possui a maior lua do Sistema Solar, chamada Ganimedes?",
    respostas: ["Júpiter", "Saturno", "Urano", "Netuno"],
    correta: 0,
    termoExtra: "Planeta Ganimedes"
  }
];


let perguntaAtual = 0;
let pontos = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const infoExtraEl = document.getElementById('info-extra');
const nextBtn = document.getElementById('next-btn');
const pontosUsuarioEl = document.getElementById('pontos-usuario');
const playerNameEl = document.getElementById('player-name');

function carregarPergunta() {
  pontos = parseInt(localStorage.getItem('pontos')) || 0;
  pontosUsuarioEl.textContent = `Pontos: ${pontos}`;

  feedbackEl.textContent = '';
  infoExtraEl.textContent = '';
  nextBtn.disabled = true; // Prevê validação
  nextBtn.style.display = 'none';

  answersEl.innerHTML = '';

  const q = quiz[perguntaAtual];
  questionEl.textContent = q.pergunta;

  q.respostas.forEach((resp, i) => {
    const btn = document.createElement('button');
    btn.textContent = resp;
    btn.onclick = () => verificarResposta(i, btn);
    answersEl.appendChild(btn);
  });
}

function verificarResposta(indiceSelecionado, botao) {
  const q = quiz[perguntaAtual];
  const correta = q.correta;

  const botoes = answersEl.querySelectorAll('button');
  botoes.forEach(b => b.disabled = true);

  if (indiceSelecionado === correta) {
    feedbackEl.textContent = 'Resposta correta!';
    feedbackEl.style.color = 'green';
    pontos += 10;
  } else {
    feedbackEl.textContent = 'Resposta incorreta.';
    feedbackEl.style.color = 'red';
    pontos = Math.max(0, pontos - 5);
  }

  localStorage.setItem('pontos', pontos);
  pontosUsuarioEl.textContent = `Pontos: ${pontos}`;

  nextBtn.disabled = false;
  nextBtn.style.display = 'block';

  buscarInfoExtra(q.termoExtra);
}

function buscarInfoExtra(termo) {
  infoExtraEl.textContent = 'Carregando informação extra...';
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`;

  fetch(url)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      infoExtraEl.textContent = data.extract || 'Informação extra não disponível.';
    })
    .catch(() => {
      infoExtraEl.textContent = 'Erro ao buscar informação extra.';
    });
}

nextBtn.addEventListener('click', () => {
  perguntaAtual++;
  if (perguntaAtual >= quiz.length) {
    window.location.href = 'resultado.html';
  } else {
    carregarPergunta();
  }
});

window.onload = () => {
  const nome = localStorage.getItem('nomeJogador');
  if (!nome) {
    alert('Por favor, digite seu nome na página inicial antes de começar.');
    window.location.href = 'index.html';
    return;
  }
  playerNameEl.textContent = `Jogador: ${nome}`;
  carregarPergunta();
};
