# Expo + AWS Amplify v6 Integration

This project is built using the latest version of **Expo SDK (~52)** with **TypeScript**, and integrates **AWS Amplify v6** to handle authentication, API (GraphQL), and cloud services.

## 🔧 Tech Stack

- **Expo (with TypeScript)**
- **React Native** (`0.76.7`)
- **AWS Amplify v6** (`aws-amplify@^6.13.4`)
- **Expo Router** with **dynamic navigation**
- **Prebuild workflow (`npx expo prebuild`)** to enable native code access

## 📱 Why Prebuild?

We use `npx expo prebuild` to generate native **Android** and **iOS** folders, which gives us access to:

- Modify native configurations
- Install native dependencies not normally compatible with Expo Go
- Combine the power of **React Native CLI** with the developer experience of **Expo**

This hybrid approach lets us take full advantage of both ecosystems.

## 🌐 Navigation

The app uses `expo-router` for routing and supports **dynamic pagination/navigation** with full type safety and folder-based routes.

## ☁️ AWS Amplify Integration

We use:

- `aws-amplify` v6
- `@aws-amplify/react-native` for React Native-specific integrations
- `@aws-amplify/ui-react-native` for prebuilt UI components (e.g., Authenticator)

All Amplify backend resources (auth, API, storage) are managed using the Amplify CLI and synced to the cloud via the `amplify` folder.

## 📂 Project Structure

Here’s a brief overview of the structure (see full structure in the repo):

```
├── amplify/               # AWS backend
├── app/                   # Expo Router pages
├── components/            # UI components
├── constants/             # Static constants
├── hooks/                 # Custom hooks
├── scripts/               # Utility scripts
├── src/graphql/           # Auto-generated GraphQL operations
├── src/models/            # Data models from Amplify
├── assets/                # Static assets
```

## 📦 Main Dependencies

```json
"aws-amplify": "^6.13.4",
"@aws-amplify/react-native": "^1.1.7",
"@aws-amplify/ui-react-native": "^2.4.3",
"expo": "~52.0.37",
"expo-router": "~4.0.17",
"react-native": "0.76.7",
"@react-navigation/native": "^7.0.14",
"@react-navigation/bottom-tabs": "^7.2.0",
"@react-navigation/drawer": "^7.1.2",
"react-native-webview": "13.12.5",
"react-native-gesture-handler": "~2.20.2",
"react-native-reanimated": "~3.16.1"
```

## 🚀 Getting Started

1. Clone the repo  
2. Run `npm install`  
3. Run `npx expo prebuild` to generate native folders  
4. Run `npx expo run:android` or `npx expo run:ios`

## 📡 Amplify Setup

Make sure to install Amplify CLI:

```bash
npm install -g @aws-amplify/cli
amplify pull --appId YOUR_APP_ID
```

## ✅ Benefits of This Setup

- Full TypeScript support
- Dynamic routing with Expo Router
- Access to native APIs (via prebuild)
- Seamless Amplify v6 integration
- Great DX from Expo + full control from React Native

---

Feel free to contribute or raise issues if you find bugs or have suggestions!

