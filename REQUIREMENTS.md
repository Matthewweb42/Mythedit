# MythEdit: AI Developmental Editor for Fiction Writers

**Last Updated**: January 12, 2026
**Version**: 2.0 (Restructured for MVP)
**Status**: Active Development - Sprint Planning Phase

---

## Executive Summary

MythEdit is an **AI-powered developmental editing platform** designed to make professional-quality editing **affordable and fast** for indie fiction authors. By leveraging advanced AI (Claude Sonnet 4.5) with RAG (Retrieval-Augmented Generation) technology, MythEdit provides developmental feedback that rivals human editors at a fraction of the cost.

**Core Value Proposition**: Professional developmental editing for $0.50-$1.00 per 1,000 words instead of $20-$50 per 1,000 words, delivered in minutes instead of weeks.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Solution Overview](#2-solution-overview)
3. [MVP Feature Set](#3-mvp-feature-set)
4. [Technical Architecture](#4-technical-architecture)
5. [User Journey](#5-user-journey)
6. [Pricing Model](#6-pricing-model)
7. [Sprint Plans](#7-sprint-plans)
8. [Success Metrics](#8-success-metrics)
9. [Post-MVP Roadmap](#9-post-mvp-roadmap)

---

## 1. Problem Statement

### The Editing Cost Crisis for Indie Authors

**Traditional Editing Costs** (Per 80,000-word novel):
- Developmental Editing: $2,000 - $5,000 ($0.025 - $0.0625/word)
- Copy Editing: $1,000 - $2,500
- Line Editing: $1,500 - $3,000
- Proofreading: $500 - $1,000

**Total**: $5,000 - $11,500 per book

**Timeline**: 4-12 weeks turnaround

**Problems**:
- ❌ Prohibitively expensive for most indie authors
- ❌ Long wait times (editors booked months in advance)
- ❌ Quality varies wildly between editors
- ❌ No iterative feedback during writing process
- ❌ Authors often skip developmental editing entirely due to cost

### Why Current AI Tools Don't Solve This

**Grammarly/ProWritingAid**:
- ✅ Good for grammar and style
- ❌ No developmental feedback (plot, character, pacing)
- ❌ No series-wide context tracking

**ChatGPT/Claude Direct Use**:
- ✅ Can provide developmental feedback
- ❌ Manual copy-paste workflow
- ❌ Loses context between sessions
- ❌ No structured editing workflow
- ❌ No memory of previous chapters

**World Anvil/Scrivener**:
- ✅ Good for organization
- ❌ No AI analysis or feedback
- ❌ Still requires manual editing

---

## 2. Solution Overview

### What MythEdit Does

MythEdit is a **developmental editing assistant** that:

1. **Maintains Full Series Context** using RAG technology
2. **Provides Professional-Quality Feedback** on plot, character, pacing, structure
3. **Learns Your Story** as you write chapter by chapter
4. **Costs 95% Less** than human developmental editors
5. **Delivers Results in Minutes** instead of weeks

### Key Innovation: Hybrid RAG + Summary System

**The Context Problem**:
- AI models have token limits (~200k for Claude)
- A full fantasy novel is 100k-150k words (~150k-225k tokens)
- Multi-book series can be 500k+ words

**Our Solution**:
1. **Chapter Summaries**: Each chapter generates a 500-1000 word summary
2. **Entity Tagging**: Summaries tagged with characters, places, events
3. **Vector Embeddings**: Full chapter text embedded in vector database
4. **Smart Retrieval**: When analyzing Chapter 15:
   - Load all chapter summaries (Chapter 1-14)
   - Retrieve relevant full-text passages using semantic search
   - Provide context-aware developmental feedback

**Result**: Analyze any chapter with full series context, regardless of total length.

---

## 3. MVP Feature Set

### Phase 1: Developmental Editing Only

Focus on the **highest-value, most expensive** editing type first.

#### Must-Have Features (Sprint 1-2)

**Core Workflow**:
- ✅ Create projects (series/standalone books)
- ✅ Upload chapters (.txt, .docx)
- ✅ Sequential chapter upload (Chapter 1, 2, 3...)
- ✅ AI developmental feedback with full series context
- ✅ Summary report + inline highlights
- ✅ Export edited chapters
- ✅ Usage tracking (chapters/words per billing period)

**Developmental Feedback Categories**:
1. **Plot & Structure**
   - Pacing issues
   - Plot holes
   - Story arc problems
   - Foreshadowing and payoff
   - Scene effectiveness

2. **Character Development**
   - Character motivation clarity
   - Character voice consistency
   - Dialogue quality
   - Character arc progression
   - Relationship dynamics

3. **Narrative Technique**
   - POV consistency
   - Show vs. tell balance
   - Tension and stakes
   - Opening/closing hooks
   - Scene-sequel structure

4. **Series Continuity** (Multi-Chapter Context)
   - Character knowledge/development tracking
   - Timeline coherence
   - Plot thread tracking
   - Recurring themes/motifs
   - Callback opportunities

**AI Context Management**:
- ✅ Generate chapter summaries after analysis
- ✅ Tag summaries with entities (characters, places, events)
- ✅ Embed full chapter text in vector database
- ✅ Retrieve relevant context for each new chapter

**User Management**:
- ✅ User authentication
- ✅ Subscription tiers with usage limits
- ✅ Usage tracking dashboard

#### Nice-to-Have (If Time Permits in Sprint 2)

- 🔄 Re-upload/revise chapters
- 🔄 Compare feedback between versions
- 🔄 Custom feedback preferences per project
- 🔄 Export feedback as PDF/docx

#### Explicitly Out of Scope for MVP

- ❌ Copy editing (grammar, spelling)
- ❌ Line editing (sentence-level craft)
- ❌ Proofreading
- ❌ Inline comment interface (Google Docs style)
- ❌ Auto-edit suggestions
- ❌ Worldbuilding graph visualization
- ❌ Character/location tracking UI
- ❌ Collaborative features
- ❌ Integration with writing tools (Scrivener, etc.)

---

## 4. Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│  - Project/Book/Chapter Management UI                       │
│  - Chapter Upload Interface                                 │
│  - Feedback Display (Summary + Inline Highlights)           │
│  - Usage Dashboard                                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────────┐
│               BACKEND API (Node.js + Fastify)                │
│  - Authentication & User Management                          │
│  - Chapter Upload & Processing                              │
│  - Usage Tracking & Subscription Management                 │
│  - AI Service Orchestration                                 │
└───┬──────────────────┬──────────────────┬───────────────────┘
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐    ┌──────────────┐   ┌─────────────────┐
│PostgreSQL│   │Claude Sonnet │   │  Qdrant Vector  │
│          │   │  4.5 API     │   │    Database     │
│- Users   │   │              │   │                 │
│- Projects│   │- Dev editing │   │- Chapter embeds │
│- Chapters│   │- Summaries   │   │- Semantic search│
│- Feedback│   │- Entity tags │   │- Context retriev│
│- Usage   │   │              │   │                 │
└─────────┘    └──────────────┘   └─────────────────┘
```

### Data Flow: Chapter Analysis

```
User uploads Chapter 15
        │
        ▼
[Frontend] Parse file → Extract text → Send to API
        │
        ▼
[Backend API]
  ├─ Store chapter in PostgreSQL
  ├─ Count words, update usage tracking
  └─ Queue for AI processing
        │
        ▼
[AI Processing Pipeline]
  ├─ 1. Retrieve context from Qdrant
  │     - Search for relevant passages from Ch 1-14
  │     - Load all chapter summaries
  │
  ├─ 2. Build prompt with context
  │     - Current chapter text
  │     - Previous chapter summaries
  │     - Retrieved relevant passages
  │     - User's genre/style preferences
  │
  ├─ 3. Call Claude API for developmental feedback
  │     - Analyze plot, character, pacing, structure
  │     - Return structured feedback
  │
  ├─ 4. Generate chapter summary with entity tags
  │     - Extract key plot points
  │     - Tag characters, places, events
  │
  ├─ 5. Embed chapter in vector database
  │     - Generate embeddings
  │     - Store in Qdrant with metadata
  │
  └─ 6. Store feedback in PostgreSQL
        │
        ▼
[Frontend] Display feedback
  - Summary report
  - Inline highlights
  - Recommendations
```

### Technology Stack

**Frontend**:
- React 18 + TypeScript
- Vite
- Tailwind CSS + Radix UI
- React Query (data fetching)
- Zustand (state management)

**Backend**:
- Node.js + Fastify
- Prisma ORM (PostgreSQL)
- TypeScript
- Bull (job queue via Redis)

**AI & ML**:
- **Claude Sonnet 4.5** (Anthropic API) - Developmental editing
- **Qdrant** - Vector database for RAG
- **OpenAI Embeddings** (text-embedding-3-small) - Chapter embeddings

**Databases**:
- **PostgreSQL** - User data, chapters, feedback, usage tracking
- **Qdrant** - Vector database for chapter embeddings
- **Redis** - Job queue, caching
- **Neo4j** (future) - Worldbuilding graph (post-MVP)

**Infrastructure**:
- Docker Compose (local development)
- Railway or Render (production deployment)
- GitHub (version control)

---

## 5. User Journey

### First-Time User Experience

**Step 1: Sign Up & Project Setup**
```
User creates account → Choose subscription tier → Create first project
```

**Project Setup Questions**:
- Project name (e.g., "The Stormborn Saga")
- Genre (Epic Fantasy, Urban Fantasy, Sci-Fi, Contemporary, etc.)
- Estimated book count (1, 3-5, 6-10, 10+)
- Writing style (Pantser, Plotter, Hybrid)
- Feedback preferences (default for MVP)

**Step 2: Upload First Chapter**
```
User uploads Chapter 1 → Processing (30-60 seconds) → View feedback
```

**First Chapter Analysis** (No prior context):
- Overall assessment and rating
- Plot setup effectiveness
- Character introduction quality
- Hook strength
- Pacing
- Genre expectations
- Voice and style

**Step 3: Review Feedback**
```
Summary Report:
  - Overall Score: 7.5/10
  - Strengths: Strong opening hook, vivid world description
  - Areas to Improve: Protagonist motivation unclear, pacing drags in middle

Inline Highlights:
  - [Paragraph 5-8] - PACING: These four paragraphs slow momentum
  - [Dialogue, Line 15] - CHARACTER: This feels out of voice for this character
```

**Step 4: Upload Subsequent Chapters**
```
Upload Chapter 2 → AI now has Chapter 1 context → Feedback includes continuity
```

**Multi-Chapter Feedback**:
- All previous feedback categories, PLUS:
- Character development consistency
- Plot thread tracking
- Timeline coherence
- Callback opportunities
- Foreshadowing payoff

### Ongoing User Experience

**Weekly Workflow**:
1. Write 1-3 chapters during week
2. Upload to MythEdit at end of week
3. Review developmental feedback
4. Revise chapters based on feedback
5. Continue writing

**Usage Limits** (Subscription-based):
- Free Tier: 5 chapters/month (for testing)
- Standard Tier ($25/month): 40 chapters/month (~10/week)
- Pro Tier ($50/month): 100 chapters/month (~25/week)
- Enterprise Tier ($100/month): Unlimited

---

## 6. Pricing Model

### Cost Analysis

**Per Chapter Analysis** (4,000 words average):

**API Costs**:
- Claude Sonnet 4.5 (developmental feedback): $0.25
- OpenAI Embeddings (text-embedding-3-small): $0.01
- Claude Sonnet 4.5 (summary generation): $0.05
- **Total per chapter**: ~$0.31

**With 10% buffer**: $0.35/chapter

### Subscription Tiers

| Tier | Price/Month | Chapters/Month | Words/Month | Cost per Chapter | Gross Margin |
|------|-------------|----------------|-------------|------------------|--------------|
| **Free** | $0 | 5 | 20,000 | N/A | Loss leader |
| **Standard** | $25 | 40 | 160,000 | $0.63 | $11/user/month |
| **Pro** | $50 | 100 | 400,000 | $0.50 | $15/user/month |
| **Enterprise** | $100 | Unlimited* | Unlimited* | Variable | Variable |

*Unlimited tiers include fair use policy (max 500 chapters/month)

### Comparison to Traditional Editing

**80,000-word novel** (20 chapters × 4,000 words):

| Service | Cost | Time | MythEdit Savings |
|---------|------|------|------------------|
| **Professional Dev Editor** | $2,000-$5,000 | 4-12 weeks | **98% cheaper** |
| **MythEdit Standard** | $25-$50 | < 1 hour | -$1,950+ saved |

---

## 7. Sprint Plans

### Sprint 1 (Week 1): Core Editing Flow

**Goal**: Get basic chapter upload → AI feedback working

**Tasks**:
1. **Frontend**:
   - Project creation UI
   - Chapter upload component (drag-drop, file picker)
   - Feedback display page (summary report + inline highlights)
   - Loading states and error handling

2. **Backend**:
   - Chapter upload endpoint (parse .txt, .docx)
   - Claude API integration
   - Basic prompt engineering for developmental editing
   - Store feedback in PostgreSQL
   - Return feedback to frontend

3. **Database**:
   - Create new Prisma models:
     - `EditingFeedback`
     - `ChapterSummary`
     - `UsageTracking`

4. **Testing**:
   - Upload test chapters
   - Verify feedback quality
   - Measure API costs

**Deliverable**: Working chapter upload → feedback flow

---

### Sprint 2 (Week 2): RAG Context System

**Goal**: Add multi-chapter context awareness

**Tasks**:
1. **Vector Database**:
   - Set up Qdrant in Docker
   - Create embedding service
   - Embed uploaded chapters

2. **RAG Implementation**:
   - Generate chapter summaries with Claude
   - Tag summaries with entities (characters, places, events)
   - Retrieve relevant passages when analyzing new chapters
   - Update prompts to include context

3. **Subscription & Usage**:
   - Add user authentication (simple email/password)
   - Implement usage tracking
   - Enforce chapter limits per tier
   - Create usage dashboard

4. **Polish**:
   - Better feedback formatting
   - Export functionality (download feedback as text/PDF)
   - Error handling and retries
   - Performance optimization

**Deliverable**: Production-ready MVP with context awareness

---

## 8. Success Metrics

### MVP Success Criteria (Week 2)

**Technical**:
- ✅ Chapter upload works for .txt and .docx
- ✅ Feedback generated in < 60 seconds
- ✅ API costs under $0.40/chapter
- ✅ Multi-chapter context working correctly
- ✅ Usage tracking functional

**Quality**:
- ✅ Feedback is actionable and specific
- ✅ No hallucinations or false information
- ✅ Tone is professional and encouraging
- ✅ Series continuity checks work (test with 5+ chapters)

**User Experience**:
- ✅ Can complete full workflow in < 5 minutes (first use)
- ✅ No crashes or data loss
- ✅ Clear error messages
- ✅ Export works correctly

### Post-MVP Metrics (Month 1-3)

**User Acquisition**:
- 50 beta users (friends, writing community)
- 20% conversion to paid (10 paying users)
- < 10% churn rate

**Quality Metrics**:
- User satisfaction: > 4/5 stars
- Users report it catches issues they missed: > 80%
- Users prefer MythEdit to manual editing: > 70%

**Business Metrics**:
- Revenue: $250/month (10 users × $25)
- API costs: < $140/month
- Gross margin: > 40%

---

## 9. Post-MVP Roadmap

### Version 2.0: Copy Editing (Month 2-3)

**Features**:
- Grammar and spelling checks
- Punctuation and capitalization
- Dialogue formatting
- Style consistency (POV, tense, voice)
- Different feedback format (inline corrections)

**Integration**: GPT-4o or Claude for grammar (cheaper than Grammarly API)

### Version 3.0: Line Editing (Month 4-5)

**Features**:
- Sentence-level improvements
- Word choice optimization
- Flow and rhythm
- Clarity and conciseness
- Tone and voice refinement

### Version 4.0: Worldbuilding Tracker (Month 6+)

**Features** (Original requirements document):
- Automatic entity extraction (characters, locations, objects)
- Knowledge graph visualization (Neo4j)
- Conflict detection (description mismatches)
- Timeline construction
- Character relationship mapping
- Series-wide consistency tracking

**Integration**: Reuse existing Neo4j and Conflict models in database

### Version 5.0: Mythscribe Integration

**Vision**: Combine editing assistant with writing environment
- Write in Mythscribe (Scrivener-like interface)
- Get real-time AI feedback while writing
- Automatic worldbuilding tracking
- Unified platform for planning, writing, and editing

---

## 10. Technical Risks & Mitigation

### Risk 1: AI Feedback Quality Inconsistent

**Risk**: Claude provides generic or unhelpful feedback

**Mitigation**:
- Extensive prompt engineering and testing
- Include genre-specific guidelines in prompts
- Provide example feedback in prompts (few-shot learning)
- Iterate based on user feedback
- Consider fine-tuning for fiction editing (future)

### Risk 2: Context Retrieval Not Relevant

**Risk**: RAG retrieves wrong passages, loses important context

**Mitigation**:
- Test with various chapter types and lengths
- Tune embedding model and retrieval parameters
- Include chapter summaries as fallback
- Allow users to flag poor context (feedback loop)
- A/B test retrieval strategies

### Risk 3: API Costs Higher Than Expected

**Risk**: Claude API usage exceeds budget, loses money per user

**Mitigation**:
- Implement aggressive caching
- Set hard usage limits per tier
- Monitor costs per user in real-time
- Optimize prompts for token efficiency
- Consider batching requests
- Have kill switch for runaway costs

### Risk 4: Slow Processing Times

**Risk**: Users wait 2-3 minutes for feedback, poor UX

**Mitigation**:
- Use streaming responses where possible
- Show progress indicators ("Analyzing plot structure...")
- Process in background with webhooks/email notification
- Optimize prompt length
- Use faster models for summaries (Haiku)

### Risk 5: Data Privacy Concerns

**Risk**: Authors worry about their unpublished work being exposed

**Mitigation**:
- Clear privacy policy (data never used for training)
- Option to delete all data
- SOC 2 compliance (future)
- Encryption at rest and in transit
- Transparency about AI provider (Anthropic)

---

## Appendices

### A. Example Developmental Feedback

**Input**: Chapter 3 of epic fantasy novel (4,200 words)

**Output**:
```markdown
# Developmental Feedback: Chapter 3 - "The Crossing"

## Overall Assessment: 7.5/10

### Strengths
- **Strong Tension**: The bridge crossing scene maintains excellent suspense throughout
- **Vivid Description**: The frozen river and crumbling bridge are visceral and immersive
- **Character Voice**: Alaric's internal dialogue feels authentic and consistent with Chapter 1-2

### Areas to Improve

#### 1. Pacing Issue (Paragraphs 15-22)
**Severity**: Medium

The backstory dump about the bridge's history slows momentum during a tense action scene. Consider moving this exposition to Chapter 2 during the planning scene, or weave it in gradually.

**Specific Example**:
> "The Bridge of Sorrows had been built three hundred years ago by the legendary mason Thoric Ironhammer, who had..." [200 words of history]

**Suggestion**: Cut to 1-2 sentences max, or relocate entirely.

#### 2. Character Motivation Unclear
**Severity**: High

Why is Alaric risking his life to cross this dangerous bridge? The reader knows he needs to reach the capital (from Chapter 1), but not WHY it's urgent enough to risk death. This makes the danger feel arbitrary.

**Suggestion**: Add 2-3 sentences of internal dialogue where Alaric reminds himself why he must cross (e.g., "Three days. The summons had given him three days, and he'd already lost two...")

#### 3. Missed Foreshadowing Opportunity
**Severity**: Low

In Chapter 1, you established that Alaric has a fear of heights. This bridge scene would be a perfect callback to show his character growth or struggle with that fear.

**Suggestion**: Add a moment where he acknowledges his fear but pushes through, or where it hampers him and creates additional conflict.

### Continuity Notes
- ✅ Alaric's sword (the Soulblade mentioned in Ch 2) is referenced correctly
- ✅ Timeline is consistent (two days after departing, as expected)
- ⚠️ Brenna hasn't been mentioned since Chapter 2 - consider a brief thought about her to keep her present in the story

### Next Chapter Recommendations
- Show the consequences of the bridge crossing (injuries? equipment lost?)
- Introduce the capital city with the same vivid description you used for the bridge
- Consider raising the stakes further - what happens if Alaric is late?
```

### B. Glossary

- **RAG**: Retrieval-Augmented Generation - AI technique for providing relevant context
- **Developmental Editing**: Big-picture editing focused on story structure, character, pacing
- **Copy Editing**: Grammar, spelling, punctuation corrections
- **Line Editing**: Sentence-level improvements to prose quality
- **Token**: Unit of text for AI models (~4 characters or 0.75 words)
- **Embedding**: Vector representation of text for semantic search
- **Hallucination**: When AI invents false information

---

**End of Requirements Document**
