document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleção dos Elementos HTML
  const actionBtns = document.querySelectorAll(".left-actions .action-btn");
  const likeBtn = actionBtns[0]; // Primeiro botão de ação (Coração)
  const postMedia = document.querySelector(".post-media");
  
  // Seleciona o botão de Bookmark (Salvar) no canto direito
  const bookmarkBtn = document.querySelector(".post-actions > .action-btn");

  if (!likeBtn) return;

  // Busca o nó de texto dentro do botão para não apagar o SVG ao atualizar o contador
  let countNode = Array.from(likeBtn.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE
  );

  // Variáveis de Estado
  let isLiked = false;
  let baseLikes = 1200; // Começa em 1.2K (1200)

  // Função para formatar números (ex: 1200 -> 1.2K)
  function formatLikes(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  // Função para atualizar a interface (CSS + Contador + Animação)
  function updateLikeUI() {
    likeBtn.classList.toggle("liked", isLiked);

    if (countNode) {
      countNode.textContent = ` ${formatLikes(baseLikes)}`;
    }

    // Animação de pulso no SVG do coração
    const svg = likeBtn.querySelector("svg");
    if (svg) {
      svg.style.transform = "scale(1.3)";
      setTimeout(() => {
        svg.style.transform = "scale(1)";
      }, 150);
    }
  }

  // Função para acionar/exibir o Coração Flutuante no centro da tela
  function createHeartAnimation(e) {
    if (!postMedia) return;

    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    heart.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;

    // Pega as posições do clique relativas à área da foto
    const rect = postMedia.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;

    postMedia.appendChild(heart);

    // Remove o elemento do DOM após o término da animação
    setTimeout(() => {
      heart.remove();
    }, 800);
  }

  // Evento 1: Clique no Botão de Coração
  likeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isLiked) {
      // Se já estava curtido -> Descurte
      isLiked = false;
      baseLikes = Math.max(0, baseLikes - 1);
    } else {
      // Se não estava curtido -> Curte
      isLiked = true;
      baseLikes++;
    }
    updateLikeUI();
  });

  // Evento 2: Clique Simples ou Duplo na Tela/Foto para Curtir
  if (postMedia) {
    postMedia.addEventListener("click", (e) => {
      e.stopPropagation();

      // Exibe a animação do coração onde o usuário clicou
      createHeartAnimation(e);

      // Se ainda não estava curtido, ativa a curtida e soma +1
      if (!isLiked) {
        isLiked = true;
        baseLikes++;
        updateLikeUI();
      }
    });
  }

  // Evento Extra: Botão Salvar (Bookmark)
  if (bookmarkBtn) {
    let isBookmarked = false;
    bookmarkBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isBookmarked = !isBookmarked;
      bookmarkBtn.classList.toggle("bookmarked", isBookmarked);

      const svg = bookmarkBtn.querySelector("svg");
      if (svg) {
        svg.style.transform = "scale(1.2)";
        setTimeout(() => {
          svg.style.transform = "scale(1)";
        }, 150);
      }
    });
  }
});
