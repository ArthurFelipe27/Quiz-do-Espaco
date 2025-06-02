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
  // ... continue com as demais perguntas normalmente
];

let perguntaAtual = 0;
let pontos = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const infoExtraEl = document.getElementById('info-extra');
const nextBtn = document.getElementById('next-btn');
const voltarBtn = document.getElementById('voltar');
const pontosUsuarioEl = document.getElementById('pontos-usuario');
const playerNameEl = document.getElementById('player-name');

function carregarPergunta() {
  pontos = parseInt(localStorage.getItem('pontos')) || 0;
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
    btn.onclick = () => verificarResposta(i);
    answersEl.appendChild(btn);
  });

  // Esconde o botão voltar na primeira pergunta
  voltarBtn.style.display = perguntaAtual === 0 ? 'none' : 'inline-block';
}

function verificarResposta(indiceSelecionado) {
  const q = quiz[perguntaAtual];

  const botoes = answersEl.querySelectorAll('button');
  botoes.forEach(b => b.disabled = true);

  if (indiceSelecionado === q.correta) {
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

window.onload = () => {
  const nome = localStorage.getItem('nomeJogador');
  if (!nome) {
    alert('Por favor, digite seu nome na página inicial antes de começar.');
    window.location.href = 'index.html';
    return;
  }
  playerNameEl.textContent = `Jogador(a): ${nome}`;
  carregarPergunta();
};
