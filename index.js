document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        });
    });

    // Scroll Reveal Animation with Staggering
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Trigger counter animation if it's the stats section
                if (entry.target.classList.contains('stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Animated Counters Logic
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            counter.classList.add('animated');
            
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + (target > 10 ? '+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + (target > 10 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Enviando...';
            btn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                btn.style.backgroundColor = 'var(--primary)';
                btn.style.color = '#020617';
                btn.innerText = 'Mensagem Enviada!';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }

    // Smooth Scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Carousel Logic
    const carouselItems = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let autoPlayInterval;

    function showSlide(index) {
        carouselItems.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (carouselItems[index]) carouselItems[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselItems.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentSlide);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetAutoPlay();
        });
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // 5 seconds
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (carouselItems.length > 0) {
        startAutoPlay();
    }

    // --- Three.js 3D Experience Logic ---
    const threeContainer = document.getElementById('three-container');
    if (threeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, threeContainer.clientWidth / threeContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        threeContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x22c55e, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const blueLight = new THREE.PointLight(0x1e40af, 1);
        blueLight.position.set(-5, -5, 5);
        scene.add(blueLight);

        const geometry = new THREE.SphereGeometry(3.5, 64, 64);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x22c55e,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
            emissive: 0x16a34a,
            emissiveIntensity: 0.5
        });

        const innerGeometry = new THREE.SphereGeometry(3.4, 32, 32);
        const innerMaterial = new THREE.MeshStandardMaterial({
            color: 0x020617,
            transparent: true,
            opacity: 0.4
        });

        const globe = new THREE.Mesh(geometry, material);
        const innerGlobe = new THREE.Mesh(innerGeometry, innerMaterial);
        
        const globeGroup = new THREE.Group();
        globeGroup.add(globe);
        globeGroup.add(innerGlobe);
        scene.add(globeGroup);

        for(let i = 0; i < 30; i++) {
            const dotGeom = new THREE.SphereGeometry(0.06, 8, 8);
            const dotMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
            const dot = new THREE.Mesh(dotGeom, dotMat);
            const phi = Math.acos(-1 + (2 * i) / 30);
            const theta = Math.sqrt(30 * Math.PI) * phi;
            dot.position.setFromSphericalCoords(3.5, phi, theta);
            globeGroup.add(dot);
        }

        camera.position.z = 10;

        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) - 0.5;
            mouseY = (e.clientY / window.innerHeight) - 0.5;
        });

        function animate() {
            requestAnimationFrame(animate);
            globeGroup.rotation.y += 0.003;
            globeGroup.rotation.y += mouseX * 0.03;
            globeGroup.rotation.x += mouseY * 0.03;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
        });
    }

    // --- Scroll Progress Indicator Logic ---
    const scrollIndicator = document.getElementById('scrollTire');
    const track = document.getElementById('tireTrack');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollIndicator && track) {
            track.style.height = scrolled + "%";
            scrollIndicator.style.top = scrolled + "%";
            
            // Subtle pulse based on scroll
            const scale = 1 + Math.sin(winScroll * 0.05) * 0.1;
            scrollIndicator.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
    });
});

