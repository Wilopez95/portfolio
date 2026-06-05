import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // When RESEND_API_KEY is set in .env.local, emails will send.
  // Until then, log to console in dev.
  if (!process.env.RESEND_API_KEY) {
    console.log("[Contact Form]", { name, email, message });
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "wilopez95@gmail.com",
      replyTo: email,
      subject: `[Portfolio] New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Contact API]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
