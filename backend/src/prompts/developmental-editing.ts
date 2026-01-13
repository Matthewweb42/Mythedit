import { ChapterContext } from '../types';

/**
 * Build the developmental editing prompt for Claude
 */
export function buildDevelopmentalPrompt(
  chapterText: string,
  context?: ChapterContext
): string {
  let prompt = `You are an expert developmental editor specializing in fiction writing. Your role is to provide constructive, actionable feedback that helps authors improve their storytelling craft.

Your feedback should focus on the big-picture elements of storytelling, not grammar or spelling.`;

  // Add genre context if provided
  if (context?.genre) {
    prompt += `\n\nGENRE: ${context.genre}
This is important - your feedback should consider genre conventions and reader expectations for ${context.genre}.`;
  }

  // Add series context if provided
  if (context?.bookNumber && context?.totalBooks) {
    prompt += `\n\nSERIES CONTEXT: This is Book ${context.bookNumber} of a ${context.totalBooks}-book series.`;
  }

  // Add previous chapter summaries for continuity checking
  if (context?.previousSummaries && context.previousSummaries.length > 0) {
    prompt += `\n\n## STORY SO FAR

Here are summaries of the previous chapters to help you check for continuity and story progression:\n`;

    context.previousSummaries.forEach((summary, i) => {
      const chapterNum = i + 1;
      prompt += `\n**Chapter ${chapterNum}**: ${summary}\n`;
    });

    prompt += `\nPlease check this chapter for consistency with previous events, character development arcs, and plot progression.`;
  }

  // Add the chapter to analyze
  prompt += `\n\n## CHAPTER TO ANALYZE

${context?.chapterNumber ? `**Chapter ${context.chapterNumber}**\n\n` : ''}${chapterText}`;

  // Add detailed instructions for feedback
  prompt += `\n\n## FEEDBACK INSTRUCTIONS

Provide comprehensive developmental editing feedback covering these key areas:

### 1. Plot & Structure
- Does the chapter advance the plot meaningfully?
- Is the pacing appropriate (too fast, too slow, just right)?
- Are there any plot holes or logical inconsistencies?
- Does the chapter have a clear beginning, middle, and end?
- Is there proper tension and conflict?

### 2. Character Development
- Are character motivations clear and believable?
- Do characters act consistently with their established personalities?
- Is the dialogue natural and voice-distinct?
- Are there opportunities to deepen characterization?
- Do characters show growth or change?

### 3. Narrative Technique
- Is the POV consistent and effective?
- Balance of showing vs. telling (show more where it matters)
- Are descriptions vivid but not excessive?
- Does the opening hook the reader?
- Does the ending create anticipation for the next chapter?

### 4. Worldbuilding (if applicable)
- Is worldbuilding integrated naturally or info-dumped?
- Are magic/tech systems explained clearly and consistently?
- Does the setting feel immersive?

${context?.previousSummaries?.length ? `### 5. Series Continuity
- Are there any contradictions with previous chapters?
- Is character development tracking properly across the story arc?
- Are callbacks to earlier events handled well?` : ''}

## OUTPUT FORMAT

Return your feedback as JSON in this EXACT format:

\`\`\`json
{
  "overallScore": 7.5,
  "strengths": [
    "Strong opening hook that immediately establishes tension",
    "Vivid sensory descriptions that immerse the reader",
    "Character dialogue feels natural and reveals personality"
  ],
  "weaknesses": [
    "Pacing drags in the middle section (paragraphs 5-8)",
    "Character motivation for the betrayal is unclear",
    "Info-dump about magic system breaks narrative flow"
  ],
  "feedback": "## Overall Assessment\\n\\nThis chapter shows strong craft in several areas, particularly in your opening and descriptive work. However, there are some pacing and clarity issues that need attention.\\n\\n### What Works Well\\n\\n**Opening Hook**: The first paragraph immediately establishes tension with [specific example]. This is exactly what you want in a chapter opening.\\n\\n**Sensory Detail**: Your descriptions engage multiple senses. For example, [quote specific passage] - this makes the scene come alive.\\n\\n### Areas for Improvement\\n\\n**Pacing Issues**: The middle section (starting around 'She walked through the door...') slows momentum considerably. Consider cutting [specific details] or condensing this to 2-3 sentences.\\n\\n**Character Motivation**: When [character] decides to [action], the motivation isn't clear. Readers need to understand WHY. Consider adding an internal thought or flashback that reveals their reasoning.\\n\\n**Info-Dumping**: The explanation of the magic system (paragraph 12) stops the story cold. Instead, reveal this information through action - show the magic being used rather than explaining how it works.\\n\\n### Specific Suggestions\\n\\n1. **Restructure the middle**: Move the dialogue exchange earlier to maintain momentum\\n2. **Strengthen character motivation**: Add 2-3 sentences of internal conflict before the key decision\\n3. **Integrate worldbuilding**: Weave magic system details into the action sequence\\n\\n### Continuity Notes\\n\\n[If previous chapters were provided, note any continuity issues or successful callbacks here]",
  "inlineHighlights": [
    {
      "start": 450,
      "end": 680,
      "type": "pacing",
      "comment": "This passage slows momentum. The detailed description of the room is well-written but comes at the wrong time. Consider moving this earlier or cutting to essentials.",
      "severity": "moderate"
    },
    {
      "start": 1200,
      "end": 1450,
      "type": "character",
      "comment": "Strong dialogue here! Each character's voice is distinct and the subtext is clear. This is exactly the kind of dialogue that reveals character.",
      "severity": "minor"
    }
  ]
}
\`\`\`

IMPORTANT GUIDELINES:
- Be specific: Quote passages, cite line numbers, give concrete examples
- Be actionable: Suggest HOW to fix issues, not just what's wrong
- Be balanced: Note both strengths and weaknesses
- Be constructive: Frame criticism as opportunities for improvement
- Use markdown formatting in the feedback field for readability
- overallScore should be 0-10 (7-8 is good, 9+ is exceptional, below 6 needs significant work)
- Include 3-5 inline highlights pointing to specific passages
- Each inline highlight needs character position (start/end), type, comment, and severity`;

  return prompt;
}

