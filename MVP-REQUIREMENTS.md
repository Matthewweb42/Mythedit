# MythEdit MVP Requirements & Implementation Plan

**Last Updated**: January 15, 2026
**Status**: Phase 1 - Database, Auth & Workspace Routes Complete ✅

---

## Executive Summary

MythEdit is a fully cloud-based AI developmental editor for fiction writers with two workspace types:
- **Free Edit**: Standalone chapters with no context tracking ($0.026/chapter)
- **Novel**: Multi-book projects with RAG-powered continuity checking

**Target Launch**: 5 weeks from kickoff
**Current Progress**: Week 1, Day 1 - Database schema updated and migrated

---

## Product Vision

### Core Value Propositions
1. **Affordable AI editing**: 90%+ cheaper than human developmental editors
2. **Series continuity tracking**: Catch character/timeline contradictions across books
3. **Flexible workflow**: Both quick practice drafts and full novel editing
4. **Google Docs-like UX**: Always-editable with inline AI suggestions

### Target Users
- Self-published fiction authors
- Writers working on series/multi-book projects
- Authors who need developmental feedback but can't afford $2000-5000 for human editors

---

## Architecture Decisions

### ✅ **APPROVED: Fully Cloud-Based**
- PostgreSQL database hosted on Railway/Render
- Backend API (Fastify + Node.js)
- Frontend (React + Vite) on Vercel
- Vector database (Qdrant) for RAG

**Cost**: ~$35-45/month infrastructure
**Break-even**: 2 paying users ($50/month revenue)
**Profit at 10 users**: $188/month (75% margin)

### ✅ **APPROVED: Authentication Methods**
- Email/password (primary)
- Magic link (passwordless)
- OAuth (Google) - deferred to v1.1

### ✅ **APPROVED: UI Layout**
Three-panel design:
```
┌─────────────────────────────────────────────────┐
│  Header: Logo | Workspace Selector | User Menu  │
├──────────┬─────────────────┬────────────────────┤
│ Projects │   Document      │   Tools Panel      │
│ (20%)    │   (60%)         │   (20%)            │
│          │                 │                    │
│ 📁 Free  │  Always-edit    │  Analysis Controls │
│  Edit    │  document with  │  Settings          │
│  - Ch1   │  inline AI      │  Export Options    │
│  - Ch2   │  highlights     │                    │
│          │                 │                    │
│ 📚 Novel │  [Accept] [Reject] [Edit]            │
│  Book 1  │                 │                    │
│  - Ch1✓  │                 │                    │
└──────────┴─────────────────┴────────────────────┘
```

---

## Workspace System

### **Free Edit Workspace**
- **Purpose**: Standalone chapter editing without context
- **Use Cases**: Practice scenes, short stories, experimental writing
- **Features**:
  - No chapter dependencies
  - No continuity checking
  - Faster analysis (no RAG lookup)
  - Cheaper (no embedding costs)
- **Cost**: ~$0.026/chapter
- **Created**: Default workspace on user signup

### **Novel Workspace**
- **Purpose**: Multi-book projects with full context awareness
- **Use Cases**: Novels, series, complete manuscripts
- **Features**:
  - Hierarchical structure: Workspace → Project → Book → Chapter
  - RAG-powered context retrieval
  - Continuity checking mode
  - Character/timeline tracking
- **Cost**: ~$0.03-0.05/chapter (includes embeddings)
- **Created**: User-initiated

### **Migration**
- ✅ Chapters can be moved between workspace types
- Moving from Free Edit → Novel enables context tracking
- Moving from Novel → Free Edit removes context (user warned)

---

## Analysis System

### **Analysis Modes** (All Approved)

1. **Developmental Editing** ✅ (Currently implemented)
   - Plot, pacing, character development, structure
   - Narrative technique, worldbuilding
   - Model: Claude Sonnet 4.5

2. **Dialogue & Voice** (To implement)
   - Character voice distinction
   - Dialogue naturalness
   - Tag usage, rhythm

3. **Line Editing** (To implement)
   - Sentence-level craft
   - Word choice, flow, clarity
   - Tone and voice refinement

4. **Continuity Check** (To implement - Novel workspaces only)
   - Character description consistency
   - Timeline contradictions
   - Location/object tracking
   - Requires RAG context

### **Analysis Depth Levels**

| Level | Model | Time | Cost | Output |
|-------|-------|------|------|--------|
| **Quick** | Haiku | ~10s | $0.005 | Score + top 3 issues |
| **Balanced** | Sonnet 4.5 | ~30s | $0.026 | Full feedback + highlights |
| **Deep Dive** | Sonnet Extended | ~60s | $0.10 | Comprehensive + rewrites |

**Free tier**: Quick + Balanced only
**Paid tiers**: All depths available

---

## Editing Experience

### ✅ **APPROVED: Google Docs Style**

**Always Editable**: Document is contentEditable by default

**AI Suggestions**:
- Appear automatically on highlighted text
- Shown inline (not hidden behind click)
- Accept/Reject/Edit buttons on hover

