# MailCategorizer

**MailCategorizer** is a Gmail Chrome Extension enforcing email labeling based on GDPR-sensitive data and communication types. It ensures compliance and streamlines email communication.

## 🚀 Features
- **Label Suggestions**: Detects GDPR-sensitive data (e.g., customer details, financial data) and suggests labels.
- **Manual Label Selection**: Prompts for labels like:
  - Internal Communication
  - External Communication
  - Contains Sensitive Data
  - Only for Authorized Recipients
- **Auto-Injection**: Adds the selected label at the top of the email body:
  > "Sender of this email has categorized it as: [Label]"
- **GDPR Compliance**: Flags emails containing sensitive data.
- **Future Updates**: Support for Outlook, Firefox, Edge, and other platforms.

## 🛠️ Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ravikant2509/MailCategorizer.git
   ```
2. Open Chrome and go to:
   ```
   chrome://extensions/
   ```
3. Enable **Developer Mode** and click **Load unpacked**.
4. Select the project folder.

## 📚 Usage
1. **Compose an Email**: Open Gmail and click **Compose**.
2. **Select a Label**: Choose from suggested or manual options before sending.
3. **Send the Email**: The label is added to the email body.
![image](https://github.com/user-attachments/assets/1b826ff2-406d-4c3c-9d89-4863005d4b12)

## 🌍 Future Roadmap
- Support for Outlook, Yahoo Mail, Edge, Firefox, and Safari.
- AI-powered label suggestions.
- Enterprise-level reporting.

## 🤝 Contributing
1. Fork the repo and create a branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Commit and push:
   ```bash
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```
3. Open a Pull Request.

## 📂 Project Structure
MailCategorizer/

├── background.js      # Handles background tasks

├── content.js         # Core logic for DOM manipulation

├── popup.js           # Handles popup UI functionality

├── popup.html         # Popup user interface

├── manifest.json      # Extension metadata

├── styles.css         # Popup styling

├── README.md          # Documentation

├── icon.png           # Extension icon


🌟 Show Your Support
⭐ Star this repo on GitHub.
Share with your network to spread the word.
