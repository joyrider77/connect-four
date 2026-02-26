// Simple sound effects using Web Audio API
class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
      document.addEventListener('touchstart', this.initAudioContext.bind(this), { once: true });
    }
  }

  private initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playDrop() {
    // Create a dropping sound effect
    this.createTone(800, 0.1, 'sine');
    setTimeout(() => this.createTone(400, 0.1, 'sine'), 100);
    setTimeout(() => this.createTone(200, 0.2, 'sine'), 200);
  }

  playWin() {
    // Create a winning fanfare
    const notes = [523, 659, 784, 1047]; // C, E, G, C (major chord)
    notes.forEach((note, index) => {
      setTimeout(() => this.createTone(note, 0.5, 'triangle'), index * 100);
    });
  }

  playDraw() {
    // Create a neutral draw sound
    this.createTone(440, 0.3, 'square');
    setTimeout(() => this.createTone(415, 0.3, 'square'), 150);
    setTimeout(() => this.createTone(392, 0.5, 'square'), 300);
  }
}

const soundEffects = new SoundEffects();

export function playSound(type: 'drop' | 'win' | 'draw') {
  try {
    switch (type) {
      case 'drop':
        soundEffects.playDrop();
        break;
      case 'win':
        soundEffects.playWin();
        break;
      case 'draw':
        soundEffects.playDraw();
        break;
    }
  } catch (error) {
    // Silently fail if audio is not supported
    console.warn('Audio playback failed:', error);
  }
}
