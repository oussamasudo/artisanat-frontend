import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {   
  const { email, message } = await req.json()

  await resend.emails.send({
    from: 'Heritage AI <onboarding@resend.dev>',
    to: 'oussamahafdoune6@gmail.com',  // ← votre email ici
    subject: '✦ Nouvelle remarque — Heritage AI',
    html: `
      <h2>Nouvelle remarque reçue</h2>
      <p><strong>De :</strong> ${email || 'Anonyme'}</p>
      <hr/>
      <p>${message}</p>
    `,
  })

  return NextResponse.json({ ok: true })
}