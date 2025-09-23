# PWA (Progressive Web App) Implementation

This document explains the PWA features implemented in the Work Safety Analyzer app.

## Features Implemented

### 1. Web App Manifest (`/public/manifest.json`)

- App metadata (name, description, theme colors)
- Display mode set to "standalone" for app-like experience
- Icons in multiple sizes for different devices
- Screenshots for app store listings

### 2. Service Worker (`/public/sw.js`)

- Offline functionality with caching
- Background sync for offline actions
- Automatic cache management and updates

### 3. PWA Meta Tags

- Apple-specific meta tags for iOS devices
- Microsoft-specific meta tags for Windows
- Theme color and viewport configuration
- Open Graph and Twitter Card support

### 4. Install Prompt Component

- Automatic install prompt for supported browsers
- Custom install button with better UX
- Dismissal handling and session storage

### 5. PWA Utilities (`/lib/pwa-utils.ts`)

- Service worker registration
- Online/offline status detection
- Data caching utilities
- PWA installation detection

## Testing PWA Features

### 1. Install the App

1. Build and start the app: `npm run build && npm start`
2. Open in Chrome/Edge: `http://localhost:3000`
3. Look for the install prompt or use the browser's "Install" button
4. The app should install and open in standalone mode

### 2. Test Offline Functionality

1. Install the app
2. Open Chrome DevTools → Network tab
3. Check "Offline" to simulate no internet
4. The app should still work with cached content

### 3. Test on Mobile Devices

1. Deploy to a server with HTTPS
2. Open on mobile browser
3. Look for "Add to Home Screen" option
4. The app should install and behave like a native app

### 4. Browser Support

- **Chrome/Edge**: Full PWA support with install prompts
- **Firefox**: Basic PWA support, manual install via menu
- **Safari**: Limited PWA support, "Add to Home Screen" only
- **Mobile browsers**: Varies by platform

## Customization

### Icons

Replace the placeholder icons in `/public/icons/` with your custom app icons:

- `icon-192x192.png` - Main app icon
- `icon-512x512.png` - High-resolution icon
- Other sizes for different contexts

### Theme Colors

Update theme colors in:

- `manifest.json` - `theme_color` and `background_color`
- `app/layout.tsx` - Meta tags and theme configuration

### Service Worker

Modify `/public/sw.js` to:

- Add more resources to cache
- Implement custom offline strategies
- Add push notification support

## Production Deployment

1. Ensure HTTPS is enabled (required for PWA)
2. Update manifest.json with production URLs
3. Replace placeholder icons with final designs
4. Test on multiple devices and browsers
5. Submit to app stores if desired (using tools like PWA Builder)

## Troubleshooting

### Install Prompt Not Showing

- Ensure the app is served over HTTPS
- Check that manifest.json is accessible
- Verify service worker is registered
- Try in incognito mode to avoid cached issues

### Icons Not Displaying

- Check icon file paths in manifest.json
- Ensure icons are in PNG format
- Verify icon sizes match manifest specifications

### Offline Not Working

- Check service worker registration in DevTools
- Verify cache strategy in sw.js
- Test with different network conditions
