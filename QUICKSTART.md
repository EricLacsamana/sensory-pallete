# Quick Start Guide

Get the Sensory Palette dashboard running in minutes!

## 1. Setup (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 2. Login (Demo Mode)

- **URL**: `http://localhost:3000/login`
- **Username**: Enter any text
- **Password**: Enter any text
- Click "Sign In"

## 3. Explore the Dashboard

### Main Dashboard (`/dashboard`)
See real-time stats with animated cards:
- Total Learners
- Today's Sessions
- Accuracy Rate
- Activity Time

Hover over stat cards to see the bouncy game-design effect!

### Admin Panel (`/admin`)
Manage users and view audit logs:
- Create new therapist accounts
- View all active users
- Track system audit logs

### Learners (`/learners`)
Browse student directory with:
- Search by name
- Filter by status (Active/Idle)
- View progress bars
- See star ratings

### Game Center (`/games`)
Launch educational games:
- 6 different sensory games
- Player statistics
- Average scores
- Session creation

### Devices (`/devices`)
Monitor IoT sensors:
- Battery levels
- Signal strength
- Connection status
- Device location

## 4. Design Features to Try

### Hover Effects
- Cards scale and glow on hover
- Smooth 0.3s transitions
- Glowing shadow effects
- Color transitions

### Interactive Elements
- Click stat cards (animated)
- Filter buttons with gradients
- Toggle tabs with smooth animations
- Search inputs with focus glow

### Professional Dark Theme
- Navy blue backgrounds
- Golden yellow accents
- Orange secondary buttons
- Clean contrast

## 5. Customize It

### Change Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  accent: '#feba49',      // Golden yellow
  secondary: '#ff6b35',   // Orange
  primary: '#1e3a5f',     // Navy
}
```

### Add New Pages
1. Create `app/(authenticated)/[page-name]/page.tsx`
2. Import components and add content
3. Navigation appears automatically in sidebar

### Modify Animations
Edit `app/globals.css` for custom keyframes:
```css
@keyframes pulse-glow {
  from { opacity: 1; }
  to { opacity: 0.8; }
}
```

## 6. Production Build

```bash
# Build optimized version
npm run build

# Start production server
npm start
```

## 7. Deploy to Vercel

### Option A: Using Git
```bash
git push origin main
# Vercel auto-deploys on push
```

### Option B: CLI
```bash
npm install -g vercel
vercel
```

## File Structure Reference

```
app/
├── (authenticated)/
│   ├── dashboard/          Main page
│   ├── admin/              User management
│   ├── learners/           Student directory
│   ├── games/              Game center
│   └── devices/            Sensor monitoring
├── login/                  Login page
└── layout.tsx              Root layout

components/
└── Sidebar.tsx             Navigation

tailwind.config.ts          Styling config
app/globals.css             Global styles
```

## Common Tasks

### Add a New Stat Card
In `app/(authenticated)/dashboard/page.tsx`, add to `stats` array:
```ts
{
  id: 5,
  title: 'New Metric',
  label: 'Your Label',
  value: 123,
  trend: 'Your trend text',
  icon: <FaIcon />,
  gradient: 'from-color-500/20 to-color-500/20',
}
```

### Add a New Navigation Item
In `components/Sidebar.tsx`, add to `navItems`:
```ts
{ path: '/your-page', label: 'Your Page', icon: <FaIcon /> }
```

### Style a Component
Use Tailwind classes:
```tsx
<button className="px-4 py-2 bg-accent hover:bg-secondary rounded-lg text-white">
  Click me
</button>
```

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styles not applying?**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Next Steps

1. Connect to a real backend API
2. Add authentication with JWT
3. Integrate a database
4. Deploy to production
5. Add more games/features

## Support

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for production setup
- Visit [Next.js Docs](https://nextjs.org/docs)

---

Happy building! The dashboard is ready to customize.
