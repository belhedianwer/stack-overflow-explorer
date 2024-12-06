# Stack Overflow Explorer

![Stack Overflow Explorer Preview](https://i.imgur.com/nW8wGF2.png)

A Chrome extension that allows you to search Stack Overflow directly from your browser. You can save your favorite answers and easily access them later.

## 🚀 Features

- Full-text search across Stack Overflow questions and answers
- View search results with essential information (title, score, answers count, tags)
- Save favorite answers for quick access with delightful confetti animation
- Copy answer links to clipboard with visual feedback
- Clean and intuitive user interface with tabs navigation
- Smooth animations and transitions
- Offline access to saved favorites

## 🏗️ Installation

### For Users
1. Download the latest release from the Chrome Web Store (coming soon)
2. The extension will automatically install and appear in your browser toolbar

### For Developers
1. Clone this repository:
```bash
git clone https://github.com/belhedianwer/stack-overflow-explorer.git
```

2. Install dependencies:
```bash
npm install
```

3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your browser toolbar
2. Enter your search query in the search box
3. Press Enter or click the Search button
4. Browse through the search results
5. Click the star icon to save an answer to your favorites (with confetti celebration!)
6. Switch between Results and Favorites using the tabs
7. Click the link icon to copy the answer URL to your clipboard

## 🛠️ Development

The extension is built using vanilla JavaScript with a modular architecture:

## Project Structure

```
Stack Overflow Explorer/
├── js/                     # JavaScript source files
│   ├── animations.js       # Animation utilities and effects
│   ├── api.js             # Stack Overflow API integration
│   ├── confetti.js        # Confetti animation for favorites
│   ├── popup.js           # Main popup interface manager
│   ├── state.js           # Application state management
│   ├── storage.js         # Chrome storage operations
│   └── ui.js              # UI components and interactions
├── styles/                 # CSS stylesheets
│   └── popup.css          # Main styles for the popup
├── icons/                  # Extension icons and assets
├── manifest.json          # Chrome extension manifest
├── popup.html            # Main popup interface
├── package.json          # Project dependencies and scripts
├── webpack.config.js     # Webpack configuration
└── .gitignore           # Git ignore rules
```

### Code Organization

specific functionality:
  - `popup.js`: Manages the main popup interface and coordinates between components
  - `api.js`: Handles Stack Overflow API requests and response parsing
  - `storage.js`: Manages Chrome storage for saving favorites and settings
  - `ui.js`: Contains UI components and event handlers
  - `state.js`: Manages application state and tab navigation
  - `animations.js`: Provides smooth transitions and visual feedback

### Building for Production

We use webpack and npm scripts to automate the build process:

1. Update version in `manifest.json`
2. Run the build command:
```bash
npm run build
```

This will:
- Clean the dist directory
- Bundle and minify JavaScript files using webpack
- Optimize CSS using clean-css
- Copy necessary assets
- Create a production-ready zip file

The build process is configured in:
- `package.json`: npm scripts for the build pipeline
- `webpack.config.js`: webpack configuration for module bundling

### Build Pipeline
1. JavaScript processing:
   - Modules are bundled using webpack
   - confetti.js is minified separately (non-module)
   - All code is optimized and minified
2. CSS optimization:
   - Minification with clean-css
   - Removal of unused styles
3. Asset management:
   - Icons and manifest copying
   - HTML template generation
4. Distribution:
   - Creation of zip file for Chrome Web Store submission

### Publishing to Chrome Web Store

1. Create a developer account at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay one-time registration fee ($5)
3. Create a new item
4. Upload the generated `stack-overflow-explorer.zip` file
5. Fill in store listing information:
   - Detailed description
   - Screenshots
   - Privacy policy
   - Store icons
6. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details

## 📧 Contact

Anwer Awled Belhedi

- Website: [anwer-awled-belhedi.com](https://anwer-awled-belhedi.com)
- LinkedIn: [linkedin.com/in/aabyna](https://www.linkedin.com/in/aabyna)
- GitHub: [github.com/belhedianwer](https://github.com/belhedianwer)