**Workflow**:
```
1. User uploads chapter
2. AI analyzes (30s)
3. Document displays with highlights
4. User hovers highlight → sees suggestion
5. User can:
   - Click [Accept] → text replaced
   - Click [Reject] → highlight dismissed
   - Click [Edit] → manual editing
   - Type anywhere → always allowed
```

**Auto-Save**: Every 30 seconds

**Versioning**: Manual "Save Draft" creates snapshot

---

## Export System

### ✅ **APPROVED: Export Formats**
- PDF (clean text after accepted edits)
- Word (.docx)
- Markdown (.md)
- Plain text (.txt)

**Export Content**: Clean chapter text only (feedback not included)
**Future**: Option to export with AI comments as Word track changes

---

## Free Tier & Subscription

### **Subscription Tiers**

| Tier | Price | Chapters/Month | Features |
|------|-------|----------------|----------|
| Free | $0 | 5 | Quick + Balanced depth |
| Standard | $25 | 40 | All modes + Deep Dive |
| Pro | $50 | 100 | Priority processing |
| Enterprise | $100 | Unlimited* | API access, custom models |

*Fair use policy applies

### **Enforcement**
- Usage tracked in `UsageRecord` model
- Subscription status checked on upload
- Graceful blocking UI (upgrade prompt)

---

## Database Schema

### ✅ **COMPLETED: Workspace Schema**

**New Models**:
```prisma
model Workspace {
  id        String        @id @default(cuid())
  userId    String
  type      WorkspaceType // FREE_EDIT | NOVEL
  name      String
  projects  Project[]     // Novel workspaces
  chapters  Chapter[]     // Free Edit workspaces
}

enum WorkspaceType {
  FREE_EDIT
  NOVEL
}
```

**Updated Models**:
- `User`: Added `passwordHash`, `workspaces[]`
- `Project`: Added `workspaceId` (belongs to NOVEL workspace)
- `Chapter`: Made `bookId` optional, added `workspaceId` (for FREE_EDIT)

**Migration**: Applied on January 14, 2026 (`20260114173744_add_workspaces`)

---

## Implementation Roadmap

### **Phase 1: Database & Auth** (Week 1) ✅ **COMPLETED**

✅ **Task 1**: Update Prisma schema with Workspace model
✅ **Task 2**: Add workspace relationships to Chapter/Project
✅ **Task 3**: Create and apply database migration
✅ **Task 4**: Implement JWT authentication service
✅ **Task 5**: Create auth routes (register, login, magic link)
✅ **Task 6**: Implement workspace CRUD endpoints

⏳ **Task 7**: Add subscription tier enforcement middleware (moved to Phase 2)

**Deliverables**:
- ✅ User registration/login working
- ✅ JWT tokens issued and validated
- ✅ Workspace creation/listing endpoints
- ⏳ Subscription limits enforced (deferred to Phase 2)

**Files Created**:
- `backend/src/services/auth.service.ts` - JWT auth, password hashing, magic links
- `backend/src/middleware/auth.middleware.ts` - Route protection middleware
- `backend/src/routes/auth.ts` - Auth endpoints (register, login, magic-link)
- `backend/src/routes/workspaces.ts` - Workspace CRUD endpoints

**API Endpoints Added**:
- POST /api/auth/register - Email/password registration
- POST /api/auth/login - Email/password login
- POST /api/auth/magic-link/request - Request magic link
- POST /api/auth/magic-link/verify - Verify magic link and login
- GET /api/auth/me - Get current user (protected)
- POST /api/auth/logout - Logout
- GET /api/workspaces - List user's workspaces
- GET /api/workspaces/:id - Get workspace by ID
- POST /api/workspaces - Create workspace
- PATCH /api/workspaces/:id - Update workspace name
- DELETE /api/workspaces/:id - Delete workspace

### **Phase 2: Multi-Mode Analysis** (Week 2)
- Create prompts for Dialogue, Line Edit, Continuity modes
- Update ClaudeService to support mode selection
- Implement depth levels (Haiku/Sonnet/Extended)
- Store multiple EditingFeedback records per chapter
- Build mode selection UI in right panel

### **Phase 3: RAG & Continuity** (Week 2-3)
- Set up Qdrant vector database
- Implement embedding service (OpenAI)
- Re-enable chapter summary generation
- Store summaries as vectors
- Implement context retrieval for Novel workspaces
- Build continuity checking logic

### **Phase 4: Google Docs Editor** (Week 3-4)
- Replace ChapterView with ContentEditable component
- Render inline AI highlights
- Add Accept/Reject/Edit buttons on hover
- Implement auto-save (30s debounce)
- Build version history UI
- Conflict resolution for concurrent edits

### **Phase 5: Export & Polish** (Week 4)
- PDF export (jsPDF or Puppeteer)
- Word export (docx library)
- Markdown/TXT export
- Loading states and progress bars
- Comprehensive error handling
- UI polish

### **Phase 6: Deployment** (Week 5)
- Railway/Render setup for backend + DB
- Vercel deployment for frontend
- Environment variable configuration
- Email service integration (SendGrid)
- Production database migrations
- Monitoring (Sentry)

