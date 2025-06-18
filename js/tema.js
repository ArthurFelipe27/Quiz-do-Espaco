// ===[Executa quando o conteúdo da página estiver totalmente carregado]===
document.addEventListener("DOMContentLoaded", function () {
    // ===[Seleciona o botão de alternância de tema]===
    const toggleThemeBtn = document.getElementById('toggleTheme');

    // ===[Verifica se já existe um tema salvo no localStorage]===
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme); // Aplica o tema salvo
    } else {
        document.body.classList.add('dark-theme'); // Tema padrão: escuro
    }

    // ===[Alterna entre tema claro e escuro quando o botão for clicado]===
    toggleThemeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            // Troca do tema claro para escuro
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            // Troca do tema escuro para claro
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        }
    });

    // ===[Cria o fundo animado com estrelas - visível em todas as páginas com canvas]===
    function createStarBackground() {
        const canvas = document.getElementById("starsCanvas");
        if (!canvas) return; // Garante que o canvas existe antes de continuar

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // ===[Gera 100 estrelas com posições e velocidades aleatórias]===
        let stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                velocity: Math.random() * 0.5
            });
        }

        // ===[Anima as estrelas para criarem o efeito de movimento no fundo]===
        function animateStars() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                star.y += star.velocity;

                // Reposiciona estrela para o topo se ela sair da parte inferior
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animateStars); // Loop de animação contínua
        }

        animateStars(); // Inicia a animação
    }

    // ===[Executa a criação do fundo estrelado ao carregar a página]===
    createStarBackground();
});
