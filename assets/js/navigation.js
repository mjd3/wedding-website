document.getElementById("nav-toggle").addEventListener("click", toggleNav);
document.getElementById("main-menu").addEventListener("click", toggleNav);
document.getElementById("logo").addEventListener("click", toggleNav);

function toggleNav() {
    var nav = document.getElementById("main-menu");
    var burger = document.getElementById("nav-toggle");
    if (!nav.classList.contains("is-active")) {
        nav.classList.add("is-active")
        burger.classList.add("is-active")
    } else {
        nav.classList.remove("is-active")
        burger.classList.remove("is-active")
    }
}

