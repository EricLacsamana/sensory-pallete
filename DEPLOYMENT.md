# Deployment Guide

## Vercel Deployment (Recommended)

### Quick Deploy
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel auto-detects Next.js settings
6. Click "Deploy"

Your app will be live at `your-project.vercel.app`

### Environment Variables
1. Go to Project Settings → Environment Variables
2. Add any required environment variables
3. Redeploy for changes to take effect

## Docker Deployment

### Build Image
```bash
docker build -t sensory-palette .
```

### Run Container
```bash
docker run -p 3000:3000 sensory-palette
```

### Dockerfile Example
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Traditional Server Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

Server will run on `http://localhost:3000`

### With PM2 (Process Manager)
```bash
npm install -g pm2

pm2 start npm --name "sensory-palette" -- start
pm2 save
pm2 startup
```

## Performance Optimization

### Image Optimization
Next.js automatically optimizes images. For best results:
- Use `<Image>` component from `next/image`
- Provide width and height
- Use appropriate image formats

### Code Splitting
Next.js automatically splits code by route. Each page is only loaded when needed.

### Font Optimization
Fonts are self-hosted and optimized automatically in `app/globals.css`

## Monitoring & Logging

### Vercel Analytics
- Go to your Vercel dashboard
- Check Real User Monitoring (RUM) data
- Track Core Web Vitals

### Custom Logging
Add logging service (e.g., Sentry) for error tracking:
```bash
npm install @sentry/nextjs
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Memory Issues
Increase Node memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Slow Performance
1. Check for unoptimized images
2. Verify code splitting is working
3. Use Chrome DevTools to identify bottlenecks
4. Consider implementing caching

## Database Integration

When ready to add backend:

1. Choose a database:
   - PostgreSQL (Neon, Supabase)
   - MongoDB (Atlas)
   - MySQL (PlanetScale)

2. Add environment variables
3. Create API routes in `app/api/`
4. Update components to fetch from API

## Security Checklist

- [ ] Set secure environment variables
- [ ] Enable CORS if needed
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Validate all user input
- [ ] Sanitize database queries
- [ ] Use secure headers

---

For more details, visit [Next.js Deployment](https://nextjs.org/docs/deployment)
