// Enhanced background music system with Safari compatibility
class BackgroundMusic {
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.3;
  private isMuted = false;
  private currentLoop: number | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isInitialized = false;
  private userInteracted = false;

  // More engaging chord progressions with stronger synthesizer character
  private readonly chordProgression = [
    // Em - C - G - D (vi-IV-I-V in G major)
    [164.81, 207.65, 246.94], // Em (E-G-B)
    [130.81, 164.81, 196.00], // C (C-E-G)
    [196.00, 246.94, 293.66], // G (G-B-D)
    [146.83, 185.00, 220.00], // D (D-F#-A)
  ];

  // More dynamic melody with synthesizer character
  private readonly melodyNotes = [
    659.25, // E5
    587.33, // D5
    523.25, // C5
    493.88, // B4
    440.00, // A4
    392.00, // G4
    349.23, // F#4
    329.63, // E4
  ];

  // Bass line for stronger foundation
  private readonly bassNotes = [
    82.41,  // E2
    65.41,  // C2
    98.00,  // G2
    73.42,  // D2
  ];

  // Arpeggio patterns for more engaging texture
  private readonly arpeggioPatterns = [
    [0, 2, 1, 2], // Em pattern
    [0, 1, 2, 1], // C pattern
    [0, 2, 1, 0], // G pattern
    [0, 1, 2, 0], // D pattern
  ];

