var slider = document.getElementById("checkbox");
var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if(storedTheme) {
    document.documentElement.setAttribute('color-theme', storedTheme)
}

if (storedTheme == "dark") {
    document.getElementById("checkbox").checked = true;
}


slider.onclick = function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute("color-theme");
    var targetTheme = "light";

    if(currentTheme === "light") {
        targetTheme = "dark";
    }

    document.documentElement.setAttribute('color-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
};

