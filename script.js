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


function isSnowSeason(date = new Date()) {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 11 && day >= 15) {
    return true;
  }

  if (month === 0 && day <= 15) {
    return true;
  }

  return false;
}

function initSnowEffect() {
  if (!isSnowSeason()) {
    return;
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  if (document.querySelector('.snow-container')) {
    return;
  }

  const snowContainer = document.createElement('div');
  snowContainer.className = 'snow-container';
  snowContainer.style.pointerEvents = 'none';
  document.body.appendChild(snowContainer);

  const isMobile = window.innerWidth <= 600;
  const flakesCount = isMobile ? 40 : 80;

  for (let i = 0; i < flakesCount; i++) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';

    const size = Math.random() * 3 + 2;
    flake.style.width = size + 'px';
    flake.style.height = size + 'px';

    flake.style.left = Math.random() * 100 + '%';
    flake.style.opacity = (Math.random() * 0.5 + 0.5).toFixed(2);

    const duration = Math.random() * 10 + 10;
    flake.style.animationDuration = duration + 's';

    const delay = Math.random() * -duration;
    flake.style.animationDelay = delay + 's';

    snowContainer.appendChild(flake);
  }
}

window.addEventListener('load', initSnowEffect);

// GitHub followers functionality
const followersList = document.getElementById('followersList');
const msg = document.getElementById('msg');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageInfo = document.getElementById('pageInfo');
const recentFollowersList = document.getElementById('recentFollowersList');
const msgRecent = document.getElementById('msgRecent');
const showFollowersBtn = document.getElementById('showFollowersBtn');

let allFollowers = [];
let currentPage = 1;
let followersPerPage = 12;
let isFollowersVisible = false;

// Update followers per page based on screen size
function updateFollowersPerPage() {
    followersPerPage = window.innerWidth <= 600 ? 10 : 12;
}

// Check screen size on load and resize
window.addEventListener('resize', updateFollowersPerPage);
updateFollowersPerPage();

// Load recent followers on page load
window.addEventListener('DOMContentLoaded', loadRecentFollowers);

async function loadRecentFollowers() {
    const username = 'meafrenchdude';
    let allFollowersData = [];
    let page = 1;
    const perPage = 100; // Max per page to minimize requests
    
    try {
        msgRecent.innerHTML = '<span class="loading"></span>Loading recent followers...';
        
        // Fetch all pages of followers
        while (true) {
            const apiUrl = `https://api.github.com/users/${username}/followers?page=${page}&per_page=${perPage}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const followersPage = await response.json();
            allFollowersData = allFollowersData.concat(followersPage);
            
            // If we got fewer followers than per_page, we're done
            if (followersPage.length < perPage) {
                break;
            }
            
            page++;
        }
        
        allFollowers = allFollowersData;
        console.log('Total followers loaded:', allFollowers.length);
        
        if (allFollowers.length === 0) {
            msgRecent.textContent = 'No followers found.';
            return;
        }
        
        // Display first 10 followers as recent profile pictures
        const recentFollowers = allFollowers.slice(0, 10);
        displayRecentFollowers(recentFollowers);
        
    } catch (error) {
        console.error('Error fetching recent followers:', error);
        msgRecent.textContent = `Failed to load followers: ${error.message}`;
    }
}

async function getFollowerCount(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
            const userData = await response.json();
            return userData.followers;
        }
    } catch (error) {
        console.error('Error fetching follower count:', error);
    }
    return 0;
}

async function displayRecentFollowers(recentFollowers) {
    recentFollowersList.innerHTML = '';
    
    recentFollowers.forEach((follower, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'profile-pic-wrapper';
        wrapper.style.animationDelay = `${index * 0.05}s`;
        
        const img = document.createElement('img');
        img.src = follower.avatar_url;
        img.alt = `${follower.login}'s avatar`;
        img.className = 'profile-pic';
        
        wrapper.appendChild(img);
        recentFollowersList.appendChild(wrapper);
    });
    
    // Add plus icon with follower count if there are more followers
    if (allFollowers.length > 10) {
        const remainingCount = allFollowers.length - 10;
        
        const plusWrapper = document.createElement('div');
        plusWrapper.className = 'plus-icon-wrapper';
        plusWrapper.style.animationDelay = '0.55s';
        
        const plusIcon = document.createElement('div');
        plusIcon.className = 'plus-icon';
        plusIcon.textContent = remainingCount > 99 ? '+99' : `+${remainingCount}`;
        
        plusWrapper.appendChild(plusIcon);
        
        // Add click event to toggle followers
        plusWrapper.addEventListener('click', () => {
            toggleFollowers(plusWrapper, plusIcon, remainingCount);
        });
        
        recentFollowersList.appendChild(plusWrapper);
    }
    
    msgRecent.textContent = `Showing the ${recentFollowers.length} most recent followers`;
}

