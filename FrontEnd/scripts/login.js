async function connexion() {
  // Récupérer les champs du formulaire
  const email = document.getElementById("email");
  const password = document.getElementById("mot-de-passe");
  // Envoyer une requête au serveur
  const request = await fetch("http://localhost:5678/api/users/login", {
    // Méthode POST
    method: "post",
    // Définir le type de contenu
    headers: { "Content-type": "application/json" },
    // Envoyer les données
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });
  // Vérification de la réponse serveur
  if (!request.ok) {
    throw Error(`erreur: ${request.status}`);
  } else {
    // Si la requête réussit
    const response = await request.json();
    localStorage.setItem("token", response.token);
    window.location.href = "index.html";
  }
}
// Gestion du formulaire
const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  connexion();
});

// Traitement de message d'erreur du forlulaire login

function messageError () 
