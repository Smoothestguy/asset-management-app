# Asset Management App

A modern, professional personal asset tracking application with beautiful neon UI effects and comprehensive authentication system.

## 🌟 Features

### 💎 **Modern UI Design**
- Beautiful neon-themed interface with 4 stunning themes
- Smooth animations and particle effects
- Fully responsive design for desktop and mobile
- Professional typography with futuristic styling

### 🔐 **Comprehensive Authentication**
- **Local Authentication**: Email/password with secure storage
- **Backend API**: Flask-based JWT authentication with database
- **Social Login**: Google and GitHub integration via Firebase Auth
- User profile management and preferences sync

### 📊 **Asset Management**
- Track multiple asset categories (Real Estate, Vehicles, Luxury Items, Electronics, Home Assets)
- Photo upload and management for each asset
- Real-time portfolio value calculation
- Gain/loss tracking with percentage indicators
- Favorites system for quick access

### 🎨 **Customization**
- **4 Themes**: Dark Mode, Cyberpunk 2077, Matrix Green, Red Mode
- Adjustable neon intensity (0-100%)
- Animation speed controls
- Particle effects toggle
- Sound effects support

### 👤 **User Features**
- Individual user data isolation
- Profile management with avatar support
- Settings synchronization across devices
- Secure password management

## 🚀 **Technology Stack**

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** components
- **Lucide React** icons

### Backend
- **Flask** REST API
- **SQLite** database
- **JWT** authentication
- **Werkzeug** password hashing

### Authentication
- **Firebase Auth** for social login
- **Local storage** for client-side auth
- **Backend API** for server-side auth

## 📦 **Installation**

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Smoothestguy/asset-management-app.git
cd asset-management-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup (Optional)
```bash
# Navigate to backend directory
cd asset-tracker-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python src/main.py
```

## 🎯 **Usage**

1. **Sign Up/Login**: Choose from email/password, Google, or GitHub
2. **Add Assets**: Click "Add Asset" to track your valuable items
3. **Upload Photos**: Add images to your assets for better organization
4. **Customize Theme**: Go to Settings → Appearance to personalize your experience
5. **Track Portfolio**: Monitor your total asset value and gains/losses

## 🔧 **Configuration**

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Theme Customization
Themes can be customized in `src/contexts/ThemeContext.jsx`:
- Primary colors
- Secondary colors
- Background gradients
- Glow effects

## 📱 **Screenshots**

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Authentication
![Login](screenshots/login.png)

### Settings
![Settings](screenshots/settings.png)

## 🛠️ **Development**

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API and authentication services
└── App.jsx             # Main application component
```

## 🔒 **Security Features**

- JWT token-based authentication
- Secure password hashing
- CORS protection
- Input validation and sanitization
- User data isolation
- Session management

## 🌐 **Browser Support**

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 **Support**

For support, email support@codewcg.com or create an issue on GitHub.

## 🙏 **Acknowledgments**

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for clean icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

**Built with ❤️ by [CodeWCG](https://codewcg.com)**

