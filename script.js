document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. ANIMAÇÕES DE SCROLL E MENU (CÓDIGO ORIGINAL)
    // ============================================================

    // Seleciona todos os elementos que devem aparecer ao rolar
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Configura o Intersection Observer
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Descomente se quiser que anime apenas uma vez
            }
        });
    }, {
        root: null,
        threshold: 0.15, 
        rootMargin: "0px"
    });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Rolagem suave para os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Inicia o carregamento das conquistas
    loadAchievements();
});

// ============================================================
// 2. LÓGICA DAS CONQUISTAS E GOOGLE SHEETS
// ============================================================

// ⚠️ COLE ABAIXO O LINK DO SEU CSV (Gerado em Arquivo > Compartilhar > Publicar na Web)
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4oSY6gaQT2u4N7WvfV29qBQTF-tHeGA7PukpLgkYI5EU-N9XrewMH7F3M0bscga4BPkL5JYIqpZGm/pub?output=csv'; 

// Lista de conquistas (Títulos devem ser IDÊNTICOS aos salvos no Google Forms)
const achievementsData = [
    { title: "Iniciou o jogo", desc: "Iniciou o jogo pela primeira vez.", icon: "fa-skull" },
    { title: "Tirou o Capuz", desc: "Tentou ser legal.", icon: "fa-skull" },
    { title: "Grand Theft Auto", desc: "Ladrão, ladrão, ladrãozinho.", icon: "fa-skull" },
    { title: "Run Forrest Run", desc: "Corre Corre.", icon: "fa-skull" },
    { title: "Posição Fetal", desc: "Apanhou de graça.", icon: "fa-skull" },
    { title: "Mente Blindada", desc: "Resistiu aos pensamentos de pânico", icon: "fa-skull" },
    { title: "Testemunha Ocular", desc: "Você viu demais.", icon: "fa-eye" },
    { title: "Iniciado", desc: "Você agora é um pagão.", icon: "fa-book" },
    { title: "Sherlock", desc: "Encontrou as 3 pistas.", icon: "fa-search" },
    { title: "Dory", desc: "Precisou obter todas as ajudas possíveis", icon: "fa-fish" },
    { title: "Hoa Hoa Hoa Season", desc: "Fã da saga mais horny de todas", icon: "fa-heart" },
    { title: "Stalker", desc: "Invadiu a privacidade da Natalia.", icon: "fa-user-secret" },
    { title: "Hacker", desc: "Não precisou de ajuda para a invasão.", icon: "fa-laptop-code" },
    { title: "Amigos do Peito", desc: "Amigos pra valer", icon: "fa-hands-helping" },
    { title: "Coragem o Cão Covarde", desc: "Desistiu de tudo", icon: "fa-dog" },
    { title: "Mr Robot", desc: "Só nos computer", icon: "fa-robot" },
    { title: "You Shall Not Pass", desc: "Vai pá onde?", icon: "fa-hand-paper" },
    { title: "Missão Impossivel", desc: "A espera de um milagre", icon: "fa-bomb" },
    { title: "Dream Team", desc: "Time dos sonhos", icon: "fa-users" },
    { title: "Mestre do Arquivo", desc: "Concluiu todos os níveis do Sokoban.", icon: "fa-box" },
    { title: "Mestre do Nonogram", desc: "Recuperou todas as imagens corrompidas.", icon: "fa-th" },
    { title: "Mestre do Interruptor", desc: "Limpou o servidor.", icon: "fa-toggle-on" },
    { title: "Mente Organizada", desc: "Desfragmentou toda a memória.", icon: "fa-brain" }, 
    { title: "Se Complicando", desc: "Pediu dinheiro a um agiota no natal", icon: "fa-money-bill-wave" },
    { title: "Conseguiu Morrer", desc: "Conseguiu morrer num jogo que não dá.", icon: "fa-skull-crossbones" }
];

async function loadAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    const countElement = document.getElementById('player-count');

    try {
        // 1. Puxa os dados da planilha
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const allText = data.toLowerCase(); // Tudo minúsculo para facilitar a busca

        // 2. Define o total de jogadores baseado na conquista "Iniciou o jogo"
        // Conta quantas vezes a frase aparece no CSV inteiro
        const totalPlayers = (allText.match(/iniciou o jogo/g) || []).length;

        // Atualiza o contador na tela inicial (Cartão "Iniciados")
        if (countElement) {
            countElement.innerText = totalPlayers;
            if (totalPlayers > 0) countElement.style.color = "#ff3333"; // Destaque vermelho
        }

        // Evita divisão por zero
        const baseCalc = totalPlayers > 0 ? totalPlayers : 1;

        // 3. Limpa e Gera a Lista
        if (achievementsList) {
            achievementsList.innerHTML = ""; 

            achievementsData.forEach((item) => {
                // Conta quantas vezes essa conquista específica aparece
                // Usamos Regex para garantir que pegue o termo exato
                const regex = new RegExp(item.title.toLowerCase(), "g");
                const count = (allText.match(regex) || []).length;

                // Calcula porcentagem
                let percent = (count / baseCalc) * 100;
                
                // Travas de segurança visual
                if (percent > 100) percent = 100;
                if (count === 0) percent = 0;

                // Se menos de 10% conseguiu, ganha borda dourada
                const isRare = percent < 10 && percent > 0 ? 'rare' : '';

                const html = `
                    <li class="achievement-row">
                        <div class="ach-icon-small ${isRare}">
                            <i class="fas ${item.icon}"></i>
                        </div>
                        <div class="ach-info">
                            <h4>${item.title}</h4>
                            <p>${item.desc}</p>
                        </div>
                        <div class="ach-percent">
                            <span>${percent.toFixed(1)}%</span>
                            <span class="rarity-label">dos jogadores</span>
                        </div>
                    </li>
                `;
                
                achievementsList.insertAdjacentHTML('beforeend', html);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar dados do Google Sheets:", error);
        if (achievementsList) {
            achievementsList.innerHTML = "<p style='color:#666; padding:20px;'>Sem sinal da Seita (Erro ao carregar dados).</p>";
        }
    }
}
