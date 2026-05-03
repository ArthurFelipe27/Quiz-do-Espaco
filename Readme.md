# 🌌🧑‍🚀 Quiz Interativo – Explorando o Espaço (Full-Stack)

![GitHub repo size](https://img.shields.io/github/repo-size/ArthurFelipe27/quiz-do-espaco?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/ArthurFelipe27/quiz-do-espaco?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/ArthurFelipe27/quiz-do-espaco?style=for-the-badge)
![License](https://img.shields.io/github/license/ArthurFelipe27/quiz-do-espaco?style=for-the-badge)

> **Quiz Interativo: Explorando o Espaço** é uma aplicação web Full-Stack desenvolvida para testar e expandir os conhecimentos do usuário sobre astronomia através de uma jornada espacial de aprendizado, curiosidade e diversão.  
> Originalmente concebido como um projeto estático, o sistema evoluiu para uma arquitetura robusta Cliente-Servidor, utilizando **Python, Flask e SQLite** no backend, e **Vanilla JS** no frontend, tudo orquestrado de forma isolada via **Docker** e servido por **Nginx**.

## 🌐 Acesse o Quiz

🚀 Jogue agora diretamente no navegador:  
👉 https://quizdoespaco.arthurfelipe.dev.br/
 
  
O projeto é hospedado em um servidor local operando 24/7 e exposto para a internet de forma segura através de túneis da Cloudflare.

---   

## ✨ Funcionalidades Principais  

- 🛰️ Arquitetura Desacoplada (API RESTful): Comunicação assíncrona entre a interface de usuário e o servidor Python utilizando requisições Fetch API seguras e otimizadas.
- ⚖️ Sistema de Pontuação Dinâmico (Risco/Recompensa): Os ganhos variam de acordo com a dificuldade intrínseca de cada pergunta (até +95 pontos), enquanto as penalidades variam conforme o Modo de Jogo escolhido pelo usuário (até -45 pontos).
- 🎓 Modo Exploração (Educacional): Uma experiência "zen" sem limites de tempo ou pressão por pontuação. Ao responder, o jogo exibe um modal dinâmico contendo curiosidades científicas e explicações detalhadas sobre o tema da pergunta.
- 🏆 Ranking Global em Tempo Real: Pontuações validadas pelo backend e persistidas no banco de dados, exibindo os 5 maiores exploradores espaciais em um mural atualizado instantaneamente.
- 🛡️ Segurança de Múltiplas Camadas: Sanitização de inputs contra XSS no cliente (DOM) e no servidor (html.escape), aliada à proteção contra spam e ataques de força bruta através de Rate Limiting na API.
- 🎨 Design Responsivo e Imersivo: Interface com tema Glassmorphism (efeito de vidro neon) e background procedural animado de estrelas via Canvas API, adaptável a dispositivos móveis e desktops.

---

## 🎮 Como Executar Localmente 
Siga os passos abaixo para rodar a aplicação completa com todos os seus serviços em sua máquina local:

1. Clone o repositório:   
``git clone https://github.com/ArthurFelipe27/quiz-do-espaco.git``  
2. Configure as Variáveis de Ambiente:  
Navegue até a pasta **backend/** e crie um arquivo chamado ``.env`` com suas credenciais:  
``SECRET_KEY=sua_chave_super_secreta_aqui  ``  
``FLASK_ENV=production  ``  
``DATABASE_URI=sqlite:///quiz_espaco.db  ``
3. Inicie a Orquestração com Docker: Volte para a raiz do projeto (onde está o arquivo docker-compose.yml) e execute: ``docker-compose up -d --build``
4. Acesse o sistema:Abra o seu navegador e acesse: http://localhost:8080

---

## 📂 Estrutura do Projeto
A aplicação adota uma organização modular, separando responsabilidades e facilitando a manutenção e orquestração dos contêineres:

quiz-do-espaco/  
├── docker-compose.yml       # Maestro da orquestração dos serviços (Nginx e Flask)  
├── nginx.conf               # Configuração do Proxy Reverso e Web Server  
├── frontend/                # Aplicação Cliente (Interface de Usuário)  
│   ├── index.html           # Tela principal e motor do Quiz  
│   ├── configuracao.html    # Configuração de oxigênio (tempo e modos)  
│   ├── ranking.html         # Mural do Top 5  
│   ├── creditos.html        # Página de desenvolvimento  
│   ├── js/script.js         # Lógica Vanilla JS e consumo de APIs  
│   └── css/style.css        # Estilos globais e variáveis CSS  
└── backend/                 # Aplicação Servidor (API RESTful)  
    ├── Dockerfile           # Instruções de build da imagem Python  
    ├── app.py               # Entrypoint e inicialização do app (Factory)  
    ├── config.py            # Validador de variáveis de ambiente  
    ├── requirements.txt     # Dependências (Flask, SQLAlchemy, python-dotenv)  
    ├── models/              # Camada de banco de dados (SQLite)  
    │   └── modelos.py       # Schemas das Perguntas e Pontuações  
    └── routes/              # Controladores  
        └── quiz_routes.py   # Endpoints de consumo do frontend  

---

## 🔧 Tecnologias Utilizadas

O desenvolvimento deste projeto envolveu uma stack completa englobando as seguintes tecnologias e ferramentas:
* Frontend (Cliente):
* HTML5: Estruturação semântica.
* CSS3: Flexbox, Grid, Animações e variáveis de ambiente (CSS Variables).
* JavaScript (ES6+): Lógica pura (Vanilla), sem frameworks adicionais, garantindo alta performance e manipulação nativa de DOM e Fetch API.
* Backend (Servidor/API):Python 3.11: Linguagem de processamento central.
* Flask (v3.0.0): Microframework para roteamento da API REST.
* SQLAlchemy & SQLite: ORM e banco de dados relacional leve e embutido.
* Flask-Limiter: Controle de limite de taxa de requisições.
* Infraestrutura, DevOps e Segurança: 
  * Docker & Docker Compose: Isolamento de ambiente, construção de imagens e orquestração de microsserviços.
  * Nginx: Servidor estático e Proxy Reverso focado em alta disponibilidade e roteamento seguro. 
  * Cloudflare Tunnels: Tunneling seguro e aplicação automática de SSL (HTTPS).
  * Dotenv (python-dotenv): Gestão segura de segredos em tempo de execução.

---

## 💡 Melhorias Implementadas na Nova Versão
Esta versão representa um salto significativo na maturidade arquitetural e técnica do projeto em relação ao seu protótipo inicial:

* ✅ Migração de Armazenamento: Substituição do armazenamento volátil do navegador (localStorage) por um banco de dados relacional sólido (SQLite).  
* ✅ Desenvolvimento de API Própria: Criação de endpoints robustos com controle de rotas, separando a lógica de negócios da interface.  
* ✅ Orquestração Completa de Infraestrutura: Dockerização de todo o ecossistema da aplicação, padronizando os ambientes de desenvolvimento e produção.  
* ✅ Roteamento Seguro com Proxy Reverso: Implementação de Nginx para resolver problemas de Mixed Content (HTTPS para HTTP) e esconder IPs internos da máquina host.  
* ✅ Novo "Modo Exploração" (Foco Educacional): Inserção de uma nova feature não competitiva com banco de dados enriquecido por curiosidades científicas de alta qualidade.  
* ✅ Refatoração Profunda de Segurança: Sanitização implementada em duas camadas (Frontend via DOM, Backend via HTML escape), além de blindagem de rotas com Rate Limiting e Fail Fast configuration.

---

## 📌 Requisitos para Execução
Para rodar este projeto em um ambiente local ou servidor de produção, é necessário:
- Docker Engine instalado e operando.
- Docker Compose instalado.
- Navegador moderno (Google Chrome, Firefox, Edge, Safari) com suporte a JavaScript atualizado.

---

## 📸 Demonstração
### Tela Inicial (Base de Lançamento)
<img width="1920" height="1080" alt="Captura de tela 2026-05-02 220829" src="https://github.com/user-attachments/assets/35ec74b5-a570-4e18-a04e-8ecb892f36aa" />

### Tela do Quiz (Missão em Andamento)
<img width="1920" height="1080" alt="Captura de tela 2026-05-02 224551" src="https://github.com/user-attachments/assets/4b891f1b-efcd-4ad7-bf74-60abf32943e2" />

### Tela de Resultados (Conquista do Espaço)
<img width="1920" height="1080" alt="Captura de tela 2026-05-02 224638" src="https://github.com/user-attachments/assets/3c5d8d39-0e84-43ec-b0f9-3697b44204e3" />


---

### 🧑‍💻 Autores
👨‍🚀 **Arthur Felipe**   
🌐 GitHub: https://github.com/ArthurFelipe27  
👩‍🚀 
**Luana Pereira**   
🌐 GitHub: https://github.com/LuluPereira  

### 📝 Licença 
Este projeto está licenciado sob a Licença MIT. Sinta-se livre para usar, modificar e distribuir este código!

---
🌟 Divirta-se aprendendo sobre o universo! 
> *“A imaginação nos levará a mundos que nunca existiram. Mas, sem ela, não vamos a lugar nenhum.”* — **Carl Sagan**
