document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que devem aparecer ao rolar
    const revealElements = document.querySelectorAll('.scroll-reveal');

    // Configura o Intersection Observer
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que faz o elemento aparecer
                entry.target.classList.add('visible');
                // Para de observar depois que apareceu (opcional)
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Aciona quando 15% do elemento estiver visível
        rootMargin: "0px"
    });

    // Aplica o observer em cada seção
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Rolagem suave para os links internos (ancoras)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});