// Fonction qui affiche le travaux grace a une API
let allWorks = [];

// 1  Paramètre optionnel
async function afficherTravaux(workToDisplay = null) {
  // 2  Condition : charger ou pas ?
  if (!workToDisplay) {
    const request = await fetch("http://localhost:5678/api/works");
    allWorks = await request.json();

    workToDisplay = allWorks;
  }
  // pour recuperer la galllery dans le HTML
  const gallery = document.querySelector(".gallery");
  // 3 Nettoyage de la galerie
  gallery.innerHTML = "";

  // 4 Affichage des travaux

  workToDisplay.forEach((work) => {
    // 5 Remplissage avec les données
    const article = document.createElement("article");
    const image = document.createElement("img");
    const title = document.createElement("h3");
    image.src = work.imageUrl;
    title.textContent = work.title;

    // 5 Assemblage et ajout au DOM

    article.appendChild(image);
    article.appendChild(title);

    gallery.appendChild(article);
  });
}

afficherTravaux();

// crée des boutons de filtrage basés sur les catégories récupérées depuis l'API.

// 1 Récupération des données
async function afficherFiltre() {
  const request = await fetch("http://localhost:5678/api/categories");
  const categories = await request.json();

  // 2 Sélection de la zone de filtres
  const filter = document.querySelector(".filter");

  // 3 Création du bouton "Tous"
  const buttonTous = document.createElement("button");
  buttonTous.textContent = "Tous";
  buttonTous.addEventListener("click", () => {
    afficherTravaux();
  });
  filter.appendChild(buttonTous);

  // 3  Création des boutons de catégories
  categories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;
    button.addEventListener("click", () => {
      const filteredWorks = allWorks.filter(
        (work) => work.category.id === categorie.id
      );
      console.log(filteredWorks);
      afficherTravaux(filteredWorks);
    });

    filter.appendChild(button);

    //
  });
}

afficherFiltre();

function afficherModeEdition() {
  const token = localStorage.getItem("token");
  if (token) {
    const banniere = document.querySelector(".banniere");
    banniere.classList.remove("hide");

    const filter = document.querySelector(".filter");
    filter.setAttribute("hidden", "");

    const portfolioH2 = document.getElementById("mesprojetsh2");
    portfolioH2.style.marginBottom = "0";
  }
}

afficherModeEdition();
