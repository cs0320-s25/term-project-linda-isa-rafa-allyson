import { useEffect, useState } from 'react';

class VoiceOverService {
  private static instance: VoiceOverService;
  private speechSynthesis: SpeechSynthesis;
  private isSpeaking: boolean = false;

  private constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }

  public static getInstance(): VoiceOverService {
    if (!VoiceOverService.instance) {
      VoiceOverService.instance = new VoiceOverService();
    }
    return VoiceOverService.instance;
  }

  public speak(text: string): void {
    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.isSpeaking = true;
    this.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      this.isSpeaking = false;
    };
  }

  public stop(): void {
    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const useVoiceOver = () => {
  const [voiceOver] = useState(() => VoiceOverService.getInstance());

  useEffect(() => {
    return () => {
      voiceOver.stop();
    };
  }, [voiceOver]);

  return voiceOver;
};

export default VoiceOverService; 