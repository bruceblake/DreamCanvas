# Deployment Guide

This document provides comprehensive instructions for deploying the AI Image Generator to various platforms.

## 🚀 GitHub Pages (Recommended)

GitHub Pages is the easiest and free way to deploy this application.

### Quick Setup

1. **Fork or Upload to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/DreamCanvas.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to Pages section
   - Select "GitHub Actions" as the source
   - The deployment will start automatically

3. **Configure Repository Name**
   - If your repository name is different from "DreamCanvas", update `vite.config.ts`:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

4. **Add Firebase Domain**
   - In Firebase Console, go to Authentication > Settings
   - Add your GitHub Pages domain to authorized domains:
   ```
   yourusername.github.io
   ```

### Your Live URL
```
https://yourusername.github.io/DreamCanvas/
```

## 🔥 Firebase Hosting (Alternative)

If you prefer Firebase Hosting:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🌐 Other Platforms

### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables if needed

## 🔧 Environment Configuration

### Firebase Configuration

For production deployment, you have two options:

#### Option 1: Environment Variables (Recommended)
Create environment variables in your hosting platform:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Option 2: Direct Configuration
Update `src/firebase/config.ts` with your production values.

### Firebase Security Rules

Update Firestore rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access to gallery images
    match /gallery/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🛡️ Security Considerations

### Firebase Security
1. **Authorized Domains**: Add your production domain to Firebase Auth
2. **API Keys**: Firebase API keys are safe to expose in client-side code
3. **Database Rules**: Implement proper Firestore security rules
4. **CORS**: Ensure your domain is allowed for Firebase services

### HTTPS
- GitHub Pages automatically provides HTTPS
- Ensure all external APIs use HTTPS
- Mixed content (HTTP on HTTPS) will be blocked

## 📊 Monitoring

### Firebase Analytics
Add Firebase Analytics to track usage:

```typescript
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);
```

### Error Tracking
Consider adding error tracking with services like:
- Sentry
- LogRocket
- Firebase Crashlytics

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) provides:
- Automatic deployment on push to main
- Build caching for faster deployments
- Environment variable support
- Error reporting

### Customizing the Pipeline
To add additional steps (testing, linting):

```yaml
- name: Run Tests
  run: npm test

- name: Run Linting
  run: npm run lint
```

## 🚨 Troubleshooting

### Common Issues

1. **404 on Page Refresh**
   - Ensure your hosting platform supports SPA routing
   - Add rewrite rules to serve `index.html` for all routes

2. **Firebase Auth Domain Error**
   - Add your production domain to Firebase Auth settings
   - Check that the domain matches exactly (including subdomain)

3. **Build Failures**
   - Check that all environment variables are set
   - Verify Node.js version compatibility (18+)
   - Clear cache and reinstall dependencies

4. **Images Not Loading**
   - Ensure all image URLs use HTTPS
   - Check CORS policies for external images
   - Verify image paths are correct for production

### Debug Commands

```bash
# Local production build test
npm run build && npm run preview

# Check bundle size
npm run build -- --analyze

# Firebase hosting emulator
firebase serve
```

## 📈 Performance Optimization

### Bundle Size Optimization
- The app uses code splitting for better performance
- Consider implementing lazy loading for routes
- Optimize images and use WebP format when possible

### Caching Strategy
- Static assets are cached automatically by GitHub Pages
- Consider implementing service workers for offline functionality

---

## 🎯 Quick Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled with GitHub Actions
- [ ] Firebase project created and configured
- [ ] Production domain added to Firebase Auth
- [ ] Environment variables configured (if using)
- [ ] Build successful locally
- [ ] All external URLs use HTTPS
- [ ] Firestore security rules updated

Your AI Image Generator should now be live and accessible to users worldwide! 🌍