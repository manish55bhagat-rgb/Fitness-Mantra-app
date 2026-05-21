class VoiceService {
  private audioContext: AudioContext | null = null;
  private isSpeaking = false;

  constructor() {
    // Client-side initialization only.
  }

  private async getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    return this.audioContext;
  }

  async speak(text: string) {
    if (this.isSpeaking) return;
    this.isSpeaking = true;

    try {
      const response = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate TTS on server");
      }

      const { audio } = await response.json();
      if (audio) {
        await this.playBase64Audio(audio);
      }
    } catch (error) {
      console.error("AI Voice failed, falling back to browser TTS:", error);
      this.fallbackSpeak(text);
    } finally {
      this.isSpeaking = false;
    }
  }

  private async playBase64Audio(base64: string) {
    const ctx = await this.getAudioContext();
    const binary = atob(base64);
    
    // Convert base64 to PCM (16-bit)
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    
    // Create Int16Array from the buffer (2 bytes per sample)
    const pcmData = new Int16Array(buffer);
    
    // Map to Float32 for Web Audio
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        float32Data[i] = pcmData[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    
    return new Promise((resolve) => {
      source.onended = resolve;
      source.start();
    });
  }

  private fallbackSpeak(text: string) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.8;
    synth.speak(utterance);
  }
}

export const voiceService = new VoiceService();
