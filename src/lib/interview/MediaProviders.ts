// Media abstractions for Milestone 11

export interface MediaDeviceStatus {
  hasCamera: boolean;
  hasMicrophone: boolean;
  cameraGranted: boolean;
  micGranted: boolean;
}

export class MediaDeviceManager {
  static async checkPermissions(): Promise<MediaDeviceStatus> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return { hasCamera: false, hasMicrophone: false, cameraGranted: false, micGranted: false };
    }

    try {
      // In a real browser this triggers the permission prompt.
      // We wrap it securely to fail gracefully.
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(d => d.kind === 'videoinput');
      const hasMicrophone = devices.some(d => d.kind === 'audioinput');

      let cameraGranted = false;
      let micGranted = false;

      // Note: for production we would use navigator.permissions API where supported, 
      // but enumerateDevices reveals labels only if granted.
      const hasLabels = devices.some(d => d.label !== '');
      if (hasLabels) {
        cameraGranted = hasCamera;
        micGranted = hasMicrophone;
      }

      return { hasCamera, hasMicrophone, cameraGranted, micGranted };
    } catch (e) {
      return { hasCamera: false, hasMicrophone: false, cameraGranted: false, micGranted: false };
    }
  }

  static async requestMedia(): Promise<MediaStream | null> {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (e) {
      console.warn("Media access denied or unavailable.");
      return null;
    }
  }
}

export class IntegrityEventEngine {
  private sessionId: string;
  private isStrict: boolean;
  
  constructor(sessionId: string, isStrict: boolean = false) {
    this.sessionId = sessionId;
    this.isStrict = isStrict;
  }

  public async logEvent(type: string, metadata: any = {}) {
    // Debouncing/batching logic would go here before sending to API
    try {
      await fetch('/api/interviews/integrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId, type, metadata })
      });
    } catch (error) {
      console.warn("Failed to log integrity event", error);
    }
  }

  public attachBrowserListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('blur', () => {
      this.logEvent('WINDOW_BLUR', { timestamp: new Date().toISOString() });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.logEvent('TAB_HIDDEN', { timestamp: new Date().toISOString() });
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.logEvent('FULLSCREEN_EXIT', { timestamp: new Date().toISOString() });
      }
    });

    document.addEventListener('copy', (e) => {
      this.logEvent('COPY_ATTEMPT', { timestamp: new Date().toISOString() });
    });

    document.addEventListener('paste', (e) => {
      this.logEvent('PASTE_ATTEMPT', { timestamp: new Date().toISOString() });
    });
  }
}
