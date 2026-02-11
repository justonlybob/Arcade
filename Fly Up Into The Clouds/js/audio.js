const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

export function playBeep(type = 'collect') {
    try {
        if (!audioCtx) audioCtx = new AudioCtx();
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g);
        g.connect(audioCtx.destination);
        if (type === 'collect') {
            o.frequency.value = 880;
            g.gain.value = 0.06;
            o.start();
            g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
            setTimeout(() => o.stop(), 140);
        } else if (type === 'death') {
            o.frequency.value = 160;
            g.gain.value = 0.08;
            o.start();
            g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
            setTimeout(() => o.stop(), 360);
        }
    } catch (e) {
        // ignore if audio blocked
    }
}