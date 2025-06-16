document.addEventListener("DOMContentLoaded", function () {
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
    } else {
        document.body.classList.add('dark-theme'); // Define o tema escuro como padrão se não houver preferência
    }

    toggleThemeBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light-theme');
        }
    });

    // Função para criar o fundo estrelado (movida para cá para ser global)
    function createStarBackground() {
        const canvas = document.getElementById("starsCanvas");
        if (!canvas) return; // Garante que o canvas existe na página

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let stars = [];
        for (let i = 0; i < 100; i++) {
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

    // Chama a função createStarBackground ao carregar o DOM
    createStarBackground();
});