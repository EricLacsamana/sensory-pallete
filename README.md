# Sensory Palette - Educational Admin Dashboard

A modern, professional admin dashboard for managing sensory education and learning activities. Built with Next.js 16, Tailwind CSS, and TypeScript with an engaging game-inspired design.

## 🎮 Features

- **Modern Dashboard**: Real-time analytics with beautiful stat cards and hover effects
- **Admin Control Center**: User management, access control, and audit logging
- **Learner Management**: Comprehensive student directory with progress tracking
- **Game Center**: Interactive games and activities for sensory learning
- **Device Management**: IoT sensor monitoring and status tracking
- **Professional Design**: Dark theme with accent colors, smooth animations, and intuitive UX
- **Responsive Layout**: Fully mobile-friendly with adaptive navigation
- **Hover Effects**: Game design-inspired interactions and visual feedback

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript 5
- **Icons**: React Icons
- **State Management**: React Hooks
- **Development**: Modern development workflow with hot reload

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/EricLacsamana/sensory-pallete.git
cd sensory-pallete
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

5. **Login credentials** (demo)
- Username: any value
- Password: any value

## 🏗️ Project Structure

```
├── app/
│   ├── (authenticated)/          # Protected routes with sidebar
│   │   ├── layout.tsx            # Authenticated layout wrapper
│   │   ├── dashboard/            # Main dashboard
│   │   ├── admin/                # Admin control center
│   │   ├── learners/             # Student directory
│   │   ├── games/                # Game center
│   │   └── devices/              # Sensor management
│   ├── login/                    # Login page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirect to dashboard
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── components/
│   └── Sidebar.tsx               # Navigation sidebar
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript config
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: `#1e3a5f` (Navy Blue) - Main brand color
- **Secondary**: `#ff6b35` (Vibrant Orange) - Accent actions
- **Accent**: `#feba49` (Golden Yellow) - Highlights and focus
- **Surface**: `#0f1419` (Very Dark) - Background
- **Surface Light**: `#1a202c` (Dark) - Secondary background
- **Muted**: `#718096` (Gray) - Inactive/secondary text

### Typography
- **Headings**: Fredoka (Rounded, modern look)
- **Body**: Inter (Clean, readable sans-serif)

### Animations
- **Hover Effects**: Cards scale, glow, and shift with smooth easing
- **Transitions**: 0.3s cubic-bezier easing for natural motion
- **Pulse Animations**: Subtle breathing effects on interactive elements
- **Floating Effects**: Gentle up-down animations on static elements

## 📄 Key Pages

### Dashboard (`/dashboard`)
Main overview with real-time stats, learner table, and quick tips. Features animated stat cards with gradient backgrounds.

### Admin Panel (`/admin`)
- User management with create/delete functionality
- Audit logs with activity tracking
- Responsive table with hover effects
- Toast notifications for user feedback

### Learners (`/learners`)
Complete student directory with:
- Search functionality
- Status filtering
- Progress tracking
- Diagnosis badges
- Star ratings

### Game Center (`/games`)
Browse and launch educational games:
- 6+ interactive games
- Player statistics
- Score tracking
- Session management

### Devices (`/devices`)
Monitor IoT sensors:
- Battery levels
- Signal strength
- Connection status
- Location tracking

## 🚀 Customization

### Adding New Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: '#1e3a5f',
  secondary: '#ff6b35',
  accent: '#feba49',
  // Add more colors here
}
```

### Modifying Animations
Update animations in `tailwind.config.ts` and `app/globals.css`:
```css
@keyframes pulse-glow {
  /* Customize animation keyframes */
}
```

### Adding New Pages
1. Create folder in `app/(authenticated)/`
2. Add `page.tsx` component
3. New navigation will auto-link in sidebar

## 🔧 Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎯 Future Enhancements

- [ ] Real API integration
- [ ] User authentication with JWT
- [ ] Database persistence
- [ ] Real-time data updates
- [ ] Export/reporting features
- [ ] Dark/light theme toggle
- [ ] Advanced analytics

## 📄 License

MIT License - Feel free to use for educational purposes

## 👥 Contributors

- Eric Lacsamana

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Happy Learning! 🎓**
