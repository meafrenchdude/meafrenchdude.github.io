let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let overlay = document.querySelector(".page-overlay");

closeBtn.addEventListener("click",() => {
    sidebar.classList.toggle("open");
    menuBtnChange();
})

overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    menuBtnChange();
})

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-left");
    } else {
        closeBtn.classList.replace("bx-menu-left", "bx-menu");
    }
}

menuBtnChange();