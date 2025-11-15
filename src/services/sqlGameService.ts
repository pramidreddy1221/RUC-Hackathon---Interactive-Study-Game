import axios from 'axios'

const NEXT_LEVEL_WEBHOOK_URL = import.meta.env.VITE_N8N_NEXT_LEVEL_WEBHOOK_URL || 'https://ruchack.app.n8n.cloud/webhook-test/c3a31930-f466-4674-8cc7-460fccc05d7d'

export interface NextLevelResponse {
  success: boolean
  error?: string
}

export async function callNextLevelWebhook(level: number): Promise<NextLevelResponse> {
  try {
    const data = {"current level" : level}
    console.log('Calling next level webhook:', NEXT_LEVEL_WEBHOOK_URL)
    
    const response = await axios.post(
      NEXT_LEVEL_WEBHOOK_URL,
      {
        data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 seconds timeout
      }
    )

    console.log('Next level webhook response:', response.data)
    
    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error calling next level webhook:', error)
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to call next level webhook',
    }
  }
}

