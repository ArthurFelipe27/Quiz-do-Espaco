// ==========================================
// BACKGROUND ANIMADO (ESTRELAS NO CANVAS)
// ==========================================
const canvas = document.getElementById('starsCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    // Gera 120 estrelas de diferentes tamanhos e velocidades
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
            // Se a estrela sair da tela, volta pro topo
            if (star.y > canvas.height) star.y = 0;
        });
        requestAnimationFrame(drawStars);
    }
    drawStars();

    // Recalcula o canvas se a tela for redimensionada
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ==========================================
// LÓGICA DO QUIZ (SÓ RODA NO INDEX.HTML)
// ==========================================
const telaInicio = document.getElementById('tela-inicio');

// Só executa se estivermos na tela principal
if (telaInicio) {
    const telaQuiz = document.getElementById('tela-quiz');
    const telaResultado = document.getElementById('tela-resultado');
    const telaErro = document.getElementById('tela-erro');

    const btnIniciar = document.getElementById('btn-iniciar');
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

    let perguntas = [];
    let indicePerguntaAtual = 0;
    let pontuacao = 0;
    let nomeJogador = "ANÔNIMO";

    // Pega o tempo do localStorage (gravado pela tela de config) ou 15s por padrão
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
        // Atualiza a base caso o usuário tenha jogado, ido na config e voltado na mesma sessão
        tempoBase = parseInt(localStorage.getItem('tempoQuiz')) || 15;
        tempoRestante = tempoBase;
        timerSpan.textContent = tempoRestante;
        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            tempoRestante--;
            timerSpan.textContent = tempoRestante;

            if (tempoRestante <= 0) {
                clearInterval(timerInterval);
                // Estourou o tempo, trata como erro (-1)
                verificarResposta(-1, perguntas[indicePerguntaAtual].respostaCorreta);
            }
        }, 1000);
    }

    function pararTimer() {
        clearInterval(timerInterval);
    }

    async function fetchPerguntasAPI() {
        try {
            const response = await fetch('http://192.168.1.4:5000/api/perguntas'); // Use o seu IP real aqui
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

    btnIniciar.addEventListener('click', () => {
        // Valida o nome antes de iniciar
        if (inputNome.value.trim() === '') {
            inputNome.style.borderColor = 'red';
            inputNome.focus();
            return;
        }
        inputNome.style.borderColor = 'transparent';
        nomeJogador = inputNome.value.trim().toUpperCase();

        btnIniciar.textContent = "Conectando...";
        fetchPerguntasAPI();
    });

    function iniciarQuiz() {
        pontuacao = 0;
        indicePerguntaAtual = 0;
        pontuacaoAtualEl.textContent = pontuacao;
        nomeFinal.textContent = nomeJogador;
        alternarTela(telaQuiz);
        carregarPergunta();
    }

    function carregarPergunta() {
        const dadosPergunta = perguntas[indicePerguntaAtual];
        textoPergunta.textContent = dadosPergunta.pergunta;
        contadorPerguntas.textContent = `${indicePerguntaAtual + 1}/${perguntas.length}`;

        containerAlternativas.innerHTML = '';

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

        iniciarTimer();
    }

    function verificarResposta(indiceSelecionado, indiceCorreto, btnElemento = null) {
        if (indiceSelecionado === indiceCorreto) {
            pontuacao += 100;
            pontuacaoAtualEl.textContent = pontuacao;
            if (btnElemento) btnElemento.classList.add('btn-correta');
        } else {
            if (btnElemento) btnElemento.classList.add('btn-incorreta');
        }

        setTimeout(() => {
            indicePerguntaAtual++;
            if (indicePerguntaAtual < perguntas.length) {
                carregarPergunta();
            } else {
                finalizarQuiz();
            }
        }, 1000);
    }

    async function finalizarQuiz() {
        pontuacaoFinal.textContent = pontuacao;
        alternarTela(telaResultado);

        const dadosPontuacao = {
            nome: nomeJogador,
            pontos: pontuacao
        };

        try {
            await fetch('http://192.168.1.4:5000/api/pontuacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosPontuacao)
            });
        } catch (error) {
            console.error("Erro ao salvar pontuação.", error);
        }
    }

    btnReiniciar.addEventListener('click', () => {
        btnIniciar.textContent = "Iniciar Missão";
        inputNome.value = ''; // Limpa o nome para um novo jogo
        alternarTela(telaInicio);
    });

    btnTentarNovamente.addEventListener('click', () => {
        btnIniciar.textContent = "Iniciar Missão";
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
            localStorage.setItem('tempoQuiz', novoTempo);

            // Exibe o Alert Customizado
            if (customAlert && customAlertMsg) {
                customAlertMsg.innerHTML = `Oxigênio ajustado para <strong>${novoTempo} segundos</strong>.`;

                customAlert.classList.remove('oculta');
                customAlert.classList.add('ativa'); // Usa a mesma classe que criamos pro CSS

                // Fecha o alert ao clicar no botão "Entendido"
                btnFecharAlert.onclick = () => {
                    customAlert.classList.remove('ativa');
                    customAlert.classList.add('oculta');
                };

                // Opcional: O alert fecha sozinho automaticamente após 3 segundos
                setTimeout(() => {
                    customAlert.classList.remove('ativa');
                    customAlert.classList.add('oculta');
                }, 6000);
            }
        });
    });
}