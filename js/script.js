const quiz = [
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
  }
];


let perguntaAtual = 0;
let pontos = 0;
let perguntasRespondidas = Array(quiz.length).fill(false);

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const infoExtraEl = document.getElementById('info-extra');
const nextBtn = document.getElementById('next-btn');
const voltarBtn = document.getElementById('voltar');
const resetBtn = document.getElementById('reset-btn');
const pularBtn = document.getElementById('pular-btn');
const pontosUsuarioEl = document.getElementById('pontos-usuario');
const playerNameEl = document.getElementById('player-name');

function salvarProgresso() {
  localStorage.setItem('progressoQuiz', JSON.stringify({
    perguntaAtual,
    pontos,
    perguntasRespondidas
  }));
}

function carregarProgresso() {
  const progresso = JSON.parse(localStorage.getItem('progressoQuiz'));
  if (progresso) {
    perguntaAtual = progresso.perguntaAtual;
    pontos = progresso.pontos;
    perguntasRespondidas = progresso.perguntasRespondidas;
  } else {
    perguntaAtual = 0;
    pontos = 0;
    perguntasRespondidas = Array(quiz.length).fill(false);
  }
}

function carregarPergunta() {
  pontosUsuarioEl.textContent = `Pontos: ${pontos}`;

  feedbackEl.textContent = '';
  infoExtraEl.textContent = '';
  nextBtn.disabled = true;
  nextBtn.style.display = 'none';

  answersEl.innerHTML = '';

  const q = quiz[perguntaAtual];
  questionEl.textContent = q.pergunta;

  q.respostas.forEach((resp, i) => {
    const btn = document.createElement('button');
    btn.textContent = resp;

    if (perguntasRespondidas[perguntaAtual]) {
      btn.disabled = true;
    } else {
      btn.onclick = () => verificarResposta(i);
    }

    answersEl.appendChild(btn);
  });

  if (perguntasRespondidas[perguntaAtual]) {
    nextBtn.disabled = false;
    nextBtn.style.display = 'inline-block';
    feedbackEl.textContent = 'Pergunta já respondida.';
    feedbackEl.style.color = 'orange';
    buscarInfoExtra(q.termoExtra);
  }

  voltarBtn.style.display = perguntaAtual === 0 ? 'none' : 'inline-block';

  salvarProgresso();
}

function verificarResposta(indiceSelecionado) {
  const q = quiz[perguntaAtual];

  const botoes = answersEl.querySelectorAll('button');
  botoes.forEach(b => b.disabled = true);

  if (!perguntasRespondidas[perguntaAtual]) {
    if (indiceSelecionado === q.correta) {
      feedbackEl.textContent = 'Resposta correta!';
      feedbackEl.style.color = 'green';
      pontos += 10;
    } else {
      feedbackEl.textContent = 'Resposta incorreta.';
      feedbackEl.style.color = 'red';
      pontos = Math.max(0, pontos - 5);
    }

    perguntasRespondidas[perguntaAtual] = true;
    salvarProgresso();
  } else {
    feedbackEl.textContent = 'Você já respondeu esta pergunta.';
    feedbackEl.style.color = 'orange';
  }

  pontosUsuarioEl.textContent = `Pontos: ${pontos}`;

  nextBtn.disabled = false;
  nextBtn.style.display = 'inline-block';

  buscarInfoExtra(q.termoExtra);
}

function buscarInfoExtra(termo) {
  infoExtraEl.textContent = 'Carregando informação extra...';
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`;

  fetch(url)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => {
      infoExtraEl.innerHTML = `<strong>${termo}</strong>: ${data.extract || 'Informação extra não disponível.'}`;
    })
    .catch(() => {
      infoExtraEl.textContent = 'Erro ao buscar informação extra.';
    });
}

nextBtn.addEventListener('click', () => {
  perguntaAtual++;
  if (perguntaAtual >= quiz.length) {
    localStorage.setItem('pontos', pontos);
    localStorage.removeItem('progressoQuiz');
    window.location.href = 'resultado.html';
  } else {
    carregarPergunta();
  }
});

voltarBtn.addEventListener('click', () => {
  if (perguntaAtual > 0) {
    perguntaAtual--;
    carregarPergunta();
  }
});

pularBtn.addEventListener('click', () => {
  perguntaAtual++;
  if (perguntaAtual >= quiz.length) {
    localStorage.setItem('pontos', pontos);
    localStorage.removeItem('progressoQuiz');
    window.location.href = 'resultado.html';
  } else {
    carregarPergunta();
  }
});

resetBtn.addEventListener('click', resetarQuiz);

function resetarQuiz() {
  perguntaAtual = 0;
  pontos = 0;
  perguntasRespondidas = Array(quiz.length).fill(false);
  localStorage.removeItem('progressoQuiz');
  localStorage.removeItem('pontos');
  carregarPergunta();
}

window.onload = () => {
  const nome = localStorage.getItem('nomeJogador');
  if (!nome) {
    alert('Por favor, digite seu nome na página inicial antes de começar.');
    window.location.href = 'index.html';
    return;
  }
  playerNameEl.textContent = `Jogador(a): ${nome}`;

  carregarProgresso();
  carregarPergunta();
};
