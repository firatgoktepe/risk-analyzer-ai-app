# Work Safety Analyzer

> AI-powered workplace safety analysis through photo upload

A modern, responsive web application that uses artificial intelligence to analyze workplace photos and identify potential safety risks. Built with Next.js 14 and powered by OpenAI's GPT-4 Vision model.

## 🎯 Project Overview

The Work Safety Analyzer is a single-page application designed to help identify workplace safety hazards through AI-powered photo analysis. Users can upload or capture photos of their workplace, and the system provides detailed safety assessments with risk levels and actionable recommendations.

### Key Features

- **📸 Smart Photo Upload**: Drag-and-drop interface with mobile camera integration
- **🤖 AI-Powered Analysis**: OpenAI GPT-4 Vision model for accurate risk detection
- **📊 Risk Assessment**: Categorized risk levels (High, Medium, Low) with specific recommendations
- **📄 PDF Reports**: Professional safety analysis reports with embedded photos
- **📱 Mobile-First Design**: Responsive interface optimized for all devices
- **⚡ Real-time Processing**: Fast analysis with loading states and error handling
- **🎨 Modern UI**: Clean, accessible interface built with TailwindCSS and shadcn/ui

## 🛠 Technical Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useCallback)

### Backend & AI

- **API Routes**: Next.js API routes
- **AI Provider**: OpenAI GPT-4 Vision (gpt-4o model)
- **Image Processing**: Base64 conversion and validation

### Document Generation

- **PDF Generation**: jsPDF
- **HTML to Canvas**: html2canvas
- **Image Embedding**: Native jsPDF image support

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack (Next.js)
- **Type Checking**: TypeScript 5

## 📁 Project Structure

```
work-safety-analyzer/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # AI analysis API endpoint
│   ├── favicon.ico
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── AnalysisResults.tsx       # Results display with PDF export
│   ├── ErrorDisplay.tsx          # Error handling component
│   ├── LoadingSpinner.tsx        # Loading state component
│   ├── PhotoPreview.tsx          # Photo preview with analysis controls
│   └── PhotoUpload.tsx           # Upload interface with drag-and-drop
├── lib/                          # Utility libraries
│   ├── pdf-utils.ts              # PDF generation utilities
│   └── utils.ts                  # General utility functions
├── public/                       # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd work-safety-app/work-safety-analyzer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Basic Workflow

1. **Upload Photo**:

   - Drag and drop an image onto the upload area
   - Click "Choose from Gallery" to select from files
   - On mobile: Use "Take Photo" to capture with camera

2. **Photo Validation**:

   - Supported formats: JPEG, PNG, WebP
   - Maximum file size: 10MB
   - Automatic file validation and error handling

3. **AI Analysis**:

   - Click "Analyze for Safety Risks"
   - Real-time processing with loading indicators
   - Comprehensive safety assessment

4. **Review Results**:

   - Risk categorization (High/Medium/Low)
   - Specific recommendations for each risk
   - Visual risk summary statistics

5. **Export Report**:
   - Generate professional PDF reports
   - Includes original photo and detailed analysis
   - Formatted for easy sharing and documentation

### Risk Assessment Categories

- **🔴 High Risk**: Immediate safety concerns requiring urgent attention
- **🟡 Medium Risk**: Important issues that should be addressed soon
- **🔵 Low Risk**: Minor concerns for monitoring and improvement

## 🔧 API Reference

### POST /api/analyze

Analyzes uploaded workplace photos for safety risks.

**Request Body:**

```json
{
  "base64Image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

**Response:**

```json
{
  "risks": [
    {
      "title": "Workers not wearing safety helmets",
      "level": "high",
      "recommendation": "Ensure all workers wear approved safety helmets at all times"
    }
  ]
}
```

**Error Responses:**

- `400`: Invalid request (no image provided)
- `401`: Invalid API key
- `429`: API quota exceeded
- `500`: Server error or AI processing failure

## ⚙️ Configuration

### Environment Variables

| Variable         | Description                     | Required |
| ---------------- | ------------------------------- | -------- |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 Vision | Yes      |

### Supported Image Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)

### File Size Limits

- Maximum upload size: 10MB
- Recommended resolution: 1024x1024 or higher for best analysis results

## 🧪 Development

### Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Code Structure

#### Components Architecture

- **Presentational Components**: UI rendering without business logic
- **Container Logic**: State management and API interactions
- **Custom Hooks**: Reusable stateful logic
- **Type Safety**: Comprehensive TypeScript interfaces

#### State Management

```typescript
interface UploadedPhoto {
  file: File;
  preview: string;
  base64: string;
}

interface AnalysisResult {
  risks: {
    title: string;
    level: "low" | "medium" | "high";
    recommendation: string;
  }[];
}
```

### AI Integration Details

The application uses OpenAI's GPT-4 Vision model with:

- **Model**: `gpt-4o` for image analysis
- **Temperature**: 0.1 for consistent results
- **Max Tokens**: 1000 for detailed responses
- **Image Detail**: High resolution for accurate analysis

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   - Import project to Vercel
   - Configure build settings (auto-detected)

2. **Environment Variables**

   ```
   OPENAI_API_KEY=your_api_key
   ```

3. **Deploy**
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

### Alternative Platforms

The application can be deployed on any platform supporting Next.js:

- **Netlify**: Static export with API routes
- **Railway**: Full-stack deployment
- **DigitalOcean App Platform**: Container deployment

### Build Configuration

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbo: true, // Enable Turbopack
  },
  images: {
    remotePatterns: [
      // Configure if using external images
    ],
  },
};
```

## 🔒 Security Considerations

- **API Key Security**: Never expose OpenAI API key in client-side code
- **File Validation**: Strict file type and size validation
- **Error Handling**: Sanitized error messages to prevent information leakage
- **CORS Protection**: API routes protected against unauthorized domains

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure mobile responsiveness
- Test across different browsers

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check existing documentation
- Review common troubleshooting scenarios

## 🔄 Version History

- **v0.1.0**: Initial release with core functionality
  - Photo upload and analysis
  - AI-powered risk detection
  - PDF report generation
  - Mobile-responsive design

---

**Built with ❤️ using Next.js, TypeScript, and OpenAI**
