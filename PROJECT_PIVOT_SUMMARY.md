# MythEdit Project Pivot Summary

**Date**: January 12, 2026
**Status**: Major Restructure Complete

---

## 🎯 What Changed?

### **BEFORE**: Worldbuilding & Continuity Tracker
- Original vision: Extract characters, locations, magic systems
- Build knowledge graph of story elements
- Catch inconsistencies (eye color, timelines, etc.)
- Visualization-heavy

### **AFTER**: AI Developmental Editor
- **New vision**: Professional developmental editing for indie authors
- Make editing affordable ($25/month vs $2,000-5,000 per book)
- Focus on plot, character, pacing, structure feedback
- Worldbuilding features moved to post-MVP

---

## 📊 Why the Pivot?

**Key Insights from User Interview**:
1. **Editing is the #1 pain point** for indie authors (expensive & time-consuming)
2. **Developmental editing costs $0.02-$0.05 per word** ($2,000-5,000 per 80k-word novel)
3. User has **50 chapters already written** - needs editing NOW
4. **Worldbuilding tracking** is nice-to-have, but not urgent
5. Target market: **10-book epic fantasy series** with complex continuity needs

**Business Model**:
- Subscription: $25-50/month
- 40-100 chapters/month limit
- Cost per chapter: ~$0.30-$0.40 (AI API)
- **Gross margin: $11-15/user/month**

---

## 🏗️ New Architecture

### **Tech Stack**:
- **AI**: Claude Sonnet 4.5 (Anthropic) for developmental editing
- **RAG**: Qdrant vector database + chapter summaries for context
- **Backend**: Node.js + Fastify + Prisma (PostgreSQL)
- **Frontend**: React + Vite + Tailwind CSS
- **Keep for future**: Neo4j (worldbuilding graph), Conflict detection

### **Data Flow**:
```
User uploads chapter →
  Store in PostgreSQL →
    Generate summary with entity tags →
      Embed in Qdrant vector DB →
        Retrieve context from previous chapters →
          Call Claude API for developmental feedback →
            Display feedback + inline highlights →
              Track usage for subscription limits
```

---

## 📋 Updated Database Schema

### **New Models**:
- `ChapterSummary` - AI-generated summaries with tagged entities
- `EditingFeedback` - Developmental feedback from Claude
- `EntityMention` - Track character/place mentions for RAG
- `Subscription` - User subscription tier and limits
- `UsageRecord` - Track API costs and usage

### **Kept Models** (for future worldbuilding features):
- `User`, `Project`, `Book`, `Chapter`
- `Conflict` (for continuity tracking in v2)
- `ConflictType`, `ConflictSeverity`, `ConflictStatus` enums

---

## 🚀 MVP Scope (Weeks 1-2)

### **Sprint 1 (Week 1)**: Core Editing Flow
- Chapter upload (.txt, .docx)
- Claude API integration
- Display developmental feedback (summary + inline highlights)
- Basic project/book/chapter management

### **Sprint 2 (Week 2)**: RAG Context + Production Ready
- Chapter summary generation
- Qdrant vector database setup
- Multi-chapter context awareness
- User authentication & subscription limits
- Export functionality
- Production deployment

---

## 📝 New Documentation Created

1. **REQUIREMENTS.md** - Complete rewrite for AI developmental editor
2. **docs/SPRINT_PLANS.md** - Detailed day-by-day tasks for 2-week MVP
3. **docs/CLAUDE_API_SETUP.md** - How to get API keys and integrate Claude
4. **backend/prisma/schema.prisma** - Updated with editing-focused models

---

## 💰 Cost Analysis

### **Development (2 weeks)**:
- Claude API testing: ~$10-50
- Total: **Under $50** ✅

### **Production (Per User Per Month)**:
- Standard tier ($25/mo): 40 chapters
- API cost: ~$14 (40 chapters × $0.35)
- **Profit: $11/user/month**

### **Scalability**:
- 100 users = $2,500 revenue, $1,400 API costs, **$1,100 profit/month**
- 1,000 users = $25,000 revenue, $14,000 API costs, **$11,000 profit/month**

---

## 🎯 Success Metrics

### **MVP (End of Week 2)**:
- [ ] Chapter upload works for .txt and .docx
- [ ] Developmental feedback generated in < 60 seconds
- [ ] Feedback quality rated 4+/5 by testers
- [ ] API costs < $0.40/chapter
- [ ] Multi-chapter context working correctly
- [ ] User auth and subscription limits functional
- [ ] Export working
- [ ] Ready for beta with 10-20 users

### **Month 1-3** (Post-MVP):
- 50 beta users
- 20% conversion to paid (10 paying users)
- $250/month revenue
- < 10% churn rate
- User satisfaction > 4/5

---

## 🔮 Post-MVP Roadmap

### **v1.1 (Month 2)**: Copy Editing
- Grammar, spelling, punctuation
- Dialogue formatting
- Style consistency checks

### **v2.0 (Month 3-4)**: Line Editing
- Sentence-level improvements
- Word choice optimization
- Flow and rhythm

