# 🎓 Nexus AI - Complete Project Documentation

**Last Updated:** December 9, 2025

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Configuration](#configuration)
6. [Components](#components)
7. [API Integration](#api-integration)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Changelog](#changelog)

---

## 🚀 Project Overview

**Nexus AI** is a free, open-source AI chatbot platform designed for students, developers, and professionals who need access to multiple AI models without expensive subscriptions.

### Key Features
- ✅ **Multi-Model Support** - Access 5 different AI models
- ✅ **Authentication** - Supabase-powered user accounts
- ✅ **Chat History** - Persistent conversation storage for logged-in users
- ✅ **Image Upload** - Upload images to chat (logged-in users)
- ✅ **Dark/Light Theme** - Full theme switching
- ✅ **Prompt Templates** - 20+ pre-built templates
- ✅ **Export Chats** - Download conversations
- ✅ **Responsive Design** - Works on all devices

### Tech Stack
- **Frontend:** React 18 + Vite
- **Styling:** CSS with CSS Variables
- **Backend:** Supabase (Auth + Database + Storage)
- **AI Models:** Google Gemini, Groq (Llama/Mixtral), HuggingFace
- **Rendering:** React Markdown + Syntax Highlighter

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Free API keys (see below)

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:5173
```

### API Keys (All Free)
1. **Gemini** (Required): https://makersuite.google.com/app/apikey
2. **Groq** (Optional): https://console.groq.com
3. **HuggingFace** (Optional): https://huggingface.co/settings/tokens
4. **Supabase**: https://supabase.com/dashboard

Keys are already configured in `.env` file for this project.

---

## 🎯 Features

### 1. Multi-Model AI System

**Available Models:**

| Model | Provider | Best For | Features |
|-------|----------|----------|----------|
| Gemini 1.5 Pro 🔷 | Google | Complex reasoning, long context | Text, Image, Code |
| Gemini 1.5 Flash ⚡ | Google | Quick responses | Text, Code |
| Llama 3.3 70B 🦙 | Groq | Ultra-fast inference | Text, Code |
| Mixtral 8x7B 🎯 | Groq | Creative writing | Text, Code |
| Mistral 7B 🤗 | HuggingFace | Fast open-source | Text |

**Model Switching:**
- Click model selector in top navigation
- See model descriptions and features
- Switch instantly between models
- Each model optimized for different tasks

### 2. Authentication & User Management

**Features:**
- Email/password sign up and login
- User profile with display name
- Session persistence
- Sign out functionality

**Benefits of Signing In:**
- ✅ Save chat history to cloud
- ✅ Access chats from any device
- ✅ Upload images to chat
- ✅ Delete saved sessions

**Guest Mode:**
- Use all AI models
- Local chat history (browser only)
- No image upload

### 3. Chat History & Sessions

**Logged-In Users:**
- Chats saved to Supabase database
- Organized by sessions
- Load previous conversations
- Delete unwanted sessions
- Accessible from sidebar

**Guest Users:**
- Last 50 chats in localStorage
- Cleared on browser data wipe
- Quick access to recent prompts

### 4. Image Upload (Logged-In Only)

**How It Works:**
1. Click gallery icon in chat input
2. Select image (max 5MB)
3. Preview appears above input
4. Add text prompt (optional)
5. Send - image uploaded to Supabase Storage
6. AI analyzes image (Gemini models only)

**Supported Formats:**
- JPEG, PNG, GIF, WebP
- Maximum size: 5MB

### 5. Theme System

**Dark/Light Toggle:**
- Click sun/moon icon in navigation
- Preference saved to localStorage
- All components fully themed
- Smooth transitions

**Color Schemes:**
- Light: White backgrounds, dark text
- Dark: Dark gray backgrounds, light text
- Accent: Purple gradient throughout

### 6. Prompt Templates

**5 Categories, 20+ Templates:**

#### Academic & Research 📚
- Essay Outline Generator
- Research Summary Writer
- Citation Helper (APA/MLA)
- Study Guide Creator

#### Writing & Content ✍️
- Grammar & Spell Checker
- Professional Email Writer
- Resume Bullet Point Generator
- Creative Writing Assistant

#### Learning & Tutoring 🧮
- Step-by-Step Math Solver
- Concept Explainer (ELI5)
- Language Practice Partner
- Q&A Tutor

#### Productivity & Planning 📋
- Task Organizer & Prioritizer
- Goal Planning Assistant
- Data Analysis Helper
- Meeting Notes Organizer

#### Programming & Tech 💻
- Code Explainer
- Debug Helper
- Code Optimizer
- Documentation Generator

**Usage:**
1. Click "✨ Templates" button
2. Browse categories
3. Click template to insert
4. Customize and send

### 7. Export Functionality

**Export Conversations:**
- Click "💾 Export" button (appears after AI response)
- Downloads as `.txt` file
- Includes: prompt, response, model name, timestamp
- Auto-generated filename

---

## 🏗️ Architecture

### Project Structure
```
React-Gemini-Clone/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/
│   │   ├── Auth/        # Login/Signup components
│   │   ├── Main/        # Main chat interface
│   │   ├── Sidebar/     # Navigation sidebar
│   │   ├── ModelSwitcher/   # AI model selector
│   │   ├── ThemeToggle/     # Theme switcher
│   │   └── PromptTemplates/ # Template library
│   ├── config/
│   │   ├── supabase.js      # Supabase client & helpers
│   │   ├── aiService.js     # AI model handlers
│   │   └── models.js        # Model configurations
│   ├── context/
│   │   ├── AuthContext.jsx  # Auth state management
│   │   └── Context.jsx      # App state management
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                 # Environment variables (API keys)
├── DATABASE_SCHEMA.sql  # Supabase database setup
├── agents.md           # This file (all documentation)
└── package.json
```

### State Management

**AuthContext (Authentication):**
- User state (logged in/out)
- Session management
- User sessions list
- Sign in/up/out functions

**Context (App State):**
- Chat messages
- Current session
- Selected AI model
- Theme preference
- Uploaded images
- Loading states

### Data Flow
```
User Input → Context → AI Service → API → Response → Context → UI
         ↓
    (If logged in)
         ↓
    Supabase → Database/Storage
```

---

## ⚙️ Configuration

### Environment Variables

File: `.env`
```bash
# AI Model APIs
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
VITE_HUGGINGFACE_API_KEY=your_hf_key

# Supabase (Authentication & Database)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Model Configuration

File: `src/config/models.js`

**AI_MODELS Object:**
- Model metadata (name, description, icon)
- Provider information
- Feature flags

**API_CONFIG Object:**
- API endpoints
- Model names (internal API IDs)
- Provider-specific configs

**To Add New Model:**
1. Add to `AI_MODELS` object
2. Add API config to `API_CONFIG`
3. Add handler in `aiService.js`
4. Update switch statement in `runAIChat()`

### Supabase Configuration

File: `src/config/supabase.js`

**Exports:**
- `supabase` - Client instance
- `signUp()` - User registration
- `signIn()` - User login
- `signOut()` - Logout
- `saveChatSession()` - Create session
- `saveMessage()` - Save message
- `getChatSessions()` - Load user sessions
- `getSessionMessages()` - Load session messages
- `deleteChatSession()` - Delete session
- `uploadImage()` - Upload to storage

---

## 🧩 Components

### Main Components

#### 1. Main.jsx
**Purpose:** Primary chat interface

**Features:**
- Message input
- Image upload button
- Send button
- Message history display
- Model badge
- Export button
- Auth modal trigger

**State:**
- `input` - Current message
- `imagePreview` - Selected image preview
- `showResult` - Show/hide results
- `loading` - Loading state

#### 2. Sidebar.jsx
**Purpose:** Navigation and chat history

**Features:**
- Collapse/expand toggle
- New chat button
- Saved sessions (if logged in)
- Recent prompts (if guest)
- Delete session buttons
- Sign-in prompt (if guest)

**State:**
- `extended` - Sidebar open/closed

#### 3. AuthModal.jsx
**Purpose:** User authentication UI

**Features:**
- Login/signup toggle
- Email/password inputs
- Display name (signup)
- Error messages
- Success messages
- Benefits list

**State:**
- `isLogin` - Login vs signup mode
- `email`, `password`, `displayName`
- `isLoading` - Form submission state

#### 4. UserMenu.jsx
**Purpose:** User profile dropdown

**Features:**
- User avatar with initial
- Display name & email
- Sign out button
- Shows "Sign In" if logged out

**State:**
- `showMenu` - Dropdown open/closed

#### 5. ModelSwitcher.jsx
**Purpose:** AI model selection

**Features:**
- Dropdown with all models
- Model icons and descriptions
- Provider info
- Active indicator

**State:**
- `isOpen` - Dropdown visibility

#### 6. ThemeToggle.jsx
**Purpose:** Dark/light theme switch

**Features:**
- Animated sun/moon icon
- Smooth transitions
- Persistent preference

#### 7. PromptTemplates.jsx
**Purpose:** Template library

**Features:**
- Category tabs
- Template cards
- One-click insertion
- Close button

**State:**
- `activeCategory` - Selected tab

---

## 🔌 API Integration

### Google Gemini

**Function:** `runGeminiChat(prompt, modelId)`

**Endpoint:** 
```
https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
```

**Models:**
- `gemini-1.5-pro`
- `gemini-1.5-flash`

**Parameters:**
- Temperature: 0.7
- Top K: 40
- Top P: 0.95
- Max tokens: 8192

**Safety Settings:**
- Harassment: BLOCK_MEDIUM_AND_ABOVE
- Hate speech: BLOCK_MEDIUM_AND_ABOVE
- Sexually explicit: BLOCK_MEDIUM_AND_ABOVE
- Dangerous content: BLOCK_MEDIUM_AND_ABOVE

### Groq (Llama/Mixtral)

**Function:** `runGroqChat(prompt, modelId)`

**Endpoint:**
```
https://api.groq.com/openai/v1/chat/completions
```

**Models:**
- `llama-3.3-70b-versatile`
- `mixtral-8x7b-32768`

**Parameters:**
- Temperature: 0.7
- Max tokens: 8192

**Format:** OpenAI-compatible API

### HuggingFace

**Function:** `runHuggingFaceChat(prompt)`

**Endpoint:**
```
https://api-inference.huggingface.co/models/{model}
```

**Model:**
- `mistralai/Mistral-7B-Instruct-v0.2`

**Parameters:**
- Max new tokens: 1024
- Temperature: 0.7

**Note:** May have cold start delays

---

## 🗄️ Database Schema

### Supabase Tables

#### chat_sessions
```sql
id              UUID PRIMARY KEY
user_id         UUID (references auth.users)
title           TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

**Purpose:** Store chat conversations

**RLS Policies:**
- Users can only view/edit/delete their own sessions

#### messages
```sql
id              UUID PRIMARY KEY
session_id      UUID (references chat_sessions)
role            TEXT (user/assistant)
content         TEXT
model           TEXT
image_url       TEXT (nullable)
created_at      TIMESTAMP
```

**Purpose:** Store individual messages

**RLS Policies:**
- Users can only access messages from their own sessions

### Storage Bucket

**Name:** `chat-images`
**Type:** Public
**Purpose:** Store uploaded images

**Structure:**
```
chat-images/
  └── {user_id}/
      └── {timestamp}.{ext}
```

**Policies:**
- Authenticated users can upload
- Anyone can view (public bucket)
- Users can delete their own images

---

## 🚀 Deployment

### Build for Production

```bash
# Install dependencies
npm install

# Build optimized bundle
npm run build

# Output in dist/ folder
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Add environment variables in Netlify dashboard
```

### Environment Variables

Make sure to add all `.env` variables to your hosting platform's environment settings.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "API key not configured" Error
**Solution:**
- Check `.env` file exists
- Verify API key is correct
- Restart dev server after changing `.env`

#### 2. Models Not Working
**Solution:**
- Confirm API keys are valid
- Check API quotas/limits
- Try different model
- Check browser console for errors

#### 3. Database Connection Error
**Solution:**
- Verify Supabase URL and key
- Check database tables exist (run SQL schema)
- Verify RLS policies enabled

#### 4. Image Upload Fails
**Solution:**
- Create `chat-images` bucket in Supabase Storage
- Make bucket public
- Check image size (<5MB)
- Verify user is logged in

#### 5. Chat History Not Saving
**Solution:**
- Ensure user is logged in
- Check database connection
- Verify RLS policies
- Check browser console for errors

### Debug Mode

**Enable detailed logging:**
```javascript
// In aiService.js
console.log('API Request:', { prompt, modelId });
console.log('API Response:', response);
```

---

## 📝 Changelog

### Version 2.0.0 - December 9, 2025
**Major Update: Supabase Integration**

**Added:**
- ✅ User authentication (email/password)
- ✅ Persistent chat history to database
- ✅ Image upload functionality
- ✅ Session management
- ✅ User profile menu
- ✅ Saved sessions in sidebar
- ✅ AuthContext for state management
- ✅ Database schema with RLS
- ✅ Storage bucket for images

**Changed:**
- 🔄 Updated model names to latest versions
- 🔄 Renamed from "ScholarAI" to "Nexus AI"
- 🔄 Enhanced Context.jsx with Supabase integration
- 🔄 Updated Main.jsx with auth UI
- 🔄 Enhanced Sidebar with session management

**Fixed:**
- 🐛 Model API compatibility issues
- 🐛 Groq API error handling
- 🐛 Environment variable loading

### Version 1.0.0 - Initial Release
**Features:**
- Multi-model support (5 AI models)
- Dark/light theme
- Prompt templates
- Chat history (localStorage)
- Export functionality
- Markdown rendering
- Code syntax highlighting
- Responsive design

---

## 🎯 Future Roadmap

### Planned Features
- [ ] Voice input/output
- [ ] Multi-language UI
- [ ] Advanced image analysis (OCR, object detection)
- [ ] Chat folders/organization
- [ ] Search chat history
- [ ] Share conversations (public links)
- [ ] Collaborative workspaces
- [ ] Custom prompt saving
- [ ] Usage analytics
- [ ] PWA for offline use

### Under Consideration
- [ ] File upload (PDF, DOCX)
- [ ] Video analysis
- [ ] Browser extension
- [ ] Mobile apps (React Native)
- [ ] API access for developers

---

## 📞 Support & Contributing

### Get Help
1. Check this documentation first
2. Review error messages in browser console
3. Check Supabase dashboard for backend issues
4. Verify API keys and quotas

### Contributing
Contributions welcome! Areas needing help:
- Adding new AI models
- Creating more prompt templates
- Improving UI/UX
- Bug fixes
- Documentation improvements
- Translations

### License
MIT License - Free to use, modify, and distribute

---

## 🙏 Acknowledgments

**Built With:**
- React & Vite
- Supabase
- Google Gemini AI
- Groq
- HuggingFace
- React Markdown
- React Syntax Highlighter

**Special Thanks:**
- Google for free Gemini API
- Groq for ultra-fast inference
- HuggingFace for open-source models
- Supabase for generous free tier

---

## 📊 Project Statistics

- **Total Lines of Code:** ~5000+
- **Components:** 10+
- **API Integrations:** 5
- **Features:** 60+
- **Documentation:** Complete
- **Status:** Production Ready ✅

---

**Made with ❤️ for accessible AI**

*"Free AI for everyone who needs to learn, create, and grow"*

---

**Last Updated:** December 9, 2025
**Version:** 2.0.0
**Maintained By:** Nexus AI Team