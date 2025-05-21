import { useEffect, useState } from 'react';

class VoiceOverService {
  private static instance: VoiceOverService;
  private static instanceCount = 0;
  private static methodCallCount = 0;
  private speechSynthesis: SpeechSynthesis;
  private isSpeaking: boolean = false;
  private currentUtterance: string = "";

  private constructor() {
    this.speechSynthesis = window.speechSynthesis;
  }

  public static getInstance(): VoiceOverService {
    if (!VoiceOverService.instance) {
      VoiceOverService.instance = new VoiceOverService();
      VoiceOverService.instanceCount++;
      console.log(`VoiceOverService instance created. Total instances: ${VoiceOverService.instanceCount}`);  
    } else {
      console.log(`Reusing existing VoiceOverService instance. Total instances: ${VoiceOverService.instanceCount}`);
    }
    return VoiceOverService.instance;
  }

  public static getInstanceCount(): number {
    return VoiceOverService.instanceCount;
  }

  public speak(text: string): void {
    VoiceOverService.methodCallCount++;
    console.log(`Speak method called ${VoiceOverService.methodCallCount} times. Text: "${text}"`);

    if (this.isSpeaking) {
      this.speechSynthesis.cancel();
    }

    this.currentUtterance = text;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.isSpeaking = true;
    this.speechSynthesis.speak(utterance);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = "";
    };
  }

  public getCurrentUtterance(): string {
    return this.currentUtterance;
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

  console.log(`VoiceOverService instance created. Total instances: ${VoiceOverService.getInstanceCount()}, Current utterance: ${voiceOver.getCurrentUtterance()}`);

  useEffect(() => {
    return () => {
      voiceOver.stop();
    };
  }, [voiceOver]);

  return voiceOver;
};

export default VoiceOverService; 