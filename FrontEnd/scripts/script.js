// Fonction qui affiche le travaux grace a une API
let allWorks = [];
let allCategories = [];

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

async function init() {
  await afficherTravaux();
  await getCategories();
  await afficherFiltre();
  await afficherModeEdition();
  initSelectModal();
}

init();

async function getCategories() {
  try {
    const request = await fetch("http://localhost:5678/api/categories");
    if (request.ok) {
      allCategories = await request.json();
    }
  } catch (error) {
    console.error(error);
  }
  return allCategories;
}

// crée des boutons de filtrage basés sur les catégories récupérées depuis l'API.

// 1 Récupération des données
async function afficherFiltre() {
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
  allCategories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;
    button.addEventListener("click", () => {
      const filteredWorks = allWorks.filter(
        (work) => work.category.id === categorie.id,
      );
      console.log(filteredWorks);
      afficherTravaux(filteredWorks);
    });

    filter.appendChild(button);

    //
  });
}

async function afficherModeEdition() {
  const token = localStorage.getItem("token");
  if (token) {
    const banniere = document.querySelector(".banniere");
    banniere.classList.remove("hide");

    const filter = document.querySelector(".filter");
    filter.setAttribute("hidden", "");

    const portfolioH2 = document.getElementById("mesprojetsh2");
    portfolioH2.style.marginBottom = "0";

    const login = document.getElementById("login");
    login.textContent = "logout";
    login.addEventListener("click", () => {
      localStorage.removeItem("token");
    });

    const modifier = document.getElementById("edit");
    modifier.addEventListener("click", (e) => {
      const modal = document.querySelector(".modal");
      e.preventDefault();
      showModal(modal);
      galleryModal();
    });

    const cross = document.querySelector(".fa-xmark");
    console.log(cross);
    cross.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      closeModal(modal);
    });

    const buttonAfficherPhotos = document.querySelector(".bouton-ajout");
    buttonAfficherPhotos.addEventListener("click", () => {
      const modal = document.querySelector(".modal");
      const modal2 = document.querySelector(".modal2");
      closeModal(modal);
      showModal(modal2);
    });
  }
}

function galleryModal() {
  const galerie = document.querySelector(".gallery-modal");
  galerie.innerHTML = "";

  allWorks.forEach((work) => {
    const article = document.createElement("article");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;
    const divTrash = document.createElement("div");
    const trashCan = document.createElement("i");
    trashCan.classList.add("fa-solid", "fa-trash-can");
    trashCan.addEventListener("click", () => {
      deletedWorks(work.id);
    });
    divTrash.appendChild(trashCan);
    article.appendChild(image);
    article.appendChild(divTrash);
    galerie.appendChild(article);
  });
}

function showModal(element1) {
  element1.showModal();
}

function closeModal(element1) {
  element1.close();
}

async function deletedWorks(id) {
  const request = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!request.ok) {
    throw Error("votre travail n'a pas été supprimé");
  } else {
    allWorks = allWorks.filter((work) => work.id !== id);
    galleryModal(allWorks);
    afficherTravaux(allWorks);
  }
}

function initSelectModal() {
  const select = document.getElementById("categories");
  // select.innerHTML = "";

  allCategories.forEach((categorie) => {
    const option = document.createElement("option");
    option.textContent = categorie.name;
    option.value = categorie.id;
    select.appendChild(option);
  });
}
