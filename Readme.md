# Quiz Interativo - Tema Espaço

Este é um projeto simples de Quiz Interativo em HTML, CSS e JavaScript, com sistema de pontos, armazenamento local (localStorage) e perguntas dinâmicas com informações extras do Wikipédia.

---

## Como Rodar

1. **Clone ou baixe** este repositório para o seu computador.

2. **Abra a pasta do projeto**.

3. **Abra o arquivo `index.html` em seu navegador** (Google Chrome, Firefox, Edge, etc.).  
   - Clique com o botão direito no arquivo > Abrir com > seu navegador preferido.

4. **Digite seu nome na tela inicial e clique em "Começar"**.

5. **Responda às perguntas do quiz**.  
   - Cada resposta correta soma 10 pontos.  
   - Cada resposta errada subtrai 5 pontos (não podendo ficar negativo).

6. **No final do quiz, sua pontuação será exibida na tela de resultado.**

---

## Estrutura do Projeto

├── index.html # Página inicial com campo para nome do jogador
├── quiz.html # Página com perguntas do quiz
├── resultado.html # Página que mostra a pontuação final
├── css/
│ └── style.css # Estilos visuais do projeto
└── js/
└── script.js # Lógica do quiz, validações e armazenamento


---

## Funcionalidades

- Validação do nome no início (mínimo 3 caracteres).  
- Sistema de pontos atualizado e armazenado no `localStorage`.  
- Carregamento de perguntas e respostas dinâmicas via JavaScript.  
- Bloqueio do botão “Próxima Pergunta” até o usuário responder.  
- Busca de informações extras na Wikipédia para cada resposta correta.  
- Navegação entre páginas controlada pelo JavaScript.  

---

## Requisitos

- Navegador moderno com suporte a JavaScript e fetch API (Chrome, Firefox, Edge, Safari).  
- Conexão com internet para buscar as informações extras da Wikipédia.  

---

## Dúvidas ou sugestões

Entre em contato!

---

**Divirta-se aprendendo sobre o universo!** 🚀🌌
