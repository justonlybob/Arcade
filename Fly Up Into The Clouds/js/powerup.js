export class Powerup {
    constructor(gameContainer, getCameraOffset, type = 'shield') {
        this.type = type;
        this.getCameraOffset = getCameraOffset;
        this.x = Math.random() * 340;
        this.y = this.getCameraOffset() - Math.random() * 400 - 100;
        this.width = 40;
        this.height = 40;
        this.element = document.createElement('div');
        let className = 'powerup';
        if (type === 'destroyer') className = 'powerup powerup-destroyer';
        if (type === 'godmode') className = 'powerup powerup-godmode';
        this.element.className = className;
        this.element.style.left = this.x + 'px';
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
        gameContainer.appendChild(this.element);
    }

    update() {
        // gentle floating motion
        this.y += 0.5 + Math.sin(Date.now() / 400 + this.x) * 0.3;
        this.element.style.top = (this.y - this.getCameraOffset()) + 'px';
    }

    collect() {
        // quick burst animation
        this.element.style.transition = 'opacity 200ms ease, transform 200ms ease';
        this.element.style.opacity = '0';
        this.element.style.transform = 'scale(1.8) rotate(360deg)';
        setTimeout(() => this.element.remove(), 220);
    }

    remove() {
        this.element.style.transition = 'opacity 300ms ease';
        this.element.style.opacity = '0';
        setTimeout(() => this.element.remove(), 320);
    }
}
