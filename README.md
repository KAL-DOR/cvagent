# CV Agent - AI-Powered CV Screener

An intelligent CV screening application that uses AI to analyze candidate resumes against job profiles and provides confidence scores with detailed insights.

![CV Agent](https://img.shields.io/badge/CV-Agent-green?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT4-green?style=for-the-badge&logo=openai)

## 🚀 Features

- **AI-Powered Analysis**: Advanced machine learning algorithms for accurate candidate assessment
- **Confidence Scoring**: Precise confidence scores with detailed breakdowns
- **Multi-Format Support**: PDF, DOCX, DOC, and TXT file processing
- **Batch Processing**: Analyze multiple CVs simultaneously
- **Cost Optimization**: Built-in rate limiting and token management
- **Responsive Design**: Modern UI with green color palette inspired by Sandstruck
- **Vercel Ready**: Optimized for serverless deployment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom green palette
- **AI/ML**: OpenAI GPT-4 for CV analysis
- **File Processing**: PDF-parse, Mammoth for document extraction
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel (serverless functions)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cv-agent.git
cd cv-agent
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Vercel Blob Storage (for production)
VERCEL_BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Configure Environment Variables**:
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Add `NEXT_PUBLIC_APP_URL` with your Vercel deployment URL
4. **Deploy**: Click "Deploy" and wait for the build to complete

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to configure your project
```

## 📊 Rate Limiting & Cost Control

The application includes comprehensive rate limiting and cost control measures:

### API Rate Limits
- **Upload**: 5 requests per minute
- **Analysis**: 3 requests per 5 minutes
- **General**: 100 requests per minute

### File Limits
- **Max file size**: 10MB per file
- **Max files per upload**: 10 files
- **Max CVs per analysis**: 20 CVs
- **Max text length**: 50,000 characters

### Token Limits
- **Max tokens per request**: 8,000
- **Max requests per hour**: 50
- **Max requests per day**: 200

## 🎨 Customization

### Color Palette

The application uses a custom green color palette inspired by Sandstruck:

```css
Primary Green: #2d5a27 (Dark green)
Secondary Green: #4a7c59 (Medium green)
Accent Green: #6b8e23 (Olive green)
Light Green: #9dc183 (Light green)
Background: #f8faf8 (Off-white)
```

### Styling

Modify the color palette in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#f8faf8',
    100: '#e8f5e8',
    // ... customize as needed
  }
}
```

## 🔧 Configuration

### OpenAI API

The application uses OpenAI's GPT-4 for CV analysis. Ensure your API key has sufficient credits and access to GPT-4.

### File Processing

Supported file formats and their size limits:

| Format | Max Size | Processing |
|--------|----------|------------|
| PDF    | 5MB      | Text extraction |
| DOCX   | 5MB      | Text extraction |
| DOC    | 3MB      | Text extraction |
| TXT    | 1MB      | Direct processing |

## 📁 Project Structure

```
cv-agent/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (serverless functions)
│   │   ├── upload/        # File upload endpoint
│   │   ├── analyze/       # CV analysis endpoint
│   │   └── health/        # Health check endpoint
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── JobProfileForm.tsx
│   │   ├── FileUpload.tsx
│   │   └── AnalysisResults.tsx
│   ├── lib/              # Utilities and services
│   │   ├── types.ts      # TypeScript types
│   │   ├── utils.ts      # Utility functions
│   │   ├── openai.ts     # OpenAI service
│   │   ├── file-processor.ts # File processing
│   │   └── rate-limiter.ts   # Rate limiting
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
├── package.json          # Dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind configuration
├── vercel.json           # Vercel configuration
└── README.md            # This file
```

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse and controls costs
- **File Validation**: Validates file types and sizes
- **Input Sanitization**: Sanitizes all user inputs
- **CORS Configuration**: Proper CORS headers for API routes
- **Environment Variables**: Secure API key management

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

## 📈 Performance Optimization

- **Serverless Functions**: Optimized for Vercel's serverless environment
- **Caching**: React Query for client-side caching
- **Bundle Optimization**: Next.js automatic code splitting
- **Image Optimization**: Next.js built-in image optimization
- **CDN**: Vercel's global CDN for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/cv-agent/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- **Sandstruck**: For the inspiring green color palette
- **OpenAI**: For providing the GPT-4 API
- **Vercel**: For the excellent hosting platform
- **Next.js Team**: For the amazing React framework

---

**Made with ❤️ for better hiring decisions**
