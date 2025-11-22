const isInPagesFolder = window.location.pathname.includes('/pages/');

if (performance.navigation.type === 1 && !window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
    window.location.href = isInPagesFolder ? '../index.html' : 'index.html';
}

const navPath = isInPagesFolder ? '../nav.html' : 'nav.html';

fetch(navPath)
    .then(res => res.text())
    .then(data =>{
        document.querySelector("#nav-placeholder").innerHTML = data;

        const nav = document.querySelector(".nav");
        const toggleBtn = document.querySelector(".open-close-icon");

        toggleBtn.classList.toggle("fa-x", nav.classList.contains("active"));
        toggleBtn.classList.toggle("fa-bars", !nav.classList.contains("active"));

        toggleBtn.addEventListener("click", () =>{
            nav.classList.toggle("active");
            toggleBtn.classList.toggle("fa-x");
            toggleBtn.classList.toggle("fa-bars");
        });

        // Fix navigation links and logo based on current location
        const navLinks = document.querySelectorAll('.side-nav a');
        const logo = document.querySelector('.nav-header img');
        
        if (isInPagesFolder) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href.startsWith('pages/')) {
                    link.href = href.replace('pages/', '');
                }
            });
            if (logo) logo.src = '../assests/images/logo.png';
        }
    });
