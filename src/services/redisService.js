import { createClient } from 'redis';

class RedisService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect() {
    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: { reconnectStrategy: (retries) => Math.min(retries * 500, 10000) }
      });

      let errorLogged = false;
      this.client.on('error', (err) => {
        this.connected = false;
        if (!errorLogged) {
          console.warn('[Redis] Unavailable — caching disabled. Start Redis to enable it.');
          errorLogged = true;
        }
      });

      this.client.on('connect', () => {
        console.log('[Redis] Connected — caching enabled');
        this.connected = true;
        errorLogged = false;
      });

      this.client.on('end', () => {
        this.connected = false;
      });

      await this.client.connect();
    } catch (err) {
      console.warn('[Redis] Failed to connect — caching disabled:', err.message);
      this.connected = false;
    }
  }

  async get(key) {
    if (!this.connected) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async setex(key, ttl, value) {
    if (!this.connected) return;
    try {
      await this.client.setEx(key, ttl, value);
    } catch {
      // silently skip — caching is best-effort
    }
  }

  async del(key) {
    if (!this.connected) return;
    try {
      await this.client.del(key);
    } catch {}
  }

  async flushByPattern(pattern) {
    if (!this.connected) return 0;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) await this.client.del(keys);
      return keys.length;
    } catch {
      return 0;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new RedisService();
