/**
 * LLM provider abstractions for the legal intake system
 * Supports multiple providers with consistent interfaces
 */

import OpenAI from 'openai';

export interface LLMProvider {
  name: string;
  generateResponse(prompt: string, options?: LLMOptions): Promise<string>;
  generateStreamingResponse(prompt: string, options?: LLMOptions): AsyncGenerator<string, void, unknown>;
  isAvailable(): boolean;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  systemPrompt?: string;
  messages?: Array<{ role: string; content: string }>;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
}

export class OpenAIProvider implements LLMProvider {
  public readonly name = 'openai';
  private client: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || null;
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
      });
    }
  }

  public isAvailable(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  public async generateResponse(prompt: string, options: LLMOptions = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Check API key.');
    }

    const {
      temperature = 0.7,
      maxTokens = 2000,
      model = 'gpt-4-1106-preview',
      systemPrompt,
      messages = []
    } = options;

    const messageHistory = [];
    
    if (systemPrompt) {
      messageHistory.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (messages.length > 0) {
      messageHistory.push(...messages);
    } else {
      messageHistory.push({
        role: 'user',
        content: prompt
      });
    }

    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: messageHistory as any,
        temperature,
        max_tokens: maxTokens,
        stream: false
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async *generateStreamingResponse(prompt: string, options: LLMOptions = {}): AsyncGenerator<string, void, unknown> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Check API key.');
    }

    const {
      temperature = 0.7,
      maxTokens = 2000,
      model = 'gpt-4-1106-preview',
      systemPrompt,
      messages = []
    } = options;

    const messageHistory = [];
    
    if (systemPrompt) {
      messageHistory.push({
        role: 'system',
        content: systemPrompt
      });
    }

    if (messages.length > 0) {
      messageHistory.push(...messages);
    } else {
      messageHistory.push({
        role: 'user',
        content: prompt
      });
    }

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: messageHistory as any,
        temperature,
        max_tokens: maxTokens,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw new Error(`OpenAI streaming error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class FallbackProvider implements LLMProvider {
  public readonly name = 'fallback';

  public isAvailable(): boolean {
    return true; // Always available as fallback
  }

  public async generateResponse(prompt: string, options: LLMOptions = {}): Promise<string> {
    // Simple fallback response based on prompt content
    if (prompt.toLowerCase().includes('interview') || prompt.toLowerCase().includes('question')) {
      return this.generateInterviewResponse(prompt);
    }
    
    if (prompt.toLowerCase().includes('document') || prompt.toLowerCase().includes('generate')) {
      return this.generateDocumentResponse(prompt);
    }

    return "I understand you need legal assistance. I'm currently experiencing technical difficulties with my AI system. Please try again in a few moments, or contact our support team for immediate assistance.";
  }

  public async *generateStreamingResponse(prompt: string, options: LLMOptions = {}): AsyncGenerator<string, void, unknown> {
    const response = await this.generateResponse(prompt, options);
    
    // Simulate streaming by yielding chunks
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '');
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  private generateInterviewResponse(prompt: string): string {
    const responses = [
      "I'd like to help you with your legal matter. Let me start by understanding your situation better. What brings you in today?",
      "I can see you're dealing with a legal issue. To provide you with the best assistance, I need to gather some information about your case. What kind of legal situation are you facing?",
      "Thank you for reaching out. I'm here to help you through this legal process. Can you tell me what type of legal matter you're dealing with?",
      "I understand you need legal assistance. Let me ask you some questions to better understand your situation. What's the main legal issue you're facing?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateDocumentResponse(prompt: string): string {
    return "I understand you'd like to generate a legal document. However, I'm currently experiencing technical difficulties with my document generation system. Please try again in a few moments, or contact our support team for immediate assistance with your legal document needs.";
  }
}

export class LLMProviderManager {
  private providers: Map<string, LLMProvider> = new Map();
  private defaultProvider: string = 'openai';

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize OpenAI provider
    const openaiProvider = new OpenAIProvider();
    this.providers.set('openai', openaiProvider);

    // Initialize fallback provider
    const fallbackProvider = new FallbackProvider();
    this.providers.set('fallback', fallbackProvider);

    // Set default provider based on availability
    if (openaiProvider.isAvailable()) {
      this.defaultProvider = 'openai';
    } else {
      this.defaultProvider = 'fallback';
      console.warn('OpenAI provider not available, using fallback provider');
    }
  }

  public getProvider(name?: string): LLMProvider {
    const providerName = name || this.defaultProvider;
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }

    return provider;
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.isAvailable())
      .map(([name, _]) => name);
  }

  public setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider '${name}' not found`);
    }
    
    this.defaultProvider = name;
  }

  public async generateResponse(prompt: string, options: LLMOptions = {}): Promise<string> {
    const provider = this.getProvider(options.model);
    
    try {
      return await provider.generateResponse(prompt, options);
    } catch (error) {
      console.error(`Error with provider ${provider.name}:`, error);
      
      // Fallback to fallback provider if not already using it
      if (provider.name !== 'fallback') {
        console.log('Falling back to fallback provider');
        const fallbackProvider = this.getProvider('fallback');
        return await fallbackProvider.generateResponse(prompt, options);
      }
      
      throw error;
    }
  }

  public async *generateStreamingResponse(prompt: string, options: LLMOptions = {}): AsyncGenerator<string, void, unknown> {
    const provider = this.getProvider(options.model);
    
    try {
      yield* provider.generateStreamingResponse(prompt, options);
    } catch (error) {
      console.error(`Error with provider ${provider.name}:`, error);
      
      // Fallback to fallback provider if not already using it
      if (provider.name !== 'fallback') {
        console.log('Falling back to fallback provider');
        const fallbackProvider = this.getProvider('fallback');
        yield* fallbackProvider.generateStreamingResponse(prompt, options);
      } else {
        throw error;
      }
    }
  }

  public addProvider(name: string, provider: LLMProvider): void {
    this.providers.set(name, provider);
  }

  public removeProvider(name: string): void {
    if (name === 'fallback') {
      throw new Error('Cannot remove fallback provider');
    }
    
    this.providers.delete(name);
    
    // Update default provider if it was removed
    if (this.defaultProvider === name) {
      this.defaultProvider = 'fallback';
    }
  }
}

