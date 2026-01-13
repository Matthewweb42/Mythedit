import Anthropic from '@anthropic-ai/sdk';
import {
  DevelopmentalFeedback,
  ChapterSummaryData,
  ChapterContext,
  ApiUsage,
} from '../types';
import {
  buildDevelopmentalPrompt,
  buildSummaryPrompt,
} from '../prompts/developmental-editing';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export class ClaudeService {
  /**
   * Analyze a chapter with developmental editing feedback
   */
  async analyzeDevelopmental(
    chapterText: string,
    context?: ChapterContext
  ): Promise<{ feedback: DevelopmentalFeedback; usage: ApiUsage }> {
    const prompt = buildDevelopmentalPrompt(chapterText, context);
    const startTime = Date.now();

    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4000'),
        temperature: 0.7, // Slightly creative but consistent
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      // Extract text from response
      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      // Parse structured feedback
      const feedback = this.parseFeedback(responseText);

      // Calculate usage and cost
      const usage = this.calculateUsage(message.usage);

      // Log for monitoring
      console.log('✅ Developmental analysis complete:', {
        processingTime: `${processingTime}s`,
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        costUsd: `$${usage.costUsd.toFixed(4)}`,
      });

      return { feedback, usage };
    } catch (error) {
      console.error('❌ Claude API error:', error);
      throw new Error(
        `Failed to analyze chapter with Claude: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate a chapter summary with entity tagging
   * Uses Claude Haiku for cost efficiency
   */
  async generateSummary(
    chapterText: string,
    chapterNumber: number,
    genre?: string
  ): Promise<{ summary: ChapterSummaryData; usage: ApiUsage }> {
    const prompt = buildSummaryPrompt(chapterText, chapterNumber, genre);
    const startTime = Date.now();

    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-20250122', // Use Haiku for summaries (10x cheaper)
        max_tokens: 2000,
        temperature: 0.3, // More consistent for summaries
        messages: [{ role: 'user', content: prompt }],
      });

      const processingTime = Math.round((Date.now() - startTime) / 1000);

      const responseText =
        message.content[0].type === 'text' ? message.content[0].text : '';

      // Parse JSON response
      const summary = this.parseSummary(responseText);

      // Calculate usage and cost
      const usage = this.calculateUsage(message.usage, true); // true = using Haiku

      console.log('✅ Summary generation complete:', {
        processingTime: `${processingTime}s`,
        costUsd: `$${usage.costUsd.toFixed(4)}`,
      });

      return { summary, usage };
    } catch (error) {
      console.error('❌ Summary generation error:', error);
      throw new Error(
        `Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Parse Claude's developmental feedback response
   */
  private parseFeedback(responseText: string): DevelopmentalFeedback {
    try {
      // Try to extract JSON from response
      // Claude sometimes wraps JSON in ```json blocks
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/({[\s\S]*})/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);

        // Validate required fields
        if (
          typeof parsed.overallScore !== 'number' ||
          !Array.isArray(parsed.strengths) ||
          !Array.isArray(parsed.weaknesses) ||
          typeof parsed.feedback !== 'string' ||
          !Array.isArray(parsed.inlineHighlights)
        ) {
          throw new Error('Invalid feedback structure');
        }

        return parsed as DevelopmentalFeedback;
      }

      // Fallback: try to parse as-is
      const parsed = JSON.parse(responseText);
      return parsed as DevelopmentalFeedback;
    } catch (error) {
      console.error('Failed to parse feedback:', error);

      // Return basic structure if parsing fails
      return {
        overallScore: 7.0,
        strengths: ['Analysis completed'],
        weaknesses: ['Could not parse structured feedback'],
        feedback: responseText,
        inlineHighlights: [],
      };
    }
  }

  /**
   * Parse Claude's summary response
   */
  private parseSummary(responseText: string): ChapterSummaryData {
    try {
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/({[\s\S]*})/);

      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);

        // Validate structure
        if (
          typeof parsed.summary !== 'string' ||
          !Array.isArray(parsed.keyPoints) ||
          !parsed.entities ||
          !Array.isArray(parsed.entities.characters)
        ) {
          throw new Error('Invalid summary structure');
        }

        return parsed as ChapterSummaryData;
      }

      return JSON.parse(responseText) as ChapterSummaryData;
    } catch (error) {
      console.error('Failed to parse summary:', error);

      // Return basic structure
      return {
        summary: responseText,
        keyPoints: [],
        entities: {
          characters: [],
          places: [],
          events: [],
        },
      };
    }
  }

  /**
   * Calculate API usage and cost
   */
  private calculateUsage(
    usage: { input_tokens: number; output_tokens: number },
    isHaiku = false
  ): ApiUsage {
    // Pricing (as of January 2026)
    // Sonnet 4.5: $3/1M input, $15/1M output
    // Haiku 4: $0.25/1M input, $1.25/1M output

    const inputCostPer1M = isHaiku ? 0.25 : 3.0;
    const outputCostPer1M = isHaiku ? 1.25 : 15.0;

    const inputCost = (usage.input_tokens / 1_000_000) * inputCostPer1M;
    const outputCost = (usage.output_tokens / 1_000_000) * outputCostPer1M;

    return {
      inputTokens: usage.input_tokens,
      outputTokens: usage.output_tokens,
      totalTokens: usage.input_tokens + usage.output_tokens,
      costUsd: inputCost + outputCost,
    };
  }
}

// Export singleton
export const claudeService = new ClaudeService();
