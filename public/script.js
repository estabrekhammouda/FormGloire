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
const totalEasterEggs = 10;
let clickCount = 0;
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let unlockedEggs = new Set();

function incrementEasterEgg(id, message) {
    if (unlockedEggs.has(id)) return;   
    
    unlockedEggs.add(id);
    easterEggCount++;
    document.getElementById('eggCount').textContent = easterEggCount;
    document.getElementById('secretCounter').style.display = 'block';
    showEasterEggMessage(message);
    
    if (easterEggCount >= totalEasterEggs) {
        showEasterEggMessage('🏆 MAÎTRE DES SECRETS DÉBLOQUÉ ! 🏆');
        createMassiveFireworks();
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

// ===== EASTER EGG 1: Double clic sur le titre =====
document.getElementById('mainTitle').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 2) {
        incrementEasterEgg('egg1', '🎯 EASTER EGG 1 : Maître du Double-Clic !');
        document.getElementById('mainTitle').style.animation = 'none';
        setTimeout(() => {
            document.getElementById('mainTitle').style.animation = 'glitch 1s infinite';
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
        incrementEasterEgg('egg2', '🎮 EASTER EGG 2: Code Konami!');
        document.getElementById('konamiIndicator').style.display = 'block';
        document.body.style.animation = 'hue-rotate 3s infinite';
        setTimeout(() => {
            document.getElementById('konamiIndicator').style.display = 'none';
        }, 5000);
    }
});
        
// ===== EASTER EGG 3: Taper "matrix" dans le champ message =====
document.getElementById('message').addEventListener('input', (e) => {
    if (e.target.value.toLowerCase().includes('matrix') && !unlockedEggs.has('egg3')) {
        incrementEasterEgg('egg3', '🔮 EASTER EGG 3: Code Matrix Découvert !');
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
            incrementEasterEgg('egg4', '💎 EASTER EGG 4 : Maître des Coins !');
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

document.getElementById('email').addEventListener('focus', () => {
    if (!unlockedEggs.has('egg5')) {
        emailFocusTimer = setTimeout(() => {
            incrementEasterEgg('egg5', '⏰ EASTER EGG 5 : Patience Récompensée !');
            createFireworks();
        }, 10000);
    }
});

document.getElementById('email').addEventListener('blur', () => {
    clearTimeout(emailFocusTimer);
});

// ===== EASTER EGG 6: Taper "admin" dans le nom =====
document.getElementById('nom').addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value.includes('admin') && !unlockedEggs.has('egg6')) {
        incrementEasterEgg('egg6', '👑 EASTER EGG 6 : Admin détecté !');
        e.target.style.borderColor = 'gold';
        e.target.style.boxShadow = '0 0 20px gold';
    }
});

// ===== EASTER EGG 7: Taper "god" ou "dieu" dans le nom =====
document.getElementById('nom').addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    if ((value.includes('god') || value.includes('dieu')) && !unlockedEggs.has('egg7')) {
        incrementEasterEgg('egg7', '😱 EASTER EGG 7 : Complexe de Dieu !');
        e.target.style.borderColor = '#ffff00';
        e.target.style.boxShadow = '0 0 30px #ffff00';
    }
});

// ===== EASTER EGG 8: Email avec @yopmail.com =====
document.getElementById('email').addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value.includes('@yopmail.com') && !unlockedEggs.has('egg8')) {
        incrementEasterEgg('egg8', '🕵️ EASTER EGG 8 : Détective Yopmail !');
        e.target.style.borderColor = 'orange';
        e.target.style.boxShadow = '0 0 20px orange';
    }
});

// ===== EASTER EGG 9: Écrire plus de 100 caractères =====
document.getElementById('message').addEventListener('input', (e) => {
    const charCount = e.target.value.length;
    if (charCount > 100 && !unlockedEggs.has('egg9')) {
        incrementEasterEgg('egg9', '📖 EASTER EGG 9 : Mode Auteur !');
        e.target.style.borderColor = '#9b59b6';
        e.target.style.boxShadow = '0 0 20px #9b59b6';
    }
});

// ===== EASTER EGG 10: Taper "abracadabra" n'importe où =====
let magicWord = '';
document.addEventListener('keypress', (e) => {
    magicWord += e.key;
    if (magicWord.length > 12) magicWord = magicWord.slice(-12);
    
    if (magicWord.includes('abracadabra') && !unlockedEggs.has('egg10')) {
        incrementEasterEgg('egg10', '🪄 EASTER EGG 10 : Maître de la Magie !');
        createMagicEffect();
        magicWord = '';
    }
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

    // Afficher le modal de succès
    showSuccessModal();
    
    // Reset form après un délai
    setTimeout(() => {
        document.getElementById('contactForm').reset();
    }, 1000);
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

// ===== FIREWORKS EFFECTS (8 SECONDS) =====
function createFireworks() {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00'];
    const duration = 8000; 
    const startTime = Date.now();
    
    const fireworkInterval = setInterval(() => {
        if (Date.now() - startTime >= duration) {
            clearInterval(fireworkInterval);
            return;
        }
        
        for (let i = 0; i < 5; i++) {
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
        }
    }, 100);
}

function createMassiveFireworks() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFireworks();
        }, i * 2);
    }
}

function createMagicEffect() {
    const colors = ['#9b59b6', '#e74c3c', '#3498db', '#f39c12'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.width = '5px';
            particle.style.height = '5px';
            particle.style.borderRadius = '50%';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            document.body.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;
            
            const animate = () => {
                x += Math.cos(angle) * velocity;
                y += Math.sin(angle) * velocity;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.opacity = parseFloat(particle.style.opacity || 1) - 0.02;
                
                if (parseFloat(particle.style.opacity) > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            animate();
        }, i * 20);
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

// ===== ADD HUE-ROTATE ANIMATION =====
const style = document.createElement('style');
style.textContent = `
    @keyframes hue-rotate {
        from { filter: hue-rotate(0deg); }
        to { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);