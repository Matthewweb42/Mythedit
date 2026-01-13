# Claude API Setup Guide

**Last Updated**: January 12, 2026
**API Provider**: Anthropic (Claude Sonnet 4.5)

---

## Overview

MythEdit uses **Claude Sonnet 4.5** from Anthropic for developmental editing. This guide will help you get your API keys and integrate Claude into the backend.

---

## Step 1: Create Anthropic Account

1. **Go to**: https://console.anthropic.com/
2. **Sign up** with your email
3. **Verify** your email address
4. **Add payment method** (required for API access)
   - Credit card or PayPal
   - Anthropic uses pay-as-you-go pricing
   - Set up billing alerts (recommended: $10, $25, $50)

---

## Step 2: Get Your API Key

1. **Login** to https://console.anthropic.com/
2. **Navigate** to "API Keys" in the left sidebar
3. **Click** "Create Key"
4. **Name** your key: `mythedit-dev` (for development)
5. **Copy** the key immediately (it won't be shown again!)
   - Format: `sk-ant-api03-...` (long string)
6. **Store safely** - never commit to git!

---

## Step 3: Add to Environment Variables

### Backend `.env` File

Add your Claude API key to `backend/.env`:

```bash
# backend/.env

# Existing variables
DATABASE_URL="postgresql://mythuser:mythpass@localhost:5432/mythedit_db"
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="mythpass123"
REDIS_URL="redis://localhost:6379"

# Add this:
ANTHROPIC_API_KEY="sk-ant-api03-YOUR-KEY-HERE"

# Optional: Set model version
CLAUDE_MODEL="claude-sonnet-4-20250514"  # Latest Sonnet 4.5

# Optional: Set max tokens for responses
CLAUDE_MAX_TOKENS=4000

# Frontend URL
FRONTEND_URL="http://localhost:5173"
PORT=3000
NODE_ENV="development"
```

**⚠️ IMPORTANT**: Make sure `.env` is in `.gitignore`!

---

## Step 4: Install Anthropic SDK

In your backend directory:

```bash
cd backend
npm install @anthropic-ai/sdk
```

This installs the official Anthropic TypeScript SDK.

---

## Step 5: Create Claude Service

Create a new service file for Claude API interactions:

**File**: `backend/src/services/claude.service.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface DevelopmentalFeedback {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  inlineHighlights: InlineHighlight[];
}

interface InlineHighlight {
  start: number;
  end: number;
  type: 'pacing' | 'character' | 'plot' | 'structure' | 'style';
  comment: string;
}

export class ClaudeService {

  /**
   * Analyze a chapter with developmental editing feedback
   */
  async analyzeDevelopmental(
    chapterText: string,
    context?: {
      previousSummaries?: string[];
      genre?: string;
      bookNumber?: number;
    }
  ): Promise<DevelopmentalFeedback> {

    const prompt = this.buildDevelopmentalPrompt(chapterText, context);

    try {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS || '4000'),
        temperature: 0.7,  // Slightly creative but consistent
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text from response
      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      // Parse structured feedback (assuming Claude returns JSON)
      const feedback = this.parseFeedback(responseText);

      // Track usage
      console.log('Claude API usage:', {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        totalCost: this.calculateCost(message.usage),
      });

      return feedback;

    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error('Failed to analyze chapter with Claude');
    }
  }

  /**
   * Generate a chapter summary with entity tagging
   */
  async generateSummary(
    chapterText: string,
    chapterNumber: number
  ): Promise<{
    summary: string;
    keyPoints: string[];
    entities: {
      characters: string[];
      places: string[];
      events: string[];
    };
  }> {

    const prompt = `You are analyzing Chapter ${chapterNumber} of a novel.

CHAPTER TEXT:
${chapterText}

Generate a concise summary (500-1000 words) that captures:
1. Key plot developments
2. Character actions and decisions
3. Important revelations or events
4. Setting/location changes

Also extract and list:
- All character names mentioned
- All place/location names
- Major events that occur

Return as JSON:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "entities": {
    "characters": ["Name1", "Name2"],
    "places": ["Place1", "Place2"],
    "events": ["Event1", "Event2"]
  }
}`;

    try {
      const message = await anthropic.messages.create({
        model: 'claude-haiku-4-20250317',  // Use Haiku for summaries (cheaper)
        max_tokens: 2000,
        temperature: 0.3,  // More consistent
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      return JSON.parse(responseText);

    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  /**
   * Build the developmental editing prompt
   */
  private buildDevelopmentalPrompt(
    chapterText: string,
    context?: {
      previousSummaries?: string[];
      genre?: string;
      bookNumber?: number;
    }
  ): string {

    let prompt = `You are an expert developmental editor specializing in fiction. Your task is to provide detailed, actionable feedback on this chapter.`;

    if (context?.genre) {
      prompt += `\n\nGENRE: ${context.genre}`;
    }

    if (context?.previousSummaries && context.previousSummaries.length > 0) {
      prompt += `\n\nPREVIOUS CHAPTERS SUMMARY:\n`;
      context.previousSummaries.forEach((summary, i) => {
        prompt += `\nChapter ${i + 1}: ${summary}\n`;
      });
    }

    prompt += `\n\nCHAPTER TO ANALYZE:\n${chapterText}`;

    prompt += `\n\nProvide developmental editing feedback covering:

