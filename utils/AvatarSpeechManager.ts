// utils/AvatarSpeechManager.ts
import * as Speech from 'expo-speech';

export interface SpeechConfig {
  voice?: string;
  language?: string;
  pitch?: number;
  rate?: number;
}

export interface VisemeData {
  viseme: string;
  time: number;
}

class AvatarSpeechManager {
  private isSpeaking: boolean = false;
  private currentAudio: any = null;
  private speechQueue: Array<{ text: string; config?: SpeechConfig }> = [];
  private onVisemeCallback?: (viseme: string) => void;
  private onSpeechEndCallback?: () => void;

  /**
   * Speak text with the avatar
   */
  async speak(text: string, config?: SpeechConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isSpeaking) {
        this.speechQueue.push({ text, config });
        return resolve();
      }

      this.isSpeaking = true;

      const options: any = {
        language: config?.language || 'en-US',
        pitch: config?.pitch || 1.0,
        rate: config?.rate || 0.9,
        voice: config?.voice,
        onStart: () => {
          this.startVisemeAnimation(text);
        },
        onDone: () => {
          this.isSpeaking = false;
          this.stopVisemeAnimation();
          
          if (this.onSpeechEndCallback) {
            this.onSpeechEndCallback();
          }

          // Process queue
          if (this.speechQueue.length > 0) {
            const next = this.speechQueue.shift();
            if (next) {
              this.speak(next.text, next.config);
            }
          }
          resolve();
        },
        onError: (error: any) => {
          this.isSpeaking = false;
          this.stopVisemeAnimation();
          reject(error);
        },
      };

      Speech.speak(text, options);
    });
  }

  /**
   * Stop current speech
   */
  stop(): void {
    Speech.stop();
    this.isSpeaking = false;
    this.speechQueue = [];
    this.stopVisemeAnimation();
  }

  /**
   * Check if currently speaking
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Set callback for viseme/mouth shape changes
   */
  setOnViseme(callback: (viseme: string) => void): void {
    this.onVisemeCallback = callback;
  }

  /**
   * Set callback for when speech ends
   */
  setOnSpeechEnd(callback: () => void): void {
    this.onSpeechEndCallback = callback;
  }

  /**
   * Generate viseme (mouth shape) data from text
   * Simplified phoneme-to-viseme mapping
   */
  private generateVisemeSequence(text: string): VisemeData[] {
    const words = text.toLowerCase().split(' ');
    const visemes: VisemeData[] = [];
    let currentTime = 0;
    const avgWordDuration = 0.4; // seconds per word

    words.forEach((word) => {
      const chars = word.split('');
      const charDuration = avgWordDuration / chars.length;

      chars.forEach((char) => {
        const viseme = this.charToViseme(char);
        visemes.push({ viseme, time: currentTime });
        currentTime += charDuration;
      });

      // Add neutral between words
      visemes.push({ viseme: 'neutral', time: currentTime });
      currentTime += 0.1;
    });

    return visemes;
  }

  /**
   * Map character to viseme/mouth shape
   */
  private charToViseme(char: string): string {
    const visemeMap: { [key: string]: string } = {
      a: 'aa',
      e: 'ee',
      i: 'ih',
      o: 'oh',
      u: 'ou',
      b: 'pp',
      p: 'pp',
      m: 'pp',
      f: 'ff',
      v: 'ff',
      t: 'th',
      d: 'th',
      s: 'ss',
      z: 'ss',
      l: 'll',
      r: 'rr',
      w: 'ww',
      y: 'ee',
    };

    return visemeMap[char] || 'neutral';
  }

  /**
   * Start animating mouth shapes during speech
   */
  private startVisemeAnimation(text: string): void {
    const visemeSequence = this.generateVisemeSequence(text);
    let index = 0;
    const startTime = Date.now();

    const animate = () => {
      if (!this.isSpeaking || index >= visemeSequence.length) {
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      const current = visemeSequence[index];

      if (elapsed >= current.time) {
        if (this.onVisemeCallback) {
          this.onVisemeCallback(current.viseme);
        }
        index++;
      }

      if (this.isSpeaking) {
        setTimeout(animate, 50); // Update every 50ms
      }
    };

    animate();
  }

  /**
   * Stop viseme animation
   */
  private stopVisemeAnimation(): void {
    if (this.onVisemeCallback) {
      this.onVisemeCallback('neutral');
    }
  }

  /**
   * Get available voices
   */
  async getAvailableVoices(): Promise<any[]> {
    try {
      return await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  /**
   * Queue multiple texts to speak in sequence
   */
  queueSpeak(texts: string[], config?: SpeechConfig): void {
    texts.forEach((text) => {
      this.speechQueue.push({ text, config });
    });

    if (!this.isSpeaking && this.speechQueue.length > 0) {
      const first = this.speechQueue.shift();
      if (first) {
        this.speak(first.text, first.config);
      }
    }
  }
}

export default new AvatarSpeechManager();