# 🚀 Quiz Interativo: Explorando o Espaço 🌌

Este é um projeto de **Quiz Interativo** desenvolvido com **HTML**, **CSS (com Bootstrap e animações personalizadas)** e **JavaScript**, com um design futurista envolvente. Ele apresenta um sistema de pontuação inteligente, armazenamento local com `localStorage`, perguntas dinâmicas, integração com a **Wikipédia**, efeitos visuais modernos e ranking de jogadores.

---

## 🎮 Como Rodar o Projeto

1. **Clone ou baixe** este repositório:
   ```bash
   git clone https://github.com/seu-usuario/quiz-espaco.git

2. **Acesse a pasta do projeto**:
   cd quiz-espaco

3. Abra o arquivo **index.html** em seu navegador (Chrome, Firefox, Edge, etc.).

    Clique com o botão direito > "Abrir com" > navegador preferido.

4. Digite **seu nome de usuário e senha (padrão: 12345**) para iniciar.

5. Responda ao quiz:

    ✅ Respostas corretas somam **+10 pontos**.

    ❌ Respostas erradas subtraem **-5 pontos** (sem pontuação negativa).

6. Ao final, veja sua **pontuação, ranking dos melhores jogadores e informações extras** sobre o tema das perguntas.

## 📁 Estrutura do Projeto  
📦 quiz-espaco/  
├── index.html              
├── quiz.html                
├── resultado.html  
├── creditos.html  
├── css/  
│        └── style.css  
├── js/  
│        └── script.js   
│        └── tema.js   
│        └── perguntas.js   
├── img/  
│        └── astronauta.png   
└── README.md                 

## ✨ Funcionalidades  
🔐 Tela de login animada com validação e túnel espacial ao entrar.  
📋 Validação de nome (mínimo 3 caracteres) e senha (padrão: 12345).  
🧠 Perguntas e respostas dinâmicas via JavaScript.  
💾 Pontuação persistente usando localStorage.  
🌐 Integração com API da Wikipédia: busca dados relevantes ao tema.  
🚫 Bloqueio da próxima pergunta até que uma opção seja escolhida.  
🏆 Ranking dos melhores jogadores salvo localmente.  
🛸 Animações futuristas com:
+ Estrelas flutuantes (canvas).  
+ Efeito de dobra espacial (warpCanvas).  
+ Astronauta flutuando.  
+ Textos e botões com brilho neon.       

## 🎨 Design
Interface imersiva e responsiva.  
Efeitos com text-shadow, box-shadow, backdrop-filter.  
Tipografia moderna e navegação intuitiva.  
Feedback visual claro para acertos e erros.  
Tema claro/escuro facilmente integrável (em desenvolvimento opcional).  

## 🔧 Tecnologias Utilizadas
HTML5  
CSS3 (com @keyframes, backdrop-filter, neon)  
JavaScript (Vanilla)  
Bootstrap 5 (ajuste de responsividade e layout)  
Fetch API para buscar resumos na Wikipédia  
localStorage API para persistência de dados  

## 💡 Melhorias Implementadas  
✅ Interface aprimorada com efeitos modernos e interativos.  
✅ Modularização do JavaScript para melhor legibilidade.  
✅ Validação de formulário com mensagens claras.  
✅ Utilização de canvas para criar um ambiente espacial realista.  
✅ Estrutura responsiva e escalável para dispositivos móveis.  

## 📌 Requisitos para Execução  <br/>
   Navegador moderno com suporte a:  
   + JavaScript (ES6+)  
   + Fetch API  
   + Manipulação de DOM  
   + Conexão com internet para carregamento da API da Wikipédia

## 🤝 Contribuições  
   Contribuições são muito bem-vindas!  
   Sugestões de melhoria, novas funcionalidades ou correções podem ser feitas via **Pull Request** ou **Issues**.

---

🌟 **Divirta-se aprendendo sobre o universo!**
   "A curiosidade é o combustível da descoberta." – Carl Sagan
    EOF