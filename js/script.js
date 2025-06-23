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
let respondeuPeloMenosUma = false;
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

  botoes.forEach((btn, index) => {
    btn.disabled = true;

    if (index === q.correta) {
      btn.classList.add('btn-correta');
    }

    if (index === indiceSelecionado && index !== q.correta) {
      btn.classList.add('btn-incorreta');
    }
  });

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
    respondeuPeloMenosUma = true;
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
      if (!response.ok) throw new Error("Resposta não OK da Wikipedia");
      return response.json();
    })
    .then(data => {
      const infoDiv = document.getElementById("info-extra");
      infoDiv.innerHTML = "";

      if (data.extract && data.type !== "disambiguation") {
        if (data.thumbnail && data.thumbnail.source) {
          const img = document.createElement("img");
          img.src = data.thumbnail.source;
          img.alt = `Imagem de ${data.title}`;
          img.style.maxWidth = "100%";
          img.style.borderRadius = "8px";
          img.style.marginBottom = "10px";
          infoDiv.appendChild(img);
        }

        const texto = document.createElement("p");
        texto.textContent = data.extract;
        infoDiv.appendChild(texto);
      } else {
        infoDiv.textContent = "Informação extra não disponível para esse tema. 😞";
      }
    })
    .catch(error => {
      console.error("Erro ao buscar da Wikipedia:", error);
      document.getElementById("info-extra").textContent =
        "Não foi possível carregar a informação extra. 😞";
    });
}

//===[NAVEGAÇÃO ENTRE PERGUNTAS]===//
nextBtn.addEventListener('click', () => {
  perguntaAtual++;
  if (perguntaAtual >= quiz.length) {
    if (!respondeuPeloMenosUma) {
      alert("⚠️ Você precisa responder pelo menos uma pergunta antes de concluir o quiz.");
      perguntaAtual--;
      return;
    }
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
    if (!respondeuPeloMenosUma) {
      alert("⚠️ Você precisa responder pelo menos uma pergunta antes de concluir o quiz.");
      perguntaAtual--;
      return;
    }
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
  respondeuPeloMenosUma = false;
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

  localStorage.removeItem('progressoQuiz');
  localStorage.removeItem('pontos');

  playerNameEl.textContent = `Jogador(a): ${nome}`;
  carregarProgresso();
  carregarPergunta();
};
