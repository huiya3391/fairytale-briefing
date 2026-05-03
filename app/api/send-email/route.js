export async function POST(req) {
  try {
    const { briefing, date } = await req.json();

    const notionToken = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // 브리핑 텍스트를 노션 블록으로 변환 (2000자 제한으로 나누기)
    const chunks = [];
    const maxLen = 1900;
    let text = briefing;
    while (text.length > 0) {
      chunks.push(text.slice(0, maxLen));
      text = text.slice(maxLen);
    }

    const children = chunks.map(chunk => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: chunk } }]
      }
    }));

    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [{ text: { content: `🌿 세계 동화 교육 브리핑 - ${date}` } }]
          },
          날짜: {
            date: { start: new Date().toISOString().split("T")[0] }
          }
        },
        children: children.slice(0, 100)
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Notion error:", err);
      throw new Error("노션 저장 실패");
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "노션 저장 실패: " + err.message }, { status: 500 });
  }
}
