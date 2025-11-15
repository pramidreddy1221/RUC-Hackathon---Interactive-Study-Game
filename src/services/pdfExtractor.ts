// Import pdfjs-dist - using static import for better Vite compatibility
import * as pdfjsLib from 'pdfjs-dist'

// Configure worker source - using CDN
let workerConfigured = false

const configureWorker = () => {
  if (workerConfigured) return
  
  try {
    if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
      const version = pdfjsLib.version || '3.11.174'
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
      workerConfigured = true
    }
  } catch (error) {
    console.warn('Failed to configure PDF.js worker:', error)
  }
}

// Configure worker on module load
if (typeof window !== 'undefined') {
  configureWorker()
}

export interface PDFExtractionResult {
  text: string
  pageCount: number
}

export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  try {
    // Ensure worker is configured
    configureWorker()
    
    // Use getDocument from pdfjsLib
    const getDocument = pdfjsLib.getDocument
    
    if (!getDocument || typeof getDocument !== 'function') {
      throw new Error('getDocument is not available. pdfjs-dist may not be loaded correctly.')
    }
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    return await extractPages(pdf)
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.')
  }
}

// Helper function to extract text from all pages
async function extractPages(pdf: any): Promise<PDFExtractionResult> {
  let fullText = ''
  const pageCount = pdf.numPages

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    fullText += pageText + '\n\n'
  }

  return {
    text: fullText.trim(),
    pageCount,
  }
}

