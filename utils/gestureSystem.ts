// ---------------------------------------------------------
// 1. DEFINITIONS
// ---------------------------------------------------------

// We define the interface here to ensure zero import errors.
export interface GestureConfig {
  animation: string; // The animation name in the viewer
  duration: number;  // How long the animation lasts
  cooldown: number;  // Time before another gesture can play
  description: string;
  emote: string;
}

// We extend the config to include the 'id' internally.
// This solves your "Property 'id' does not exist" error.
interface StoredGesture extends GestureConfig {
  id: string;
}

// ---------------------------------------------------------
// 2. MAIN CLASS
// ---------------------------------------------------------

export class GestureAnimationSystem {
  private viewer: any;
  private currentGesture: string | null = null;
  private gestureQueue: Array<{ id: string; options?: any }> = [];
  private isAnimating = false;
  
  // UPDATED: Usage of StoredGesture allows saving the ID inside the object
  private customGestures: Record<string, StoredGesture> = {};

  constructor(viewer: any) {
    this.viewer = viewer;
    this.setupDefaultGestures();
  }

  private setupDefaultGestures(): void {
    this.registerGesture('wave', {
      animation: 'wave',
      duration: 1200,
      cooldown: 500,
      description: 'Wave hand greeting',
      emote: '👋',
    });

    this.registerGesture('nod', {
      animation: 'nod',
      duration: 800,
      cooldown: 300,
      description: 'Nod head yes',
      emote: '🤝',
    });

    this.registerGesture('thumbsup', {
      animation: 'thumbsup',
      duration: 1000,
      cooldown: 400,
      description: 'Thumbs up approval',
      emote: '👍',
    });

    this.registerGesture('idle', {
      animation: 'idle',
      duration: Infinity,
      cooldown: 0,
      description: 'Idle stance',
      emote: '😌',
    });
  }

  public registerGesture(id: string, config: GestureConfig): void {
    // FIXED: This now works because customGestures expects 'StoredGesture' (which has an id)
    this.customGestures[id] = { id, ...config };
  }

  public async playGesture(
    id: string,
    options: { queue?: boolean } = {}
  ): Promise<void> {
    const gesture = this.customGestures[id];
    
    if (!gesture) {
      console.warn(`Gesture '${id}' not found`);
      return;
    }

    if (this.isAnimating && !options.queue) {
      return;
    }

    if (options.queue) {
      this.gestureQueue.push({ id, options });
      if (!this.isAnimating) {
        // Fire and forget the queue processor
        this.processQueue();
      }
      return;
    }

    this.isAnimating = true;
    this.currentGesture = id;

    if (gesture.animation && this.viewer) {
      try {
        this.viewer.playAnimation(gesture.animation);
      } catch (error) {
        console.error(`Failed to play animation: ${gesture.animation}`, error);
      }
    }

    await new Promise((resolve) =>
      setTimeout(resolve, gesture.duration)
    );

    this.isAnimating = false;

    if (this.gestureQueue.length > 0) {
      await this.processQueue();
    } else {
      // Return to idle if viewer exists
      if (this.viewer && this.viewer.playAnimation) {
        this.viewer.playAnimation('idle');
      }
      this.currentGesture = null;
    }
  }

  private async processQueue(): Promise<void> {
    // Check isAnimating to prevent double processing if called concurrently
    if (this.gestureQueue.length === 0) return;

    const nextItem = this.gestureQueue.shift();
    if (nextItem) {
      const { id, options } = nextItem;
      await this.playGesture(id, { ...options, queue: false });
    }
  }

  public listGestures(): Array<{ id: string; name: string; emote: string }> {
    return Object.values(this.customGestures).map((g) => ({
      // We can now safely use g.id because StoredGesture ensures it exists
      id: g.id, 
      name: g.description,
      emote: g.emote,
    }));
  }

  public getCurrentGesture(): string | null {
    return this.currentGesture;
  }

  public isCurrentlyAnimating(): boolean {
    return this.isAnimating;
  }
}