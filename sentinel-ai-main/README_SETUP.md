# Sentinel AI - Cyber Security Monitoring System

A modern React-based cyber security threat monitoring and analysis dashboard built with **Vite**, **TypeScript**, and **Shadcn UI**.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Running

1. **Navigate to project directory:**
   ```bash
   cd 'd:\projects\cyber\sentinel-ai-main (1)(2)\sentinel-ai-main'
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Local: **http://localhost:8080/** (or http://localhost:8081/ if port 8080 is in use)
   - Network: http://192.168.1.2:8080/ (or 8081/)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates production build |
| `npm run build:dev` | Creates development build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run test` | Runs tests once |
| `npm run test:watch` | Runs tests in watch mode |

## 🏗️ Project Structure

```
sentinel-ai-main/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── AlertsPanel.tsx
│   │   ├── AnalysisHistory.tsx
│   │   ├── AnomalyScoreChart.tsx
│   │   ├── DataEntryPanel.tsx
│   │   ├── NetworkCharts.tsx
│   │   ├── NetworkTable.tsx
│   │   ├── StatCard.tsx
│   │   ├── ThreatLevel.tsx
│   │   └── NavLink.tsx
│   ├── pages/               # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and services
│   │   ├── cyberEngine.ts   # Cyber threat analysis engine
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                  # Static assets
├── dist/                    # Production build output
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── README_SETUP.md
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18+** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### UI Components & Styling
- **Shadcn UI** - High-quality React components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components

### Tools & Libraries
- **Framer Motion** - Animation library
- **TanStack React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **ESLint** - Code linting
- **Vitest** - Unit testing

## 🎯 Features

- **Real-time Threat Monitoring** - Track security threats in real-time
- **Network Analysis** - Visualize network traffic and anomalies
- **Threat Level Indicators** - Color-coded threat severity levels
- **Anomaly Detection** - Score-based anomaly visualization
- **Data Entry Panel** - Input security data for analysis
- **Alert Management** - View and manage security alerts
- **Analysis History** - Track historical security events

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root if needed:
```env
VITE_API_URL=http://localhost:3000/api
```

### Vite Configuration
Configured in `vite.config.ts` for optimal development and production builds.

### TypeScript Configuration
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.app.json` - App-specific settings
- `tsconfig.node.json` - Node-specific settings

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets
- Mobile devices

## 🧪 Testing

Run tests with:
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
```

## 🏗️ Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` folder** to your hosting service

## 📋 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## ⚠️ Troubleshooting

### Port 8080 Already in Use
The dev server will automatically try port 8081, 8082, etc.

### Module Not Found Errors
```bash
npm install  # Reinstall dependencies
```

### Build Fails
```bash
npm run lint         # Check for linting errors
npm run test         # Run tests
npm run build:dev    # Try development build first
```

## 📝 Notes

- **Bun Package Manager**: While the project includes `bun.lockb`, it can be used with npm without issues
- **Browserslist Warning**: Can be safely ignored for development
- **Hot Module Replacement (HMR)**: Enabled by default in development mode

## 📄 License

Please check the original project for license information.

## 🤝 Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Open a Pull Request

---

**Application Status**: ✅ Running on http://localhost:8080/ or http://localhost:8081/

Last Updated: 2026-06-15
