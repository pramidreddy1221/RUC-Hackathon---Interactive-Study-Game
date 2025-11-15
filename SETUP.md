# Setup and Run Instructions

## Step-by-Step Guide to Run the Application

### Prerequisites
Make sure you have the following installed:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **pnpm**

### Step 1: Install Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
npm install
```

This will install all required packages including React, Vite, TypeScript, TailwindCSS, and other dependencies.

**Expected output:** You should see packages being downloaded and installed. This may take a few minutes.

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory of your project (same level as `package.json`).

**On Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**On Mac/Linux:**
```bash
touch .env
```

Then open the `.env` file and add your n8n webhook URL:

```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/pdf-processor
```

**Important:** 
- Replace `http://localhost:5678/webhook/pdf-processor` with your actual n8n webhook URL
- If you don't have n8n set up yet, you can use a placeholder URL for now (the app will show an error when trying to process, but you can still test the PDF upload)

### Step 3: Start the Development Server

Run the following command:

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

Open your web browser and navigate to:
```
http://localhost:5173
```

You should see the "Student PDF Game App" homepage with the upload interface.

### Step 5: Test the Application

1. **Upload a PDF:**
   - Click on the upload area or drag and drop a PDF file
   - The file should appear with its name and size

2. **Process the PDF:**
   - Click the "Process PDF" button
   - You'll see a loading indicator while the text is being extracted
   - Then another loading indicator while it's being sent to n8n

3. **View Results:**
   - Once processed, the game content will be displayed
   - You can interact with MCQs, flashcards, fill-in-the-blanks, etc.

## Available Scripts

- `npm run dev` - Start development server (default: http://localhost:5173)
- `npm run build` - Build for production (creates `dist` folder)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check for code issues

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Make sure you ran `npm install` and all dependencies were installed successfully.

### Issue: Port 5173 is already in use
**Solution:** Vite will automatically try the next available port (5174, 5175, etc.), or you can specify a different port:
```bash
npm run dev -- --port 3000
```

### Issue: PDF extraction fails
**Solution:** 
- Make sure the PDF file is not corrupted
- Check browser console for detailed error messages
- Ensure the PDF is not password-protected

### Issue: n8n connection fails
**Solution:**
- Verify your n8n webhook URL in the `.env` file
- Make sure your n8n workflow is active and running
- Check that CORS is enabled on your n8n instance if it's on a different domain
- Check browser console for network errors

### Issue: Styles not loading
**Solution:**
- Make sure TailwindCSS is properly configured
- Try clearing browser cache
- Restart the dev server

## n8n Workflow Setup

Your n8n workflow should:

1. **Receive a Webhook** (HTTP Request node)
   - Method: POST
   - Path: `/webhook/pdf-processor` (or your custom path)
   - Response Mode: "Respond to Webhook"

2. **Process the Text** (use any n8n nodes to process the text)

3. **Return JSON Response** in this format:
```json
{
  "content": [
    {
      "type": "mcq",
      "data": {
        "question": "What is React?",
        "options": ["A library", "A framework", "A language"],
        "correctAnswer": 0,
        "explanation": "React is a JavaScript library"
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

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder. You can deploy this folder to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

To preview the production build locally:

```bash
npm run build
npm run preview
```

## Need Help?

- Check the browser console (F12) for error messages
- Check the terminal for build/compilation errors
- Verify all environment variables are set correctly
- Ensure your n8n workflow is properly configured

