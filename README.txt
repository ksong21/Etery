==================
++ General Info ++
==================
Hi welcome to our COMP 1800 project (Etery). Our idea is essentially a webapp that allows users to create and share recipes with others around the globe!

DEVELOPERS:
Kevin Tran
Kevin Song
Prerna

==================
++ Technologies ++
==================
- Glowhost hosting (cPanel)
- Firebase database
- HTML, CSS
- JavaScript
- Bootstrap

==================
++++ Content ++++
==================
Top level folder:
├── .gitignore                  # Git ignore file
├── README.txt                  # Project documentation
├── account.html                # User account page
├── index.html                  # Landing page
├── loginPage.html              # Login form
├── main.html                   # Main page where user created recipes are displayed
├── uploadPage.html             # Where users can post their own recipes
├── view.html                   # Dynamically generates info of recipes that users want to use

It has the subfolders:
├── css                         # Folder for CSS
    /accountstyle.css           # User account page styling
    /indexstyle.css             # Landing page styling
    /mainstyle.css              # Main page styling
    /uploadstyle.css            # Post recipe page styling
    /viewstyle.css              # Recipe info page styling
├── images                      # Folder to store images
    /header1.png                # Landing page carousel header1
    /header2.png                # Landing page carousel header2
    /header3.png                # Landing page carousel header3
    /salad_card.jpg             # Default image for recipes
    /share.jpg                  # Subfooter image
├── js                          # Folder to store core functionality (JavaScript)
    /account.js                 # Account page functions
    /firebase_api_29.js         # Firebase file
    /main.js                    # Main page functions
    /upload.js                  # Post recipe page functions
    /view.js                    # Recipe info page functions
