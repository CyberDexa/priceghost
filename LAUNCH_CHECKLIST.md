# 🚀 PriceGhost Launch Checklist

## Pre-Launch Technical Checks

### ✅ Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console.log statements in production code
- [ ] Error boundaries in place
- [ ] Loading states for all async operations

### ✅ Security
- [ ] Environment variables not exposed in client code
- [ ] API routes protected with authentication
- [ ] CRON endpoints protected with secret
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React escaping + CSP headers)

### ✅ SEO & Metadata
- [x] Meta title and description on all pages
- [x] Open Graph tags configured
- [x] Twitter cards configured
- [x] Structured data (JSON-LD) added
- [x] robots.txt created
- [x] sitemap.xml generated
- [ ] Canonical URLs set

### ✅ Performance
- [ ] Images optimized (WebP/AVIF)
- [ ] Fonts preloaded
- [ ] Code splitting implemented
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing

### ✅ Accessibility
- [ ] All images have alt text
- [ ] Forms have labels
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Pre-Launch Business Checks

### ✅ Legal
- [x] Terms of Service page
- [x] Privacy Policy page
- [x] Refund Policy page
- [ ] Cookie consent banner (if needed)

### ✅ Support
- [ ] Help center/FAQ page
- [ ] Contact email set up
- [ ] Support workflow documented

## Deployment Steps

### 1. Vercel Setup
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. Environment Variables in Vercel
Add these in Vercel Dashboard > Settings > Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `CRON_SECRET`

### 3. Custom Domain
1. Go to Vercel Dashboard > Domains
2. Add your domain (e.g., priceghost.app)
3. Update DNS records as instructed
4. Enable HTTPS (automatic)

### 4. Supabase Production
1. Create production Supabase project
2. Run migrations
3. Set up Row Level Security policies
4. Configure auth redirect URLs

### 5. Verify Cron Jobs
- Check `/api/cron/check-prices` runs every 6 hours
- Check `/api/cron/weekly-digest` runs Monday 9 AM

## Post-Launch Monitoring

### ✅ Metrics to Track
- [ ] Uptime monitoring (UptimeRobot/Better Stack)
- [ ] Error tracking (Sentry)
- [ ] User signups
- [ ] Products tracked
- [ ] Email delivery rate

### ✅ First Week Tasks
- [ ] Monitor error logs daily
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately
- [ ] Track conversion funnel

## Go-Live Checklist

- [ ] Final testing on staging
- [ ] Backup database
- [ ] Deploy to production
- [ ] Verify all routes work
- [ ] Test signup/login flow
- [ ] Test product tracking
- [ ] Test email alerts
- [ ] Test PWA installation
- [ ] Announce launch! 🎉

---

**Launch Date Target:** ____________

**Launch Announced:** [ ] Yes [ ] No

**Post-Launch Review Date:** ____________
