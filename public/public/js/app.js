const noticias = [
  {
    id: 1,
    slug: "stalking-saiba-identificar",
    titulo: "Stalking: saiba identificar e o que fazer",
    resumo:
      "Médica do DF viralizou ao relatar perseguição; entenda o que é, quais as penas e como denunciar.",
    imagem: "../imagem/stalking.png",
    imagemAlt: "Cena ilustrativa representando situação de perseguição",
    categoria: "Segurança",
    autor: "Thiago",
    local: "Beaga",
    dataPublicacao: "2025-10-05T09:18:00-03:00",
    conteudo: {
      paragrafos: [
        "Centenas de mensagens ou ligações de uma mesma pessoa. Comentários invasivos em redes sociais. Perfis falsos que acompanham a rotina e a de familiares e amigos.",
        "O caso ganhou repercussão com o relato de uma médica do Distrito Federal, que afirmou ser perseguida por um ex‑paciente há mais de quatro anos."
      ],
      secoes: [
        {
          titulo: "O que é stalking",
          paragrafos: [
            "Stalking é a perseguição reiterada que invade a privacidade e restringe a liberdade da vítima, podendo ocorrer online ou offline."
          ]
        },
        {
          titulo: "Como agir",
          lista: [
            "Documente todas as evidências (prints, áudios, datas, locais).",
            "Evite contato direto com a pessoa e ajuste a privacidade das contas.",
            "Registre boletim de ocorrência e busque medidas protetivas."
          ]
        }
      ]
    },
    palavrasChave: ["stalking", "perseguição", "segurança"],
    destino: "./detalhes.html?id=1"
  },
  {
    id: 2,
    slug: "pix-fora-do-ar",
    titulo:
      "PIX fora do ar: usuários relatam problemas com o sistema de pagamentos em diferentes bancos",
    resumo:
      "Usuários de diferentes bancos relataram instabilidade no PIX em instituições como Nubank, Banco do Brasil, Bradesco, Itaú e C6 Bank.",
    imagem: "../imagem/pix.png",
    imagemAlt: "Tela de aplicativo bancário com falha de PIX",
    categoria: "Economia",
     autor: "Thiago",
    local: "Beaga",
    dataPublicacao: "2025-10-05T16:00:00-03:00",
    conteudo: {
      paragrafos: [
        "O PIX ficou fora do ar na manhã desta segunda-feira (29). Nas redes sociais, usuários relataram falhas generalizadas que impactaram o sistema de pagamentos em diferentes instituições financeiras. ",
       "O g1 encontrou relatos de instabilidade no PIX nos aplicativos do Bradesco, Itaú, Mercado Pago, Nubank e Santander." ,
       "De acordo com o site DownDetector, que monitora interrupções em serviços online, os problemas começaram a ser registrados por volta das 11h, totalizando cerca de 8.400 notificações de instabilidade.",
       "as redes sociais, usuários também relataram falhas em plataformas de comércio eletrônico, reforçando que o problema ocorre no sistema de transferência e não em uma instituição específica.",
    "\"Estou tentando pagar no Mercado Pago, mas está dando erro. O problema está no Banco Central\", escreveu um deles no X, antigo Twitter.",
       "O Banco Central informou que está ciente das ocorrências e que as equipes técnicas estão trabalhando para a normalização do serviço o mais breve possível. A instituição ressaltou que não há indícios de ataques cibernéticos ao sistema.",
       "Em nota, o Nubank confirmou que o PIX apresentou instabilidade e que a equipe técnica está empenhada em resolver o problema. O banco pediu desculpas pelo transtorno e agradeceu a compreensão dos clientes.",
       "O Bradesco também reconheceu a falha no sistema de pagamentos e afirmou que está trabalhando para restabelecer o serviço. O banco recomendou aos clientes que tentem novamente mais tarde.",
    ],
     secoes: [
       
    ] 

    },
    palavrasChave: ["PIX", "bancos", "pagamentos"],
    destino: "./detalhes.html?id=2"
  }
];

function montarHome() {
  const lista = document.querySelector("#lista");
  if (!lista) return; 
  
  lista.innerHTML = "";

  noticias.forEach((item) => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = item.destino;
    a.setAttribute("aria-label", `Abrir: ${item.titulo}`);

    const img = document.createElement("img");
    img.src = item.imagem;
    img.alt = item.imagemAlt;
    img.width = 320;
    img.height = 180;

    const body = document.createElement("div");
    body.className = "card__content";

    const h2 = document.createElement("h2");
    h2.className = "card__title";
    h2.textContent = item.titulo;

    const p = document.createElement("p");
    p.className = "card__excerpt";
    p.textContent = item.resumo;

    body.append(h2, p);
    a.append(img, body);
    lista.appendChild(a);
  });
}