1. **Plot & Structure** (pacing, plot holes, story arc)
2. **Character Development** (motivation, voice, dialogue, arc progression)
3. **Narrative Technique** (POV, show vs tell, tension, hooks)
4. **Series Continuity** (if previous chapters provided - check consistency)

Return your feedback as JSON in this exact format:
{
  "overallScore": 7.5,
  "strengths": ["Strong opening hook", "Vivid descriptions"],
  "weaknesses": ["Pacing drags in middle", "Character motivation unclear"],
  "feedback": "## Overall Assessment\\n\\n[Detailed markdown feedback...]",
  "inlineHighlights": [
    {
      "start": 150,
      "end": 300,
      "type": "pacing",
      "comment": "This section slows momentum - consider cutting or condensing"
    }
  ]
}

Be specific, cite examples, and provide actionable suggestions.`;

    return prompt;
  }

  /**
   * Parse Claude's response into structured feedback
   */
  private parseFeedback(responseText: string): DevelopmentalFeedback {
    try {
      // Try to extract JSON from response
      // Claude sometimes wraps JSON in ```json blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
                        responseText.match(/({[\s\S]*})/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }

      // Fallback: parse as-is
      return JSON.parse(responseText);

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
   * Calculate API cost in USD
   */
  private calculateCost(usage: { input_tokens: number; output_tokens: number }): number {
    // Claude Sonnet 4.5 pricing (as of Jan 2026):
    // Input: $3 per 1M tokens
    // Output: $15 per 1M tokens

    const inputCost = (usage.input_tokens / 1_000_000) * 3.00;
    const outputCost = (usage.output_tokens / 1_000_000) * 15.00;

    return inputCost + outputCost;
  }
}

// Export singleton
export const claudeService = new ClaudeService();
```

---

## Step 6: Test Claude Integration

Create a simple test script to verify everything works:

**File**: `backend/src/test-claude.ts`

```typescript
import 'dotenv/config';
import { claudeService } from './services/claude.service';

