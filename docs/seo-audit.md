# SEO Audit – MyGoProfile (Feb 2025)

Low CTR (7 clicks / 2.8k impressions in 3 months) usually comes from: **weak or duplicate titles/descriptions**, **poor relevance to queries**, or **technical/UX issues**. Below is what was wrong and what was fixed.

---

## Critical issues (fixed in this pass)

### 1. **Missing or duplicate page titles**
- **Problem:** Several important pages did not export their own `metadata`. They all fell back to the root layout title: *"MyGoProfile - AI-Powered Google Business Profile Management"*.
- **Impact:** In search results, Home, Pricing, Resources, and Login could all show the same title. Google may treat them as duplicate or low-differentiation, and users can’t tell which page is which → low CTR.
- **Fixed:**
  - **Resources hub** (`/resources`): Added `resources/layout.tsx` with a unique title and description focused on “Resources & Guides” and local SEO.
  - **Pricing** (`/pricing`): Added `pricing/layout.tsx` with pricing-specific title and description.
  - **Login** (`/login`): Added `login/layout.tsx` with “Login | MyGoProfile” and `robots: { index: false }` so login is not indexed.
  - **Terms** and **Privacy**: Added `metadata` (title + description) to both pages. Cookies already had metadata.

### 2. **No `robots.txt` / sitemap discovery**
- **Problem:** There was no `robots.txt`. Crawlers had no explicit sitemap URL and no clarity on what to crawl or skip.
- **Impact:** Slower or less efficient discovery of your best pages (especially guides); possible crawling of login/dashboard.
- **Fixed:** Added `src/app/robots.ts` that:
  - Allows all crawlers on `/`
  - Disallows `/dashboard/`, `/welcome/`, `/connect/`, `/api/`
  - Points to `https://mygoprofile.com/sitemap.xml`

### 3. **Weak internal linking from footer**
- **Problem:** Footer only linked to Terms, Privacy, Cookies, and 2xGen. It did not link to Why MyGoProfile, Pricing, or **Resources**.
- **Impact:** Your guide pages get less internal link equity; crawlers and users discover them mainly from the nav and the Resources hub.
- **Fixed:** Footer now includes links to **Why MyGoProfile**, **Pricing**, and **Resources** so key commercial and content pages are linked from every page.

---

## What was already in good shape

- **Guide articles** (e.g. `/resources/ai-and-local-seo`, `/resources/google-business-profile-optimization-2025`): Each has its own title, description, keywords, Open Graph, Twitter cards, and **BlogPosting + BreadcrumbList** JSON-LD. Clear H1 → H2 → H3 structure and internal links to other guides.
- **Sitemap:** `sitemap.ts` includes the main static routes and all 15 resource articles; priorities and change frequencies are set.
- **Root layout:** `metadataBase`, Google site verification, and solid default title/description. A **title template** was added so child pages get “ | MyGoProfile” when they only set a short title.

---

## Recommendations (not yet implemented)

### 1. **Stable publish dates in guide JSON-LD**
- **Issue:** Guide pages use `datePublished: new Date().toISOString()` in BlogPosting schema, so the “published” date changes on every build/render.
- **Recommendation:** Set a fixed `datePublished` (e.g. `2025-11-01`) per article, and optionally add `dateModified` when you update the post. This improves consistency and trust in search results.

### 2. **Stronger, query-focused meta descriptions**
- **Issue:** Descriptions are good but generic. With 2.8k impressions and 7 clicks, you’re likely appearing for broad or non-intent queries.
- **Recommendation:** In Google Search Console, check **Queries** (and optionally **Pages**). See which queries and URLs get impressions but few/no clicks. Rewrite titles and descriptions for those pages to match the **exact intent** of the query and include a clear benefit or CTA (e.g. “Learn how to…” or “Get more clicks from local search”).

### 3. **Content and topical depth**
- **Issue:** 15 guides is a good start, but local SEO/GBP is competitive. More depth (longer, more specific sections) and more articles on long-tail keywords can help.
- **Recommendation:** Add or expand guides around specific problems (e.g. “GBP not showing up”, “how to fix suspended GBP”, “best categories for [industry]”). Use GSC and keyword tools to find gaps.

### 4. **Core Web Vitals and performance**
- **Recommendation:** Run Lighthouse (and/or PageSpeed Insights) on the live site. Improve LCP (e.g. image sizing, priority for hero/OG images) and minimize layout shift. Fast, stable pages can get a small ranking and CTR boost.

### 5. **Optional: Absolute URLs in Open Graph**
- **Current:** Some guide pages set `openGraph.url: '/resources/...'` (relative). Next.js resolves this with `metadataBase`.
- **Optional:** Use full URLs (e.g. `https://mygoprofile.com/resources/...`) in OG for maximum compatibility with all social crawlers.

---

## Summary

| Area              | Before                          | After                                      |
|-------------------|----------------------------------|--------------------------------------------|
| Page titles       | Same/default on 5+ key pages    | Unique titles for Resources, Pricing, Login, Terms, Privacy |
| robots.txt        | None                             | Allow public pages, disallow dashboard/api, sitemap URL |
| Footer links      | Terms, Privacy, Cookies, 2xGen   | + Why MyGoProfile, Pricing, Resources      |
| Guide articles    | Already strong                   | Unchanged (only recommendations above)    |

After deploying these changes, **re-submit sitemap** in Google Search Console and allow a few weeks for re-crawl. Then use **Performance → Queries** to refine titles and descriptions for the queries that already bring impressions; that’s the fastest lever to improve CTR.
