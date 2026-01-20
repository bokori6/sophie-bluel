async function connexion() {
  const email = document.getElementById("email");
  const password = document.getElementById("mot-de-passe");
  const request = await fetch("http://localhost:5678/api/users/login", {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  if (!request.ok) {
    throw Error(`erreur: ${request.status}`);
  } else {
    const response = await request.json();
    localStorage.setItem("token", response.token);
    window.location.href = "index.html";
  }
}

const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  connexion();
});
