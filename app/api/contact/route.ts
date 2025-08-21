import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { nombre, email, telefono, asunto, mensaje } = await request.json()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'web@montevera.com.ar',
        to: ['info@montevera.com.ar'],
        subject: asunto || 'Nuevo mensaje',
        text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\n\n${mensaje}`,
      }),
    })

    if (!res.ok) {
      console.error('Failed to send email', await res.text())
      return new NextResponse('Error sending email', { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email', error)
    return new NextResponse('Error sending email', { status: 500 })
  }
}
