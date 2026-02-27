// VARIABLES GLOBALES

let allWorks = [];
let allCategories = [];

// INITIALISATION

async function init() {
  await getWorks();
  afficherTravaux();
  await getCategories();
  afficherFiltre();
  afficherModeEdition();
  initSelectModal();
}

init();

async function getWorks() {
  try {
    const request = await fetch("http://localhost:5678/api/works");
    if (!request.ok) {
      throw new Error("Erreur récupération des travaux");
    }

    const data = await request.json();
    allWorks = data;
  } catch (e) {
    e;
  }
}

// AFFICHER TRAVAUX

function afficherTravaux(workToDisplay = null) {
  try {
    workToDisplay = allWorks;

    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    workToDisplay.forEach((work) => {
      const article = document.createElement("article");
      const image = document.createElement("img");
      const title = document.createElement("h3");

      image.src = work.imageUrl;
      image.alt = work.title;
      title.textContent = work.title;

      article.appendChild(image);
      article.appendChild(title);
      gallery.appendChild(article);
    });
  } catch (error) {
    console.error("afficherTravaux :", error);
    alert("Impossible de charger les travaux.");
  }
}

// RECUPERER CATEGORIES

async function getCategories() {
  try {
    const request = await fetch("http://localhost:5678/api/categories");
    if (!request.ok) throw new Error("Erreur récupération des catégories");
    allCategories = await request.json();
  } catch (error) {
    console.error("getCategories :", error);
    alert("Impossible de charger les catégories.");
  }
}

// FILTRES

function afficherFiltre() {
  const filter = document.querySelector(".filter");
  filter.innerHTML = "";

  const buttonTous = document.createElement("button");
  buttonTous.textContent = "Tous";
  buttonTous.addEventListener("click", () => afficherTravaux());
  filter.appendChild(buttonTous);

  allCategories.forEach((categorie) => {
    const button = document.createElement("button");
    button.textContent = categorie.name;

    button.addEventListener("click", () => {
      const filteredWorks = allWorks.filter(
        (work) => work.category.id === categorie.id,
      );
      afficherTravaux(filteredWorks);
    });

    filter.appendChild(button);
  });
}

// MODE EDITION

function afficherModeEdition() {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Affiche la bannière
  document.querySelector(".banniere").classList.remove("hide");

  // Cache les filtres
  document.querySelector(".filter").setAttribute("hidden", "");

  // Ajuste le style du titre
  const portfolioH2 = document.getElementById("mesprojetsh2");
  if (portfolioH2) portfolioH2.style.marginBottom = "0";

  // Logout
  const loginBtn = document.getElementById("login");
  loginBtn.textContent = "logout";
  loginBtn.addEventListener(
    "click",
    () => {
      localStorage.removeItem("token");
      location.reload();
    },
    { once: true },
  );

  // Ouvre la modal 1
  const modal1 = document.querySelector(".modal");
  const modal2 = document.querySelector(".modal2");

  // fermeture de la flèche

  const left = document.querySelector(".fa-arrow-left");
  left.addEventListener("click", () => {
    modal2.close();
    modal1.showModal();
  });

  document.getElementById("edit").addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      modal1.showModal();
      galleryModal();
    },
    { once: true },
  );

  // Ferme les modals avec la croix
  document.querySelectorAll(".fa-xmark").forEach((cross) => {
    cross.addEventListener("click", () => {
      modal1.close();
      modal2.close();
      resetModal2();
    });
  });

  // Passe à la modal 2
  document.querySelector(".bouton-ajout").addEventListener(
    "click",
    () => {
      modal1.close();
      resetModal2();
      modal2.showModal();
    },
    { once: true },
  );

  initPreviewImage();
  initValidationListener();
}

// GALERIE MODAL

function galleryModal() {
  const galerie = document.querySelector(".gallery-modal");
  galerie.innerHTML = "";

  allWorks.forEach((work) => {
    const article = document.createElement("article");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    image.alt = work.title;

    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.addEventListener("click", () => deleteWork(work.id));

    article.appendChild(image);
    article.appendChild(trash);
    galerie.appendChild(article);
  });
}

