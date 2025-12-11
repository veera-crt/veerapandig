// Toggle Grades Function - Defined globally first
window.toggleGrades = function (btn) {
    console.log("Toggle Grade Clicked");
    const parent = btn.parentElement;
    const gradeDetails = parent.querySelector('.grade-details');

    if (gradeDetails) {
        if (gradeDetails.style.display === "none" || getComputedStyle(gradeDetails).display === "none") {
            gradeDetails.style.display = "block";
            btn.textContent = "Hide Grade";
            btn.classList.add('active');
        } else {
            gradeDetails.style.display = "none";
            btn.textContent = "View Grade";
            btn.classList.remove('active');
        }
    } else {
        console.error("Grade details element not found");
    }
};



// Mobile Menu Toggle logic
// (Note: HTML for hamburger is there, need to add logic if expanded nav implementation is desired)

// Smooth Scroll for Anchor Links (Enhancement)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Simple reveal on scroll
const revealElements = document.querySelectorAll('.project-card, .resume-category, .about-text');

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.8;

    revealElements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        } else {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// About Section Emoji Trigger
const aboutEmoji = document.querySelector('.emoji-pop-about');
const aboutSection = document.querySelector('.about-section');

if (aboutEmoji && aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutEmoji.classList.add('visible');
                observer.unobserve(entry.target); // Play once
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of section is visible

    observer.observe(aboutSection);
}

// Scroll Progress Bar Logic
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
});

// Full Screen Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelector('.loader-text');
    const loaderBar = document.querySelector('.loader-bar');

    // Disable scroll while loading
    document.body.style.overflow = 'hidden';

    let progress = 0;

    const updateLoader = () => {
        loaderText.textContent = `${progress}%`;
        loaderBar.style.width = `${progress}%`;
    };

    // Fast loading phase (0-90%)
    const fastInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress >= 90) {
            progress = 90;
            updateLoader();
            clearInterval(fastInterval);
            startSlowPhase();
        } else {
            updateLoader();
        }
    }, 40); // Fast speed

    // Slow loading phase (90-100%)
    const startSlowPhase = () => {
        const slowInterval = setInterval(() => {
            progress += 1;
            updateLoader();

            if (progress >= 100) {
                progress = 100;
                clearInterval(slowInterval);
                setTimeout(() => {
                    loader.classList.add('slide-up');
                    document.body.style.overflow = 'auto';
                    // Trigger Reveal on Scroll after loader
                    setTimeout(revealOnScroll, 500);

                    // Trigger Hello Emoji Animation after loader moves up
                    setTimeout(() => {
                        const helloEmoji = document.querySelector('.greeting-container .emoji-pop');
                        if (helloEmoji) {
                            helloEmoji.classList.add('visible');
                        }
                    }, 800); // Slight delay after loader slides up
                }, 500); // 0.5s pause at 100% before sliding up
            }
        }, 150); // Slow speed for satisfaction
    };
});
