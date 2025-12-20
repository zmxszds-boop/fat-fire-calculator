# WebCraft - Modern Web Development Platform

A full-stack web application built with React, TypeScript, Express.js, and modern development tools. This project serves as a foundation for building scalable web applications with a beautiful, responsive frontend and robust backend API.

## 🚀 Features

- **Modern Frontend**: React 18 + TypeScript + Tailwind CSS
- **Fast Development**: Vite for lightning-fast HMR and builds
- **Backend API**: Express.js server with TypeScript
- **Responsive Design**: Mobile-first, fully responsive layout
- **Type Safety**: Full TypeScript support throughout the stack
- **Modern UI**: Clean, professional design with gradients and animations
- **Deployment Ready**: Pre-configured for Vercel deployment

## 📁 Project Structure

```
/Users/bytedance/Documents/trae_projects/
├── api/                    # Backend Express.js application
│   ├── routes/            # API route handlers
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   └── index.ts           # API export for deployment
├── src/                   # Frontend React application
│   ├── components/        # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # React entry point
├── public/                 # Static assets
├── vercel.json             # Deployment configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting
- **nodemon** - Development server auto-restart
- **concurrently** - Run multiple commands simultaneously

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trae_projects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend development servers |
| `npm run client:dev` | Start only frontend development server |
| `npm run server:dev` | Start only backend development server |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint code linting |
| `npm run check` | Run TypeScript type checking |

## 🌐 API Documentation

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

### Available Endpoints

#### Health Check
- **GET** `/api/health`
  - Returns server status
  - Response: `{ "success": true, "message": "ok" }`

#### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/logout` - User logout

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Follow the prompts**
   - Link your GitHub repository
   - Configure environment variables if needed
   - Deploy automatically on git push

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the API**
   - The `api/` directory is ready for serverless deployment
   - Configure your hosting platform to serve the built frontend
   - Set up the API routes to handle `/api/*` requests

## 🎨 Frontend Components

### Home Page (`src/pages/Home.tsx`)
- **Navigation**: Fixed header with smooth scrolling
- **Hero Section**: Gradient text and call-to-action buttons
- **Features**: Three-column feature showcase
- **Newsletter**: Email subscription form
- **Footer**: Professional footer with social links

### Styling
- **Tailwind CSS**: Utility-first approach
- **Responsive Design**: Mobile-first methodology
- **Modern UI**: Gradients, shadows, and smooth transitions

## 🔧 Backend Architecture

### Express.js Setup
- **Middleware**: CORS, JSON parsing, error handling
- **Routes**: Modular route organization
- **Error Handling**: Centralized error middleware
- **TypeScript**: Full type safety

### API Structure
```
api/
├── routes/
│   └── auth.ts          # Authentication routes
├── app.ts               # Express configuration
├── server.ts            # Development server
└── index.ts             # Production export
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint configuration
- Use functional components in React
- Implement proper error handling

### File Naming
- Components: PascalCase (e.g., `Home.tsx`)
- Utilities: camelCase (e.g., `utils.ts`)
- Hooks: camelCase with 'use' prefix (e.g., `useTheme.ts`)

### Git Workflow
- Create feature branches for new work
- Write descriptive commit messages
- Test changes before committing
- Keep commits focused and atomic

## 🔍 Testing

### Manual Testing
- Test responsive design on different screen sizes
- Verify all interactive elements work correctly
- Check API endpoints with tools like Postman
- Test deployment build locally before deploying

### Recommended Testing Tools
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5173 or 3001
   npx kill-port 5173
   npx kill-port 3001
   ```

2. **TypeScript Errors**
   ```bash
   npm run check
   ```

3. **Build Failures**
   ```bash
   npm run lint
   npm run check
   ```

4. **Module Not Found**
   ```bash
   npm install
   ```

## 🚀 Future Enhancements

### Planned Features
- User authentication system
- Database integration (PostgreSQL/MongoDB)
- Admin dashboard
- File upload functionality
- Real-time features (WebSocket)
- Mobile app (React Native)

### Performance Optimizations
- Implement code splitting
- Add caching strategies
- Optimize images and assets
- Implement progressive web app (PWA) features

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Check existing documentation
- Review the troubleshooting section

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding!** 🎉

Built with ❤️ using modern web technologies.