function tornarCardsEstaticosClicaveis() {
  const card1 = document.querySelector("article.card");
  const card2 = document.querySelector("article.card2");

  if (card1) {
    card1.style.cursor = "pointer";
    card1.addEventListener("click", () => {
      window.location.href = noticias[0].destino;
    });
  }
  if (card2) {
    card2.style.cursor = "pointer";
    card2.addEventListener("click", () => {
      window.location.href = noticias[1].destino;
    });
  }
}

function getIdDaURL() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("id");
  return raw ? Number(raw) : null;
}

function montarDetalhes() {
  const container = document.querySelector("main#main article.post");
  if (!container) return; // não está na página de detalhes

  const id = getIdDaURL();
  const item = noticias.find((n) => n.id === id);
  if (!item) {
    container.innerHTML = "<p>Item não encontrado.</p>";
    return;
  }

  
  const h1 = container.querySelector(".post-title");
  const deck = container.querySelector(".post-deck");
  const byline = container.querySelector(".post-byline");
  const meta = container.querySelector(".post-meta time");

  if (h1) h1.textContent = item.titulo;
  if (deck) deck.textContent = item.resumo;
  if (byline) byline.innerHTML = `Por <a rel="author" href="#">${item.autor}</a> — ${item.local}`;
  if (meta) {
    meta.setAttribute("datetime", item.dataPublicacao);
    
    const dataVisivel = new Date(item.dataPublicacao).toLocaleString("pt-BR");
    meta.textContent = dataVisivel;
  }

  
  const heroImg = container.querySelector(".post-hero img");
  const heroCap = container.querySelector(".post-hero figcaption");
  if (heroImg) {
    heroImg.src = item.imagem;
    heroImg.alt = item.imagemAlt;
  }
  if (heroCap) {
    heroCap.textContent = item.resumo;
  }

  // Galeria de fotos associadas 
  const thumbsWrap = document.querySelector(".post-gallery .gallery-thumbs");
  if (thumbsWrap && heroImg) {
    const fotos = Array.isArray(item.fotos) && item.fotos.length
      ? item.fotos
      : [item.imagem, item.imagem, item.imagem];

    thumbsWrap.innerHTML = "";
    fotos.forEach((src, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb";
      btn.setAttribute("aria-label", `Ver imagem ${idx + 1}`);

      const img = document.createElement("img");
      img.src = src;
      img.alt = item.imagemAlt || `Imagem ${idx + 1}`;

      btn.appendChild(img);
      thumbsWrap.appendChild(btn);

      btn.addEventListener("click", () => {
        heroImg.src = src;
        
        document.querySelectorAll(".thumb").forEach(el => el.classList.remove("is-active"));
        btn.classList.add("is-active");
      });

      
      if (idx === 0) btn.classList.add("is-active");
    });
  }


  const corpo = container.querySelector(".post-body");
  if (corpo) {
    corpo.innerHTML = "";
  
    item.conteudo.paragrafos.forEach((txt) => {
      const p = document.createElement("p");
      p.textContent = txt;
      corpo.appendChild(p);
    });
    
    item.conteudo.secoes.forEach((sec) => {
      const h2 = document.createElement("h2");
      h2.textContent = sec.titulo;
      corpo.appendChild(h2);

      if (sec.paragrafos) {
        sec.paragrafos.forEach((txt) => {
          const p = document.createElement("p");
          p.textContent = txt;
          corpo.appendChild(p);
        });
      }
      if (sec.lista && sec.lista.length) {
        const ul = document.createElement("ul");
        sec.lista.forEach((liTxt) => {
          const li = document.createElement("li");
          li.textContent = liTxt;
          ul.appendChild(li);
        });
        corpo.appendChild(ul);
      }
    });
  }
}


// Dados da seção "Sobre mim"
const sobreMim = {
  nome: "Thiago Nobre",
  bio: "Sou estudante de Engenharia de software, apaixonado por notícias.",
  
};

//  "Sobre mim" 
function montarSobre() {
  const container = document.querySelector("#sobre .sobre__content");
  if (!container) return;

  container.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.textContent = sobreMim.nome;
  container.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = sobreMim.bio;
  container.appendChild(p);

  if (sobreMim.links && sobreMim.links.length) {
    const ul = document.createElement("ul");
    ul.style.listStyle = "none";
    ul.style.padding = "0";
    ul.style.margin = "8px 0 0 0";

    container.appendChild(ul);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  montarHome();
  tornarCardsEstaticosClicaveis();
  montarDetalhes();
  montarSobre(); 
});