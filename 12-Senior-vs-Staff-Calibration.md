# Senior vs Staff Calibration -- Match Your Stories to the Level

> The **single biggest mistake** in behavioral interviews is telling L4-level stories for an L6 role. Calibrate your stories to the level you're targeting.

---

## How Stories Differ by Level

### Mid-Level (L4/SDE-II)

| Dimension | What to show |
|-----------|-------------|
| **Scope** | Individual or small team contribution |
| **Leadership** | Informal — helped onboard a new hire, mentored an intern |
| **Ambiguity** | Followed direction but adapted when details were unclear |
| **Impact** | Direct, measurable output — shipped feature X, fixed bug Y |
| **Conflict** | Resolved within the team |
| **Failure** | Personal mistake, personal learning |

**Example:** *"I built the user search feature, optimizing the query to reduce latency from 500ms to 80ms."*

---

### Senior (L5/Senior SDE)

| Dimension | What to show |
|-----------|-------------|
| **Scope** | Cross-team or multi-component impact |
| **Leadership** | Led a project, mentored 2-3 junior engineers, set technical standards |
| **Ambiguity** | Defined the approach when the problem was loosely defined |
| **Impact** | Team-level or org-level outcomes with business metrics |
| **Conflict** | Cross-team alignment, stakeholder management |
| **Failure** | Project-level failure, systemic fix |

**Example:** *"I led the migration of our search infrastructure from Elasticsearch 5 to 7 across 3 services, coordinating with 2 other teams. This improved query performance by 60% and eliminated 4 hours/week of manual index management."*

---

### Staff+ (L6-L7/Principal)

| Dimension | What to show |
|-----------|-------------|
| **Scope** | Organization-wide or company-wide impact |
| **Leadership** | Set technical vision, influenced VP/Director decisions, force multiplier |
| **Ambiguity** | Created scope from nothing — identified the problem AND the solution |
| **Impact** | Business-level outcomes — revenue, user growth, strategic direction |
| **Conflict** | Cross-org alignment, navigated organizational politics |
| **Failure** | Strategic mistake, broad systemic improvement |

**Example:** *"I identified that our 12 teams were each building their own caching layer, causing inconsistent behavior and duplicated effort. I proposed and led the adoption of a shared caching framework, which I designed with pluggable backends. This reduced cache-related incidents by 80% and freed up an estimated 3 engineer-months of duplicated work per quarter."*

---

## Side-by-Side Comparison

### "Tell me about a time you solved a technical problem"

| Level | Answer calibration |
|-------|-------------------|
| **Mid** | "I debugged a memory leak in the user service by analyzing heap dumps. Fixed it by closing unclosed streams." |
| **Senior** | "I identified a systemic memory leak pattern across our services caused by a shared library. I fixed the library, added monitoring, and presented the findings to all teams." |
| **Staff** | "I noticed intermittent OOM failures across the org. I investigated, found the root cause was our deployment pipeline's JVM defaults. I redesigned the deployment config system, created team-specific templates, and established JVM tuning guidelines. OOM incidents dropped from 12/month to 1/month org-wide." |

### "Tell me about a time you dealt with ambiguity"

| Level | Answer calibration |
|-------|-------------------|
| **Mid** | "Requirements were unclear, so I clarified with the PM and proceeded." |
| **Senior** | "There was no clear spec. I proposed 3 approaches, evaluated tradeoffs, and drove the decision with the team." |
| **Staff** | "There was no project, no spec, no team. I identified the opportunity through data analysis, wrote a proposal, got leadership buy-in, assembled a team, and led the initiative to completion." |

---

## Key Phrases by Level

### Senior
- "I led the project..."
- "I coordinated with other teams..."
- "I mentored junior engineers..."
- "I proposed the technical approach..."
- "I set up monitoring and alerting..."

### Staff+
- "I identified this problem that wasn't on anyone's roadmap..."
- "I convinced the VP to prioritize..."
- "I designed the architecture that N teams now use..."
- "I established the standard practice for..."
- "I was the force multiplier that made the team 2x more effective..."
- "I created scope from nothing..."

---

## Self-Check Before the Interview

For each of your 8-10 stories, ask:

1. **Scope:** Does the impact match my target level?
2. **"I" vs "we":** Am I clearly showing MY contribution?
3. **Quantified:** Do I have specific metrics?
4. **Leadership:** Am I leading, not following?
5. **Ambiguity:** Am I defining direction, not just executing?
6. **Why:** Am I explaining my reasoning, not just my actions?
