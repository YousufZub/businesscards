# Business Card Scanner App

A mobile app for scanning and digitizing business cards using OCR technology.

## Features
- Camera-based business card scanning
- OCR text extraction from Google Cloud Vision
- Contact information management
- Google OAuth authentication
- Cross-platform support (iOS/Android)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Run on device/emulator:
```bash
npx expo run:android
# or
npx expo run:ios
```

## Project Structure
```
src/
├── screens/
│   ├── WelcomeScreen.tsx
│   ├── CameraScreen.tsx
│   ├── CardDetailScreen.tsx
│   └── CardListScreen.tsx
├── services/
│   ├── ocrService.ts
│   └── apiService.ts
├── components/
│   ├── CardItem.tsx
│   └── CameraView.tsx
├── navigation/
├── types/
└── utils/
```

## Technologies
- React Native with Expo
- TypeScript
- Google Cloud Vision API
- React Navigation