/**
 * Build the summary generation prompt for Claude
 */
export function buildSummaryPrompt(
  chapterText: string,
  chapterNumber: number,
  genre?: string
): string {
  return `You are analyzing Chapter ${chapterNumber} of a ${genre || 'fiction'} novel.

## CHAPTER TEXT

${chapterText}

## TASK

Generate a concise but comprehensive summary that captures:

1. **Key Plot Developments**: What happens in this chapter? What events move the story forward?
2. **Character Actions & Decisions**: What do characters do and decide? How do they change?
3. **Important Revelations**: What new information is revealed (about plot, characters, world)?
4. **Setting/Location**: Where does this chapter take place? Any significant location changes?
5. **Emotional Arc**: What is the emotional journey of this chapter?

Also extract and list:
- **All character names** mentioned (including minor characters)
- **All place/location names** mentioned
- **Major events** that occur (battles, revelations, deaths, etc.)

## OUTPUT FORMAT

Return as JSON:

\`\`\`json
{
  "summary": "A 500-1000 word summary covering all the key points above. Write this as a narrative summary, not bullet points. Focus on WHAT happens and WHY it matters to the story.",
  "keyPoints": [
    "Hero discovers the ancient artifact in the ruins",
    "Betrayal revealed: trusted ally is actually working for the enemy",
    "Final confrontation set up for next chapter"
  ],
  "entities": {
    "characters": ["Alaric", "Brenna", "Lord Tyran", "Sera"],
    "places": ["Tower of Winds", "Eloria", "Shadow Realm"],
    "events": ["Battle of Sorrows", "The Awakening", "Betrayal at Dawn"]
  }
}
\`\`\`

Be thorough but concise. The summary should give someone a complete understanding of this chapter's role in the larger story.`;
}
