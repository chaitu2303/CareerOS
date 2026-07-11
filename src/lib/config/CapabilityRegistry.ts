export type CapabilityState = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' | 'DISABLED';

export class CapabilityRegistry {
  static getAiProviderStatus(): CapabilityState {
    if (process.env.OPENAI_API_KEY) return 'AVAILABLE';
    return 'UNAVAILABLE'; // By default, fail safely
  }

  static getCodeExecutionStatus(): CapabilityState {
    if (process.env.SECURE_CODE_EXECUTION === 'true') return 'AVAILABLE';
    return 'UNAVAILABLE';
  }

  static getEmailNotificationStatus(): CapabilityState {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) return 'AVAILABLE';
    return 'UNAVAILABLE'; // Only IN_APP will work
  }
  
  static getRealTimeVideoStatus(): CapabilityState {
    // We are definitely not integrating real-time emotion/gaze ML today.
    return 'DISABLED';
  }

  static getStatusReport() {
    return {
      ai: this.getAiProviderStatus(),
      code: this.getCodeExecutionStatus(),
      email: this.getEmailNotificationStatus(),
      video: this.getRealTimeVideoStatus()
    };
  }
}
