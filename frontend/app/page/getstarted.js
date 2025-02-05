class BouncingBallLoader {
    constructor() {
        this.loader = document.querySelector('.loader-wrapper');
        this.mainContent = document.querySelector('.main-content');
        this.ball = document.querySelector('.ball');
        this.trails = [];
        this.position = { x: 100, y: 100 };
        this.velocity = { x: 5, y: 3 };
        this.maxTrails = 20;

        this.createStars();
        this.init();
        this.animate();
    }

    createStars() {
        const starsContainer = document.querySelector('.stars');
        const starCount = 100;

        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';    
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.width = `${Math.random() * 3}px`;
            star.style.height = star.style.width;
            star.style.setProperty('--duration', `${Math.random() * 3 + 1}s`);
            starsContainer.appendChild(star);
        }
    }

    createTrail() {
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${this.position.x}px`;
        trail.style.top = `${this.position.y}px`;
        this.loader.appendChild(trail);
        this.trails.push({
            element: trail,
            opacity: 1
        });

        if (this.trails.length > this.maxTrails) {
            const oldestTrail = this.trails.shift();
            oldestTrail.element.remove();
        }
    }

    updateTrails() {
        this.trails.forEach(trail => {
            trail.opacity -= 0.05;
            trail.element.style.opacity = trail.opacity;
            if (trail.opacity <= 0) {
                trail.element.remove();
            }
        });
        this.trails = this.trails.filter(trail => trail.opacity > 0);
    }

    animate() {
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Bounce off walls
        if (this.position.x <= 0 || this.position.x >= window.innerWidth - 10) {
            this.velocity.x *= -1;
        }
        if (this.position.y <= 0 || this.position.y >= window.innerHeight - 10) {
            this.velocity.y *= -1;
        }

        // Update ball position
        this.ball.style.left = `${this.position.x}px`;
        this.ball.style.top = `${this.position.y}px`;

        // Create and update trails
        this.createTrail();
        this.updateTrails();

        requestAnimationFrame(() => this.animate());
    }

    init() {
        // Show main content after 3 seconds
        setTimeout(() => {
            this.complete();
        }, 3000);
    }

    complete() {
        this.loader.classList.add('fade-out');
        this.mainContent.classList.add('visible');
        
        setTimeout(() => {
            this.loader.remove();
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new BouncingBallLoader();
});

class TypingAnimation {
    constructor(element, text, options = {}) {
        if (!element) throw new Error("TypingAnimation: Element is required.");
        this.element = element;
        this.text = text || "";
        this.charIndex = 0;
        this.options = {
            typeSpeed: options.typeSpeed || 100,
            cursor: options.cursor ?? true,
            cursorChar: options.cursorChar || '|',
            cursorBlinkSpeed: options.cursorBlinkSpeed || 0.7,
            onComplete: options.onComplete || null,
        };

        this.init();
    }

    init() {
        if (this.options.cursor) {
            const style = document.createElement('style');
            style.textContent = `
                .typing-cursor::after {
                    content: '${this.options.cursorChar}';
                    animation: cursorBlink ${this.options.cursorBlinkSpeed}s infinite;
                }
                @keyframes cursorBlink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            this.element.classList.add('typing-cursor');
        }
    }

    start() {
        this.type();
    }

    type() {
        if (this.charIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.charIndex);
            this.charIndex++;
            setTimeout(() => this.type(), this.options.typeSpeed);
        } else if (typeof this.options.onComplete === "function") {
            this.options.onComplete();
        }
    }

    reset() {
        this.charIndex = 0;
        this.element.textContent = '';
    }

    updateText(newText) {
        this.reset();
        this.text = newText;
        this.start();
    }
}

class getstartedPage extends HTMLElement {
    constructor() {
        super();
        this.typingAnimation = null;
    }

