/**
 * Counters to provide unique ID's to the DOM elements.
 */
let ingredientCounter = 0;
let instructionCounter = 0;
let tagCounter = 0;

/**
 * Ingredients box constructor.
 */
function IngredientsBox() {
    ingredientCounter++;
    // Generate input box.
    this.textbox = document.createElement("input");
    this.textbox.setAttribute("id", "ingredient" + ingredientCounter);
    document.getElementById("ingredientsBox").appendChild(this.textbox);

    // Generate remove button.
    this.removeButton = document.createElement("button");
    this.removeButton.innerHTML = "X";
    this.removeButton.setAttribute("id", ingredientCounter);
    this.removeButton.onclick = removeIngredient;
    document.getElementById("ingredientsBox").appendChild(this.removeButton);

    // Inserts br.
    let br = document.createElement("br");
    br.setAttribute("id", "br" + ingredientCounter);
    document.getElementById("ingredientsBox").appendChild(br);
}

/**
 * Add ingredient button.
 */
function addIngredient() {
    new IngredientsBox();
}

/**
 * Remove ingredient button.
 */
function removeIngredient() {
    ingredientCounter--;
    // Remove from view.
    document.getElementById("ingredientsBox").removeChild(this);
    document.getElementById("ingredient" + this.id).remove();
    document.getElementById("br" + this.id).remove();
}

/**
 * Instructions box constructor.
 */
function InstructionBox() {
    instructionCounter++;
    // Generate input box.
    this.textbox = document.createElement("input");
    this.textbox.setAttribute("id", "instruction" + instructionCounter);
    document.getElementById("instructionsBox").appendChild(this.textbox);

    // Generate remove button.
    this.removeButton = document.createElement("button");
    this.removeButton.innerHTML = "X";
    this.removeButton.setAttribute("id", instructionCounter);
    this.removeButton.onclick = removeInstruction;
    document.getElementById("instructionsBox").appendChild(this.removeButton);

    // Inserts br.
    let br = document.createElement("br");
    br.setAttribute("id", "br" + instructionCounter);
    document.getElementById("instructionsBox").appendChild(br);
}

/**
 * Add instruction button.
 */
function addInstruction() {
    new InstructionBox();
}

/**
 * Remove instruction button.
 */
function removeInstruction() {
    instructionCounter--;
    console.log(instructionCounter);
    // Remove from view.
    document.getElementById("instructionsBox").removeChild(this);
    document.getElementById("instruction" + this.id).remove();
    document.getElementById("br" + this.id).remove();
}

/**
 * Tags box constructor.
 */
function TagBox() {
    tagCounter++;
    // Generate input box.
    this.textbox = document.createElement("input");
    this.textbox.setAttribute("id", "tag" + tagCounter);
    document.getElementById("tagsBox").appendChild(this.textbox);

    // Generate remove button.
    this.removeButton = document.createElement("button");
    this.removeButton.innerHTML = "X";
    this.removeButton.setAttribute("id", tagCounter);
    this.removeButton.onclick = removeTag;
    document.getElementById("tagsBox").appendChild(this.removeButton);

    // Inserts br.
    let br = document.createElement("br");
    br.setAttribute("id", "br" + tagCounter);
    document.getElementById("tagsBox").appendChild(br);
}

/**
 * Add tag button.
 */
function addTags() {
    new TagBox();
}

/**
 * Remove instruction button.
 */
function removeTag() {
    tagCounter--;
    // Remove from view.
    document.getElementById("tagsBox").removeChild(this);
    document.getElementById("tag" + this.id).remove();
    document.getElementById("br" + this.id).remove();
}

/**
 * Check if any Ingredient field is empty.
 */
function checkIngEmpty() {
    for (let i = 1; i <= ingredientCounter; i++) {
        if (document.getElementById("ingredient" + i).value == "") {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Check if any instruction field is empty.
 */
function checkInstrEmpty() {
    for (let i = 1; i <= instructionCounter; i++) {
        if (document.getElementById("instruction" + i).value == "") {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Check if any tag field is empty.
 */
function checkTagEmpty() {
    for (let i = 1; i <= tagCounter; i++) {
        if (document.getElementById("tag" + i).value == "") {
            return true;
        } else {
            return false;
        }
    }
}

/**
 * Submit button handler.
 */
function uploadRecipe() {
    document.getElementById("submitButton").addEventListener("click",function (e) {
        if (document.getElementById("recipeName").value == "" 
        || checkIngEmpty() || checkInstrEmpty() || checkTagEmpty() 
        || ingredientCounter < 1 || instructionCounter < 1 || tagCounter < 1) {
            window.alert("One of the fields is empty");
        } else {
            // Inserts spinner.
            document.getElementById("submitButton").style.display = "none";
            document.getElementById("spinner").style.display = "block";

            e.preventDefault();
            let stepList = [];
            let ingredientList= [];
            let tagsList = [];
            let recipeName = document.getElementById("recipeName").value;
            let descriptionText = document.getElementById("description").value;

            // Push each ingredient into an array.
            for (let i = 1; i <= ingredientCounter; i++) {
                ingredientList.push(document.getElementById("ingredient" + i).value);
            }
            
            // Push each instruction into an array.
            for (let j = 1; j <= instructionCounter; j++) {
                stepList.push(document.getElementById("instruction" + j).value);
            }
            
            // Push each tag into an array.
            for (let k = 1; k <= tagCounter; k++) {
                tagsList.push(document.getElementById("tag" + k).value);
            }

            // Check if user is logged in.
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    let recipes = [];
                    recipes.push(recipeName);
                    db.collection("users").doc(user.uid).get().then(function (snap) {
                        console.log(snap.data().numberOfRecipes)
                        let numberOfRecipesPlus = snap.data().numberOfRecipes + 1;
                        // If this is the first recipe the user has submitted, increment the number of recipes and
                        // add the recipesList array to the document.
                        if (snap.data().numberOfRecipes == 0) {
                            db.collection("users").doc(user.uid).update({
                                numberOfRecipes: numberOfRecipesPlus,
                                recipesList: recipes
                            })
                        // If this is not the first recipe submitted, just append the recipesName to the recipesList.
                        } else {
                            db.collection("users").doc(user.uid).update({
                                numberOfRecipes: numberOfRecipesPlus,
                                recipesList: firebase.firestore.FieldValue.arrayUnion(recipeName)
                            })
                        }
                    })
                }
            });

            // Write to the recipes collection.
            db.collection("recipes").add({
                name: recipeName,
                ingredients: ingredientList,
                steps: stepList,
                tags: tagsList,
                description: descriptionText
            }).then(function (docRef) {
                console.log("Recipe added to database");
                window.alert("It's taking longer than expected... Please wait");
                setTimeout(function () {
                    window.location.href = "view.html?" + docRef.id;
                }, 10000);
            })
        }
    })
}

uploadRecipe();