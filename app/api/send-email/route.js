import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { to, briefing, date } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 텍스트를 HTML로 변환 (줄바꿈 처리)
    const htmlBody = briefing
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>")
      .replace(/---/g, "<hr style='border:1px solid #dcecd4;margin:20px 0'/>");

    const html = `
      <div style="max-width:680px;margin:0 auto;font-family:Georgia,serif;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #dcecd4;">
        <div style="background:linear-gradient(160deg,#1a3a2a,#2d5a3a);padding:32px 28px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">🌿</div>
          <h1 style="margin:0;color:#e8f5e0;font-size:24px;">세계 동화 교육 브리핑</h1>
          <p style="margin:8px 0 0;color:#8fbc8f;font-size:14px;">${date}</p>
          <p style="margin:6px 0 0;color:#6aaa6a;font-size:12px;">0–7세 · 세계 각국 동화 7-10편 · 누리과정 연계 활동 포함</p>
        </div>
        <div style="padding:28px;font-size:14px;line-height:1.9;color:#2a3a2a;">
          ${htmlBody}
        </div>
        <div style="background:#f0f8ec;padding:18px 28px;text-align:center;font-size:12px;color:#8aaa8a;border-top:1px solid #dcecd4;">
          세계 동화 교육 브리핑 · 유아교육 전문가 설계
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"세계 동화 브리핑" <${process.env.GMAIL_USER}>`,
      to,
      subject: `📚 세계 동화 교육 브리핑 - ${date}`,
      html,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "이메일 전송 실패" }, { status: 500 });
  }
}
