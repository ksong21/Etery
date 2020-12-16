/**
 * Gets the correct recipe document from firestore database via the url.
 */
function getRecipe() {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?");
    let recipe = queries[1];
    return recipe;
}

/**
 * Displays the recipe on the screen.
 * Shows the information about each ingredient in a list underneath.
 */
function displayRecipe() {
    // Gets the recipe docs and grabs a snapshot of the information.
    db.collection("recipes").doc(getRecipe())
    .get().then(function (snap) {
        document.getElementById("recipeName").innerHTML = snap.data().name;

        // Loop through the number of ingredients and append to the list.
        for (let i = 0; i < snap.data().ingredients.length; i++) {
            let list = document.createElement('p');
            list.setAttribute("id", "" + snap.data().ingredients[i]);
            list.innerHTML = snap.data().ingredients[i];
            document.getElementById("ingredientList").appendChild(list);

            // Search through the ingredients database 
            // and if any ingredients match display that ingredients information.
            db.collection("ingredients").where("name", "==", snap.data().ingredients[i])
            .get().then(function (snap) {
                snap.forEach(function (doc) {
                let tipList = document.createElement('ul');
                let life = document.createElement('li');
                let storage = document.createElement('li');
                let tip = document.createElement('li');
                life.innerHTML = "Shelf-life: " + doc.data().life;
                storage.innerHTML = "Storage: " + doc.data().storage;
                tip.innerHTML = "Tip: " + doc.data().tip;
                tipList.appendChild(life);
                tipList.appendChild(storage);
                tipList.appendChild(tip);
                document.getElementById("" + doc.data().name).appendChild(tipList);
                })
            })
        }

        // Loop through the number of instructions and display.
        for (let i = 0; i < snap.data().steps.length; i++) {
            let list = document.createElement('p');
            list.innerHTML = snap.data().steps[i];
            let numList = document.createElement("li");
            document.getElementById("instructionList").appendChild(numList);
            numList.appendChild(list);
        }
    })
}

/**
 * Create a bootstrap card for each recipe in the database.
 */
function createCard(recipe) {
    let card = document.createElement('div');
    card.className = "card";
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
    cardBody.class = "card-body";
    let title = document.createElement('h5');
    title.className = "card-title";
    let textName = document.createTextNode(recipe.data().name);
    title.appendChild(textName);
    let cardText = document.createElement('p');
    cardText.className = "card-text";
    let description = document.createTextNode(recipe.data().description);
    cardText.appendChild(description);
    let viewRecipe = document.createElement('a');
    viewRecipe.className = "align-self-end btn btn-primary btn-block";
    viewRecipe.href = "view.html?" + recipe.id;
    let text = document.createTextNode("View Recipe");
    viewRecipe.appendChild(text);
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(viewRecipe);
    img.appendChild(cardBody);
    card.appendChild(img);
    card.appendChild(cardBody);
    let t = document.createTextNode("Leftovers? Try these other recipes to use them up!");
    document.getElementById("leftovers").innerHTML = "Leftovers? Try these other recipes to use them up!";
    document.getElementsByClassName("card-columns")[0].appendChild(card);
}

/**
 * Recommends the users other recipes that contain the same ingredients as the recipe they are viewing.
 */
function recommendRecipes() {
    // Get a list of ingredients for this recipe.
    let thisIngredients = [];
    db.collection("recipes").doc(getRecipe()).get().then(function (snap){
        let recipeName = snap.data().name;
        for (let i = 0; i < snap.data().ingredients.length; i++) {
            thisIngredients.push(snap.data().ingredients[i]);
        }
    
        console.log(thisIngredients);

        // Search through the for all OTHER recipes.
        db.collection("recipes").get().then(function (snap) {
            snap.forEach(function (doc) {
                // Get a list of ingredients for the OTHER recipes.
                let otherIngredients = [];
                let sameIngredientCounter = 0;
                for (let j = 0; j < doc.data().ingredients.length; j++) {
                    otherIngredients.push(doc.data().ingredients[j]);
                }
                console.log(otherIngredients);
                // Compare ingredients of both recipes.
                for (k = 0; k < thisIngredients.length; k++) {
                    if (thisIngredients[k] == otherIngredients[k]) {
                        sameIngredientCounter++;
                    }
                    console.log(sameIngredientCounter);
                }
                if (sameIngredientCounter >= 2 && (doc.data().name != recipeName)) {
                    createCard(doc);
                }
            })
        })
    })
}

displayRecipe();
recommendRecipes();