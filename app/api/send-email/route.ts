import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, asunto, mensaje } = await request.json()

    // Validar campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY
    
    if (!apiKey) {
      console.error('RESEND_API_KEY no está configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incorrecta' },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    // Crear HTML bonito para el email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin: 0; font-size: 28px;">Monte Vera</h1>
            <p style="color: #666; margin: 5px 0 0 0;">Nueva consulta desde la página web</p>
          </div>
          
          <!-- Banner destacado con info del remitente -->
          <div style="background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 20px; border-radius: 10px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 22px;">Mensaje de: ${nombre}</h2>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">
              📧 <a href="mailto:${email}" style="color: #bef264; text-decoration: none; font-weight: bold;">${email}</a>
            </p>
            ${telefono ? `<p style="margin: 10px 0 0 0; opacity: 0.9;">📱 ${telefono}</p>` : ''}
          </div>
          
          <div style="border-left: 4px solid #16a34a; padding-left: 20px; margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 10px 0; font-size: 22px;">Asunto: ${asunto}</h2>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Mensaje:</h3>
            <div style="background-color: #f8f9fa; border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px; line-height: 1.6; color: #333;">
              ${mensaje.replace(/\n/g, '<br />')}
            </div>
          </div>
          
          <!-- Botón de respuesta rápida -->
          <div style="text-align: center; margin: 25px 0;">
            <a href="mailto:${email}?subject=Re: ${asunto}" 
               style="background-color: #16a34a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              📧 Responder a ${nombre}
            </a>
          </div>
          
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e5e5; color: #666; font-size: 14px;">
            <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto de <strong>monteverasrl.com.ar</strong></p>
            <p style="margin: 5px 0 0 0;">Fecha: ${new Date().toLocaleString('es-AR', { 
              timeZone: 'America/Argentina/Buenos_Aires',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
              💡 Tip: Al hacer clic en "Responder" en tu cliente de email, la respuesta irá directamente a <strong>${email}</strong>
            </p>
          </div>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Dominio verificado (requerido por Resend)
      to: 'info@monteverasrl.com.ar', // Tu email para pruebas
      replyTo: email, // El email del usuario - cuando respondas irá directamente a él
      subject: `[Web] ${asunto} - De: ${nombre}`,
      html: htmlContent
    })

    console.log('Email enviado exitosamente:', result)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error detallado al enviar email:', error)
    
    // Log más detallado del error
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message)
      console.error('Stack trace:', error.stack)
    }
    
    return NextResponse.json(
      { error: 'Error al enviar el email. Por favor, intenta nuevamente.' },
      { status: 500 }
    )
  }
}