// Global provider manager instance
export const llmProviderManager = new LLMProviderManager();

// Utility functions
export function createOpenAIProvider(apiKey?: string): OpenAIProvider {
  return new OpenAIProvider(apiKey);
}

export function createFallbackProvider(): FallbackProvider {
  return new FallbackProvider();
}

export function getLLMProvider(name?: string): LLMProvider {
  return llmProviderManager.getProvider(name);
}

export async function generateLLMResponse(prompt: string, options: LLMOptions = {}): Promise<string> {
  return llmProviderManager.generateResponse(prompt, options);
}

export async function generateLLMStreamingResponse(prompt: string, options: LLMOptions = {}): AsyncGenerator<string, void, unknown> {
  return llmProviderManager.generateStreamingResponse(prompt, options);
}

// Provider health check
export async function checkProviderHealth(): Promise<Record<string, boolean>> {
  const health: Record<string, boolean> = {};
  
  for (const [name, provider] of llmProviderManager['providers']) {
    try {
      health[name] = provider.isAvailable();
    } catch (error) {
      health[name] = false;
    }
  }
  
  return health;
}

// Configuration helpers
export function configureLLMProviders(config: {
  openaiApiKey?: string;
  defaultProvider?: string;
  customProviders?: Array<{ name: string; provider: LLMProvider }>;
}): void {
  if (config.openaiApiKey) {
    const openaiProvider = new OpenAIProvider(config.openaiApiKey);
    llmProviderManager.addProvider('openai', openaiProvider);
  }
  
  if (config.defaultProvider) {
    llmProviderManager.setDefaultProvider(config.defaultProvider);
  }
  
  if (config.customProviders) {
    config.customProviders.forEach(({ name, provider }) => {
      llmProviderManager.addProvider(name, provider);
    });
  }
}
