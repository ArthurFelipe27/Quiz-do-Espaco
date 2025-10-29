// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {

    // BANCO DE PERGUNTAS E INFORMAÇÕES
    // REMOVIDO: Agora será carregado do perguntas.json

    // == GESTÃO DE ESTADO DA APLICAÇÃO ==
    const state = {
        nomeJogador: '',
        perguntasQuiz: [],
        perguntasDoBanco: [], // <-- NOVO: Armazena perguntas do JSON
        fallbackDoBanco: {}, // <-- NOVO: Armazena fallbacks do JSON
        perguntaAtual: 0,
        pontos: 0,
        streak: 0, // <-- NOVO: Para contar acertos consecutivos
        perguntasRespondidas: [],
        respondeuPeloMenosUma: false,
        tempoRestante: 15,
        timerInterval: null,
    };

    // == SELETORES DE ELEMENTOS DO DOM ==
    const elements = {
        views: {
            login: document.getElementById('login-view'),
            quiz: document.getElementById('quiz-view'),
            resultado: document.getElementById('resultado-view'),
            creditos: document.getElementById('creditos-view'),
        },
        loginForm: document.getElementById('loginForm'),
        usernameInput: document.getElementById('username'),
        errorMsg: document.getElementById('errorMsg'),
        playerName: document.getElementById('player-name'),
        timer: document.getElementById('timer'),
        question: document.getElementById('question'),
        answers: document.getElementById('answers'),
        feedback: document.getElementById('feedback'),
        infoExtra: document.getElementById('info-extra'),
        pontosUsuario: document.getElementById('pontos-usuario'),
        resultadoTexto: document.getElementById('resultado-texto'),
        listaRanking: document.getElementById('lista-ranking'),
        modal: document.getElementById('custom-modal'),
        modalText: document.getElementById('modal-text'),
        modalConfirmBtn: document.getElementById('modal-confirm-btn'),
        modalCancelBtn: document.getElementById('modal-cancel-btn'),
        // Botões
        creditosBtnLogin: document.getElementById('creditos-btn-login'),
        voltarInicioBtn: document.getElementById('voltar-inicio-btn'),
        nextBtn: document.getElementById('next-btn'),
        voltarBtn: document.getElementById('voltar-btn'),
        resetBtn: document.getElementById('reset-btn'),
        pularBtn: document.getElementById('pular-btn'),
        jogarNovamenteBtn: document.getElementById('jogar-novamente-btn'),
        reiniciarRankingBtn: document.getElementById('reiniciar-ranking-btn'),
        toggleThemeBtn: document.getElementById('toggleThemeBtn'),
    };

    // == LÓGICA DE NAVEGAÇÃO ENTRE TELAS ==
    const showView = (viewName) => {
        Object.values(elements.views).forEach(view => view.classList.remove('active'));
        elements.views[viewName].classList.add('active');
    };

    // == MODAL CUSTOMIZADO ==
    const showModal = (text, showConfirm = true, showCancel = true) => {
        return new Promise((resolve) => {
            elements.modalText.textContent = text;
            elements.modalConfirmBtn.style.display = showConfirm ? 'inline-block' : 'none';
            elements.modalCancelBtn.style.display = showCancel ? 'inline-block' : 'none';
            elements.modal.style.display = 'flex';

            elements.modalConfirmBtn.onclick = () => {
                elements.modal.style.display = 'none';
                resolve(true);
            };
            elements.modalCancelBtn.onclick = () => {
                elements.modal.style.display = 'none';
                resolve(false);
            };
        });
    };

    // == LÓGICA DO TEMA (CLARO/ESCURO) ==
    const themeManager = {
        init() {
            const savedTheme = localStorage.getItem('theme') || 'dark-theme';
            document.body.classList.add(savedTheme);
            elements.toggleThemeBtn.addEventListener('click', this.toggleTheme);
        },
        toggleTheme() {
            const isLight = document.body.classList.toggle('light-theme');
            document.body.classList.toggle('dark-theme', !isLight);
            localStorage.setItem('theme', isLight ? 'light-theme' : 'dark-theme');
        }
    };

    // == LÓGICA DO QUIZ ==
    const quizManager = {
        // A função start agora é "async" para poder usar "await" no fetch
        start: async function () {
            try {
                // Tenta carregar as perguntas do arquivo JSON
                const response = await fetch('perguntas.json');
                if (!response.ok) {
                    throw new Error(`Erro ao carregar perguntas.json: ${response.statusText}`);
                }
                const data = await response.json();

                // Salva os dados carregados no estado global
                state.perguntasDoBanco = data.perguntas;
                state.fallbackDoBanco = data.fallbackInfo;

                // Continua com a lógica original do quiz
                this.selecionarPerguntas();
                this.resetState();
                elements.playerName.textContent = `Jogador(a): ${state.nomeJogador}`;
                this.carregarPergunta();
                showView('quiz');

            } catch (error) {
                // Se falhar, exibe um erro na tela de login
                console.error("Não foi possível carregar o banco de perguntas:", error);
                elements.errorMsg.textContent = "Erro fatal: Não foi possível carregar as perguntas. Tente recarregar a página.";
                showView('login');
            }
        },
        resetState() {
            state.perguntaAtual = 0;
            state.pontos = 0;
            state.streak = 0; // <-- NOVO: Reseta a sequência
            state.perguntasRespondidas = Array(state.perguntasQuiz.length).fill(false);
            state.respondeuPeloMenosUma = false;
        },
        selecionarPerguntas() {
            // Modificado: Usa state.perguntasDoBanco em vez de BANCO_DE_PERGUNTAS
            const copia = [...state.perguntasDoBanco];
            state.perguntasQuiz = [];
            const numPerguntas = Math.min(10, copia.length);
            for (let i = 0; i < numPerguntas; i++) {
                const index = Math.floor(Math.random() * copia.length);
                state.perguntasQuiz.push(copia.splice(index, 1)[0]);
            }
        },
        carregarPergunta() {
            elements.pontosUsuario.textContent = `Pontos: ${state.pontos}`;
            elements.feedback.textContent = '';
            elements.infoExtra.innerHTML = '';
            elements.nextBtn.disabled = true;
            elements.answers.innerHTML = '';

            const q = state.perguntasQuiz[state.perguntaAtual];
            elements.question.textContent = q.pergunta;

            q.respostas.forEach((resp, i) => {
                const btn = document.createElement('button');
                btn.textContent = resp;
                btn.onclick = () => this.verificarResposta(i);
                elements.answers.appendChild(btn);
            });

            this.iniciarTimer();
            elements.voltarBtn.style.display = state.perguntaAtual === 0 ? 'none' : 'inline-block';
        },
        verificarResposta(indiceSelecionado) {
            clearInterval(state.timerInterval);
            const q = state.perguntasQuiz[state.perguntaAtual];
            const botoes = elements.answers.querySelectorAll('button');

            botoes.forEach(btn => btn.disabled = true);

            if (indiceSelecionado === q.correta) {
                // Lógica de pontos por acerto
                const pontosBase = 10;
                const pontosTempo = state.tempoRestante; // Ganha os segundos restantes como bônus
                state.streak++; // Incrementa a sequência
                const bonusStreak = (state.streak - 1) * 5; // Bônus de +5 para 2x, +10 para 3x, etc.
                const pontosGanhos = pontosBase + pontosTempo + bonusStreak;

                state.pontos += pontosGanhos;

                botoes[indiceSelecionado].classList.add('btn-correta');
                let feedbackTexto = `Resposta correta! +${pontosGanhos} pontos (${pontosBase} base + ${pontosTempo} tempo)`;
                if (bonusStreak > 0) {
                    feedbackTexto += ` (Bônus de ${bonusStreak} por ${state.streak}x acertos!)`;
                }
                elements.feedback.textContent = feedbackTexto;
                elements.feedback.style.color = 'var(--correct-color)';

            } else {
                // Lógica de pontos por erro
                state.streak = 0; // Zera a sequência
                botoes[indiceSelecionado].classList.add('btn-incorreta');
                botoes[q.correta].classList.add('btn-correta');
                elements.feedback.textContent = 'Resposta incorreta. -5 pontos. Sequência perdida!';
                elements.feedback.style.color = 'var(--incorrect-color)';
                state.pontos = Math.max(0, state.pontos - 5);
            }

            state.perguntasRespondidas[state.perguntaAtual] = true;
            state.respondeuPeloMenosUma = true;
            elements.pontosUsuario.textContent = `Pontos: ${state.pontos}`;
            elements.nextBtn.disabled = false;
            this.buscarInfoExtra(q.termoExtra);
        },
        iniciarTimer() {
            clearInterval(state.timerInterval);
            state.tempoRestante = 15;
            elements.timer.textContent = `Tempo: ${state.tempoRestante}s`;

            state.timerInterval = setInterval(() => {
                state.tempoRestante--;
                elements.timer.textContent = `Tempo: ${state.tempoRestante}s`;
                if (state.tempoRestante <= 0) {
                    clearInterval(state.timerInterval);
                    elements.feedback.textContent = 'Tempo esgotado!';
                    elements.feedback.style.color = 'orange';
                    elements.nextBtn.disabled = false;
                    elements.answers.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    this.buscarInfoExtra(state.perguntasQuiz[state.perguntaAtual].termoExtra);
                }
            }, 1000);
        },
        buscarInfoExtra(termo) {
            const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(termo)}`;
            fetch(url)
                .then(response => response.ok ? response.json() : Promise.reject('API call failed'))
                .then(data => {
                    if (data.extract && data.type !== "disambiguation") {
                        let content = '';
                        if (data.thumbnail && data.thumbnail.source) {
                            content += `<img src="${data.thumbnail.source}" alt="Imagem de ${data.title}">`;
                        }
                        content += `<p>${data.extract}</p>`;
                        elements.infoExtra.innerHTML = content;
                    } else {
                        this.usarFallback(termo);
                    }
                })
                .catch(() => this.usarFallback(termo));
        },
        usarFallback(termo) {
            // Modificado: Usa state.fallbackDoBanco em vez de FALLBACK_INFO
            const fallback = state.fallbackDoBanco[termo];
            if (fallback) {
                let content = '';
                if (fallback.imagem) {
                    content += `<img src="${fallback.imagem}" alt="Imagem de ${termo}">`;
                }
                content += `<p>${fallback.texto}</p>`;
                elements.infoExtra.innerHTML = content;
            } else {
                elements.infoExtra.textContent = "Informação extra não disponível.";
            }
        },
        proximaPergunta() {
            state.perguntaAtual++;
            if (state.perguntaAtual >= state.perguntasQuiz.length) {
                if (!state.respondeuPeloMenosUma) {
                    showModal("Você precisa responder pelo menos uma pergunta para concluir.", true, false);
                    state.perguntaAtual--;
                    return;
                }
                this.finalizar();
            } else {
                this.carregarPergunta();
            }
        },
        // <-- NOVO: Função para pular pergunta -->
        pular() {
            // Pular quebra a sequência e tem uma pequena penalidade
            state.streak = 0;
            state.pontos = Math.max(0, state.pontos - 2); // Penalidade de 2 pontos
            elements.pontosUsuario.textContent = `Pontos: ${state.pontos}`;
            elements.feedback.textContent = 'Pergunta pulada. -2 pontos.';
            elements.feedback.style.color = 'orange';

            // Avança para a próxima pergunta
            this.proximaPergunta();
        },
        perguntaAnterior() {
            if (state.perguntaAtual > 0) {
                state.perguntaAtual--;
                this.carregarPergunta();
            }
        },
        async resetar() {
            const confirmado = await showModal("Tem certeza que deseja reiniciar o quiz? Seu progresso será perdido.");
            if (confirmado) {
                clearInterval(state.timerInterval);
                this.start();
            }
        },
        finalizar() {
            clearInterval(state.timerInterval);
            rankingManager.atualizar(state.nomeJogador, state.pontos);
            elements.resultadoTexto.innerHTML = `${state.nomeJogador}, você fez <strong>${state.pontos}</strong> ponto${state.pontos !== 1 ? 's' : ''}! <span class="rocket">🚀</span>`;
            rankingManager.exibir();
            showView('resultado');
        }
    };

    // == LÓGICA DO RANKING ==
    const rankingManager = {
        getRanking() {
            return JSON.parse(localStorage.getItem('ranking')) || [];
        },
        saveRanking(ranking) {
            localStorage.setItem('ranking', JSON.stringify(ranking));
        },
        atualizar(nome, pontos) {
            let ranking = this.getRanking();
            ranking.push({ nome, pontos });
            ranking.sort((a, b) => b.pontos - a.pontos);
            ranking = ranking.slice(0, 5); // Mantém apenas os 5 melhores
            this.saveRanking(ranking);
        },
        exibir() {
            const ranking = this.getRanking();
            elements.listaRanking.innerHTML = '';
            if (ranking.length === 0) {
                elements.listaRanking.innerHTML = '<li>Ainda não há pontuações. Seja o primeiro!</li>';
            } else {
                ranking.forEach((jogador, index) => {
                    const item = document.createElement('li');
                    item.textContent = `${index + 1}º - ${jogador.nome}: ${jogador.pontos} pontos`;
                    elements.listaRanking.appendChild(item);
                });
            }
        },
        async reiniciar() {
            const confirmado = await showModal("Tem certeza que deseja apagar todo o ranking?");
            if (confirmado) {
                localStorage.removeItem('ranking');
                this.exibir();
            }
        }
    };

    // == EVENT LISTENERS (Controladores) ==
    // A função do listener agora é "async" para poder chamar quizManager.start()
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = elements.usernameInput.value.trim();
        if (username) {
            state.nomeJogador = username;
            elements.errorMsg.textContent = '';

            // Desabilita o botão para evitar cliques duplos enquanto carrega
            const loginButton = elements.loginForm.querySelector('button');
            loginButton.disabled = true;
            loginButton.textContent = 'Carregando...';

            await quizManager.start(); // Chama o start "async"

            // Reabilita o botão
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';

        } else {
            elements.errorMsg.textContent = "Por favor, digite seu nome!";
        }
    });

    elements.creditosBtnLogin.addEventListener('click', () => showView('creditos'));
    elements.voltarInicioBtn.addEventListener('click', () => showView('login'));
    elements.jogarNovamenteBtn.addEventListener('click', () => {
        elements.usernameInput.value = '';
        showView('login');
    });

    elements.nextBtn.addEventListener('click', () => quizManager.proximaPergunta());
    elements.pularBtn.addEventListener('click', () => quizManager.pular()); // <-- MUDANÇA: Chama a nova função pular()
    elements.voltarBtn.addEventListener('click', () => quizManager.perguntaAnterior());
    elements.resetBtn.addEventListener('click', () => quizManager.resetar());

    elements.reiniciarRankingBtn.addEventListener('click', () => rankingManager.reiniciar());

    // == INICIALIZAÇÃO DA APLICAÇÃO ==
    const init = () => {
        themeManager.init();
        showView('login');
        createStarBackground(); // Inicia o fundo de estrelas
    };

    // EFEITO DE FUNDO DE ESTRELAS (Canvas)
    function createStarBackground() {
        const canvas = document.getElementById("starsCanvas");
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        let stars = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                velocity: Math.random() * 0.5
            });
        }

        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                star.y += star.velocity;

                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(animateStars);
        }
        animateStars();
    }

    init(); // Roda a aplicação
});


