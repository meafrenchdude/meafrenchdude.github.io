let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let overlay = document.querySelector(".page-overlay");
let logo = document.querySelector(".main-logo");
let projectsSection = document.querySelector(".projects-section");
let projectsHint = document.querySelector(".projects-hint");

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

window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const scalingSpeed = 50;
    const isMobile = window.innerWidth <= 600;
    const desktopWidth = 350;
    const mobileWidth = 200;
    const topWidth = isMobile ? mobileWidth : desktopWidth;
    
    if (scrolled > 1) {
        const progress = Math.min((scrolled - 1) / scalingSpeed, 1);
        const newMarginTop = 50 - (30 * progress);
        const widthReduction = isMobile ? 50 : 100;
        const newWidth = topWidth - (widthReduction * progress);
        
        logo.style.marginTop = newMarginTop + "px";
        logo.style.width = newWidth + "px";
    } else {
        logo.style.marginTop = "50px";
        logo.style.width = topWidth + "px";
    }
});

function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

if (projectsHint) {
  projectsHint.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(projectsSection);
  });
}

const sidebarProjectsLink = document.querySelector('a[href="#projects"]');
if (sidebarProjectsLink) {
  sidebarProjectsLink.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo(projectsSection);
  });
}

if (projectsSection && projectsHint) {
  const projectsHeading = projectsSection.querySelector('h1');
  
  function updateHintVisibility() {
    if (!projectsHeading) return;
    
    const headingTop = projectsHeading.getBoundingClientRect().top;
    const headingBottom = projectsHeading.getBoundingClientRect().bottom;
    const viewportHeight = window.innerHeight;
    
    const isHeadingAboveViewport = headingBottom <= 0;
    const isHeadingVisible = headingBottom > 0 && headingTop < viewportHeight;
    const isScrolledPast = headingTop < 0;
    
    const shouldHide = isHeadingVisible || isScrolledPast;
    
    projectsHint.classList.toggle("hidden", shouldHide);
  }
  
  window.addEventListener("scroll", updateHintVisibility);
  window.addEventListener("resize", updateHintVisibility);

  updateHintVisibility();
}