export class Plane {
    constructor(gameContainer, getCameraOffset, maxWidth = 400) {
        this.getCameraOffset = getCameraOffset;
        this.x = Math.random() * (maxWidth - 60);
        this.y = this.getCameraOffset() - Math.random() * 400 - 100;
        this.width = 60;
        this.height = 40;
        this.speedX = (Math.random() - 0.5) * 1.5;  // Slower horizontal drift than dangers
        this.element = document.createElement('div');
        this.element.className = 'plane';
        // add a small propeller element for nicer visuals
        this.element.innerHTML = '<div class="plane-propeller" aria-hidden="true"></div>';
        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
        this.element.style.transition = 'transform 220ms ease, opacity 200ms ease';
        gameContainer.appendChild(this.element);
        this.propeller = this.element.querySelector('.plane-propeller');
    }

    update(maxWidth = 400) {
        // Fall down with slight horizontal drift
        this.y += 1.8;
        this.x += this.speedX;

        // Bounce off sides (keep within bounds)
        if (this.x < 0) { this.x = 0; this.speedX = Math.abs(this.speedX); }
        if (this.x > maxWidth - 60) { this.x = maxWidth - 60; this.speedX = -Math.abs(this.speedX); }

        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';

        // Visual tilt and bob for more life
        const tilt = this.speedX * 8;
        const bob = Math.sin(Date.now() / 350 + this.x) * 2;
        this.element.style.transform = `translateY(${bob}px) rotate(${tilt}deg)`;

        // Adjust propeller spin speed slightly based on horizontal speed
        if (this.propeller) {
            const dur = Math.max(0.12, 0.6 - Math.abs(this.speedX) * 0.2);
            this.propeller.style.animationDuration = `${dur}s`;
        }
    }

    remove() {
        this.element.style.transition = 'opacity 200ms ease, transform 200ms ease';
        this.element.style.opacity = '0';
        this.element.style.transform = 'scale(0.8) rotate(-15deg) translateY(10px)';
        setTimeout(() => this.element.remove(), 220);
    }
}
