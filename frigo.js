const idFrigo = 9;

/*********************** FUNCTIONS ***********************/

/**
 * Récupère les produits de la base de données.
 * Si le paramètre cherche est renseigné, récupère les produits contenant la
 * chaîne de caractère cherche.
 * 
 * @param {int} idFrigo L'identifiant du frigo dans la base de données
 * @param {string} cherche La chaîne de caractère à rechercher 
 */
function getProduits(idFrigo, cherche) {
  console.log("Recherche : " + cherche);

  //Initialisation du tableau

  let url =
    "http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/" +
    idFrigo +
    "/produits";

  if (cherche !== undefined) {
    url += "?search=" + cherche;
  }

  console.log(url);

  let fetchOptions = {
    method: "GET"
  };

  fetch(url, fetchOptions)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(dataJSON => {
      console.log(dataJSON);
      let char =
        "<tr>" +
        "<th> Produit </th>" +
        "<th> Quantité </th>" +
        "<th> Action </th>" +
        "</tr>";
      for (let produit of dataJSON) {
        document.getElementById("recherche").value = "";
        document.getElementById("newProduct").value = "";
        document.getElementById("qteNewProduct").value = "";
        char =
          char +
          "<tr>" +
          "<td>" +
          produit.nom +
          "</td>" +
          "<td>" +
          produit.qte +
          "</td>" +
          "<td>" +
          "<input type='button' name='ajouter1' qte='" +
          produit.qte +
          "'  id='" +
          produit.id +
          "' nom='" +
          produit.nom +
          "' class='ajoutbutton'>" +
          "<input type='button' name='enlever1' qte='" +
          produit.qte +
          "'  id='" +
          produit.id +
          "' nom='" +
          produit.nom +
          "' class='enleverbutton' >" +
          "<input type='button' name='supprimer' id='" +
          produit.id +
          "' class='supbutton'>" +
          "</td>" +
          "</tr>";
      }
      document.getElementById("listeProduits").innerHTML = char;
    })
    .catch(error => {
      console.log(error.message);
    });
}

/**
 * Ajoute le un produit avec une quantité initiale dans le frigo.
 *
 * @param {int} idFrigo L'identifiant du frigo dans lequel ajouter le produit
 * @param {object} product Le produit à ajouter
 */
function addProduct(idFrigo, product) {
  const url =
    "http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/" +
    idFrigo +
    "/produits";
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log(myHeaders);
  const fetchOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(product)
  };
  fetch(url, fetchOptions)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(dataJSON => {
      console.log(dataJSON);
      getProduits(idFrigo);
    })
    .catch(error => console.log(error.message));
}

/**
 * Supprime le un produit du frigo.
 *
 * @param {int} idFrigo L'identifiant du frigo dans lequel supprimer le produit
 * @param {int} idProduct L'identifiant du produit à supprimer
 */
function deleteProduct(idFrigo, idProduct) {
  console.log("deleteProduct :");
  const url =
    "http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/" +
    idFrigo +
    "/produits/" +
    idProduct;
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log(myHeaders);
  const fetchOptions = {
    method: "DELETE"
  };
  fetch(url, fetchOptions)
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(dataJSON => {
      getProduits(idFrigo);
      console.log(dataJSON);
    })
    .catch(error => console.log(error.message));
}

/**
 * Modifie la quantité du produit dans le frigo.
 * 
 * @param {int} idFrigo L'identifiant du frigo dans lequel modifier le produit
 * @param {object} product Le produit à modifier
 */
function setProduct(idFrigo, product) {
  console.log("setProduct :")
  const url =
    "http://webmmi.iut-tlse3.fr/~jean-marie.pecatte/frigos/" +
    idFrigo +
    "/produits";

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  console.log(myHeaders);
  const fetchOptions = {
    method: "PUT",
    headers: myHeaders,
    body: JSON.stringify(product)
  };
  
  fetch(url, fetchOptions).then( (response) => {
    return response.json();
  }).then(dataJSON => {
    getProduits(idFrigo);
    console.log(dataJSON);
  }).catch(
    error => console.log(error.message)
  )
}

/**
 * Affiche les produits contenant la chaîne de caractère saisie
 * dans la barre de recherche.
 */
function searchProduct() {
  let wanted = document.getElementById("recherche");
  getProduits(idFrigo, wanted.value);
}

/*********************** EVENTS ***********************/

// Evénement lors d'un click sur le bouton "Ajouter un produit"
let addProductBtn = document.getElementById("addProduct");
addProductBtn.addEventListener("click", event => {
  console.log("Ajouter produit clicked");

  // Récupérer les infos sur le produit
  let product = {nom: "", qte: 0}
  product.nom = document.getElementById("newProduct").value;
  product.qte = document.getElementById("qteNewProduct").value;

  //Ajouter un produit au frigo
  addProduct(idFrigo, product);

  event.stopPropagation();
});

// Evénement lors d'un click sur la loupe de recherche
// Affiche les produits en fonction de la barre de recherche
let cherche = document.getElementById("cherche");
cherche.addEventListener("click", event => {
  console.log("Cherche clicked");
  // Récupérer la chaîne à chercher
  searchProduct();
  event.stopPropagation();
});

// Evénement lors de l'utilisation de la touche "enter" dans la barre de recherche
// Affiche les produits en fonction de la barre de recherche
let rechercher = document.getElementById("recherche");
rechercher.addEventListener("keyup", event => {
  if (event.keyCode === 13) {
    console.log("Rechercher enter tapped");
    searchProduct();
  }
  event.stopPropagation();
});

// Evénement lors d'un click sur "Tout mes produits"
// Affiche tous les produits du frigo
let allProducts = document.getElementById("allProducts");
allProducts.addEventListener("click", event => {
  console.log("Tout mes produits clicked");
  // Afficher tous les produits du frigo
  getProduits(idFrigo);
  event.stopPropagation();
});

// Evénement lors d'un click sur un élément du DOM
// Utilisé pour gérer les clicks d'ajout et d'enlèvement de quantité et pour la suppression de produit
document.addEventListener("click", event => {
  let target = event.target;
  // console.log("Cible : ", target.attributes);
  // console.log("Parent node ", target.parentNode.children)
  
  let product = {id: 0, nom: "", qte: 0};

  switch (target.name) {
    case "ajouter1":
      console.log("Ajouter 1 clicked");
      // Récupérer les données du produit
      product.id = target.id;
      product.nom = target.getAttribute("nom");
      product.qte = parseInt(target.getAttribute("qte")) + 1;
      // console.log("Produit : ", product);

      // Ajouter un à la quantité du produit
      setProduct(idFrigo, product);
      // getProduits(idFrigo);
      break;
    case "enlever1":
      console.log("Enlever 1 clicked");
      // Récupérer les données du produit
      product.id = target.id;
      product.nom = target.getAttribute("nom");
      product.qte = parseInt(target.getAttribute("qte")) - 1;
      // console.log("Produit : ", product);

      console.log(typeof product.qte);

      if(product.qte === 0) {
        // Supprimer le produit
        deleteProduct(idFrigo, product.id);
      } else {
        // Enelver un à la quantité du produit
        setProduct(idFrigo, product);
      }
      break;
    case "supprimer":
      console.log("Supprimer clicked");
      // Supprimer totalement le produit
      deleteProduct(idFrigo, target.id);
      break;
    default:
  }
});

// Afficher tous les produits lors de la première visite de la page
getProduits(idFrigo);