  constructor() {
    // Safari-specific initialization
    if (typeof window !== 'undefined') {
      // Listen for multiple user interaction events for Safari compatibility
      const initEvents = ['click', 'touchstart', 'touchend', 'keydown'];
      const initHandler = () => {
        this.userInteracted = true;
        this.initAudioContext();
        initEvents.forEach(event => {
          document.removeEventListener(event, initHandler);
        });
      };
      
      initEvents.forEach(event => {
        document.addEventListener(event, initHandler, { once: true, passive: true });
      });

      // Safari-specific visibility change handling
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.isPlaying) {
          this.pause();
        } else if (!document.hidden && this.isPlaying) {
          this.resume();
        }
      });
    }
  }

  private initAudioContext() {
    if (!this.audioContext && this.userInteracted) {
      try {
        // Safari compatibility: Use webkitAudioContext if available
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        
        // Safari requires resuming the context after user interaction
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume().catch(console.warn);
        }
        
        this.masterGainNode = this.audioContext.createGain();
        this.masterGainNode.connect(this.audioContext.destination);
        this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioContext.currentTime);
        this.isInitialized = true;
      } catch (error) {
        console.warn('Failed to initialize audio context:', error);
      }
    }
  }

  private createSynthPad(frequency: number, startTime: number, duration: number): OscillatorNode | null {
    if (!this.audioContext || !this.masterGainNode || !this.isInitialized) return null;

    try {
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      const delay = this.audioContext.createDelay();
      const delayGain = this.audioContext.createGain();

      // Create rich synthesizer pad sound with detuned oscillators
      oscillator1.type = 'sawtooth';
      oscillator2.type = 'sawtooth';
      oscillator1.frequency.setValueAtTime(frequency, startTime);
      oscillator2.frequency.setValueAtTime(frequency, startTime);
      oscillator2.detune.setValueAtTime(7, startTime); // Slight detune for richness

      // Low-pass filter with resonance for classic synth sound
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, startTime);
      filter.Q.setValueAtTime(2, startTime);

      // Add subtle delay for depth
      delay.delayTime.setValueAtTime(0.15, startTime);
      delayGain.gain.setValueAtTime(0.2, startTime);

      // Connect audio graph
      oscillator1.connect(filter);
      oscillator2.connect(filter);
      filter.connect(gainNode);
      filter.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(gainNode);
      gainNode.connect(this.masterGainNode);

      // Dynamic envelope with filter modulation
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.8); // Slower attack
      gainNode.gain.setValueAtTime(0.25, startTime + duration - 1);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

      // Filter sweep for movement
      filter.frequency.setValueAtTime(800, startTime);
      filter.frequency.linearRampToValueAtTime(1400, startTime + duration * 0.3);
      filter.frequency.linearRampToValueAtTime(1000, startTime + duration);

      oscillator1.start(startTime);
      oscillator1.stop(startTime + duration);
      oscillator2.start(startTime);
      oscillator2.stop(startTime + duration);

      this.oscillators.push(oscillator1, oscillator2);
      this.gainNodes.push(gainNode);

      return oscillator1;
    } catch (error) {
      console.warn('Failed to create synth pad:', error);
      return null;
    }
  }

  private createSynthLead(frequency: number, startTime: number, duration: number): OscillatorNode | null {
    if (!this.audioContext || !this.masterGainNode || !this.isInitialized) return null;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();

      // Create bright lead synthesizer sound
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // High-pass filter for brightness
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(300, startTime);
      filter.Q.setValueAtTime(1, startTime);

      // LFO for vibrato
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5, startTime);
      lfoGain.gain.setValueAtTime(8, startTime);

      // Connect LFO to oscillator frequency for vibrato
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      // Connect audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGainNode);

      // Sharp attack and decay for lead sound
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.08, startTime + duration * 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
      lfo.start(startTime);
      lfo.stop(startTime + duration);

      this.oscillators.push(oscillator, lfo);
      this.gainNodes.push(gainNode);

      return oscillator;
    } catch (error) {
      console.warn('Failed to create synth lead:', error);
      return null;
    }
  }

  private createSynthBass(frequency: number, startTime: number, duration: number): OscillatorNode | null {
    if (!this.audioContext || !this.masterGainNode || !this.isInitialized) return null;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Create punchy bass synthesizer sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      // Low-pass filter for bass warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, startTime);
      filter.Q.setValueAtTime(3, startTime);

      // Connect audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGainNode);

      // Punchy envelope for bass
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.15, startTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);

      return oscillator;
    } catch (error) {
      console.warn('Failed to create synth bass:', error);
      return null;
    }
  }

  private createArpeggio(chord: number[], pattern: number[], startTime: number, chordDuration: number) {
    if (!this.audioContext || !this.masterGainNode || !this.isInitialized) return;

    const noteDuration = 0.4;
    const noteInterval = chordDuration / 8; // 8 notes per chord

    for (let i = 0; i < 8; i++) {
      const noteStartTime = startTime + (i * noteInterval);
      const patternIndex = pattern[i % pattern.length];
      const frequency = chord[patternIndex] * 2; // One octave higher

      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, noteStartTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(frequency * 2, noteStartTime);
        filter.Q.setValueAtTime(2, noteStartTime);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGainNode);

        // Bell-like envelope
        gainNode.gain.setValueAtTime(0, noteStartTime);
        gainNode.gain.linearRampToValueAtTime(0.08, noteStartTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, noteStartTime + noteDuration);

        oscillator.start(noteStartTime);
        oscillator.stop(noteStartTime + noteDuration);

        this.oscillators.push(oscillator);
        this.gainNodes.push(gainNode);
      } catch (error) {
        console.warn('Failed to create arpeggio note:', error);
      }
    }
  }

  private playMusicLoop() {
    if (!this.audioContext || !this.isPlaying || !this.isInitialized) return;

    // Safari: Ensure context is running
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(console.warn);
    }

    const currentTime = this.audioContext.currentTime;
    const chordDuration = 4; // 4 seconds per chord
    const totalLoopDuration = this.chordProgression.length * chordDuration;

    // Play chord progression with synthesizer pads
    this.chordProgression.forEach((chord, chordIndex) => {
      const chordStartTime = currentTime + (chordIndex * chordDuration);
      
      // Play chord as pad
      chord.forEach(frequency => {
        this.createSynthPad(frequency, chordStartTime, chordDuration);
      });

      // Play bass line
      const bassFreq = this.bassNotes[chordIndex];
      this.createSynthBass(bassFreq, chordStartTime, chordDuration * 0.8);

      // Play arpeggios
      const arpeggioPattern = this.arpeggioPatterns[chordIndex];
      this.createArpeggio(chord, arpeggioPattern, chordStartTime, chordDuration);

      // Play melody every other chord
      if (chordIndex % 2 === 0) {
        for (let i = 0; i < 2; i++) {
          const melodyStartTime = chordStartTime + (i * 2);
          const melodyNoteIndex = (chordIndex * 2 + i) % this.melodyNotes.length;
          const melodyNote = this.melodyNotes[melodyNoteIndex];
          this.createSynthLead(melodyNote, melodyStartTime, 1.5);
        }
      }
    });

    // Schedule next loop
    this.currentLoop = window.setTimeout(() => {
      if (this.isPlaying) {
        // Clean up old oscillators
        this.cleanupOscillators();
        this.playMusicLoop();
      }
    }, totalLoopDuration * 1000);
  }

  private cleanupOscillators() {
    // Clean up references to stopped oscillators
    this.oscillators = this.oscillators.filter(osc => {
      try {
        return osc.context.state !== 'closed';
      } catch {
        return false;
      }
    });
    this.gainNodes = this.gainNodes.filter(gain => {
      try {
        return gain.context.state !== 'closed';
      } catch {
        return false;
      }
    });
  }

  play() {
    if (!this.userInteracted) {
      console.warn('Cannot play audio without user interaction');
      return;
    }

    if (!this.isPlaying) {
      this.initAudioContext();
      if (!this.audioContext || !this.isInitialized) return;

      this.isPlaying = true;
      
      // Safari: Ensure context is running before playing
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          this.playMusicLoop();
        }).catch(console.warn);
      } else {
        this.playMusicLoop();
      }
    }
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      
      if (this.currentLoop) {
        clearTimeout(this.currentLoop);
        this.currentLoop = null;
      }

      // Stop all current oscillators gracefully
      this.oscillators.forEach(oscillator => {
        try {
          if (oscillator.context.state !== 'closed') {
            oscillator.stop();
          }
        } catch (e) {
          // Ignore errors when stopping already stopped oscillators
        }
      });

      this.oscillators = [];
      this.gainNodes = [];
    }
  }

  pause() {
    if (this.isPlaying && this.audioContext) {
      try {
        this.audioContext.suspend();
      } catch (error) {
        console.warn('Failed to pause audio context:', error);
      }
    }
  }

  resume() {
    if (this.isPlaying && this.audioContext && this.audioContext.state === 'suspended') {
      try {
        this.audioContext.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGainNode && !this.isMuted) {
      try {
        this.masterGainNode.gain.setValueAtTime(this.volume, this.audioContext?.currentTime || 0);
      } catch (error) {
        console.warn('Failed to set volume:', error);
      }
    }
  }

  getVolume(): number {
    return this.volume;
  }

  mute() {
    this.isMuted = true;
    if (this.masterGainNode) {
      try {
        this.masterGainNode.gain.setValueAtTime(0, this.audioContext?.currentTime || 0);
      } catch (error) {
        console.warn('Failed to mute:', error);
      }
    }
  }

  unmute() {
    this.isMuted = false;
    if (this.masterGainNode) {
      try {
        this.masterGainNode.gain.setValueAtTime(this.volume, this.audioContext?.currentTime || 0);
      } catch (error) {
        console.warn('Failed to unmute:', error);
      }
    }
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  isPlayingState(): boolean {
    return this.isPlaying;
  }
}

const backgroundMusic = new BackgroundMusic();

export function playBackgroundMusic() {
  try {
    backgroundMusic.play();
  } catch (error) {
    console.warn('Background music playback failed:', error);
  }
}

export function stopBackgroundMusic() {
  try {
    backgroundMusic.stop();
  } catch (error) {
    console.warn('Background music stop failed:', error);
  }
}

export function setMusicVolume(volume: number) {
  try {
    backgroundMusic.setVolume(volume);
  } catch (error) {
    console.warn('Background music volume change failed:', error);
  }
}

export function getMusicVolume(): number {
  return backgroundMusic.getVolume();
}

export function muteBackgroundMusic() {
  try {
    backgroundMusic.mute();
  } catch (error) {
    console.warn('Background music mute failed:', error);
  }
}

export function unmuteBackgroundMusic() {
  try {
    backgroundMusic.unmute();
  } catch (error) {
    console.warn('Background music unmute failed:', error);
  }
}

export function isMusicMuted(): boolean {
  return backgroundMusic.isMutedState();
}

export function isMusicPlaying(): boolean {
  return backgroundMusic.isPlayingState();
}