### **v3.0 (Month 6+)**: Worldbuilding Tracker
- Resurrect original vision
- Automatic entity extraction
- Knowledge graph visualization
- Continuity conflict detection
- Character relationship mapping

### **v4.0 (Future)**: Mythscribe Integration
- Combine editing with writing environment
- Real-time feedback while writing
- Unified platform for planning, writing, editing

---

## 🚨 Key Risks & Mitigation

1. **AI Feedback Quality Inconsistent**
   - Mitigation: Extensive prompt engineering, user feedback loop
   - Already planned in Sprint 1 (Day 5: Prompt Tuning)

2. **API Costs Higher Than Expected**
   - Mitigation: Track costs daily, cache aggressively, use Haiku for summaries
   - Budget alerts set at $10, $25, $50

3. **RAG Retrieval Not Accurate**
   - Mitigation: Test extensively, tune parameters, fall back to summaries
   - Sprint 2 includes thorough testing

4. **Time Constraints (2 weeks is aggressive)**
   - Mitigation: Focus on core features only, extend if needed
   - Detailed daily tasks in Sprint Plans

---

## ✅ What's Already Done

- ✅ Docker databases running (PostgreSQL, Neo4j, Redis)
- ✅ Backend initialized (Fastify + Prisma + TypeScript)
- ✅ Frontend initialized (React + Vite + Tailwind)
- ✅ Database schema updated and migrated
- ✅ Requirements document rewritten
- ✅ Sprint plans created
- ✅ Claude API guide written
- ✅ All documentation updated

---

## 📂 File Structure (Updated)

```
MythEdit/
├── REQUIREMENTS.md (NEW - comprehensive rewrite)
├── PROJECT_PIVOT_SUMMARY.md (NEW - this file)
├── README.md (needs minor update)
├── SETUP.md
├── QUICKSTART.md
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma (UPDATED - editing models added)
│   ├── src/
│   │   ├── server.ts
│   │   └── services/ (to be created in Sprint 1)
│   │       ├── claude.service.ts
│   │       ├── embedding.service.ts
│   │       └── usage.service.ts
│   └── .env (UPDATED - needs ANTHROPIC_API_KEY)
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   └── components/ (to be created in Sprint 1)
│   │       ├── ChapterUpload.tsx
│   │       ├── FeedbackDisplay.tsx
│   │       └── ProjectTree.tsx
│   └── .env
│
├── docker/
│   └── docker-compose.yml (will add Qdrant in Sprint 2)
│
└── docs/
    ├── SETUP_SUMMARY.md
    ├── SPRINT_PLANS.md (NEW - detailed task breakdown)
    └── CLAUDE_API_SETUP.md (NEW - API integration guide)
```

---

## 🎬 Next Steps

### **Immediate (Today/Tomorrow)**:
1. Get Anthropic API key (see [CLAUDE_API_SETUP.md](docs/CLAUDE_API_SETUP.md))
2. Add `ANTHROPIC_API_KEY` to `backend/.env`
3. Review Sprint 1 plan (see [SPRINT_PLANS.md](docs/SPRINT_PLANS.md))
4. Start Day 1 tasks

### **This Week (Sprint 1)**:
- Days 1-2: Backend - Chapter upload + Claude integration
- Days 3-4: Frontend - Upload UI + feedback display
- Day 5: Integration & testing
- Days 6-7: Polish & buffer

### **Next Week (Sprint 2)**:
- Days 8-9: Qdrant setup + RAG implementation
- Days 10-11: Context-aware editing
- Day 12: Auth & subscriptions
- Day 13: Export & polish
- Day 14: Testing & deploy prep

---

## 📞 Support & Questions

If you have questions during development:

1. **Claude API Issues**: See [CLAUDE_API_SETUP.md](docs/CLAUDE_API_SETUP.md)
2. **Sprint Tasks**: See [SPRINT_PLANS.md](docs/SPRINT_PLANS.md)
3. **Architecture Questions**: See [REQUIREMENTS.md](REQUIREMENTS.md) Section 4

---

## 🎉 Summary

**What we did today**:
- ✅ Clarified vision through detailed Q&A
- ✅ Pivoted from worldbuilding tracker to AI developmental editor
- ✅ Rewrote complete requirements document
- ✅ Updated database schema with editing models
- ✅ Created detailed 2-week sprint plans
- ✅ Wrote Claude API setup guide
- ✅ Migrated database
- ✅ Documented everything

**What you have now**:
- Clear, focused MVP scope (AI developmental editing)
- Realistic 2-week timeline with daily tasks
- Updated tech stack optimized for editing (RAG + Claude)
- Complete documentation to guide development
- Database ready for editing features
- Foundation for profitable business ($11-15/user/month margin)

**What you need to do**:
- Get Claude API key
- Start Sprint 1 (chapter upload + Claude integration)
- Build MVP in 2 weeks
- Launch to beta users

---

**Status**: ✅ Project restructure complete. Ready to code!