async function test() {
  const sampleChapter = `
    Chapter 1: The Call

    Alaric Stormwind stood atop the windswept tower, gazing across the
    frozen wasteland that had once been the kingdom of Eloria. Three
    years had passed since the Shadow War, and still the scars remained.

    "You can't keep running forever," a voice called from below.

    He turned to see Brenna climbing the last few steps, her breath
    forming clouds in the frigid air. She'd been his friend since
    childhood, and the only one who understood why he'd exiled himself here.

    "I'm not running," Alaric replied. "I'm waiting."

    "For what?"

    He held up the letter that had arrived that morning. The seal of
    the High Council was unmistakable.

    "They're calling me back. They need me to find the Soulblade."
  `;

  console.log('Testing Claude API...\n');

  try {
    const feedback = await claudeService.analyzeDevelopmental(sampleChapter, {
      genre: 'Epic Fantasy',
      bookNumber: 1,
    });

    console.log('✅ Success!\n');
    console.log('Overall Score:', feedback.overallScore);
    console.log('\nStrengths:');
    feedback.strengths.forEach(s => console.log(`  - ${s}`));
    console.log('\nWeaknesses:');
    feedback.weaknesses.forEach(w => console.log(`  - ${w}`));
    console.log('\nFeedback:', feedback.feedback.substring(0, 200) + '...');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

test();
```

**Run test**:
```bash
cd backend
npx tsx src/test-claude.ts
```

You should see developmental feedback for the sample chapter!

---

## Step 7: Usage Tracking & Cost Management

### Add Usage Tracking Service

**File**: `backend/src/services/usage.service.ts`

```typescript
import { prisma } from '../config/database';

export class UsageService {

  async trackChapterAnalysis(params: {
    userId: string;
    chapterId: string;
    tokensUsed: number;
    wordsAnalyzed: number;
  }) {

    // Calculate cost
    // Sonnet 4.5: ~$3/1M input + $15/1M output tokens
    // Approximate 70/30 split input/output
    const inputTokens = Math.floor(params.tokensUsed * 0.7);
    const outputTokens = Math.floor(params.tokensUsed * 0.3);
    const costUsd = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;

    // Create usage record
    await prisma.usageRecord.create({
      data: {
        userId: params.userId,
        chapterId: params.chapterId,
        action: 'DEVELOPMENTAL_EDIT',
        tokensUsed: params.tokensUsed,
        wordsAnalyzed: params.wordsAnalyzed,
        costUsd,
      },
    });

    // Update subscription usage
    await prisma.subscription.update({
      where: { userId: params.userId },
      data: {
        chaptersUsed: { increment: 1 },
        wordsUsed: { increment: params.wordsAnalyzed },
      },
    });
  }

  async checkUsageLimit(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
    usage: { chapters: number; words: number };
    limits: { chapters: number; words: number };
  }> {

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return {
        allowed: false,
        reason: 'No subscription found',
        usage: { chapters: 0, words: 0 },
        limits: { chapters: 0, words: 0 },
      };
    }

    // Check if within limits
    if (subscription.chaptersUsed >= subscription.chaptersPerMonth) {
      return {
        allowed: false,
        reason: `Monthly chapter limit reached (${subscription.chaptersPerMonth})`,
        usage: {
          chapters: subscription.chaptersUsed,
          words: subscription.wordsUsed,
        },
        limits: {
          chapters: subscription.chaptersPerMonth,
          words: subscription.wordsPerMonth,
        },
      };
    }

    return {
      allowed: true,
      usage: {
        chapters: subscription.chaptersUsed,
        words: subscription.wordsUsed,
      },
      limits: {
        chapters: subscription.chaptersPerMonth,
        words: subscription.wordsPerMonth,
      },
    };
  }
}

export const usageService = new UsageService();
```

---

## Pricing & Cost Estimation

### Claude Sonnet 4.5 Pricing (January 2026)

| Token Type | Cost per 1M Tokens |
|------------|-------------------|
| Input | $3.00 |
| Output | $15.00 |

### Cost Per Chapter (Estimated)

**4,000-word chapter**:
- Input tokens: ~5,000 (chapter + prompt)
- Output tokens: ~1,500 (feedback)
- **Total cost**: ~$0.25-$0.35 per chapter

**With context (10 previous chapter summaries)**:
- Input tokens: ~8,000 (chapter + summaries + prompt)
- Output tokens: ~1,500
- **Total cost**: ~$0.30-$0.40 per chapter

### Monthly Costs by Tier

| Tier | Chapters/Month | Est. Monthly Cost | Revenue | Margin |
|------|----------------|-------------------|---------|--------|
| Free | 5 | $1.75 | $0 | -$1.75 |
| Standard ($25) | 40 | $14 | $25 | $11 |
| Pro ($50) | 100 | $35 | $50 | $15 |

---

## Best Practices

### 1. **Set Budget Alerts**

In Anthropic Console:
- Settings → Billing → Budget Alerts
- Set alerts at $10, $25, $50, $100

### 2. **Cache When Possible**

```typescript
// Don't re-analyze the same chapter
const existingFeedback = await prisma.editingFeedback.findFirst({
  where: {
    chapterId,
    type: 'DEVELOPMENTAL',
  },
});

if (existingFeedback) {
  return existingFeedback;  // Return cached
}
```

### 3. **Use Haiku for Summaries**

Claude Haiku is 10x cheaper:
- Input: $0.25 per 1M tokens
- Output: $1.25 per 1M tokens

Always use Haiku for summaries, Sonnet for editing.

### 4. **Implement Rate Limiting**

```typescript
import { RateLimiter } from 'limiter';

// Max 50 requests per minute
const limiter = new RateLimiter({
  tokensPerInterval: 50,
  interval: 'minute',
});

await limiter.removeTokens(1);  // Wait if needed
```

### 5. **Monitor Costs Daily**

Create a dashboard showing:
- Total API spend today/week/month
- Cost per chapter
- Highest-cost users
- Projected monthly cost

---

## Troubleshooting

### Error: "Invalid API key"
- Check that `ANTHROPIC_API_KEY` is set in `.env`
- Verify key format: `sk-ant-api03-...`
- Make sure you're using the correct key (not secret from another service)

### Error: "Rate limit exceeded"
- Anthropic has rate limits (50-100 requests/minute)
- Implement exponential backoff
- Queue requests using Bull

### Error: "Model not found"
- Check `CLAUDE_MODEL` value
- Use: `claude-sonnet-4-20250514` (latest)
- Or: `claude-haiku-4-20250317` for summaries

### High Costs
- Check if you're re-analyzing chapters unnecessarily
- Verify caching is working
- Consider shorter context windows
- Use Haiku where possible

---

## Security Checklist

- [ ] API key stored in `.env` (not in code)
- [ ] `.env` in `.gitignore`
- [ ] API key rotated if exposed
- [ ] Rate limiting implemented
- [ ] Budget alerts configured
- [ ] Usage tracking working
- [ ] Error handling for API failures

---

## Next Steps

1. ✅ API key obtained and configured
2. ✅ Claude service created
3. ✅ Test script working
4. ✅ Usage tracking implemented
5. ⏳ Integrate into chapter upload flow
6. ⏳ Add prompt engineering for best results

See [PROMPT_ENGINEERING.md](./PROMPT_ENGINEERING.md) for tips on getting the best feedback from Claude!
