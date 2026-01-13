-- CreateEnum
CREATE TYPE "EditingType" AS ENUM ('DEVELOPMENTAL', 'COPY', 'LINE', 'PROOFREAD');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('CHARACTER', 'PLACE', 'EVENT', 'OBJECT', 'FACTION', 'MAGIC_ITEM');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'STANDARD', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED');

-- CreateEnum
CREATE TYPE "UsageAction" AS ENUM ('CHAPTER_UPLOAD', 'DEVELOPMENTAL_EDIT', 'COPY_EDIT', 'LINE_EDIT', 'PROOFREAD', 'SUMMARY_GENERATION', 'EMBEDDING_GENERATION');

-- CreateTable
CREATE TABLE "ChapterSummary" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "keyPoints" JSONB NOT NULL,
    "entities" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditingFeedback" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "type" "EditingType" NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "strengths" JSONB NOT NULL,
    "weaknesses" JSONB NOT NULL,
    "feedback" TEXT NOT NULL,
    "inlineHighlights" JSONB NOT NULL,
    "tokensUsed" INTEGER,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditingFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityMention" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityName" TEXT NOT NULL,
    "mentions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "chaptersPerMonth" INTEGER NOT NULL DEFAULT 5,
    "wordsPerMonth" INTEGER NOT NULL DEFAULT 20000,
    "chaptersUsed" INTEGER NOT NULL DEFAULT 0,
    "wordsUsed" INTEGER NOT NULL DEFAULT 0,
    "periodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT,
    "action" "UsageAction" NOT NULL,
    "tokensUsed" INTEGER,
    "wordsAnalyzed" INTEGER,
    "costUsd" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterSummary_chapterId_key" ON "ChapterSummary"("chapterId");

-- CreateIndex
CREATE INDEX "ChapterSummary_chapterId_idx" ON "ChapterSummary"("chapterId");

-- CreateIndex
CREATE INDEX "EditingFeedback_chapterId_idx" ON "EditingFeedback"("chapterId");

-- CreateIndex
CREATE INDEX "EditingFeedback_type_idx" ON "EditingFeedback"("type");

-- CreateIndex
CREATE INDEX "EntityMention_chapterId_idx" ON "EntityMention"("chapterId");

-- CreateIndex
CREATE INDEX "EntityMention_entityName_idx" ON "EntityMention"("entityName");

-- CreateIndex
CREATE INDEX "EntityMention_entityType_idx" ON "EntityMention"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_tier_idx" ON "Subscription"("tier");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "UsageRecord_userId_idx" ON "UsageRecord"("userId");

-- CreateIndex
CREATE INDEX "UsageRecord_createdAt_idx" ON "UsageRecord"("createdAt");

-- CreateIndex
CREATE INDEX "UsageRecord_action_idx" ON "UsageRecord"("action");

-- AddForeignKey
ALTER TABLE "ChapterSummary" ADD CONSTRAINT "ChapterSummary_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditingFeedback" ADD CONSTRAINT "EditingFeedback_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityMention" ADD CONSTRAINT "EntityMention_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageRecord" ADD CONSTRAINT "UsageRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