    static get styles() {
        return `
            <style>
            .nav-bar {
                display :none;
            }
            body{
                overflow-x :hidden;
            }
            .content-gsp {
                width: 100%;
                height: 50vh;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                padding: 20px;
            }
            body::-webkit-scrollbar {
                width: 6px; /* Narrow scrollbar for a mobile-like feel */
            }
    
            body::-webkit-scrollbar-thumb {
                background: var(--red); /* Thumb color */
                border-radius: 10px; /* Rounded thumb for a smooth look */
            }
    
            body::-webkit-scrollbar-thumb:hover {
                background: #fff; /* Darker color on hover */
            }
    
            body::-webkit-scrollbar-track {
                background: transparent; /* Transparent track for minimalistic style */
            }
            .titlehome {
                color: #333;
                font-size: 5vw;
                margin: 0;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 1);
            }
    
            .typing-text::after {
                content: '|';
                animation: blink 0.7s infinite;
            }
    
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
    
            .titlehome2 {
                color: var(--red);
                font-size: 2rem;
                margin: 0;
                text-shadow: 2px 2px 5px rgba(0, 0, 0, 1);
            }
    
            .firstpage-para {
                width: 60vw;
                text-align: center;
                font-size: 1rem;
                margin: 20px 0;
            }
    
            .btn-home {
                background: var(--red);
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background 0.3s;
                animation: pulse 2s infinite ease-in-out, pulseColor 2s infinite ease-in-out; /* Infinite pulse */
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }

            @keyframes pulseColor {
                0% {
                    background: var(--red);
                }
                50% {
                    background: var(--red);
                }
                100% {
                    background: var(--red);
                }
            }

            .page-2 {
                width: 100%;
                padding: 40px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
    
            .team {
                width: 90%;
                max-width: 1200px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                gap: 30px;
                margin-top: 30px;
            }
    
            .cartTeam {
                width: 250px;
                height: 332px;
                background: #fafafa;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                box-shadow: 2px 5px 5px black;
            }
    
            .img-team {
                width: 92%;
                height: 70%;
                border-radius: 5px;
                overflow: hidden;
                background: #ddd;
            }
            .img-team img{
                width :100%;
                height :100%;
            }
            .nameTeam {
                width: 75%;
                margin-top: -20px;
                background: var(--red);
                border-radius: 10px;
                padding: 10px;
                text-align: center;
                color: white;
                box-shadow: 2px 3px 3px #222834;
            }
    
            .iconTeam {
                margin-top: 10px;
                display: flex;
                gap: 10px;
            }
    
            .iconTeam img {
                width: 30px;
                height: 30px;
            }
    
            @media (max-width: 1024px) {
                .titlehome {
                    font-size: 7vw;
                }
                .firstpage-para {
                    width: 90vw;
                }
            }
            </style>
        `;
    }

    static get template() {
        return `
            <div class="loader-wrapper">
                <div class="stars"></div>
                <div class="ball"></div>
            </div>
            <div class="content-gsp">
                <h1 class="titlehome fw-bold" style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 1);"></h1>
                <h1 class="fw-bold titlehome2" style="text-shadow: 2px 2px 5px rgba(0, 0, 0, 1); font-size:2rem;">
                    The galaxy's future.
                </h1>
                <br>
                <p class="firstpage-para fw-bold" style="font-size:1rem;">
                    In a distant galaxy, peace hinges on the Grand Galactic Tournament of zero-gravity ping pong. 
                    The Zephron Empire aims to dominate.
                </p>
                <br>
                <a href="/login" class="btn-home btn btn-secondary mb-5" data-link>Get started</a>
            </div>
            <div class="page-2">
            <h1 style="color: #333;"><span style="color: var(--red);">Team</span> Members</h1>
            <div class="team">
                <!-- Team members will be inserted here by JavaScript -->
            </div>
        </div>
        `;
    }

    initializeTypingAnimation() {
        const titleElement = this.querySelector('.titlehome');
        if (titleElement) {
            this.typingAnimation = new TypingAnimation(titleElement, "Pong to determine", {
                typeSpeed: 100,
                cursor: true,
                cursorChar: '|',
                cursorBlinkSpeed: 0.7,
                onComplete: () => {
                    console.log('Typing animation completed');
                },
            });
            this.typingAnimation.start();
        }
    }

    renderTeam() {
        const form = [
            { player: "ahbajaou", img: "/images/ah.jpg" },
            { player: "arahmoun", img: "/images/ara.png" },
            { player: "himejjad", img: "/images/him.jpeg" },
            { player: "iantar", img: "/images/iantar.jpeg" }
        ];

        const teamCart = this.querySelector('.team');
        if (teamCart) {
            form.forEach(({ player, img }) => {
                teamCart.innerHTML += `
                    <div class="cartTeam">
                        <div class="img-team">
                            <img src=${img} alt="${player}">
                        </div>
                        <div class="nameTeam">
                            <h4>${player}</h4>
                        </div>
                        <div class="iconTeam">
                            <img src="/images/icon/linkedin.png" alt="LinkedIn">
                            <img src="/images/icon/github.png" alt="GitHub">
                        </div>
                    </div>
                `;
            });
        }
    }

    render() {
        this.innerHTML = `
            ${getstartedPage.styles}
            ${getstartedPage.template}
        `;
        this.initializeTypingAnimation();
        this.renderTeam();
    }

    connectedCallback() {
        console.log("getstartedPage connected");
        this.render();
    }

    disconnectedCallback() {
        console.log("getstartedPage disconnected");
        this.typingAnimation = null;
    }
}

customElements.define('getstarted-page', getstartedPage);
