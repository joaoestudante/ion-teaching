var progress = 0;
var max_guess = 5;
var correct_sound = new Howl({
    src:["../../sfx/correct.wav"]
});
var wrong_sound = new Howl({
    src:["../../sfx/wrong.wav"]
});
var click_sound = new Howl({
    src:["../../sfx/click.wav"]
});


function closeInstructions() {
    var instructions = document.getElementById("start");
    instructions.classList.add("close-rule-card");
    click_sound.play();
    setTimeout(() => {
        instructions.classList.remove("close-rule-card");
        var instructions_container = document.getElementById("start-game-container");
        instructions_container.style.display = "none";
        var game = document.getElementById("game-container");
        game.style.display = "block";

    }, 205)
    
}

function openInstructions() {
    var instructions = document.getElementById("start-game-container");
    instructions.style.display = "block";
    var game = document.getElementById("game-container");
    game.style.display = "none";
}

function setSquareToSelected(e) {
    e.target.classList.add("firstIonSelected");
}

function setSquareToUnselected(e) {
    e.target.classList.remove("firstIonSelected");
}

function handleClick(e, ion_to_guess_name, run_level_callback, level) {
    if (e.target.innerHTML == ion_to_guess_name) {
        setSquareToSelected(e);
        e.target.removeEventListener('mouseleave', setSquareToUnselected);
        document.getElementsByClassName("fa-solid fa-star")[progress].classList.add("star-correct");
        e.target.classList.add("correct-guess");
        setTimeout(() => correct_sound.play(), 150);
    } else {
        e.target.removeEventListener('mouseleave', setSquareToUnselected);
        document.getElementsByClassName("fa-solid fa-star")[progress].style.color = "red";
        e.target.classList.add("wrong-guess");
        setTimeout(() => wrong_sound.play(), 150);
    }
    var button = document.getElementById("next-button");
    button.style.visibility = "visible";
    progress = progress + 1;
    if (progress == max_guess) {
        // Game should finish
        button.innerHTML = "Terminar!";
        button.removeEventListener("click", run_level_callback);
        button.addEventListener("click", finishLevel.bind(null, e, level));
    }
    /* We want to disable all events, so that users don't click when
    their guess is made */
    var ion_names = document.getElementsByClassName("ion-bottom-row");
    for (ion_name of ion_names) {
        elClone = ion_name.cloneNode(true);
        ion_name.parentNode.replaceChild(elClone, ion_name);
    }
}

function finishLevel(e, level) {
    alert("Game finished! Show results page...");
}

async function startLevel(level) {
    if (level == 1) {
        await runLevel1();
        document.getElementById("next-button").addEventListener("click", runLevel1);
    } else if (level == 2) {
        await runLevel2();
        document.getElementById("next-button").addEventListener("click", runLevel2);
    } else if (level == 3) {
        await runLevel3();
        document.getElementById("next-button").addEventListener("click", runLevel2);
    }

    document.getElementById("level-selector").style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("game").style.display = "flex";
}

async function runLevel2() {
    setTimeout(() => click_sound.play(), 100);
    clearColors();
    hideExtraElements();
    selected_ions = await getRandomIons(3, 2);
    var ion_to_guess = selected_ions[parseInt(Math.random() * selected_ions.length)];
    document.getElementById("ion-top1").innerHTML = ion_to_guess["name"];
    shuffleArray(selected_ions);

    var ion_symbols = document.getElementsByClassName("ion-bottom-row");
    for (i in selected_ions) {
        ion_symbols[i].innerHTML = selected_ions[i]["symbol"]
    }

    setupEvents(ion_symbols, ion_to_guess["symbol"], runLevel2, 2);
    document.getElementById("ion-top1").classList.add("firstIonSelected")
}

async function runLevel1() {
    setTimeout(() => click_sound.play(), 100);
    clearColors();
    hideExtraElements();

    selected_ions = await getRandomIons(3, 1);
    var ion_to_guess = selected_ions[parseInt(Math.random() * selected_ions.length)];
    document.getElementById("ion-top1").innerHTML = ion_to_guess["symbol"];
    shuffleArray(selected_ions);

    var ion_names = document.getElementsByClassName("ion-bottom-row");
    for (i in selected_ions) {
        ion_names[i].innerHTML = selected_ions[i]["name"]
    }

    setupEvents(ion_names, ion_to_guess["name"], runLevel1, 1)
    document.getElementById("ion-top1").classList.add("firstIonSelected");
}

function clearColors() {
    // Clears the selected colors from the previous guess.
    for (i of ["1","2","3"]) {
        document.getElementById("ion-bottom-row"+i).classList.remove("firstIonSelected");
        document.getElementById("ion-bottom-row"+i).classList.remove("correct-guess");
        document.getElementById("ion-bottom-row"+i).classList.remove("wrong-guess");
    }
}

function hideExtraElements() {
    document.getElementById("ion-top2").style.display = "none";
    document.getElementById("ion-top3").style.display = "none";
    document.getElementById("next-button").style.visibility = "hidden";
}

function setupEvents(elements, correct_value, callback, level) {
    for (el of elements) {
        // We need to remove the previous event handlers, otherwise an ion that was
        // correct before will be recognized as correct in all further attempts.
        // The simplest way to do this is to remove and re-add the elements to the tree.
        elClone = el.cloneNode(true);
        el.parentNode.replaceChild(elClone, el);
        elClone.addEventListener('mouseenter', setSquareToSelected)
        elClone.addEventListener('mouseleave', setSquareToUnselected);
        elClone.addEventListener('click', e => handleClick(e, correct_value, callback, level));
    }
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