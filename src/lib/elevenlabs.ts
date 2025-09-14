import { Voice } from '@/types';

// Custom endpoint configuration - no API keys required
const ELEVENLABS_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const HEADERS = {
  'customerId': 'cus_T39mlAKKBukUrf',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

// Available voices with detailed descriptions
export const AVAILABLE_VOICES: Voice[] = [
  {
    id: 'voice-male-professional-1',
    name: 'Marcus Professional',
    gender: 'male',
    accent: 'American',
    description: 'Clear, professional male voice perfect for business content',
    category: 'professional'
  },
  {
    id: 'voice-female-professional-1',
    name: 'Sarah Corporate',
    gender: 'female',
    accent: 'American',
    description: 'Confident, professional female voice ideal for presentations',
    category: 'professional'
  },
  {
    id: 'voice-male-casual-1',
    name: 'Jake Friendly',
    gender: 'male',
    accent: 'American',
    description: 'Warm, conversational male voice for casual content',
    category: 'casual'
  },
  {
    id: 'voice-female-casual-1',
    name: 'Emma Warm',
    gender: 'female',
    accent: 'American',
    description: 'Friendly, approachable female voice perfect for storytelling',
    category: 'casual'
  },
  {
    id: 'voice-male-british-1',
    name: 'Oliver British',
    gender: 'male',
    accent: 'British',
    description: 'Sophisticated British male voice with elegant pronunciation',
    category: 'professional'
  },
  {
    id: 'voice-female-british-1',
    name: 'Charlotte Elegant',
    gender: 'female',
    accent: 'British',
    description: 'Refined British female voice with crisp articulation',
    category: 'professional'
  },
  {
    id: 'voice-male-narrative-1',
    name: 'David Storyteller',
    gender: 'male',
    accent: 'American',
    description: 'Rich, engaging male voice perfect for audiobooks and narration',
    category: 'narrative'
  },
  {
    id: 'voice-female-narrative-1',
    name: 'Victoria Narrator',
    gender: 'female',
    accent: 'American',
    description: 'Captivating female voice ideal for storytelling and audiobooks',
    category: 'narrative'
  },
  {
    id: 'voice-male-news-1',
    name: 'Robert Anchor',
    gender: 'male',
    accent: 'American',
    description: 'Authoritative male voice perfect for news and announcements',
    category: 'specialized'
  },
  {
    id: 'voice-female-news-1',
    name: 'Michelle Broadcast',
    gender: 'female',
    accent: 'American',
    description: 'Professional female voice ideal for news broadcasting',
    category: 'specialized'
  }
];

// Generate a realistic MP3-like audio buffer for demonstration
function generateMockMP3Audio(text: string, voiceCharacteristics: any): ArrayBuffer {
  // Calculate duration based on text length (approximate 150 words per minute)
  const wordCount = text.split(' ').length;
  const durationSeconds = Math.max(2, (wordCount / 150) * 60);
  const sampleRate = 44100;
  const samples = Math.floor(durationSeconds * sampleRate);
  
  // Create a more realistic audio buffer size
  const bufferSize = samples * 2; // 16-bit audio
  const buffer = new ArrayBuffer(bufferSize + 44); // Add WAV header space
  const view = new DataView(buffer);
  
  // Simple WAV header (can be converted to MP3 format by browser)
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, bufferSize + 36, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, bufferSize, true);
  
  // Generate audio data based on voice characteristics
  const frequency = voiceCharacteristics.gender === 'male' ? 150 : 250; // Hz base frequency
  const accent = voiceCharacteristics.accent === 'British' ? 1.1 : 1.0;
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const textVariation = Math.sin(t * text.length * 0.1) * 0.1;
    const pitch = frequency * accent + textVariation * 50;
    
    // Generate more natural-sounding audio waveform
    const sample = Math.sin(2 * Math.PI * pitch * t) * 0.3 +
                   Math.sin(2 * Math.PI * pitch * 1.5 * t) * 0.2 +
                   Math.sin(2 * Math.PI * pitch * 0.5 * t) * 0.1;
    
    // Add some randomness for more realistic sound
    const noise = (Math.random() - 0.5) * 0.05;
    const finalSample = Math.max(-1, Math.min(1, sample + noise));
    
    // Convert to 16-bit integer
    const intSample = Math.floor(finalSample * 32767);
    view.setInt16(44 + i * 2, intSample, true);
  }
  
  return buffer;
}

export async function generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  try {
    // Find the selected voice for context
    const selectedVoice = AVAILABLE_VOICES.find(v => v.id === voiceId);
    if (!selectedVoice) {
      throw new Error('Voice not found');
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate mock audio data based on text and voice characteristics
    const audioBuffer = generateMockMP3Audio(text, selectedVoice);
    
    return audioBuffer;
  } catch (error) {
    console.error('Speech generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate speech');
  }
}

export function getVoicesByCategory(): Record<string, Voice[]> {
  return AVAILABLE_VOICES.reduce((acc, voice) => {
    if (!acc[voice.category]) {
      acc[voice.category] = [];
    }
    acc[voice.category].push(voice);
    return acc;
  }, {} as Record<string, Voice[]>);
}

export function getVoiceById(id: string): Voice | undefined {
  return AVAILABLE_VOICES.find(voice => voice.id === id);
}