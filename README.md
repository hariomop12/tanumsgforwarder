# 📱 WhatsApp Message Forwarder Bot

A powerful Node.js bot that automatically forwards WhatsApp messages between groups and individual contacts. Perfect for centralized message routing and monitoring!

## 🚀 Features

- **Multi-Client Support**: Run two WhatsApp instances simultaneously
- **Group-to-Contact Relay**: Automatically forward group messages to specific contacts
- **Contact-to-Contact Relay**: Forward messages between individual chats
- **Media Forwarding**: Seamlessly forward images, videos, documents, and more
- **QR Code Authentication**: Easy WhatsApp Web.js authentication
- **Environment-Based Configuration**: All sensitive data in `.env` (never exposed!)

## 📋 Prerequisites

- Node.js 16+
- npm or pnpm
- WhatsApp account(s)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hariomop12/tanumsgfowarder.git
   cd tanumsgfowarder
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your WhatsApp numbers and group IDs:
   ```env
   NUMBER_7493=910000000000@c.us
   NUMBER_7942=910000000000@c.us
   ALLOWED_GROUP_1=120363425471147088@g.us
   ALLOWED_GROUP_2=120363168495810436@g.us
   ALLOWED_GROUP_3=120363046374862422@g.us
   ```

## ⚡ Quick Start

### Development Mode (with auto-reload)

```bash
pnpm dev
```

### Production Mode

```bash
pnpm start
```

### Scan QR Codes

When you run the bot, QR codes will appear in the terminal for each WhatsApp instance. Scan them with your phone to authenticate.

## 🤖 Bot Modes

### Bot 6261

- **Listens to**: Allowed WhatsApp groups
- **Forwards to**: Contact 7493 (NUMBER_7493)
- **Handles**: Text messages and media

### Bot 7493

- **Listens to**: Incoming messages from any contact
- **Forwards to**: Contact 7942 (NUMBER_7942)
- **Handles**: Text messages and media
- **Note**: Ignores own messages to prevent loops

## 📁 Project Structure

```
tanumsgfowarder/
├── src/
│   ├── server.js           # Main orchestrator
│   ├── bot6261.js          # Group forwarder bot
│   ├── bot7493.js          # Contact forwarder bot
│   ├── test.js             # Testing utilities
│   └── whatsapp/
│       ├── client6261.js   # WhatsApp client instance 1
│       ├── client7493.js   # WhatsApp client instance 2
│       ├── events.js       # Shared event handlers
│       └── session/        # Session data (gitignored)
├── .env                    # Environment variables (gitignored)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md              # This file
```

## 🔐 Security

✅ **All sensitive data is protected:**

- Phone numbers in `.env` (never committed)
- Session data ignored (`.wwebjs_auth/`, `.wwebjs_cache/`)
- Log files ignored
- `.env` file always gitignored

**Never commit `.env` to version control!**

## 🚨 Troubleshooting

### QR Code not appearing?

- Ensure the terminal window is large enough
- Try running in a different terminal
- Check that qrcode-terminal is installed

### "Cannot send message" error?

- Verify phone numbers in `.env` are in correct format
- Ensure the WhatsApp client is authenticated (QR scanned)
- Check that the contact/group hasn't blocked the bot

### Session errors?

- Delete the `.wwebjs_auth/` and `.wwebjs_cache/` folders
- Re-run the bot and scan QR codes again

## 📦 Dependencies

- **whatsapp-web.js** - WhatsApp automation library
- **qrcode-terminal** - QR code generation in terminal
- **dotenv** - Environment variable management
- **express** - Web framework (optional, for future features)
- **mongoose** - MongoDB support (optional)
- **nodemon** - Development auto-reload

## 🤝 Contributing

Feel free to fork, submit issues, and create pull requests!

## ⚖️ Legal Disclaimer

This bot is for educational purposes. Ensure you comply with WhatsApp's Terms of Service. Automated message forwarding may violate their policies. Use responsibly!

## 📄 License

MIT License - See LICENSE file for details

## 💬 Support

Have questions? Open an issue or reach out to the maintainers.

---

**Happy forwarding! 🚀**
