export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // URL du backend
    const backendUrl = 'http://localhost:5000'
    
    const response = await fetch(`${backendUrl}/predict`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Backend prediction failed')
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Prediction error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Prediction failed' },
      { status: 500 }
    )
  }
}
