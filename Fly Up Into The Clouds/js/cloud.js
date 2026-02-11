export class Cloud {
    constructor(gameContainer, getCameraOffset, maxWidth = 400) {
        this.getCameraOffset = getCameraOffset;
        this.x = Math.random() * (maxWidth - 60);
        this.y = this.getCameraOffset() - Math.random() * 300 - 80;
        // Random size between 0.7 and 1.5
        this.sizeMultiplier = 0.7 + Math.random() * 0.8;
        this.width = 60 * this.sizeMultiplier;
        this.height = 35 * this.sizeMultiplier;
        this.element = document.createElement('div');
        this.element.className = 'cloud';
        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        // Scale cloud SVG based on size
        this.element.style.transform = `scale(${this.sizeMultiplier})`;
        this.element.style.transformOrigin = '0 0';
        gameContainer.appendChild(this.element);
    }

    update() {
        this.y += 1 + Math.sin(Date.now() / 500 + this.x) * 0.2;
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
    }

    pop() {
        // quick pop animation for when the player collects the cloud
        this.element.style.transition = 'opacity 220ms ease, transform 220ms ease';
        this.element.style.opacity = '0';
        // slight random rotation for visual variety
        const angle = (Math.random() - 0.5) * 20;
        this.element.style.transform = `scale(1.4) rotate(${angle}deg)`;
        setTimeout(() => this.element.remove(), 240);
    }

    remove() {
        // smooth fade out then remove (used for pass-over despawn)
        this.element.style.transition = 'opacity 300ms ease, transform 300ms ease';
        this.element.style.opacity = '0';
        this.element.style.transform = 'scale(0.9)';
        setTimeout(() => this.element.remove(), 320);
    }
} 
