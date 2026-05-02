// ==========================================
// BACKGROUND ANIMADO (ESTRELAS NO CANVAS)
// ==========================================
const canvas = document.getElementById('starsCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }

    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) star.y = 0;
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==========================================
// FUNÇÃO DE SEGURANÇA (SANITIZAÇÃO XSS)
// ==========================================
function sanitizarTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ==========================================
// LÓGICA DO QUIZ (SÓ RODA NO INDEX.HTML)
// ==========================================
const telaInicio = document.getElementById('tela-inicio');

if (telaInicio) {
    const telaQuiz = document.getElementById('tela-quiz');
    const telaResultado = document.getElementById('tela-resultado');
    const telaErro = document.getElementById('tela-erro');

    const btnIniciar = document.getElementById('btn-iniciar');
    const btnExploracao = document.getElementById('btn-exploracao'); // NOVO: Modo Educativo
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const btnTentarNovamente = document.getElementById('btn-tentar-novamente');
    const inputNome = document.getElementById('input-nome');
    const nomeFinal = document.getElementById('nome-final');

    const containerAlternativas = document.getElementById('container-alternativas');
    const textoPergunta = document.getElementById('texto-pergunta');
    const pontuacaoFinal = document.getElementById('pontuacao-final');
    const pontuacaoAtualEl = document.getElementById('pontuacao-atual');
    const contadorPerguntas = document.getElementById('contador-perguntas');
    const timerSpan = document.getElementById('tempo-restante');

    // Elementos da Caixa de Explicação
    const boxExplicacao = document.getElementById('box-explicacao');
    const textoExplicacao = document.getElementById('texto-explicacao');
    const btnProximaExploracao = document.getElementById('btn-proxima-exploracao');

    let perguntas = [];
    let indicePerguntaAtual = 0;
    let pontuacao = 0;
    let nomeJogador = "ANÔNIMO";

    let tempoBase = parseInt(localStorage.getItem('tempoQuiz')) || 15;
    let tempoRestante = 0;
    let timerInterval;

    function alternarTela(telaAtiva) {
        [telaInicio, telaQuiz, telaResultado, telaErro].forEach(tela => {
            tela.classList.remove('ativa');
            tela.classList.add('oculta');
        });
        telaAtiva.classList.remove('oculta');
        telaAtiva.classList.add('ativa');
    }

    function iniciarTimer() {
        tempoBase = parseInt(localStorage.getItem('tempoQuiz')) || 15;
        tempoRestante = tempoBase;
        timerSpan.textContent = tempoRestante;
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            tempoRestante--;
            timerSpan.textContent = tempoRestante;

            if (tempoRestante <= 0) {
                clearInterval(timerInterval);
                verificarResposta(-1, perguntas[indicePerguntaAtual].respostaCorreta);
            }
        }, 1000);
    }

    function pararTimer() {
        clearInterval(timerInterval);
    }

    async function fetchPerguntasAPI() {
        try {
            const modoEscolhido = localStorage.getItem('modoQuiz') || 'medio';
            // IP da rede mantido para testes no celular
            const response = await fetch(`/api/perguntas?modo=${modoEscolhido}`);
            if (!response.ok) throw new Error('Falha na conexão com a API');

            perguntas = await response.json();

            if (perguntas.length > 0) {
                iniciarQuiz();
            } else {
                throw new Error('Banco vazio');
            }
        } catch (error) {
            console.error("Erro API:", error);
            alternarTela(telaErro);
        }
    }

    // Clique no Iniciar Normal (Competitivo)
    btnIniciar.addEventListener('click', () => {
        if (inputNome.value.trim() === '') {
            inputNome.style.borderColor = 'red';
            inputNome.focus();
            return;
        }
        inputNome.style.borderColor = 'transparent';
        nomeJogador = sanitizarTexto(inputNome.value.trim()).toUpperCase();

        // Garante que se o jogador não clicou nas configs, inicie no modo médio
        if (!localStorage.getItem('modoQuiz') || localStorage.getItem('modoQuiz') === 'exploracao') {
            localStorage.setItem('modoQuiz', 'medio');
        }

        btnIniciar.textContent = "Conectando...";
        fetchPerguntasAPI();
    });

    // Clique no Iniciar Modo Exploração (Educativo)
    if (btnExploracao) {
        btnExploracao.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.setItem('modoQuiz', 'exploracao');
            nomeJogador = "EXPLORADOR ESTELAR";
            btnExploracao.textContent = "Carregando Nave...";
            fetchPerguntasAPI();
        });
    }

    function iniciarQuiz() {
        pontuacao = 0;
        indicePerguntaAtual = 0;
        pontuacaoAtualEl.textContent = pontuacao;
        nomeFinal.textContent = nomeJogador;
        alternarTela(telaQuiz);
        carregarPergunta();
    }

    function carregarPergunta() {
        // Esconde a caixa de explicação que pode ter ficado aberta da pergunta anterior
        if (boxExplicacao) {
            boxExplicacao.style.display = 'none';
        }

        const dadosPergunta = perguntas[indicePerguntaAtual];
        textoPergunta.textContent = dadosPergunta.pergunta;
        contadorPerguntas.textContent = `${indicePerguntaAtual + 1}/${perguntas.length}`;

        containerAlternativas.innerHTML = '';

        // Verifica o modo atual para esconder/mostrar UI
        const modoAtual = localStorage.getItem('modoQuiz') || 'medio';

        if (modoAtual === 'exploracao') {
            timerSpan.parentElement.style.display = 'none';
            pontuacaoAtualEl.parentElement.style.display = 'none';
        } else {
            timerSpan.parentElement.style.display = 'block';
            pontuacaoAtualEl.parentElement.style.display = 'block';
            iniciarTimer();
        }

        dadosPergunta.alternativas.forEach((alternativa, index) => {
            const button = document.createElement('button');
            button.textContent = alternativa;
            button.classList.add('btn-alternativa');
            button.addEventListener('click', () => {
                pararTimer();
                verificarResposta(index, dadosPergunta.respostaCorreta, button);
            });
            containerAlternativas.appendChild(button);
        });
    }

    function verificarResposta(indiceSelecionado, indiceCorreto, btnElemento = null) {
        const modoAtual = localStorage.getItem('modoQuiz') || 'medio';
        const dificuldadeDaPergunta = perguntas[indicePerguntaAtual].dificuldade;

        // --- SISTEMA DE PONTUAÇÃO (RISK/REWARD) ---
        let ganhos = 0;
        let descontos = 0;

        if (dificuldadeDaPergunta === 'facil') ganhos = 15;
        else if (dificuldadeDaPergunta === 'medio') ganhos = 35;
        else if (dificuldadeDaPergunta === 'dificil') ganhos = 95;

        if (modoAtual === 'facil') descontos = 3;
        else if (modoAtual === 'medio') descontos = 10;
        else if (modoAtual === 'dificil') descontos = 45;

        // Verifica acerto
        if (indiceSelecionado === indiceCorreto) {
            pontuacao += ganhos;
            if (btnElemento) btnElemento.classList.add('btn-correta');
        } else {
            pontuacao -= descontos;
            if (pontuacao < 0) pontuacao = 0;
            if (btnElemento) btnElemento.classList.add('btn-incorreta');
        }

        pontuacaoAtualEl.textContent = pontuacao;

        // Bloqueia todos os botões para não clicarem duas vezes
        const botoes = document.querySelectorAll('.btn-alternativa');
        botoes.forEach(b => b.disabled = true);

        // --- FLUXO DE AVANÇO ---
        if (modoAtual === 'exploracao') {
            if (textoExplicacao && boxExplicacao) {
                textoExplicacao.textContent = perguntas[indicePerguntaAtual].explicacao;
                boxExplicacao.style.display = 'block';
            }
        } else {
            // Modo Competitivo: Espera 1 segundo e avança automático
            setTimeout(() => {
                avancarPergunta();
            }, 1000);
        }
    }

    function avancarPergunta() {
        indicePerguntaAtual++;
        if (indicePerguntaAtual < perguntas.length) {
            carregarPergunta();
        } else {
            finalizarQuiz();
        }
    }

    // Botão de continuar do Modo Exploração
    if (btnProximaExploracao) {
        btnProximaExploracao.addEventListener('click', avancarPergunta);
    }

    async function finalizarQuiz() {
        const modoAtual = localStorage.getItem('modoQuiz') || 'medio';
        alternarTela(telaResultado);

        if (modoAtual === 'exploracao') {
            document.querySelector('.placar h3').textContent = "Exploração Concluída!";
            pontuacaoFinal.style.display = 'none';
        } else {
            document.querySelector('.placar h3').textContent = "Sua Pontuação:";
            pontuacaoFinal.style.display = 'block';
            pontuacaoFinal.textContent = pontuacao;

            const dadosPontuacao = { nome: nomeJogador, pontos: pontuacao };

            try {
                await fetch('/api/pontuacao', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPontuacao)
                });
            } catch (error) {
                console.error("Erro ao salvar pontuação.", error);
            }
        }
    }

    btnReiniciar.addEventListener('click', () => {
        btnIniciar.textContent = "Iniciar Missão";
        if (btnExploracao) btnExploracao.textContent = "🚀 Modo Exploração (Educativo)";
        inputNome.value = '';
        alternarTela(telaInicio);
    });

    btnTentarNovamente.addEventListener('click', () => {
        btnIniciar.textContent = "Iniciar Missão";
        if (btnExploracao) btnExploracao.textContent = "🚀 Modo Exploração (Educativo)";
        alternarTela(telaInicio);
    });
}

