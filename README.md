# GemVault - Gemstone Marketplace App

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Test instantly on phone (install Expo Go from Play Store)
npx expo start

# 3. Build APK
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Login Credentials
- Admin:  admin@gemvault.com / admin123
- Seller: demo@user.com / demo1234

## Folder Structure
```
gemvault/
├── App.js                     # Entry point
├── app.json                   # Expo config
├── eas.json                   # APK build config
├── package.json
├── assets/                    # Icons & images
└── src/
    ├── theme.js               # Colors, ₹ formatter
    ├── context/AppContext.js  # Global state
    ├── data/seedData.js       # Listings, users
    ├── components/UI.js       # Reusable components
    ├── navigation/            # Tab & stack navigator
    └── screens/
        ├── HomeScreen.js      # Marketplace
        ├── SellScreen.js      # 5-step sell flow + GST
        ├── MyStonesScreen.js  # My listings
        ├── ProfileScreen.js   # Auth + profile
        ├── AdminScreen.js     # Admin panel
        └── ListingDetailScreen.js
```
