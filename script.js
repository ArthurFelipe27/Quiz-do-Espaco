// Objeto de configuração do Firebase (fornecido por você)
const firebaseConfig = {
    apiKey: "AIzaSyDJQkQDAjGqutnSRGfFlC0Xi17GlBBmXys",
    authDomain: "quiz-espaco-a459a.firebaseapp.com",
    projectId: "quiz-espaco-a459a",
    storageBucket: "quiz-espaco-a459a.firebasestorage.app",
    messagingSenderId: "240697813503",
    appId: "1:240697813503:web:ec807c49f62b400e481fca"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
// Inicializa o Cloud Firestore e obtém uma referência para o serviço
const db = firebase.firestore();


// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {

    // == GESTÃO DE ESTADO DA APLICAÇÃO ==
    const state = {
        nomeJogador: '',
        perguntasDoBanco: [], // Vai guardar as perguntas do perguntas.json
        fallbackDoBanco: {}, // Vai guardar os fallbacks do perguntas.json
        perguntasQuiz: [], // Perguntas selecionadas para a rodada
        perguntaAtual: 0,
        pontos: 0,
        streak: 0, // Acertos consecutivos
        perguntasRespondidas: [],
        respondeuPeloMenosUma: false,
        tempoRestante: 15,
        timerInterval: null,
        dificuldadeSelecionada: '', // 'facil', 'medio', 'dificil'
        multiplicadorPontos: 1, // Multiplicador baseado na dificuldade
        rankingListener: null, // Para guardar o listener do ranking em tempo real
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
        difficultyButtons: document.querySelectorAll('.btn-difficulty'),
        loginBtn: document.getElementById('login-btn'),
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
        toggleThemeBtn: document.getElementById('toggleThemeBtn'),
    };

    // == LÓGICA DE NAVEGAÇÃO ENTRE TELAS ==
    const showView = (viewName) => {
        Object.values(elements.views).forEach(view => view.classList.remove('active'));
        elements.views[viewName].classList.add('active');

        // Gerencia o listener do ranking em tempo real
        if (viewName === 'resultado') {
            rankingManager.exibir(); // Ativa o listener
        } else if (state.rankingListener) {
            // Se sairmos da tela de resultado, desativa o listener para economizar recursos
            state.rankingListener(); // Esta é a função de "unsubscribe" do Firebase
            state.rankingListener = null;
        }

        // Reseta o formulário de login ao voltar para ele
        if (viewName === 'login') {
            elements.usernameInput.value = '';
            state.dificuldadeSelecionada = '';
            elements.difficultyButtons.forEach(btn => btn.classList.remove('active'));
            elements.loginBtn.disabled = true;
            elements.errorMsg.textContent = '';
        }
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
        // Agora é 'async' para esperar o 'fetch' do JSON
        async carregarPerguntas() {
            try {
                const response = await fetch('perguntas.json');
                if (!response.ok) {
                    throw new Error(`Erro ao buscar perguntas: ${response.statusText}`);
                }
                const data = await response.json();
                state.perguntasDoBanco = data.perguntas;
                state.fallbackDoBanco = data.fallbackInfo;
                return true; // Sucesso
            } catch (error) {
                console.error(error);
                elements.errorMsg.textContent = "Falha ao carregar as perguntas. Tente recarregar a página.";
                return false; // Falha
            }
        },

        start(dificuldade) {
            state.dificuldadeSelecionada = dificuldade;
            this.definirMultiplicador();
            this.selecionarPerguntas(dificuldade);
            this.resetState();
            elements.playerName.textContent = `Jogador(a): ${state.nomeJogador}`;
            this.carregarPergunta();
            showView('quiz');
        },

        definirMultiplicador() {
            switch (state.dificuldadeSelecionada) {
                case 'facil':
                    state.multiplicadorPontos = 1;
                    break;
                case 'medio':
                    state.multiplicadorPontos = 1.5;
                    break;
                case 'dificil':
                    state.multiplicadorPontos = 2;
                    break;
                default:
                    state.multiplicadorPontos = 1;
            }
        },

        resetState() {
            state.perguntaAtual = 0;
            state.pontos = 0;
            state.streak = 0;
            state.perguntasRespondidas = Array(state.perguntasQuiz.length).fill(false);
            state.respondeuPeloMenosUma = false;
        },

        selecionarPerguntas(dificuldade) {
            // Filtra as perguntas pela dificuldade escolhida
            const perguntasFiltradas = state.perguntasDoBanco.filter(p => p.dificuldade === dificuldade);

            // Embaralha as perguntas filtradas
            const copia = [...perguntasFiltradas];
            state.perguntasQuiz = [];
            const numPerguntas = Math.min(10, copia.length); // Pega 10 perguntas ou menos
            for (let i = 0; i < numPerguntas; i++) {
                const index = Math.floor(Math.random() * copia.length);
                state.perguntasQuiz.push(copia.splice(index, 1)[0]);
            }
        },

        carregarPergunta() {
            elements.pontosUsuario.textContent = `Pontos: ${state.pontos} (Sequência: ${state.streak}x)`;
            elements.feedback.textContent = '';
            elements.infoExtra.innerHTML = '';
            elements.nextBtn.disabled = true;
            elements.answers.innerHTML = '';

            // Verifica se há perguntas
            if (state.perguntasQuiz.length === 0) {
                elements.question.textContent = "Não encontramos perguntas para esta dificuldade.";
                elements.voltarBtn.style.display = 'none';
                elements.pularBtn.style.display = 'none';
                elements.resetBtn.style.display = 'none';
                // Botão para voltar ao menu
                const backBtn = document.createElement('button');
                backBtn.textContent = "Voltar ao Menu";
                backBtn.onclick = () => showView('login');
                elements.answers.appendChild(backBtn);
                return;
            }

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
            elements.pularBtn.style.display = 'inline-block';
            elements.resetBtn.style.display = 'inline-block';
        },

        verificarResposta(indiceSelecionado) {
            clearInterval(state.timerInterval);
            const q = state.perguntasQuiz[state.perguntaAtual];
            const botoes = elements.answers.querySelectorAll('button');
            botoes.forEach(btn => btn.disabled = true);

            // Pontos por tempo
            const pontosTempo = state.tempoRestante;
            const pontosBase = 10;
            const bonusStreak = state.streak * 5; // +5 pontos para cada acerto consecutivo

            if (indiceSelecionado === q.correta) {
                state.streak++;
                const pontosGanhos = Math.round((pontosBase + pontosTempo + bonusStreak) * state.multiplicadorPontos);
                state.pontos += pontosGanhos;

                botoes[indiceSelecionado].classList.add('btn-correta');
                elements.feedback.innerHTML = `Correto! +${pontosGanhos} pts <br>
          <small>(+${pontosBase} base +${pontosTempo} tempo +${bonusStreak} streak) x${state.multiplicadorPontos} diff</small>`;
                elements.feedback.style.color = 'var(--correct-color)';
            } else {
                const penalidade = Math.round(5 * state.multiplicadorPontos);
                state.pontos = Math.max(0, state.pontos - penalidade);
                const streakPerdido = state.streak;
                state.streak = 0; // Zera a sequência

                botoes[indiceSelecionado].classList.add('btn-incorreta');
                botoes[q.correta].classList.add('btn-correta');
                elements.feedback.innerHTML = `Incorreto. -${penalidade} pts. ${streakPerdido > 0 ? `Sequência de ${streakPerdido} perdida.` : ''}`;
                elements.feedback.style.color = 'var(--incorrect-color)';
            }

            state.perguntasRespondidas[state.perguntaAtual] = true;
            state.respondeuPeloMenosUma = true;
            elements.pontosUsuario.textContent = `Pontos: ${state.pontos} (Sequência: ${state.streak}x)`;
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
                    elements.feedback.textContent = 'Tempo esgotado! Sequência perdida.';
                    elements.feedback.style.color = 'orange';
                    state.streak = 0; // Zera a sequência
                    elements.nextBtn.disabled = false;
                    elements.answers.querySelectorAll('button').forEach(btn => btn.disabled = true);
                    this.buscarInfoExtra(state.perguntasQuiz[state.perguntaAtual].termoExtra);
                }
            }, 1000);
        },

        buscarInfoExtra(termo) {
            if (!termo) {
                elements.infoExtra.textContent = "Informação extra não disponível.";
                return;
            }
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

        perguntaAnterior() {
            if (state.perguntaAtual > 0) {
                state.perguntaAtual--;
                this.carregarPergunta();
            }
        },

        pular() {
            // Penalidade por pular
            const penalidade = Math.round(2 * state.multiplicadorPontos);
            state.pontos = Math.max(0, state.pontos - penalidade);
            elements.feedback.textContent = `Pulou! -${penalidade} pts. Sequência perdida.`;
            elements.feedback.style.color = 'orange';
            state.streak = 0; // Zera a sequência
            this.proximaPergunta();
        },

        async resetar() {
            const confirmado = await showModal("Tem certeza que deseja reiniciar o quiz? Seu progresso será perdido.");
            if (confirmado) {
                clearInterval(state.timerInterval);
                this.start(state.dificuldadeSelecionada); // Reinicia com a mesma dificuldade
            }
        },

        finalizar() {
            clearInterval(state.timerInterval);
            // Salva no ranking (agora no Firebase)
            rankingManager.atualizar(state.nomeJogador, state.pontos, state.dificuldadeSelecionada);
            elements.resultadoTexto.innerHTML = `${state.nomeJogador}, você fez <strong>${state.pontos}</strong> ponto${state.pontos !== 1 ? 's' : ''}! <span class="rocket">🚀</span>`;
            // O rankingManager.exibir() agora é chamado pelo showView('resultado')
            showView('resultado');
        }
    };

    // == LÓGICA DO RANKING (AGORA COM FIREBASE) ==
    const rankingManager = {

        // Salva a pontuação no Firebase
        atualizar(nome, pontos, dificuldade) {
            db.collection('ranking').add({
                nome: nome,
                pontos: pontos,
                dificuldade: dificuldade,
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Adiciona data/hora
            }).then(() => {
                console.log('Pontuação salva no ranking global!');
            }).catch((error) => {
                console.error('Erro ao salvar no ranking: ', error);
            });
        },

        // Exibe o ranking em tempo real
        exibir() {
            // Se já houver um listener, desativa antes de criar um novo
            if (state.rankingListener) {
                state.rankingListener();
            }

            // Ouve mudanças na coleção 'ranking', ordenado por pontos, pegando os 5 melhores
            state.rankingListener = db.collection('ranking')
                .orderBy('pontos', 'desc')
                .limit(5)
                .onSnapshot((querySnapshot) => {
                    elements.listaRanking.innerHTML = '';
                    if (querySnapshot.empty) {
                        elements.listaRanking.innerHTML = '<li>Ainda não há pontuações. Seja o primeiro!</li>';
                        return;
                    }

                    let index = 1;
                    querySnapshot.forEach((doc) => {
                        const jogador = doc.data();
                        const item = document.createElement('li');
                        // Mostra a dificuldade no ranking
                        item.textContent = `${index}º - ${jogador.nome} (${jogador.dificuldade}): ${jogador.pontos} pontos`;
                        elements.listaRanking.appendChild(item);
                        index++;
                    });
                }, (error) => {
                    console.error("Erro ao buscar ranking: ", error);
                    elements.listaRanking.innerHTML = '<li>Erro ao carregar o ranking. Tente recarregar.</li>';
                });
        },
        // As funções getRanking(), saveRanking() e reiniciar() baseadas no localStorage não são mais necessárias.
    };

    // == VALIDAÇÃO DO LOGIN ==
    const validarLogin = () => {
        const nomeValido = elements.usernameInput.value.trim().length > 0;
        const dificuldadeValida = state.dificuldadeSelecionada.length > 0;
        elements.loginBtn.disabled = !(nomeValido && dificuldadeValida);
    };

    // == EVENT LISTENERS (Controladores) ==
    elements.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = elements.usernameInput.value.trim();
        if (username && state.dificuldadeSelecionada) {
            state.nomeJogador = username;
            elements.errorMsg.textContent = '';
            quizManager.start(state.dificuldadeSelecionada);
        } else {
            elements.errorMsg.textContent = "Por favor, digite seu nome e escolha uma dificuldade!";
        }
    });

    // Listeners para os botões de dificuldade
    elements.difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.difficultyButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.dificuldadeSelecionada = btn.dataset.difficulty;
            validarLogin();
        });
    });

    // Listener para o input de nome
    elements.usernameInput.addEventListener('input', validarLogin);


    elements.creditosBtnLogin.addEventListener('click', () => showView('creditos'));
    elements.voltarInicioBtn.addEventListener('click', () => showView('login'));
    elements.jogarNovamenteBtn.addEventListener('click', () => showView('login'));

    elements.nextBtn.addEventListener('click', () => quizManager.proximaPergunta());
    elements.pularBtn.addEventListener('click', () => quizManager.pular());
    elements.voltarBtn.addEventListener('click', () => quizManager.perguntaAnterior());
    elements.resetBtn.addEventListener('click', () => quizManager.resetar());

    // O listener do reiniciarRankingBtn foi removido, pois o botão está oculto.

    // == INICIALIZAÇÃO DA APLICAÇÃO ==
    const init = async () => {
        themeManager.init();
        // Mostra o login, mas desabilita o botão até carregar as perguntas
        showView('login');
        elements.loginBtn.textContent = "Carregando...";
        elements.loginBtn.disabled = true;

        const sucesso = await quizManager.carregarPerguntas();
        if (sucesso) {
            elements.loginBtn.textContent = "Entrar";
            validarLogin(); // Valida (provavelmente desabilitado até o usuário digitar)
        } else {
            elements.loginBtn.textContent = "Erro ao Carregar";
        }
        createStarBackground(); // Inicia o fundo de estrelas
    };

    // EFEITO DE FUNDO DE ESTRELAS (Canvas)
    function createStarBackground() {
        const canvas = document.getElementById("starsCanvas");
        if (!canvas) return; // Garante que o canvas exista
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        let stars = [];
        const numStars = window.innerWidth < 768 ? 75 : 150; // Menos estrelas em mobile
        for (let i = 0; i < numStars; i++) {
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

