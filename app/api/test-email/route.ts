import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use this default sender for sandbox
      to: 'exampleemail@gmail.com', // Change this to YOUR email
      subject: 'Test: Blog System Integration',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #333;">It Works! 🚀</h1>
          <p>This is a test from your Next.js Blog system.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">Sandbox Test Mode</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}