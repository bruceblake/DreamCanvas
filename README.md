# AI Image Generator

A modern web application for generating AI images using various models. Built with React 19, TypeScript, Firebase, and Tailwind CSS.

## 🚀 Live Demo

Visit the live application: [AI Image Generator](https://yourusername.github.io/DreamCanvas/)

## ✨ Features

- **Text-to-Image Generation**: Create images from text prompts using AI models
- **User Authentication**: Secure login/registration with Firebase Auth
- **AI Art Gallery**: Browse curated collection of AI-generated artwork with pagination
- **Search & Filtering**: Search by prompt, filter by style and AI model
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Real-time Updates**: Live progress tracking during image generation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Redux Toolkit
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: GitHub Pages

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, etc.)
│   └── generation/     # Image generation components
├── pages/              # Page components
├── services/           # API services and utilities
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── firebase/           # Firebase configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DreamCanvas.git
   cd DreamCanvas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication and Firestore
   - Update `src/firebase/config.ts` with your Firebase configuration

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

This project includes GitHub Actions for automatic deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

3. **Configure Repository Name**
   - If your repository name is different from "DreamCanvas", update the `base` path in `vite.config.ts`:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

### Manual Deployment

```bash
npm install gh-pages --save-dev
npm run deploy
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database

2. **Update Configuration**
   - Copy your Firebase config from Project Settings
   - Update `src/firebase/config.ts` with your credentials

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 🎨 Customization

### Adding New AI Models

Update `src/services/aiArtGallery.ts` to add new AI models to the gallery collection.

### Styling

The project uses Tailwind CSS. Customize the theme in `tailwind.config.js`.

### Components

All UI components are in `src/components/ui/` and can be customized or replaced.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

1. **Build fails with path errors**
   - Ensure the `base` path in `vite.config.ts` matches your repository name

2. **Firebase authentication not working**
   - Check that your Firebase domain is added to authorized domains
   - Verify Firebase configuration is correct

3. **Images not loading in production**
   - GitHub Pages serves over HTTPS, ensure all image URLs use HTTPS

### Getting Help

- Check the [Issues](https://github.com/yourusername/DreamCanvas/issues) for common problems
- Create a new issue if you encounter a bug
- Join our community discussions

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for providing sample images
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling system
- [Firebase](https://firebase.google.com) for backend services

---

Made with ❤️ using React and TypeScript