/**
 * Reads the users name from the database and welcomes them on the account page.
 */
function welcomeUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        document.getElementById("username").innerHTML = "Welcome back, " + user.displayName + "!";
    })
}

/**
 * Displays the recipes as cards on the user's account page.
 */
function displayNumberOfRecipes() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).get().then(function (snap) {
            document.getElementById("recipesUploaded").innerHTML = "You've uploaded " +
            snap.data().numberOfRecipes + " recipes!";
        })
    })
}

/**
 * Creates cards for recipes that the user has submitted.
 */
function createCard(recipe) {
    let col = document.createElement('div');
    col.className = "col-xs-6 col-sm-6 col-md-4 col-lg-3";
    let card = document.createElement('div');
    card.className = "card text-white bg-success mb-3";
    card.style.width = "18rem";
    card.style.margin = "auto";
    card.style.marginTop = "10px";
    let img = document.createElement("img");
    img.className = "card-img-top";
    img.src = "images/salad_card.jpg";
    img.style.width = "100%";
    img.style.height = "10vw";
    img.style.objectFit = "cover";
    let cardBody = document.createElement('div');
    cardBody.className = "card-body";
    cardBody.style.height = "10rem";
    cardBody.style.overflow = "hidden";
    let title = document.createElement('h5');
    title.className = "card-title";
    let textName = document.createTextNode(recipe.data().name);
    title.appendChild(textName);
    let cardText = document.createElement('p');
    cardText.className = "card-text";
    let description = document.createTextNode(recipe.data().description);
    cardText.appendChild(description);
    let viewRecipe = document.createElement('a');
    viewRecipe.className = "align-self-end btn stretched-link";
    viewRecipe.href = "view.html?" + recipe.id;
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(viewRecipe);
    img.appendChild(cardBody);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    document.getElementsByClassName("row")[0].appendChild(col);
}

/**
 * Loop through the users recipeList array and create a card for each one.
 */
function displayCards() {
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("users").doc(user.uid).get().then(function (snap) {
            for (let i = 0; i < snap.data().numberOfRecipes; i++) {
                db.collection("recipes").where("name", "==", snap.data().recipesList[i]).get().then(function (snapShot) {
                    snapShot.forEach(function (doc) {
                        createCard(doc);
                    })
                })
            }
        })
    })
}

welcomeUser();
displayNumberOfRecipes();
displayCards();