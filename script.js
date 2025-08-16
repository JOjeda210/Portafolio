document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Menu hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Intersection Observer para navegación activa
    const sections = document.querySelectorAll('section');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                });
                const currentNavLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (currentNavLink) {
                    currentNavLink.classList.add('active');
                    
                    // Google Analytics: Track section views
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'section_view', {
                            'section_name': entry.target.id,
                            'event_category': 'navigation'
                        });
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Animaciones de scroll
    const animateOnScroll = () => {
        const skillCards = document.querySelectorAll('.skill-category');
        const projectCards = document.querySelectorAll('.project-card');
        
        const animateElements = (elements) => {
            elements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    setTimeout(() => {
                        element.classList.add('animate');
                    }, index * 100);
                }
            });
        };

        animateElements(skillCards);
        animateElements(projectCards);
    };

    // Parallax sutil para el hero (solo si no está en mobile y no tiene reduced motion)
    const parallaxEffect = () => {
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }
    };

    // Header scroll effect
    const headerScrollEffect = () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(74, 101, 114, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--primary-color)';
            header.style.backdropFilter = 'none';
        }
    };

    // Añadir event listeners para scroll con throttling para mejor rendimiento
    let scrollTimer = null;
    const throttleScroll = () => {
        if (scrollTimer !== null) return;
        scrollTimer = setTimeout(() => {
            animateOnScroll();
            parallaxEffect();
            headerScrollEffect();
            scrollTimer = null;
        }, 16); // ~60fps
    };

    window.addEventListener('scroll', throttleScroll, { passive: true });

    // Ejecutar animaciones iniciales
    animateOnScroll();

    // Asegurar que los enlaces de proyectos funcionen correctamente
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir interferencias de otros eventos
            
            // Google Analytics: Track project clicks
            if (typeof gtag !== 'undefined') {
                const projectName = link.closest('.project-card').querySelector('h3').textContent;
                const linkType = link.classList.contains('btn-secondary') ? 'GitHub' : 'Live Demo';
                
                gtag('event', 'project_click', {
                    'project_name': projectName,
                    'link_type': linkType,
                    'event_category': 'engagement'
                });
            }
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('.social-links a, .github-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                const platform = link.href.includes('github') ? 'GitHub' : 
                               link.href.includes('linkedin') ? 'LinkedIn' : 'Social';
                
                gtag('event', 'social_click', {
                    'social_platform': platform,
                    'event_category': 'social_engagement'
                });
            }
        });
    });

    // Track contact clicks
    const contactLinks = document.querySelectorAll('.contact-item a');
    contactLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                const contactType = link.href.includes('mailto') ? 'Email' :
                                  link.href.includes('linkedin') ? 'LinkedIn' :
                                  link.href.includes('github') ? 'GitHub' : 'Contact';
                
                gtag('event', 'contact_click', {
                    'contact_method': contactType,
                    'event_category': 'contact'
                });
            }
        });
    });

    // Efecto de typing para el texto principal
    const highlightElement = document.querySelector('.highlight');
    if (highlightElement) {
        const text = highlightElement.textContent;
        highlightElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                highlightElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1500);
    }

    // Preloader simple
    const preloader = document.createElement('div');
    preloader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--background-color);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--secondary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
    `;
    
    document.body.appendChild(preloader);
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(preloader);
        }, 500);
    }, 1000);

    // Añadir CSS para la animación de loading
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});