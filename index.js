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
            
            // Animate hamburger to X (optional enhancement)
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

    // --- Before/After Slider Logic ---
    const tireSlider = document.getElementById('tire-slider');
    const foregroundImg = document.getElementById('foregroundImg');
    const sliderButton = document.getElementById('sliderBtn');

    if (tireSlider && foregroundImg && sliderButton) {
        tireSlider.addEventListener('input', (e) => {
            const sliderPos = e.target.value;
            // Update clip-path to reveal/hide image (reveals from left to right)
            foregroundImg.style.clipPath = `inset(0 ${100 - sliderPos}% 0 0)`;
            // Update button position
            sliderButton.style.left = `${sliderPos}%`;
        });
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

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const pointLight = new THREE.PointLight(0x2e7d32, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(-5, 5, 2);
        scene.add(spotLight);

        // Tire Geometry (Torus)
        const geometry = new THREE.TorusGeometry(3, 1.2, 32, 100);
        
        // Textures
        const textureLoader = new THREE.TextureLoader();
        const wornTexture = textureLoader.load('hero_tire_industrial_1776526957664.png');
        const newTexture = textureLoader.load('hero_tire_industrial_1776526957664.png');

        wornTexture.wrapS = THREE.RepeatWrapping;
        wornTexture.wrapT = THREE.RepeatWrapping;
        wornTexture.repeat.set(4, 1);

        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.wrapT = THREE.RepeatWrapping;
        newTexture.repeat.set(4, 1);

        // Materials
        const wornMaterial = new THREE.MeshStandardMaterial({ 
            map: wornTexture,
            roughness: 0.8,
            metalness: 0.2
        });

        const newMaterial = new THREE.MeshStandardMaterial({ 
            map: newTexture,
            roughness: 0.5,
            metalness: 0.3,
            transparent: true,
            opacity: 0
        });

        // Meshes
        const tireWorn = new THREE.Mesh(geometry, wornMaterial);
        const tireNew = new THREE.Mesh(geometry, newMaterial);
        
        const tireGroup = new THREE.Group();
        tireGroup.add(tireWorn);
        tireGroup.add(tireNew);
        scene.add(tireGroup);

        camera.position.z = 10;

        // Animation / Scroll Logic
        function animate() {
            requestAnimationFrame(animate);
            
            // Subtle constant rotation
            tireGroup.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        animate();

        // Scroll linked animation
        window.addEventListener('scroll', () => {
            const section = document.getElementById('experience-3d');
            const rect = section.getBoundingClientRect();
            const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Rotate based on scroll
                tireGroup.rotation.x = scrollPercent * Math.PI * 2;
                tireGroup.rotation.z = scrollPercent * Math.PI;
                
                // Blend textures
                // As we scroll through the section, the "new" texture becomes visible
                const blendFactor = Math.max(0, Math.min(1, (scrollPercent - 0.2) * 2));
                newMaterial.opacity = blendFactor;
            }
        });

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = threeContainer.clientWidth / threeContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(threeContainer.clientWidth, threeContainer.clientHeight);
        });
    }

    // --- Scroll Progress Tire Logic ---
    const scrollTire = document.getElementById('scrollTire');
    const tireTrack = document.getElementById('tireTrack');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollTire && tireTrack) {
            // Update track height
            tireTrack.style.height = scrolled + "%";
            // Update tire position
            scrollTire.style.top = scrolled + "%";
            // Rotate tire (faster rotation for dynamic feel)
            scrollTire.style.transform = `translate(-50%, -50%) rotate(${winScroll * 0.8}deg)`;

            // Transition from worn (gray) to recapado (green)
            if (scrolled > 85) {
                scrollTire.classList.add('recapado');
                scrollTire.style.filter = "none";
            } else {
                scrollTire.classList.remove('recapado');
                // More dramatic transition: very dark and blurry at top, clear at bottom
                const gray = Math.min(100, 120 - scrolled);
                const blur = Math.max(0, 2 - scrolled / 40);
                scrollTire.style.filter = `grayscale(${gray}%) blur(${blur}px) brightness(${0.4 + scrolled/150})`;
            }
        }
    });
});
