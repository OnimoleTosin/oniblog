import { invokeLLM } from './_core/llm';

/**
 * LLM-powered writing assistant for the admin editor
 * Helps generate engaging content for anime and movie reviews
 */

export interface AssistantRequest {
  type: 'generate_review' | 'generate_summary' | 'generate_seo' | 'improve_content';
  title: string;
  content?: string;
  context?: string;
}

export interface AssistantResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Generate a full anime/movie review draft
 */
export async function generateReviewDraft(
  title: string,
  context: string
): Promise<AssistantResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are an expert anime and movie critic. Write engaging, informative reviews that capture the essence of the work while maintaining a retro-futuristic, dystopian tone. Use markdown formatting.`,
        },
        {
          role: 'user',
          content: `Write a comprehensive review for: "${title}"\n\nContext: ${context}\n\nInclude sections for: Overview, Plot Summary, Characters, Themes, Visual/Audio Quality, and Final Verdict.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      return { success: false, error: 'No content generated' };
    }

    return { success: true, content };
  } catch (error) {
    console.error('[LLM] Failed to generate review:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate a concise summary from full content
 */
export async function generateSummary(
  title: string,
  content: string
): Promise<AssistantResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a skilled editor. Create compelling, concise summaries (2-3 sentences) that capture the essence of the content.`,
        },
        {
          role: 'user',
          content: `Create a summary for "${title}":\n\n${content}`,
        },
      ],
    });

    const content_result = response.choices[0]?.message?.content;
    if (!content_result || typeof content_result !== 'string') {
      return { success: false, error: 'No summary generated' };
    }

    return { success: true, content: content_result };
  } catch (error) {
    console.error('[LLM] Failed to generate summary:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate SEO-optimized description and keywords
 */
export async function generateSEOContent(
  title: string,
  content: string
): Promise<AssistantResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert. Generate meta descriptions (160 chars max) and relevant keywords for blog posts about anime and movies.`,
        },
        {
          role: 'user',
          content: `Generate SEO content for:\nTitle: "${title}"\n\nContent:\n${content.substring(0, 500)}...\n\nProvide in JSON format: {"metaDescription": "...", "keywords": ["keyword1", "keyword2", ...]}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'seo_content',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              metaDescription: { type: 'string', description: 'SEO meta description (max 160 chars)' },
              keywords: { type: 'array', items: { type: 'string' }, description: 'SEO keywords' },
            },
            required: ['metaDescription', 'keywords'],
            additionalProperties: false,
          },
        },
      },
    });

    const result_content = response.choices[0]?.message?.content;
    if (!result_content || typeof result_content !== 'string') {
      return { success: false, error: 'No SEO content generated' };
    }

    return { success: true, content: result_content };
  } catch (error) {
    console.error('[LLM] Failed to generate SEO content:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Improve existing content with better wording and structure
 */
export async function improveContent(
  title: string,
  content: string
): Promise<AssistantResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a professional editor. Improve the given content by enhancing clarity, engagement, and maintaining a retro-futuristic, dystopian tone. Keep the same structure but make it more compelling.`,
        },
        {
          role: 'user',
          content: `Improve this content about "${title}":\n\n${content}`,
        },
      ],
    });

    const improved_content = response.choices[0]?.message?.content;
    if (!improved_content || typeof improved_content !== 'string') {
      return { success: false, error: 'No improved content generated' };
    }

    return { success: true, content: improved_content };
  } catch (error) {
    console.error('[LLM] Failed to improve content:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Generate title suggestions
 */
export async function generateTitleSuggestions(
  topic: string,
  style: string = 'engaging'
): Promise<AssistantResponse> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: `You are a creative writer. Generate 5 compelling blog post titles for anime and movie content. Titles should be ${style} and SEO-friendly.`,
        },
        {
          role: 'user',
          content: `Generate 5 title suggestions for: "${topic}"\n\nReturn as a JSON array of strings.`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'title_suggestions',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              titles: { type: 'array', items: { type: 'string' }, description: 'Suggested titles' },
            },
            required: ['titles'],
            additionalProperties: false,
          },
        },
      },
    });

    const titles_content = response.choices[0]?.message?.content;
    if (!titles_content || typeof titles_content !== 'string') {
      return { success: false, error: 'No titles generated' };
    }

    return { success: true, content: titles_content };
  } catch (error) {
    console.error('[LLM] Failed to generate titles:', error);
    return { success: false, error: String(error) };
  }
}