function toggleFollowers(plusWrapper, plusIcon, remainingCount) {
    if (!isFollowersVisible) {
        // Show followers
        fetchGitHubFollowers();
        isFollowersVisible = true;
        plusIcon.textContent = '−'; // Change to minus sign
        plusWrapper.style.background = '#00fd831a '; // Red background when active
    } else {
        // Hide followers
        hideFollowers();
        isFollowersVisible = false;
        plusIcon.textContent = remainingCount > 99 ? '+99' : `+${remainingCount}`; // Restore original text
        plusWrapper.style.background = '#00fd831a'; // Restore green background
    }
}

async function fetchGitHubFollowers() {
    const username = 'meafrenchdude';
    let allFollowersData = [];
    let page = 1;
    const perPage = 100;
    
    try {
        msg.innerHTML = '<span class="loading"></span>Loading followers...';
        
        // Fetch all pages of followers
        while (true) {
            const apiUrl = `https://api.github.com/users/${username}/followers?page=${page}&per_page=${perPage}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const followersPage = await response.json();
            allFollowersData = allFollowersData.concat(followersPage);
            
            if (followersPage.length < perPage) {
                break;
            }
            
            page++;
        }
        
        allFollowers = allFollowersData;
        
        if (allFollowers.length === 0) {
            msg.textContent = 'No followers found.';
            return;
        }
        
        currentPage = 1;
        displayFollowers();
        updatePagination();
        
        msg.textContent = '';
        
    } catch (error) {
        console.error('Error fetching followers:', error);
        msg.textContent = 'Failed to load followers. Please try again later.';
    }
}

function displayFollowers(direction = 'initial') {
    followersList.innerHTML = '';
    
    const startIndex = (currentPage - 1) * followersPerPage;
    const endIndex = startIndex + followersPerPage;
    const currentFollowers = allFollowers.slice(startIndex, endIndex);
    
    currentFollowers.forEach((follower, index) => {
        const li = document.createElement('li');
        
        // Set initial animation class based on direction
        if (direction === 'next') {
            li.classList.add('slide-in-right');
        } else if (direction === 'prev') {
            li.classList.add('slide-in-left');
        }
        
        const avatar = document.createElement('img');
        avatar.src = follower.avatar_url;
        avatar.alt = `${follower.login}'s avatar`;
        avatar.className = 'follower-avatar';
        
        const nameLink = document.createElement('a');
        nameLink.href = follower.html_url;
        nameLink.target = '_blank';
        nameLink.className = 'follower-name';
        nameLink.textContent = follower.login;
        
        const username = document.createElement('p');
        username.className = 'follower-username';
        username.textContent = `@${follower.login}`;
        
        li.appendChild(avatar);
        li.appendChild(nameLink);
        li.appendChild(username);
        
        followersList.appendChild(li);
    });
    
    setTimeout(() => {
        followersList.classList.remove('hide');
        followersList.classList.add('show');
    }, 50);
}

function updatePagination() {
    const totalPages = Math.ceil(allFollowers.length / followersPerPage);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    if (totalPages > 1) {
        pagination.style.display = 'flex';
    } else {
        pagination.style.display = 'none';
    }
}

function nextPage() {
    const totalPages = Math.ceil(allFollowers.length / followersPerPage);
    if (currentPage < totalPages) {
        // Animate current cards sliding out to the left
        const currentCards = followersList.querySelectorAll('li');
        currentCards.forEach(card => card.classList.add('slide-out-left'));
        
        setTimeout(() => {
            currentPage++;
            displayFollowers('next');
            updatePagination();
            
            msg.textContent = '';
        }, 300);
    }
}

function prevPage() {
    if (currentPage > 1) {
        // Animate current cards sliding out to the right
        const currentCards = followersList.querySelectorAll('li');
        currentCards.forEach(card => card.classList.add('slide-out-right'));
        
        setTimeout(() => {
            currentPage--;
            displayFollowers('prev');
            updatePagination();
            
            msg.textContent = '';
        }, 300);
    }
}

function hideFollowers() {
    // Add hiding class to all follower cards
    const followerCards = followersList.querySelectorAll('li');
    followerCards.forEach(card => card.classList.add('hiding'));
    
    // Wait for animation to complete before clearing
    setTimeout(() => {
        followersList.innerHTML = '<li></li>';
        followersList.classList.remove('show');
        followersList.classList.add('hide');
        pagination.style.display = 'none';
        msg.textContent = '';
    }, 300);
}

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', prevPage);
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', nextPage);
}