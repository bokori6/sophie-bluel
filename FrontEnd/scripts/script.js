async function afficherTravaux() {
  const request = await fetch("http://localhost:5678/api/works");
  const allWorks = await request.json();

  const gallery = document.querySelector(".gallery");

  allWorks.forEach((work) => {
    const article = document.createElement("article");
    const image = document.createElement("img");
    image.src = work.imageUrl;
    const title = document.createElement("h3");
    title.textContent = work.title;
    article.appendChild(image);
    article.appendChild(title);
    gallery.appendChild(article);
  });
}

afficherTravaux();

async function afficherCaregorie() {
  const request = await fetch("http://localhost:5678/api/categories");
  const allCategories = await request.json();

  const containerFilter = document.querySelector(".filter");
}
