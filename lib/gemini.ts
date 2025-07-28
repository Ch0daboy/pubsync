import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function generateContent(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating content with Gemini:', error)
    throw error
  }
}

export async function repurposeContent(
  originalContent: string,
  sourcePlatform: string,
  targetPlatform: string,
  contentType: string
) {
  const prompt = `
    Repurpose the following content from ${sourcePlatform} to ${targetPlatform} as ${contentType}:
    
    Original Content: ${originalContent}
    
    Please create engaging content that:
    1. Maintains the core message and value
    2. Adapts to ${targetPlatform}'s format and audience
    3. Uses appropriate tone and style for ${targetPlatform}
    4. Includes relevant hashtags if applicable
    5. Optimizes for engagement on ${targetPlatform}
    
    Return only the repurposed content without any explanations.
  `

  return await generateContent(prompt)
} 