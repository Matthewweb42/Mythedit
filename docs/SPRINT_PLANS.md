# MythEdit Sprint Plans

**Project**: AI Developmental Editor for Fiction Writers
**Timeline**: 2 weeks (Sprint 1 + Sprint 2)
**Last Updated**: January 12, 2026

---

## Sprint Overview

| Sprint | Duration | Goal | Deliverable |
|--------|----------|------|-------------|
| **Sprint 1** | Week 1 (7 days) | Core Editing Flow | Chapter upload → AI feedback working |
| **Sprint 2** | Week 2 (7 days) | RAG Context + Polish | Multi-chapter context, subscriptions, production-ready |

---

## Sprint 1: Core Editing Flow (Week 1)

**Goal**: Get the basic chapter upload and AI developmental feedback working end-to-end.

**Success Criteria**:
- ✅ User can upload a chapter (.txt or .docx)
- ✅ Chapter is analyzed by Claude API
- ✅ Developmental feedback is displayed in UI
- ✅ Feedback quality is good (specific, actionable)
- ✅ API costs are under $0.40/chapter

---

### Day 1-2: Backend - Chapter Upload & Storage

**Tasks**:

1. **Update Chapter Upload Route** [`backend/src/routes/chapters.ts`]
   - Accept .txt and .docx files
   - Parse file content (use `mammoth` for .docx)
   - Calculate word count
   - Store in PostgreSQL via Prisma
   - Return chapter ID and status

2. **Create Claude Service** [`backend/src/services/claude.service.ts`]
   - Install Anthropic SDK: `npm install @anthropic-ai/sdk`
   - Create service class for Claude API calls
   - Implement `analyzechapter()` method
   - Handle errors and rate limits
   - Track token usage

3. **Create Basic Prompt Template** [`backend/src/prompts/developmental-editing.ts`]
   - Define system prompt for developmental editing
   - Include genre-specific guidelines
   - Format for structured output (JSON)

**Deliverables**:
- [ ] Chapter upload endpoint working
- [ ] Claude service configured
- [ ] Basic developmental editing prompt

**Files to Create**:
```
backend/src/
├── routes/
│   └── chapters.ts (update)
├── services/
│   └── claude.service.ts (new)
└── prompts/
    └── developmental-editing.ts (new)
```

---

### Day 3-4: Frontend - Upload UI & Feedback Display

**Tasks**:

1. **Create Chapter Upload Component** [`frontend/src/components/ChapterUpload.tsx`]
   - Drag-and-drop file upload
   - File type validation (.txt, .docx)
   - Upload progress indicator
   - Success/error handling

2. **Create Feedback Display Component** [`frontend/src/components/FeedbackDisplay.tsx`]
   - Display overall score and assessment
   - Show strengths and weaknesses
   - Render inline highlights (with line numbers)
   - Format markdown feedback

3. **Create Project Management Pages**
   - Project list view
   - Book/chapter tree view
   - Chapter detail page with feedback

**Deliverables**:
- [ ] Upload UI functional
- [ ] Feedback display looks good
- [ ] Navigation between projects/chapters works

**Files to Create**:
```
frontend/src/
├── components/
│   ├── ChapterUpload.tsx (new)
│   ├── FeedbackDisplay.tsx (new)
│   └── ProjectTree.tsx (new)
└── pages/
    ├── ProjectsPage.tsx (new)
    └── ChapterDetailPage.tsx (new)
```

---

### Day 5: Integration & Testing

**Tasks**:

1. **End-to-End Testing**
   - Upload test chapter
   - Verify Claude API call
   - Check feedback quality
   - Test error cases (invalid file, API error)

2. **Prompt Tuning**
   - Iterate on developmental editing prompt
   - Test with different genres
   - Ensure feedback is specific and actionable
   - Verify no hallucinations

3. **Cost Analysis**
   - Measure actual API costs
   - Track token usage
   - Optimize prompt if needed

**Test Chapters**:
- Epic fantasy (5,000 words)
- Contemporary fiction (3,500 words)
- Urban fantasy (4,200 words)

**Deliverables**:
- [ ] Full workflow tested
- [ ] Feedback quality validated
- [ ] Costs measured and documented