// SUPPRESSION

async function deleteWork(id) {
  try {
    const request = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!request.ok) throw new Error("Erreur lors de la suppression");

    allWorks = allWorks.filter((work) => work.id !== id);
    afficherTravaux(allWorks);
    galleryModal();
  } catch (error) {
    console.error("deleteWork :", error);
    alert("Erreur lors de la suppression.");
  }
}

// PREVIEW IMAGE

function initPreviewImage() {
  const input = document.getElementById("file");
  const preview = document.getElementById("img-preview");
  const elementsToHide = [
    document.querySelector(".fa-image"),
    document.querySelector(".button"),
    document.querySelector(".p"),
  ];

  input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    elementsToHide.forEach((el) => (el.style.display = "none"));

    const reader = new FileReader();
    reader.onload = () => (preview.src = reader.result);
    reader.readAsDataURL(file);
  });
}

// RESET MODAL 2

function resetModal2() {
  const form = document.getElementById("form-sendWork");
  const preview = document.getElementById("img-preview");
  const elementsToShow = [
    document.querySelector(".fa-image"),
    document.querySelector(".button"),
    document.querySelector(".p"),
  ];

  form.reset();
  preview.src = "";
  elementsToShow.forEach((el) => (el.style.display = ""));

  const bouton = document.querySelector(".valider-bouton2");
  bouton.disabled = true;
  bouton.classList.remove("valider-bouton2--active");
}

// VALIDATION FORMULAIRE
function formValider(titre, categorie, image, bouton) {
  if (
    titre.value.trim() === "" ||
    categorie.value === "" ||
    !image.files.length
  ) {
    bouton.disabled = true;
    bouton.classList.remove("active");
    // console.log("forme non valide");
    return false;
  }

  bouton.disabled = false;

  bouton.style.backgroundColor = "green";
  return true;
}
// Références DOM mises en cache une seule fois
function initValidationListener() {
  const titre = document.getElementById("titre");
  const categorie = document.getElementById("categories");
  const image = document.getElementById("file");
  const bouton = document.querySelector(".valider-bouton2");

  titre.addEventListener("input", () =>
    formValider(titre, categorie, image, bouton),
  );
  categorie.addEventListener("input", () =>
    formValider(titre, categorie, image, bouton),
  );
  image.addEventListener("change", () =>
    formValider(titre, categorie, image, bouton),
  );
  // console.log("init");
  document.querySelector(".msg-erreur").classList.add("elementhidden");
}

// async function addWork(formData) {
// const token = localStorage.getItem("token");

//   const response = await fetch("http://localhost:5678/api/works", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     console.log("Détail erreur serveur :", error);
//     throw new Error("Erreur serveur");
//   }

//   return await response.json();
// }

// AJOUT WORK

async function addWork() {
  const form = document.getElementById("form-sendWork");
  const titre = document.getElementById("titre");
  const categorie = document.getElementById("categories");
  const image = document.getElementById("file");
  const bouton = document.querySelector(".valider-bouton2");
  if (!formValider(titre, categorie, image, bouton)) {
    console.log("addWorks");
    document.querySelector(".msg-erreur").classList.remove("elementhidden");
    return true;
  }

  try {
    const formData = new FormData(form);
    const request = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      body: formData,
    });

    if (!request.ok) {
      const errorData = await request.json().catch(() => null);
      console.error("Détail erreur serveur :", errorData);
      throw new Error("Erreur serveur");
    }

    const newWork = await request.json();
    allWorks.push(newWork);

    afficherTravaux(allWorks);
    galleryModal();
    resetModal2();
    document.querySelector(".modal2").close();
  } catch (error) {
    console.error("addWork :", error);
    alert("Erreur lors de l'ajout.");
  }
}

document
  .getElementById("form-sendWork")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    await addWork();
  });

// INIT SELECT

function initSelectModal() {
  const select = document.getElementById("categories");

  allCategories.forEach((categorie) => {
    const option = document.createElement("option");
    option.value = categorie.id;
    option.textContent = categorie.name;
    select.appendChild(option);
  });
}
