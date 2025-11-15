# Student PDF Game App

A React application that allows students to upload PDFs, extract text locally, and generate interactive learning content (MCQs, flashcards, fill-in-the-blanks, mini-quizzes) using n8n workflows.

## Features

- 📄 **PDF Upload**: Drag-and-drop or click to upload PDF files
- 🔍 **Local Text Extraction**: Extracts text from PDFs using pdf.js (no server upload needed)
- 🎮 **Interactive Content**: Generates multiple types of learning games:
  - Multiple Choice Questions (MCQs)
  - Flashcards with flip animation
  - Fill-in-the-blank exercises
  - Mini quizzes
- 🎨 **Modern UI**: Built with TailwindCSS and shadcn/ui components
- ⚡ **Fast**: Powered by Vite for lightning-fast development

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **pdf.js** for PDF text extraction
- **Axios** for API calls
- **n8n** for backend workflow processing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/pdf-processor
```

Replace with your actual n8n webhook URL.

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## n8n Workflow Setup

Your n8n workflow should:

1. Receive a POST request with the following payload:
```json
{
  "text": "extracted text from PDF",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

2. Process the text and generate game content

3. Return a response in the following format:
```json
{
  "content": [
    {
      "type": "mcq",
      "data": {
        "question": "What is React?",
        "options": ["A library", "A framework", "A language", "A database"],
        "correctAnswer": 0,
        "explanation": "React is a JavaScript library for building user interfaces"
      }
    },
    {
      "type": "flashcard",
      "data": {
        "front": "What is JSX?",
        "back": "JSX is a syntax extension for JavaScript"
      }
    }
  ]
}
```

### Supported Content Types

- **mcq**: Multiple choice questions
- **flashcard**: Front/back flashcards
- **fill-in-the-blank**: Fill in the blank exercises
- **mini-quiz**: Collection of MCQs with optional time limit

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   ├── PDFUpload.tsx
│   └── GameContent.tsx
├── pages/
│   └── Home.tsx
├── services/
│   ├── pdfExtractor.ts
│   └── n8nService.ts
├── types/
│   └── game.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

MIT

