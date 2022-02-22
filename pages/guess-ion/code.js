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

function startLevel(level) {
    console.log("Level " + level + " started.");

    if (level == 1) {
        // Only one square should exist
        document.getElementById("ion2").style.display = "none";
        document.getElementById("ion3").style.display = "none";
    }

    document.getElementById("level-selector").style.display = "none";
    document.getElementById("game").style.display = "flex";
}