---

### Day 6-7: Buffer & Polish

**Tasks**:

1. **Bug Fixes**
   - Fix any issues found during testing
   - Improve error handling
   - Add loading states

2. **UI Polish**
   - Improve feedback formatting
   - Add syntax highlighting for code/markdown
   - Better error messages

3. **Documentation**
   - Update API documentation
   - Create user guide for MVP
   - Document Claude prompt structure

**Deliverables**:
- [ ] Sprint 1 goals met
- [ ] Ready for Sprint 2
- [ ] Demo-able to stakeholders

---

## Sprint 2: RAG Context + Production Ready (Week 2)

**Goal**: Add multi-chapter context awareness and prepare for production launch.

**Success Criteria**:
- ✅ Chapter summaries generated and stored
- ✅ Vector database (Qdrant) operational
- ✅ Context retrieval working for new chapters
- ✅ User authentication implemented
- ✅ Subscription limits enforced
- ✅ Export functionality working

---

### Day 8-9: RAG Implementation - Vector Database

**Tasks**:

1. **Setup Qdrant in Docker** [`docker/docker-compose.yml`]
   - Add Qdrant service to docker-compose
   - Configure volume for persistence
   - Set up health checks

2. **Create Embedding Service** [`backend/src/services/embedding.service.ts`]
   - Install OpenAI SDK: `npm install openai`
   - Implement chapter embedding generation
   - Store embeddings in Qdrant
   - Implement semantic search

3. **Create Chapter Summary Service** [`backend/src/services/summary.service.ts`]
   - Generate summaries with Claude (use Claude Haiku for cost)
   - Extract key plot points
   - Tag entities (characters, places, events)
   - Store in `ChapterSummary` model

**Deliverables**:
- [ ] Qdrant running in Docker
- [ ] Chapters embedded in vector DB
- [ ] Summary generation working

**Files to Create**:
```
backend/src/services/
├── embedding.service.ts (new)
├── summary.service.ts (new)
└── rag.service.ts (new)
```

---

### Day 10-11: Context-Aware Editing

**Tasks**:

1. **Update Developmental Editing Flow**
   - Retrieve previous chapter summaries
   - Search vector DB for relevant passages
   - Include context in Claude prompt
   - Test with multi-chapter series

2. **Enhanced Prompt Template**
   - Add section for prior context
   - Include character/plot continuity checks
   - Add timeline coherence verification

3. **Testing with Series**
   - Upload 5-10 chapters of test novel
   - Verify context is used correctly
   - Check continuity feedback quality

**Example Context Prompt**:
```
Previous Chapters Summary:
- Chapter 1: Hero introduced, receives quest
- Chapter 2: Meets companion, journey begins
- Chapter 3: First major conflict

Current Chapter to Analyze:
[Chapter 4 text...]

Provide developmental feedback considering the story so far.
Check for continuity with previous chapters.
```

**Deliverables**:
- [ ] Context retrieval functional
- [ ] Multi-chapter feedback working
- [ ] Continuity checks validated

---

### Day 12: User Authentication & Subscriptions

**Tasks**:

1. **Implement Authentication** (Simple email/password for MVP)
   - Install: `npm install bcrypt jsonwebtoken`
   - Create signup/login endpoints
   - JWT-based auth
   - Protect routes

2. **Subscription Management**
   - Create subscription on signup (default: FREE tier)
   - Implement usage tracking
   - Enforce chapter/word limits
   - Reset usage monthly

3. **Usage Dashboard**
   - Display current tier
   - Show usage (X/40 chapters this month)
   - Progress bars for limits

**Deliverables**:
- [ ] Auth working (signup, login, logout)
- [ ] Usage tracking functional
- [ ] Limits enforced

**Files to Create**:
```
backend/src/
├── routes/
│   └── auth.ts (new)
├── middleware/
│   └── auth.middleware.ts (new)
└── services/
    └── usage.service.ts (new)

frontend/src/
└── components/
    ├── LoginForm.tsx (new)
    ├── SignupForm.tsx (new)
    └── UsageDashboard.tsx (new)
```

---

### Day 13: Export & Polish

