// utils/AvatarSessionManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@avatar_session';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface AvatarSession {
  avatarId: number;
  modelUrl: string;
  profile: any;
  timestamp: number;
  preloadedHtml?: string;
}

class AvatarSessionManager {
  private static instance: AvatarSessionManager;
  private currentSession: AvatarSession | null = null;
  private htmlCache: Map<number, string> = new Map();
  private modelCache: Map<string, any> = new Map();
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): AvatarSessionManager {
    if (!AvatarSessionManager.instance) {
      AvatarSessionManager.instance = new AvatarSessionManager();
    }
    return AvatarSessionManager.instance;
  }

  /**
   * Initialize the session manager - call this on app startup
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const session: AvatarSession = JSON.parse(stored);
        
        // Check if session is still valid
        if (Date.now() - session.timestamp < CACHE_EXPIRY) {
          this.currentSession = session;
          
          // Preload HTML into memory cache
          if (session.preloadedHtml) {
            this.htmlCache.set(session.avatarId, session.preloadedHtml);
          }
        } else {
          // Session expired, clear it
          await AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize avatar session:', error);
      this.isInitialized = true;
    }
  }

  /**
   * Save the current avatar session
   */
  async saveSession(
    avatarId: number,
    modelUrl: string,
    profile: any,
    preloadedHtml?: string
  ): Promise<void> {
    const session: AvatarSession = {
      avatarId,
      modelUrl,
      profile,
      timestamp: Date.now(),
      preloadedHtml,
    };

    this.currentSession = session;
    
    // Cache the HTML in memory
    if (preloadedHtml) {
      this.htmlCache.set(avatarId, preloadedHtml);
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save avatar session:', error);
    }
  }

  /**
   * Get the current session
   */
  getSession(): AvatarSession | null {
    return this.currentSession;
  }

  /**
   * Check if a session exists
   */
  hasSession(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Get cached HTML for an avatar
   */
  getCachedHtml(avatarId: number): string | undefined {
    return this.htmlCache.get(avatarId);
  }

  /**
   * Cache HTML for quick access
   */
  cacheHtml(avatarId: number, html: string): void {
    this.htmlCache.set(avatarId, html);
  }

  /**
   * Clear the current session
   */
  async clearSession(): Promise<void> {
    this.currentSession = null;
    this.htmlCache.clear();
    this.modelCache.clear();
    
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear avatar session:', error);
    }
  }

  /**
   * Update session without full save (for quick updates)
   */
  updateSessionInMemory(updates: Partial<AvatarSession>): void {
    if (this.currentSession) {
      this.currentSession = {
        ...this.currentSession,
        ...updates,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Preload model data into cache
   */
  cacheModelData(modelUrl: string, data: any): void {
    this.modelCache.set(modelUrl, data);
  }

  /**
   * Get cached model data
   */
  getCachedModelData(modelUrl: string): any | undefined {
    return this.modelCache.get(modelUrl);
  }

  /**
   * Get session age in milliseconds
   */
  getSessionAge(): number {
    if (!this.currentSession) return Infinity;
    return Date.now() - this.currentSession.timestamp;
  }

  /**
   * Check if session is fresh (less than 1 hour old)
   */
  isSessionFresh(): boolean {
    return this.getSessionAge() < 60 * 60 * 1000; // 1 hour
  }
}

export default AvatarSessionManager.getInstance();