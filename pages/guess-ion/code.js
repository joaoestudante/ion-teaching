function loadGame() {
    const ion = 2;
}

function closeInstructions() {
    var instructions = document.getElementById("start");
    instructions.classList.add("close-rule-card");
    setTimeout(() => {
        instructions.classList.remove("close-rule-card");
        var instructions_container = document.getElementById("start-game-container");
        instructions_container.style.display = "none";
        var game = document.getElementById("game-container");
        game.style.display = "block";

    }, 205)
    
}

function openInstructions() {
    var instructions = document.getElementById("start");
    instructions.style.display = "block";
    var game = document.getElementById("game-container");
    game.style.display = "none";
}

async function startLevel(level) {
    console.log("Level " + level + " started.");


    // Select 3 random ions according to the chosen level

    selected_ions = await getRandomIons(3, level);
    console.log(selected_ions);

    if (level == 1) {
        // Only one square should exist
        document.getElementById("ion2").style.display = "none";
        document.getElementById("ion3").style.display = "none";

        var ion_to_guess = selected_ions[parseInt(Math.random() * selected_ions.length)];
        document.getElementById("ion1").innerHTML = ion_to_guess["symbol"];
        shuffleArray(selected_ions);
        var ion_names = document.getElementsByClassName("ion-name");
        for (i in selected_ions) {
            ion_names[i].innerHTML = selected_ions[i]["name"]
        }

        for (ion_name of ion_names) {
            ion_name.addEventListener('mouseenter', e => {
                e.target.style.background = "#81d4fa";
            })
            ion_name.addEventListener('mouseleave', e => {
                e.target.style.background = "white";
            })
            ion_name.addEventListener('click', e => {
                if (e.target.innerHTML == ion_to_guess["name"]) {
                    console.log("Correct!!!!");
                    e.target.style.background = "#81d4fa";
                    e.target.removeEventListener('mouseleave', () => {});
                }
            })
        }
        document.getElementById("ion1").classList.add("blue")
    }

    document.getElementById("level-selector").style.display = "none";
    document.getElementById("game").style.display = "flex";
}

async function getRandomIons(n, level) {
    // Returns n random ions from the database
    var database;
    await fetch("../../data/database.json").then(response => {
        return response.json();
    }).then(jsonData => database = jsonData["ions"]);

    var selected_ions = [];
    const values = Object.values(database.filter((value) => {
        if (level == 1) {
            return value["difficulty"] == "easy";
        }
        if (level == 2) {
            return value["difficulty"] == "medium";
        }
        if (level == 3) {
            return value["difficulty"] == "hard";
        }
    }));

    for (_ of [...Array(n).keys()]) {
        var random_value = values[parseInt(Math.random() * values.length)]
        while (selected_ions.includes(random_value))
            random_value = values[parseInt(Math.random() * values.length)]
        selected_ions.push(random_value);
    }

    return selected_ions;
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}