// ==========================================
// LÓGICA DA PÁGINA DE CONFIGURAÇÕES
// ==========================================
const containerDificuldade = document.querySelector('.difficulty-buttons');

if (containerDificuldade) {
    const botoesDificuldade = document.querySelectorAll('.btn-difficulty');
    const customAlert = document.getElementById('custom-alert');
    const customAlertMsg = document.getElementById('custom-alert-msg');
    const btnFecharAlert = document.getElementById('btn-fechar-alert');

    let tempoSalvo = parseInt(localStorage.getItem('tempoQuiz')) || 15;

    botoesDificuldade.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-time')) === tempoSalvo) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', (e) => {
            botoesDificuldade.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const novoTempo = e.target.getAttribute('data-time');
            const novoModo = e.target.getAttribute('data-modo');

            localStorage.setItem('tempoQuiz', novoTempo);
            localStorage.setItem('modoQuiz', novoModo);

            if (customAlert && customAlertMsg) {
                customAlertMsg.innerHTML = `Oxigênio ajustado para <strong>${novoTempo} segundos</strong>.`;
                customAlert.classList.remove('oculta');
                customAlert.classList.add('ativa');

                btnFecharAlert.onclick = () => {
                    customAlert.classList.remove('ativa');
                    customAlert.classList.add('oculta');
                };

                setTimeout(() => {
                    customAlert.classList.remove('ativa');
                    customAlert.classList.add('oculta');
                }, 6000);
            }
        });
    });
}

