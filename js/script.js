//===[SELEÇÃO ALEATÓRIA DE PERGUNTAS]===//
function selecionarPerguntasAleatorias(banco, quantidade) {
  const copia = [...banco];
  const selecionadas = [];

  for (let i = 0; i < quantidade && copia.length > 0; i++) {
    const index = Math.floor(Math.random() * copia.length);
    selecionadas.push(copia.splice(index, 1)[0]);
  }

  return selecionadas;
}

//===[VARIÁVEIS DE CONTROLE DO QUIZ]===//
const quiz = selecionarPerguntasAleatorias(bancoDePerguntas, 10);
let perguntaAtual = 0;
let pontos = 0;

// Inicialize outras variáveis baseadas em quiz.length
let perguntasRespondidas = Array(quiz.length).fill(false);


//===[CRONOMETRO/TEMPO]===//
let tempoRestante = 15;
let timerInterval = null;
const timerEl = document.getElementById('timer');

function iniciarTimer() {
  clearInterval(timerInterval);
  tempoRestante = 15;
  timerEl.textContent = `Tempo: ${tempoRestante}s`;

  timerInterval = setInterval(() => {
    tempoRestante--;
    timerEl.textContent = `Tempo: ${tempoRestante}s`;

    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      if (!perguntasRespondidas[perguntaAtual]) {
        perguntasRespondidas[perguntaAtual] = true;
        feedbackEl.textContent = 'Tempo esgotado! Nenhum ponto.';
        feedbackEl.style.color = 'orange';
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-block';
        buscarInfoExtra(quiz[perguntaAtual].termoExtra);
      }
    }
  }, 1000);
}

//===[REFERÊNCIAS A ELEMENTOS]===//
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

//===[SALVAR/CARREGAR PROGRESSO]===//
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

//===[CARREGAR PERGUNTA]===//
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
    clearInterval(timerInterval);
    timerEl.textContent = 'Tempo esgotado!';
  } else {
    iniciarTimer();
  }

  voltarBtn.style.display = perguntaAtual === 0 ? 'none' : 'inline-block';
  salvarProgresso();
}

//===[VERIFICAR RESPOSTA]===//
function verificarResposta(indiceSelecionado) {
  clearInterval(timerInterval);
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

//===[BUSCAR INFO EXTRA]===//
function buscarInfoExtra(termo) {
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Resposta não OK da Wikipedia");
      }
      return response.json();
    })
    .then(data => {
      const infoDiv = document.getElementById("info-extra");

      // Verifica se o resumo existe e não é uma página de desambiguação
      if (data.extract && data.type !== "disambiguation") {
        infoDiv.textContent = data.extract;
      } else {
        infoDiv.textContent = "Informação extra não disponível para esse tema.";
      }
    })
    .catch(error => {
      console.error("Erro ao buscar da Wikipedia:", error);
      document.getElementById("info-extra").textContent =
        "Não foi possível carregar a informação extra.";
    });
}


//===[NAVEGAÇÃO ENTRE PERGUNTAS]===//
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

//===[RESETAR QUIZ]===//
function resetarQuiz() {
  perguntaAtual = 0;
  pontos = 0;
  perguntasRespondidas = Array(quiz.length).fill(false);
  localStorage.removeItem('progressoQuiz');
  localStorage.removeItem('pontos');
  carregarPergunta();
}

//===[INICIALIZAÇÃO]===//
window.onload = () => {
  const nome = localStorage.getItem('nomeJogador');
  if (!nome) {
    alert('Por favor, digite seu nome na página inicial antes de começar.');
    window.location.href = 'index.html';
    return;
  }

  // LIMPA ESTADO SALVO
  localStorage.removeItem('progressoQuiz');
  localStorage.removeItem('pontos');

  playerNameEl.textContent = `Jogador(a): ${nome}`;
  carregarProgresso();
  carregarPergunta();
};