**Tasks**:

1. **Export Functionality**
   - Export chapter with inline comments (HTML)
   - Export feedback as PDF
   - Export feedback as Markdown
   - Download original chapter

2. **UI/UX Polish**
   - Better loading states ("Analyzing plot structure...")
   - Error recovery (retry failed analyses)
   - Confirmation dialogs
   - Toast notifications

3. **Performance Optimization**
   - Cache chapter summaries
   - Debounce file uploads
   - Optimize database queries
   - Lazy load chapter list

**Deliverables**:
- [ ] Export working
- [ ] UI polished
- [ ] Performance good

---

### Day 14: Testing, Documentation & Deploy Prep

**Tasks**:

1. **End-to-End Testing**
   - Test full user journey (signup → upload → feedback → export)
   - Test with multiple users
   - Test error cases
   - Load testing (10 concurrent uploads)

2. **Documentation**
   - Update README with new architecture
   - Create user guide
   - Document API endpoints
   - Create deployment guide

3. **Production Prep**
   - Environment variables for production
   - Database backup strategy
   - Monitoring setup (Sentry)
   - Cost tracking dashboard

4. **Optional: Deploy to Staging**
   - Deploy to Railway or Render
   - Test with real domain
   - Verify all services working

**Deliverables**:
- [ ] All Sprint 2 goals met
- [ ] MVP production-ready
- [ ] Documentation complete
- [ ] Ready for beta users

---

## Daily Standup Template

Track progress daily with this template:

**Date**: _______

**Yesterday**:
- [ ] Task 1
- [ ] Task 2

**Today**:
- [ ] Task 3
- [ ] Task 4

**Blockers**:
- None / [describe blocker]

**Notes**:
- [Any observations, ideas, or concerns]

---

## Sprint Retrospective Template

At end of each sprint:

### What Went Well ✅
-

### What Didn't Go Well ❌
-

### What We Learned 💡
-

### Action Items for Next Sprint 🎯
-

---

## Risk Management

### High-Priority Risks

**Risk 1: Claude API Costs Higher Than Expected**
- **Mitigation**: Track costs daily, set budget alerts, optimize prompts
- **Contingency**: Switch to cheaper model (Haiku) or reduce context window

**Risk 2: RAG Retrieval Not Accurate**
- **Mitigation**: Test extensively with various chapter types
- **Contingency**: Fall back to summary-only context

**Risk 3: Time Constraints (1-2 weeks is aggressive)**
- **Mitigation**: Focus on core features, cut nice-to-haves
- **Contingency**: Extend to 3 weeks if needed, or reduce scope

**Risk 4: Claude API Rate Limits**
- **Mitigation**: Implement exponential backoff, queue system
- **Contingency**: Show user "processing" message, process async

---

## Success Metrics

### Sprint 1 Success Criteria
- [ ] Chapter upload works for .txt and .docx
- [ ] Feedback generated in < 60 seconds
- [ ] API costs < $0.40/chapter
- [ ] Feedback quality rated 4+/5 by testers

### Sprint 2 Success Criteria
- [ ] Multi-chapter context working correctly
- [ ] User auth functional
- [ ] Usage tracking accurate
- [ ] Export working
- [ ] Zero critical bugs
- [ ] Production deployment successful

### Overall MVP Success (End of Week 2)
- [ ] Can upload chapter and get developmental feedback
- [ ] Feedback includes series continuity checks
- [ ] Users can manage their subscription and usage
- [ ] Export functionality works
- [ ] Cost per chapter under $0.40
- [ ] User satisfaction > 4/5
- [ ] Ready for beta testing with 10-20 users

---

## Post-Sprint Backlog

**Features for v1.1 (Month 2)**:
- Copy editing mode
- Improved inline comment UI
- Re-upload/compare versions
- Character arc tracking
- Better export formats (Word with comments)

**Features for v2.0 (Month 3-4)**:
- Line editing mode
- Worldbuilding graph visualization
- Collaborative features
- Integration with Mythscribe

---

**Status**: Ready to Execute
**Team**: 1 developer (5-10 hours/week)
**Timeline**: 2 weeks
**Budget**: ~$50 for AI API costs during development