// ==========================================
// LÓGICA DO RANKING GLOBAL
// ==========================================
const listaRanking = document.getElementById('lista-ranking');

if (listaRanking) {
    async function carregarRanking() {
        try {
            const response = await fetch('/api/ranking');
            if (!response.ok) throw new Error('Erro ao buscar o ranking');

            const dados = await response.json();
            listaRanking.innerHTML = '';

            if (dados.length === 0) {
                listaRanking.innerHTML = '<li class="linha-ranking" style="justify-content: center;">Nenhum astronauta no mural ainda!</li>';
                return;
            }

            dados.forEach((jogador, index) => {
                const li = document.createElement('li');
                li.classList.add('linha-ranking');

                if (index === 0) li.classList.add('podio-1');
                if (index === 1) li.classList.add('podio-2');
                if (index === 2) li.classList.add('podio-3');

                li.innerHTML = `<span>#${index + 1} ${jogador.nome}</span> <span>${jogador.pontos} pts</span>`;
                listaRanking.appendChild(li);
            });
        } catch (error) {
            console.error("Erro API Ranking:", error);
            listaRanking.innerHTML = '<li class="linha-ranking" style="justify-content: center; border-color: red;">Falha ao contatar a base de dados.</li>';
        }
    }

    carregarRanking();
}