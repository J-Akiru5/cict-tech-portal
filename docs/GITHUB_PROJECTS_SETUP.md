# GitHub Projects Setup Guide

## Step 1: Create Project Board

1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/cict-tech-portal`
2. Click **Projects** tab → **Link a project** → **New project**
3. Choose **Board** template
4. Name it: **CICT IT Tech Portal Development**

---

## Step 2: Configure Columns (Kanban)

| Column | Purpose |
|--------|---------|
| 📥 **Backlog** | Future items, not yet refined |
| 📋 **Ready** | Refined, ready to start |
| 🔄 **In Progress** | Currently working on |
| 👀 **In Review** | PR submitted, awaiting review |
| ✅ **Done** | Completed and merged |

---

## Step 3: Create Labels (Issues)

Go to **Issues** → **Labels** → Create these:

| Label | Color | Description |
|-------|-------|-------------|
| `epic:infrastructure` | `#0052CC` | Setup, deployment |
| `epic:landing-page` | `#5319E7` | Public pages |
| `epic:auth-rbac` | `#0E8A16` | Authentication |
| `epic:student-portal` | `#FBCA04` | Student features |
| `epic:officer-modules` | `#D93F0B` | Officer pages |
| `epic:ai-features` | `#B60205` | Chatbot, AI |
| `epic:admin` | `#1D76DB` | Admin features |
| `priority:high` | `#B60205` | Critical path |
| `priority:medium` | `#FBCA04` | Should have |
| `priority:low` | `#0E8A16` | Nice to have |
| `type:bug` | `#D73A4A` | Bug fix |
| `type:feature` | `#A2EEEF` | New feature |
| `type:docs` | `#0075CA` | Documentation |

---

## Step 4: Create Milestones

Go to **Issues** → **Milestones** → **New milestone**:

| Milestone | Due Date | Description |
|-----------|----------|-------------|
| v0.1 - Landing Page | Week 2 | Public pages complete |
| v0.2 - Auth Complete | Week 3 | Login/register working |
| v0.3 - Student Portal | Week 5 | Student dashboard |
| v0.4 - Officer Modules | Week 7 | All officer features |
| v0.5 - AI Integration | Week 9 | Chatbot working |
| v1.0 - Full Release | Week 11 | Production ready |

---

## Step 5: Create Issues (Copy-Paste Ready)

### Epic: Infrastructure

```markdown
### #1 Set up PlanetScale Database
**Labels:** `epic:infrastructure`, `priority:high`
**Milestone:** v0.2

- [ ] Create PlanetScale database
- [ ] Configure .env with connection string
- [ ] Test migrations
- [ ] Set up production branch
```

```markdown
### #2 Configure DigitalOcean Spaces
**Labels:** `epic:infrastructure`, `priority:high`
**Milestone:** v0.2

- [ ] Create cict-portal folder prefix
- [ ] Update filesystems.php config
- [ ] Test file uploads
- [ ] Configure CORS settings
```

```markdown
### #3 Set up GitHub Actions CI/CD
**Labels:** `epic:infrastructure`, `priority:medium`
**Milestone:** v0.2

- [ ] Create workflow file
- [ ] Configure test runner
- [ ] Set up deploy to DigitalOcean
- [ ] Add environment secrets
```

---

### Epic: Landing Page

```markdown
### #5 Install Locomotive Scroll ✅ DONE
**Labels:** `epic:landing-page`
```

```markdown
### #6 Create PublicLayout ✅ DONE
**Labels:** `epic:landing-page`
```

```markdown
### #7 Build Hero Section ✅ DONE
**Labels:** `epic:landing-page`
```

```markdown
### #8 Create glassmorphic card components ✅ DONE
**Labels:** `epic:landing-page`
```

```markdown
### #9 Build Announcements Page
**Labels:** `epic:landing-page`, `priority:high`
**Milestone:** v0.1

- [ ] Create Announcement model
- [ ] Build announcements list page
- [ ] Add filtering by category
- [ ] Implement pagination
```

```markdown
### #10 Create Digital Bulletin Board
**Labels:** `epic:landing-page`, `priority:medium`
**Milestone:** v0.1

- [ ] Design achievement cards
- [ ] Create carousel component
- [ ] Add admin management
```

```markdown
### #11 Build Organizational Chart
**Labels:** `epic:landing-page`, `priority:high`
**Milestone:** v0.1

- [ ] Create Officer model
- [ ] Build interactive tree component
- [ ] Add academic year filtering
- [ ] Admin editor for org chart
```

```markdown
### #12 Create Officer Schedule Display
**Labels:** `epic:landing-page`, `priority:medium`
**Milestone:** v0.1

- [ ] Create OfficerDuty model
- [ ] Build weekly calendar component
- [ ] Add current day highlight
```

```markdown
### #13 Build CBL Document Page
**Labels:** `epic:landing-page`, `priority:high`
**Milestone:** v0.1

- [ ] Create PDF viewer component
- [ ] Add search functionality
- [ ] Section navigation
```

```markdown
### #14 Implement Chatbot Widget
**Labels:** `epic:landing-page`, `epic:ai-features`, `priority:high`
**Milestone:** v0.5

- [ ] Create GeminiService
- [ ] Build chat UI component
- [ ] Implement message history
- [ ] Add floating button trigger
```

---

### Epic: Student Portal

```markdown
### #19 Student Dashboard
**Labels:** `epic:student-portal`, `priority:high`
**Milestone:** v0.3

- [ ] Create StudentLayout
- [ ] Build personalized dashboard
- [ ] Show upcoming events
- [ ] Display attendance stats
```

```markdown
### #22 GCash Payment Display
**Labels:** `epic:student-portal`, `priority:medium`
**Milestone:** v0.3

- [ ] Create payment info page
- [ ] Display treasurer's GCash number
- [ ] Add screenshot upload for confirmation
- [ ] Treasurer approval workflow
```

---

### Epic: AI Features

```markdown
### #29 Gemini Service Integration
**Labels:** `epic:ai-features`, `priority:high`
**Milestone:** v0.5

- [ ] Create GeminiService.php
- [ ] Implement chat endpoint
- [ ] Add rate limiting
- [ ] Error handling
```

```markdown
### #31 AI Report Generation
**Labels:** `epic:ai-features`, `priority:medium`
**Milestone:** v0.5

- [ ] Treasurer report template
- [ ] President report template
- [ ] Accomplishment report
- [ ] PDF export
```

---

## Quick Start Script

After creating issues, automate the project board setup:

```bash
# Install GitHub CLI if needed
# Then authenticate: gh auth login

# Create issues from a template file (optional)
gh issue create --title "Set up PlanetScale Database" \
  --label "epic:infrastructure,priority:high" \
  --milestone "v0.2" \
  --body "- [ ] Create database
- [ ] Configure .env
- [ ] Test migrations"
```

---

## Recommended Workflow

1. Pick an issue from **Ready** column
2. Move to **In Progress**
3. Create feature branch: `git checkout -b feature/issue-number-description`
4. Commit with issue reference: `git commit -m "feat: implement feature #5"`
5. Push and create PR
6. Move issue to **In Review**
7. After merge, move to **Done**
