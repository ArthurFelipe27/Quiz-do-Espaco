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

// ==========================================
// FUNÇÃO DE SEGURANÇA (SANITIZAÇÃO)
// ==========================================
function sanitizarTexto(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}


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
            const modoEscolhido = localStorage.getItem('modoQuiz') || 'medio';
            // Mude o localhost para o seu IP caso esteja testando no celular
            const response = await fetch(`http://localhost:5000/api/perguntas?modo=${modoEscolhido}`); // Use o seu IP real aqui
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
        if (inputNome.value.trim() === '') {
            inputNome.style.borderColor = 'red';
            inputNome.focus();
            return;
        }
        inputNome.style.borderColor = 'transparent';

        // Aplica a sanitização antes de jogar a variável para a memória
        nomeJogador = sanitizarTexto(inputNome.value.trim()).toUpperCase();

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

        // --- NOVO SISTEMA DE PONTUAÇÃO (RISK/REWARD) ---
        const modoAtual = localStorage.getItem('modoQuiz') || 'medio';
        // Usa o indicePerguntaAtual para pegar a dificuldade correta do array de perguntas
        const dificuldadeDaPergunta = perguntas[indicePerguntaAtual].dificuldade;

        let ganhos = 0;
        let descontos = 0;

        // Regra de Ganhos pela dificuldade da pergunta (só ganha se acertar)
        if (dificuldadeDaPergunta === 'facil') ganhos = 15;
        else if (dificuldadeDaPergunta === 'medio') ganhos = 35;
        else if (dificuldadeDaPergunta === 'dificil') ganhos = 95;

        // Regra de Perdas baseada no Modo de Jogo (perde se errar ou tempo esgotar)
        if (modoAtual === 'facil') descontos = 3;
        else if (modoAtual === 'medio') descontos = 10;
        else if (modoAtual === 'dificil') descontos = 45;


        // Lógica de Acerto ou Erro
        if (indiceSelecionado === indiceCorreto) {
            pontuacao += ganhos; // Soma os ganhos da pergunta
            if (btnElemento) btnElemento.classList.add('btn-correta');
        } else {
            pontuacao -= descontos; // Subtrai o desconto do modo
            if (pontuacao < 0) pontuacao = 0; // Impede saldo negativo
            if (btnElemento) btnElemento.classList.add('btn-incorreta');
        }

        // Atualiza a tela imediatamente com o novo valor
        pontuacaoAtualEl.textContent = pontuacao;

        // Aguarda 1 segundo antes de passar para a próxima
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
            const novoModo = e.target.getAttribute('data-modo'); // <--- Puxa o modo

            localStorage.setItem('tempoQuiz', novoTempo);
            localStorage.setItem('modoQuiz', novoModo); // <--- Salva o modo

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

// ==========================================
// LÓGICA DO RANKING GLOBAL
// ==========================================
const listaRanking = document.getElementById('lista-ranking');

if (listaRanking) {
    async function carregarRanking() {
        try {
            // Se for testar no celular, troque 'localhost' pelo seu IP
            const response = await fetch('http://192.168.1.4:5000/api/ranking');
            if (!response.ok) throw new Error('Erro ao buscar o ranking');

            const dados = await response.json();
            listaRanking.innerHTML = ''; // Limpa a mensagem de "Buscando dados..."

            if (dados.length === 0) {
                listaRanking.innerHTML = '<li class="linha-ranking" style="justify-content: center;">Nenhum astronauta no mural ainda!</li>';
                return;
            }

            // Preenche os top 5 na tela
            dados.forEach((jogador, index) => {
                const li = document.createElement('li');
                li.classList.add('linha-ranking');

                // Adiciona as cores do pódio
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