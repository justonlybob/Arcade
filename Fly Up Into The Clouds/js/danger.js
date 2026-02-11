export class Danger {
    constructor(gameContainer, getCameraOffset, maxWidth = 400) {
        this.getCameraOffset = getCameraOffset;
        this.x = Math.random() * (maxWidth - 50);
        this.y = this.getCameraOffset() - Math.random() * 400 - 60;
        this.width = 50;
        this.height = 50;
        this.element = document.createElement('div');
        this.element.className = 'danger';
        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
        gameContainer.appendChild(this.element);
    }

    update(maxWidth = 400) {
        // fall straight down, no horizontal drift
        this.y += 2.2;
        // Clamp x within bounds
        this.x = Math.max(0, Math.min(this.x, maxWidth - 50));
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
    }

    remove() {
        this.element.style.transition = 'opacity 220ms ease, transform 220ms ease';
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(8px)';
        setTimeout(() => this.element.remove(), 240);
    }
}
