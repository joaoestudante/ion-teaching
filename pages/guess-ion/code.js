var progress = 0;
var max_guess = 5;

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

function setSquareToBlue(e) {
    e.target.style.background = "#81d4fa";
}

function setSquareToWhite(e) {
    e.target.style.background = "white";
}

function handleClick(e, ion_to_guess_name) {
    if (e.target.innerHTML == ion_to_guess_name) {
        e.target.style.background = "#81d4fa";
        e.target.removeEventListener('mouseleave', setSquareToWhite);
        document.getElementsByClassName("fa-solid fa-star")[progress].style.color = "yellow";
    } else {
        document.getElementsByClassName("fa-solid fa-star")[progress].style.color = "red";
        e.target.style.background = "red";
        e.target.removeEventListener('mouseleave', setSquareToWhite);
    }
    var button = document.getElementById("next-button");
    button.style.visibility = "visible";
    progress = progress + 1;
    if (progress == max_guess) {
        // Game should finish
        button.innerHTML = "Terminar!";
        button.removeEventListener("click", runLevel1);
        button.addEventListener("click", finishLevel.bind(null, e, 1));
        var ion_names = document.getElementsByClassName("ion-name");
        for (ion_name of ion_names) {
            // Disable all events
            elClone = ion_name.cloneNode(true);
            ion_name.parentNode.replaceChild(elClone, ion_name);
        }
    }
    console.log(progress);

}

function finishLevel(e, level) {
    alert("Game finished! Show results page...");
}

async function startLevel(level) {
    console.log("Level " + level + " started.");


    // Select 3 random ions according to the chosen level
    if (level == 1) {
        await runLevel1();
        document.getElementById("next-button").addEventListener("click", runLevel1);
    }

    document.getElementById("level-selector").style.display = "none";
    document.getElementById("game").style.display = "flex";
}


async function runLevel1() {
    selected_ions = await getRandomIons(3, 1);
    document.getElementById("ion2").style.display = "none";
    document.getElementById("ion3").style.display = "none";
    document.getElementById("next-button").style.visibility = "hidden";

    var ion_to_guess = selected_ions[parseInt(Math.random() * selected_ions.length)];
    document.getElementById("ion1").innerHTML = ion_to_guess["symbol"];
    shuffleArray(selected_ions);

    var ion_names = document.getElementsByClassName("ion-name");
    for (i in selected_ions) {
        ion_names[i].innerHTML = selected_ions[i]["name"]
    }

    for (ion_name of ion_names) {
        ion_name.style.background = "white";

        // We need to remove the previous event handlers, otherwise an ion that was
        // correct before will be recognized as correct in all further attempts.
        // The simplest way to do this is to remove and re-add the elements to the tree.
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
        elClone.addEventListener('mouseenter', setSquareToBlue)
        elClone.addEventListener('mouseleave', setSquareToWhite);
        elClone.addEventListener('click', e => handleClick(e, ion_to_guess["name"]));
    }
    document.getElementById("ion1").classList.add("blue")
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