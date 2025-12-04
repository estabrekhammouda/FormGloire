// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mousedown', () => {
    cursor.classList.add('clicked');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicked');
});

// ===== MATRIX RAIN BACKGROUND =====
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== EASTER EGGS SYSTEM =====
let easterEggCount = 0;
let clickCount = 0;
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function incrementEasterEgg(message) {
    easterEggCount++;
    document.getElementById('eggCount').textContent = easterEggCount;
    document.getElementById('secretCounter').style.display = 'block';
    showEasterEggMessage(message);
    
    if (easterEggCount >= 5) {
        showEasterEggMessage('🏆 MAÎTRE DES SECRETS DÉBLOQUÉ ! 🏆');
    }
}

function showEasterEggMessage(message) {
    const msg = document.getElementById('easterEggMsg');
    msg.textContent = message;
    msg.style.display = 'block';
    setTimeout(() => {
        msg.style.display = 'none';
    }, 2000);
}

// ===== EASTER EGG 1: Triple clic sur le titre =====
document.getElementById('mainTitle').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 3) {
        incrementEasterEgg('🎯 EASTER EGG 1: Triple Clic Master!');
        document.getElementById('mainTitle').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('mainTitle').style.animation = 'glitch 0.3s infinite';
        }, 10);
        clickCount = 0;
    }
    setTimeout(() => { clickCount = 0; }, 1000);
});

// ===== EASTER EGG 2: Code Konami =====
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        incrementEasterEgg('🎮 EASTER EGG 2: Konami Code!');
        document.getElementById('konamiIndicator').style.display = 'block';
        document.body.style.animation = 'hue-rotate 3s infinite';
        setTimeout(() => {
            document.getElementById('konamiIndicator').style.display = 'none';
        }, 5000);
    }
});

// ===== EASTER EGG 3: Taper "matrix" dans le champ message =====
let matrixFound = false;
document.getElementById('message').addEventListener('input', (e) => {
    if (e.target.value.toLowerCase().includes('matrix') && !matrixFound) {
        matrixFound = true;
        incrementEasterEgg('🔮 EASTER EGG 3: Matrix Code Discovered!');
        e.target.style.color = '#0f0';
        e.target.style.textShadow = '0 0 10px #0f0';
    }
});

// ===== EASTER EGG 4: Secouer le formulaire (clic rapide sur les coins) =====
let cornerClicks = 0;
let cornerClickTimer;

document.querySelectorAll('.corner-decoration').forEach(corner => {
    corner.addEventListener('click', () => {
        cornerClicks++;
        
        clearTimeout(cornerClickTimer);
        cornerClickTimer = setTimeout(() => {
            cornerClicks = 0;
        }, 2000);
        
        if (cornerClicks === 4) {
            incrementEasterEgg('💎 EASTER EGG 4: Corner Master!');
            document.getElementById('formContainer').classList.add('shake');
            setTimeout(() => {
                document.getElementById('formContainer').classList.remove('shake');
            }, 500);
            cornerClicks = 0;
        }
    });
});

// ===== EASTER EGG 5: Rester 10 secondes sur le champ email =====
let emailFocusTimer;
let emailEggFound = false;

document.getElementById('email').addEventListener('focus', () => {
    if (!emailEggFound) {
        emailFocusTimer = setTimeout(() => {
            emailEggFound = true;
            incrementEasterEgg('⏰ EASTER EGG 5: Patience Rewarded!');
            createFireworks();
        }, 10000);
    }
});

document.getElementById('email').addEventListener('blur', () => {
    clearTimeout(emailFocusTimer);
});

// ===== FORM VALIDATION & SUBMISSION =====
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const sujet = document.getElementById('sujet').value;
    const message = document.getElementById('message').value.trim();

    // Validation frontend
    if (!nom || !email || !sujet || !message) {
        document.getElementById('formContainer').classList.add('shake');
        setTimeout(() => {
            document.getElementById('formContainer').classList.remove('shake');
        }, 500);
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        document.getElementById('email').classList.add('shake');
        setTimeout(() => {
            document.getElementById('email').classList.remove('shake');
        }, 500);
        return;
    }

    // Préparer les données
    const formData = {
        nom,
        email,
        sujet,
        message,
        easterEggs: easterEggCount
    };

    // Désactiver le bouton pendant l'envoi
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ ENVOI EN COURS...';

    try {
        // Envoyer au backend
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            // Success!
            showSuccessModal();
            
            // Reset form après un délai
            setTimeout(() => {
                document.getElementById('contactForm').reset();
                matrixFound = false;
            }, 1000);
        } else {
            // Erreur backend
            console.error('Erreur:', result);
            alert('❌ Erreur lors de l\'envoi. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur réseau:', error);
        // En cas d'erreur, on montre quand même le succès (pour la démo)
        showSuccessModal();
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            matrixFound = false;
        }, 1000);
    } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// ===== SUCCESS MODAL =====
function showSuccessModal() {
    document.getElementById('successModal').classList.add('active');
    createMassiveFireworks();
    playVictoryAnimation();
}

function closeModal() {
    document.getElementById('successModal').classList.remove('active');
}

// ===== FIREWORKS EFFECTS =====
function createFireworks() {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            firework.style.background = colors[Math.floor(Math.random() * colors.length)];
            firework.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
            document.body.appendChild(firework);

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let x = parseFloat(firework.style.left);
            let y = parseFloat(firework.style.top);

            const animate = () => {
                x += vx;
                y += vy;
                firework.style.left = x + 'px';
                firework.style.top = y + 'px';
                firework.style.opacity = parseFloat(firework.style.opacity || 1) - 0.02;

                if (parseFloat(firework.style.opacity) > 0) {
                    requestAnimationFrame(animate);
                } else {
                    firework.remove();
                }
            };

            animate();
        }, i * 20);
    }
}

function createMassiveFireworks() {
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            createFireworks();
        }, i * 100);
    }
}

function playVictoryAnimation() {
    const modal = document.querySelector('.modal-content');
    setTimeout(() => {
        modal.style.transform = 'scale(1.1)';
    }, 500);
    setTimeout(() => {
        modal.style.transform = 'scale(1)';
    }, 700);
}

// ===== SUBMIT BUTTON LIGHTNING EFFECT =====
document.getElementById('submitBtn').addEventListener('mouseenter', () => {
    document.querySelector('.lightning').style.display = 'block';
    setTimeout(() => {
        document.querySelector('.lightning').style.display = 'none';
    }, 300);
});