import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeDocument(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes documents.' },
        { role: 'user', content: `Summarize the following document: ${content}` },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error(`Error summarizing document: ${error.message}`);
  }
} 