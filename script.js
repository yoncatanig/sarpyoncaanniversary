document.addEventListener('DOMContentLoaded', () => {
    createWinterBg();

    // Create falling winter background
    function createWinterBg() {
        const winterBg = document.getElementById('winter-bg');
        if (!winterBg) return;
        const particles = ['❄', '❅', '💙', '🤍', '✨']; // Winter mix
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const span = document.createElement('span');
            span.classList.add('winter-particle');
            span.innerText = particles[Math.floor(Math.random() * particles.length)];

            // Random positioning properties
            const left = Math.random() * 100;
            const duration = 5 + Math.random() * 10; // Slow fall 5-15s
            const delay = Math.random() * 10;
            const size = 10 + Math.random() * 20; // 10px-30px

            span.style.left = left + 'vw';
            span.style.animationDuration = duration + 's';
            span.style.animationDelay = '-' + delay + 's'; // Start immediately randomly
            span.style.fontSize = size + 'px';

            // Slight tint based on content
            if (span.innerText === '💙') {
                span.style.color = '#81d4fa'; // Light blue hearts
            } else if (span.innerText === '✨') {
                span.style.color = '#ffd54f';
            } else {
                span.style.color = '#fff';
            }

            winterBg.appendChild(span);
        }
    }
    const envelope = document.getElementById('envelope');
    const flap = document.querySelector('.flap');
    const mainHeart = document.getElementById('main-heart');
    const optionHearts = document.querySelectorAll('.option-heart');
    const pathsSvg = document.getElementById('paths-svg');
    const hedgehogContainer = document.getElementById('hedgehog-container');
    const albumOverlay = document.getElementById('album-overlay');
    const closeAlbumBtn = document.getElementById('close-album');

    let isOpen = false;

    // Positions for the 4 hearts relative to the center
    // We'll calculate these dynamically based on window size to ensure they fit
    const setHeartPositions = () => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = 250; // Distance from center

        // Angles for the 4 hearts (spread out upwards)
        const angles = [210, 330, 150, 30]; // Degrees: Top-Left, Top-Right, Far-Left, Far-Right roughly
        // Let's make them more symmetrical: -60, -30, 30, 60 degrees from top?
        // Let's do: Top-Left (-45), Top-Right (45), Far-Left (-75), Far-Right (75) relative to Up (-90)
        // So actual angles in standard circle (0 is Right, 90 is Down):
        // Heart 1: Top-Leftish -> 225 deg
        // Heart 2: Top-Rightish -> 315 deg
        // Let's just hardcode some nice offsets relative to center

        const positions = [
            { x: -200, y: -250 }, // 1
            { x: 200, y: -250 },  // 2
            { x: -350, y: -100 }, // 3
            { x: 350, y: -100 }   // 4
        ];

        optionHearts.forEach((heart, index) => {
            const pos = positions[index];
            // Set final position in CSS variables or directly
            // We want them to start at center and move here
            // But for the 'walking' logic, we need their absolute coordinates

            // Actually, let's position them using absolute left/top based on center + offset
            heart.style.left = (centerX + pos.x - 30) + 'px'; // -30 for half width
            heart.style.top = (centerY + pos.y - 27.5) + 'px'; // -27.5 for half height

            // Draw path from center to this heart
            const path = document.getElementById(`path-${index + 1}`);
            if (path) {
                const startX = centerX;
                const startY = centerY; // Center of envelope
                const endX = centerX + pos.x;
                const endY = centerY + pos.y;

                // Create a curved path
                const controlX = (startX + endX) / 2;
                const controlY = startY - 100; // Curve upwards

                path.setAttribute('d', `M${startX},${startY} Q${controlX},${controlY} ${endX},${endY}`);
            }
        });
    };

    setHeartPositions();
    window.addEventListener('resize', setHeartPositions);

    // Open Envelope Interaction
    mainHeart.addEventListener('click', () => {
        if (isOpen) return;
        isOpen = true;

        // 1. Animate Flap
        flap.classList.add('open');

        // 2. Hide Main Heart
        mainHeart.style.opacity = '0';
        setTimeout(() => {
            mainHeart.style.display = 'none';
        }, 500);

        // 3. Show Hearts and Paths after flap opens
        setTimeout(() => {
            optionHearts.forEach((heart, index) => {
                setTimeout(() => {
                    heart.style.opacity = '1';
                    heart.style.transform = 'scale(1)';
                }, index * 100);
            });

            // Show paths
            document.querySelectorAll('.path-line').forEach(path => {
                path.style.opacity = '0.5';
            });
        }, 600);
    });

    // Handle Heart Selection
    optionHearts.forEach(heart => {
        heart.addEventListener('click', (e) => {
            const targetId = heart.getAttribute('data-id');
            walkToHeart(heart, targetId);
        });
    });

    function walkToHeart(targetElement, id) {
        // 1. Show Hedgehog at center
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        hedgehogContainer.style.left = centerX + 'px';
        hedgehogContainer.style.top = centerY + 'px';
        hedgehogContainer.style.opacity = '1';

        // 2. Calculate target position
        const rect = targetElement.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;

        // 3. Calculate duration based on distance
        const dist = Math.hypot(targetX - centerX, targetY - centerY);
        const speed = 200; // pixels per second
        const duration = dist / speed;

        // 4. Animate
        hedgehogContainer.style.transition = `top ${duration}s linear, left ${duration}s linear`;

        // Small delay to ensure transition property is applied
        requestAnimationFrame(() => {
            hedgehogContainer.style.left = targetX + 'px';
            hedgehogContainer.style.top = targetY + 'px';
        });

        // 5. When arrived
        setTimeout(() => {
            // Show hearts around them
            showLoveExplosion(targetX, targetY - 40); // -40 to be above the heart center, near hedgehogs

            // Hide hedgehog after entering (slightly delayed so we see them meet)
            setTimeout(() => {
                // Open Album
                openAlbum(id);
                hedgehogContainer.style.opacity = '0';
            }, 1000); // Wait 1 second for the love effect

        }, duration * 1000);
    }

    function showLoveExplosion(x, y) {
        const particleCount = 15;
        const color = '#ff1744';

        for (let i = 0; i < particleCount; i++) {
            const heart = document.createElement('div');
            heart.classList.add('love-heart-particle');
            document.body.appendChild(heart);

            // Set initial position
            heart.style.left = x + 'px';
            heart.style.top = y + 'px';

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * distance + 'px';
            const ty = Math.sin(angle) * distance - 50 + 'px'; // Tend upwards

            // Set CSS variables for animation
            heart.style.setProperty('--tx', tx);
            heart.style.setProperty('--ty', ty);

            // Animate
            const animDuration = 1 + Math.random();
            heart.style.animation = `float-up-fade ${animDuration}s ease-out forwards`;

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, animDuration * 1000);
        }
    }

    function openAlbum(id) {
        // Map IDs to Years (Left to Right visually: 3, 1, 2, 4)
        const titles = {
            '3': '2021-2022',
            '1': '2022-2023',
            '2': '2023-2024',
            '4': '2024-2025'
        };

        // Define image ranges for each ID
        // Total 48 images, 12 per year
        const imageRanges = {
            '3': { start: 1, end: 12 },   // 2021-2022
            '1': { start: 13, end: 24 },  // 2022-2023
            '2': { start: 25, end: 36 },  // 2023-2024
            '4': { start: 37, end: 48 }   // 2024-2025
        };

        const title = titles[id] || "Anılarımız";
        const range = imageRanges[id] || { start: 1, end: 12 };

        console.log("Opening album for " + title);

        const h2 = albumOverlay.querySelector('h2');
        if (h2) {
            h2.innerText = title;
        }

        const photoGrid = albumOverlay.querySelector('.photo-grid');
        if (photoGrid) {
            photoGrid.innerHTML = ''; // Clear existing content

            for (let i = range.start; i <= range.end; i++) {
                const card = document.createElement('div');
                card.classList.add('photo-card');

                const img = document.createElement('img');
                // Use .jpg as the primary format (normalized by our python script)
                img.src = `images/${i}.jpg`;
                img.alt = `Fotoğraf ${i}`;

                // Fallback handling
                img.onerror = function () {
                    // If .jpg fails, try .png (in case conversion hasn't run or old dummy exists)
                    if (this.src.endsWith('.jpg')) {
                        this.src = `images/${i}.png`;
                    } else {
                        // If .png also fails, show placeholder
                        this.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.classList.add('photo-placeholder');
                        placeholder.innerText = `Fotoğraf ${i}`;
                        card.appendChild(placeholder);
                    }
                };

                card.appendChild(img);
                photoGrid.appendChild(card);
            }
        }

        albumOverlay.classList.remove('hidden');
    }

    closeAlbumBtn.addEventListener('click', () => {
        albumOverlay.classList.add('hidden');
        // Reset hedgehog?
        hedgehogContainer.style.transition = 'none';
        hedgehogContainer.style.opacity = '0';
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        hedgehogContainer.style.left = centerX + 'px';
        hedgehogContainer.style.top = centerY + 'px';
    });
});
