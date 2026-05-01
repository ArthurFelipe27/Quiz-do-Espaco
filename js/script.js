// Mapeamento dos elementos do DOM (Telas)
const telaInicio = document.getElementById('tela-inicio');
const telaQuiz = document.getElementById('tela-quiz');
const telaResultado = document.getElementById('tela-resultado');
const telaErro = document.getElementById('tela-erro');

// Elementos interativos
const btnIniciar = document.getElementById('btn-iniciar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnTentarNovamente = document.getElementById('btn-tentar-novamente');
const containerAlternativas = document.getElementById('container-alternativas');
const textoPergunta = document.getElementById('texto-pergunta');
const pontuacaoFinal = document.getElementById('pontuacao-final');
const pontuacaoAtualEl = document.getElementById('pontuacao-atual');
const contadorPerguntas = document.getElementById('contador-perguntas');

// Estado do Jogo
let perguntas = [];
let indicePerguntaAtual = 0;
let pontuacao = 0;

// Navegação entre telas
function alternarTela(telaAtiva) {
    [telaInicio, telaQuiz, telaResultado, telaErro].forEach(tela => {
        tela.classList.remove('ativa');
        tela.classList.add('oculta');
    });
    telaAtiva.classList.remove('oculta');
    telaAtiva.classList.add('ativa');
}

// Simulação de Fetch para sua futura API Própria
async function fetchPerguntasAPI() {
    try {
        // Agora o frontend bate no seu backend local!
        const response = await fetch('http://localhost:5000/api/perguntas');

        if (!response.ok) {
            throw new Error('Falha na conexão com a API');
        }

        perguntas = await response.json();

        // Verifica se vieram perguntas
        if (perguntas.length > 0) {
            iniciarQuiz();
        } else {
            throw new Error('Nenhuma pergunta encontrada no banco de dados.');
        }

    } catch (error) {
        console.error("Erro ao conectar com a API:", error);
        alternarTela(telaErro); // Aciona sua tela com o SVG do astronauta offline
    }
}


// Lógica de Renderização
function iniciarQuiz() {
    pontuacao = 0;
    indicePerguntaAtual = 0;
    pontuacaoAtualEl.textContent = pontuacao;
    alternarTela(telaQuiz);
    carregarPergunta();
}

function carregarPergunta() {
    const dadosPergunta = perguntas[indicePerguntaAtual];
    textoPergunta.textContent = dadosPergunta.pergunta;
    contadorPerguntas.textContent = `${indicePerguntaAtual + 1}/${perguntas.length}`;

    // Limpa alternativas antigas
    containerAlternativas.innerHTML = '';

    // Gera botões
    dadosPergunta.alternativas.forEach((alternativa, index) => {
        const button = document.createElement('button');
        button.textContent = alternativa;
        button.classList.add('btn-alternativa');
        button.addEventListener('click', () => verificarResposta(index, dadosPergunta.respostaCorreta));
        containerAlternativas.appendChild(button);
    });
}

function verificarResposta(indiceSelecionado, indiceCorreto) {
    if (indiceSelecionado === indiceCorreto) {
        pontuacao += 100; // Lógica de pontuação simples
        pontuacaoAtualEl.textContent = pontuacao;
    }

    indicePerguntaAtual++;

    if (indicePerguntaAtual < perguntas.length) {
        carregarPergunta();
    } else {
        finalizarQuiz();
    }
}

async function finalizarQuiz() {
    pontuacaoFinal.textContent = pontuacao;
    alternarTela(telaResultado);

    // Você pode depois criar um input para o usuário digitar o nome.
    // Por enquanto, vamos enviar um nome padrão.
    const dadosPontuacao = {
        nome: "Astronauta Arthur",
        pontos: pontuacao
    };

    try {
        const response = await fetch('http://localhost:5000/api/pontuacao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosPontuacao)
        });

        if (response.ok) {
            console.log("Pontuação salva com sucesso no banco de dados!");
        } else {
            console.error("Erro ao salvar pontuação.");
        }
    } catch (error) {
        console.error("Erro de rede ao tentar salvar pontuação:", error);
    }
}

// Listeners de Botões
btnIniciar.addEventListener('click', () => {
    // Ao invés de ir direto, tentamos buscar os dados primeiro
    btnIniciar.textContent = "Estabelecendo conexão...";
    fetchPerguntasAPI();
});

btnReiniciar.addEventListener('click', () => {
    btnIniciar.textContent = "Iniciar Missão";
    alternarTela(telaInicio);
});

btnTentarNovamente.addEventListener('click', () => {
    alternarTela(telaInicio);
    btnIniciar.textContent = "Iniciar Missão";
});