---

## Success Metrics

**Technical**:
- ✅ Database schema supports both workspace types
- ⏳ Auth flow: registration → login → JWT validation
- ⏳ Workspace CRUD operations functional
- ⏳ All 4 analysis modes working
- ⏳ Real-time editing with auto-save
- ⏳ AI suggestions inline with Accept/Reject
- ⏳ Export to 4 formats
- ⏳ Deployed to production

**Performance**:
- Chapter analysis: <60 seconds
- Cost per chapter: <$0.10 (Balanced depth)
- Auto-save latency: <500ms
- Page load: <2 seconds

**Business**:
- 10 beta users signed up
- 5 paying subscribers (break-even)
- 95%+ uptime
- Zero data loss incidents

---

## Next Steps (Immediate)

**Today's Tasks**:
1. ✅ Update Prisma schema
2. ✅ Create workspace migration
3. ⏳ Implement JWT authentication service
4. ⏳ Create auth API routes
5. ⏳ Build workspace CRUD endpoints

**This Week**:
- Complete Phase 1 (Database & Auth)
- User can register, login, create workspaces
- Subscription tier enforcement working

**Questions to Resolve**:
- Email service provider: SendGrid vs. Postmark vs. AWS SES?
- JWT expiration: 7 days or 30 days?
- Magic link expiration: 15 minutes?
- Default workspace name for Free Edit: "My Drafts" or "Practice"?

---

## Cost Projections

**Infrastructure** (monthly):
| Service | Cost |
|---------|------|
| PostgreSQL (Railway) | $10 |
| Backend hosting | $10 |
| Frontend (Vercel) | Free |
| Qdrant (vector DB) | $10-20 |
| Email service | $5 |
| **Total** | **$35-45** |

**Per-User Costs** (40 chapters/month):
| Service | Cost |
|---------|------|
| Claude Sonnet (Balanced) | $1.04 |
| Chapter summaries (Haiku) | $0.20 |
| Embeddings (OpenAI) | $0.40 |
| **Total** | **$1.64/user** |

**Revenue Scenarios**:
- 10 Standard users: $250/month revenue - $45 infrastructure - $16.40 AI = **$188.60 profit** (75% margin)
- 20 Standard users: $500/month revenue - $45 - $32.80 = **$422.20 profit** (84% margin)
- 50 Standard users: $1,250/month revenue - $45 - $82 = **$1,123 profit** (90% margin)

**Conclusion**: Business model is highly profitable with excellent unit economics.

---

## Risk Mitigation

**Risks**:
1. **API cost increases**: Anthropic raises Claude pricing
   - Mitigation: Monitor costs weekly, adjust tiers if needed
2. **User retention**: Free users don't convert
   - Mitigation: Make free tier valuable enough to hook users
3. **Competition**: ChatGPT Plus is $20/month
   - Mitigation: Focus on series continuity as differentiator
4. **Technical debt**: Moving fast creates bugs
   - Mitigation: Comprehensive error handling, logging, monitoring

---

## Technical Stack Summary

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- ContentEditable (Google Docs-like editor)

**Backend**:
- Node.js + Fastify
- Prisma ORM
- TypeScript
- JWT (authentication)

**Databases**:
- PostgreSQL (primary data)
- Qdrant (vector search for RAG)

**AI Services**:
- Claude Sonnet 4.5 (developmental editing)
- Claude Haiku (summaries, quick analysis)
- OpenAI text-embedding-3-small (embeddings)

**Infrastructure**:
- Railway/Render (backend + DB)
- Vercel (frontend)
- SendGrid (email)
- Sentry (monitoring)

---

## Changelog

**2026-01-15**:
- ✅ Installed JWT and bcrypt packages (jsonwebtoken, bcryptjs)
- ✅ Created AuthService with password hashing, JWT generation, magic links
- ✅ Implemented auth middleware (authenticateToken, optionalAuth)
- ✅ Created auth routes (register, login, magic-link, me, logout)
- ✅ Created workspace CRUD routes (list, get, create, update, delete)
- ✅ Registered auth and workspace routes in server
- ✅ Updated upload flow: chapters upload immediately, analysis on-demand
- ✅ Changed FeedbackSidebar to depth-based buttons (Quick/Balanced/Deep)
- ✅ Fixed chapter formatting preservation with `<pre>` tag
- ✅ **Phase 1 Complete**: Database, Auth & Workspace infrastructure ready

**2026-01-14**:
- ✅ Created comprehensive requirements document
- ✅ Updated Prisma schema with Workspace model
- ✅ Added WorkspaceType enum (FREE_EDIT, NOVEL)
- ✅ Made Chapter.bookId optional, added Chapter.workspaceId
- ✅ Added Project.workspaceId for Novel workspaces
- ✅ Added User.passwordHash for auth
- ✅ Applied database migration `20260114173744_add_workspaces`
- 📝 Documented all approved decisions from user conversation
- 📋 Created 5-week implementation roadmap

**Next Update**: After Phase 2 (Multi-mode analysis system)

---

**Document Status**: Living document - update after each phase completion
