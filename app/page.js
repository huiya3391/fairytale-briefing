"use client";
import { useState } from "react";

export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [status, setStatus] = useState("idle");
  const [briefing, setBriefing] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  function handleCodeSubmit() {
    if (codeInput.trim().toUpperCase() === (process.env.NEXT_PUBLIC_ACCESS_CODE || "FAIRY2026")) {
      setIsAuthed(true);
      setCodeError("");
    } else {
      setCodeError("접근 코드가 올바르지 않아요. 다시 확인해주세요.");
      setCodeInput("");
    }
  }

  async function generateBriefing() {
    setStatus("generating");
    setBriefing("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBriefing(data.briefing);
      setStatus("ready");
    } catch (e) {
      setErrorMsg("브리핑 생성 중 오류가 발생했어요. 다시 시도해주세요.");
      setStatus("error");
    }
  }

  async function saveToNotion() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefing, date: today }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStatus("done");
    } catch (e) {
      setErrorMsg("노션 저장 중 오류가 발생했어요.");
      setStatus("error");
    }
  }

  const S = {
    wrap: { minHeight: "100vh", background: "linear-gradient(160deg,#eef6ff,#f9f0ff,#fff0f7)", fontFamily: "'Nunito','Apple SD Gothic Neo',sans-serif" },
    header: { background: "linear-gradient(135deg,#ddeeff,#f5e0ff,#ffd6ec)", padding: "36px 24px 28px", textAlign: "center" },
    title: { margin: 0, fontSize: "clamp(20px,5vw,26px)", fontWeight: 800, color: "#3a3a7a", letterSpacing: "-0.3px" },
    date: { margin: "6px 0 14px", fontSize: 13, color: "#7a7aaa", fontWeight: 600 },
    tag: { fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 600 },
    body: { maxWidth: 520, margin: "0 auto", padding: "22px 16px 48px" },
    badge: { background: "#fff4e6", borderRadius: 14, padding: "13px 15px", border: "1px solid #ffddb8", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 16 },
    card: { background: "#fff", borderRadius: 14, padding: "13px 15px", border: "1px solid #e0ecff", display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 9 },
    iconCircle: { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
    btn: { width: "100%", padding: "15px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", background: "linear-gradient(135deg,#5a7ce8,#9b6fd4)", color: "#fff", letterSpacing: "0.3px" },
    btnDisabled: { background: "#b8c0e8" },
    hint: { textAlign: "center", marginTop: 10, fontSize: 12, color: "#aaaacc" },
  };

  if (!isAuthed) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 380, background: "#fff", borderRadius: 24, overflow: "hidden", border: "0.5px solid #e0d8ff" }}>
          <div style={S.header}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📚✨</div>
            <h1 style={S.title}>세계 동화 교육 브리핑</h1>
            <p style={{ ...S.date, marginBottom: 0 }}>교육자 전용 서비스 🔒</p>
          </div>
          <div style={{ padding: "24px 20px" }}>
            <div style={{ ...S.badge, marginBottom: 16 }}>
              <span style={{ fontSize: 20 }}>🔑</span>
              <div style={{ fontSize: 13, color: "#aa5500", lineHeight: 1.6 }}>
                <strong>허용된 사용자만 접근 가능해요</strong><br />
                <span style={{ fontSize: 12, color: "#cc8844" }}>관리자에게 받은 접근 코드를 입력해주세요</span>
              </div>
            </div>
            <input
              type="text" placeholder="접근 코드 입력"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
              style={{ width: "100%", padding: "13px 14px", border: `1.5px solid ${codeError ? "#ffaaaa" : "#d0c8ff"}`, borderRadius: 12, fontSize: 16, fontFamily: "inherit", color: "#3a3a7a", background: "#f8f6ff", boxSizing: "border-box", outline: "none", marginBottom: 10, textAlign: "center", letterSpacing: 3, fontWeight: 700 }}
            />
            {codeError && <div style={{ marginBottom: 10, padding: "9px 13px", background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 8, color: "#c0392b", fontSize: 13, textAlign: "center" }}>⚠️ {codeError}</div>}
            <button onClick={handleCodeSubmit} style={{ ...S.btn }}>🌈 입장하기</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={{ fontSize: 38, marginBottom: 8 }}>📚✨</div>
        <h1 style={S.title}>세계 동화 교육 브리핑</h1>
        <p style={S.date}>{today} 🌸</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ ...S.tag, background: "#ddeeff", color: "#2255aa" }}>🌍 세계 각국</span>
          <span style={{ ...S.tag, background: "#f5e0ff", color: "#7722aa" }}>👶 0-7세</span>
          <span style={{ ...S.tag, background: "#ffd6ec", color: "#aa2266" }}>🇰🇷 누리과정</span>
        </div>
      </div>

      <div style={S.body}>
        <div style={S.badge}>
          <span style={{ fontSize: 22 }}>👩‍🏫</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#aa5500" }}>교육자 & 부모 전용 심층 브리핑</div>
            <div style={{ fontSize: 11, color: "#cc8844", marginTop: 2 }}>현장에서 내일 바로 활용 가능해요!</div>
          </div>
        </div>

        {status !== "done" && (
          <button
            onClick={generateBriefing}
            disabled={status === "generating" || status === "sending"}
            style={{ ...S.btn, ...(status === "generating" ? S.btnDisabled : {}), marginBottom: 10 }}
          >
            {status === "generating" ? "✨ 브리핑 생성 중... (40-60초)" : "🌈 오늘의 브리핑 생성하기"}
          </button>
        )}

        {status === "generating" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, border: "1px solid #e0ecff", textAlign: "center", fontSize: 13, color: "#7a7aaa", lineHeight: 1.9, marginBottom: 12 }}>
            🌍 세계 각국 동화 7-10편 수집 중<br />
            🎨 누리과정 연계 활동 설계 중<br />
            💬 확장 질문 & 읽어주기 팁 작성 중
          </div>
        )}

        {errorMsg && (
          <div style={{ padding: "12px 14px", background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 10, color: "#c0392b", fontSize: 13, marginBottom: 12 }}>⚠️ {errorMsg}</div>
        )}

        {briefing && status !== "done" && (
          <div style={{ marginTop: 4 }}>
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e0ecff", marginBottom: 12 }}>
              <div style={{ background: "linear-gradient(135deg,#eef4ff,#f5eaff)", padding: "13px 16px", borderBottom: "1px solid #e0ecff", display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#3a3a7a" }}>브리핑 미리보기</div>
                  <div style={{ fontSize: 11, color: "#8888aa" }}>동화 7-10편 · 연계활동 3종 포함</div>
                </div>
              </div>
              <div style={{ padding: 18, maxHeight: 460, overflowY: "auto", fontSize: 13, lineHeight: 1.95, color: "#3a3a5a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {briefing}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", border: "1px solid #e0ecff", marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#3a3a7a", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18 }}>📝</span> 노션에 저장하기
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>브리핑을 노션 데이터베이스에 새 항목으로 저장해요</p>
              <button onClick={saveToNotion} disabled={status === "sending"}
                style={{ ...S.btn, ...(status === "sending" ? S.btnDisabled : {}) }}>
                {status === "sending" ? "📝 저장 중..." : "📝 노션에 저장하기"}
              </button>
            </div>

            <button onClick={generateBriefing}
              style={{ width: "100%", padding: 12, background: "transparent", color: "#9988cc", border: "1.5px solid #d8d0f8", borderRadius: 12, fontSize: 13, fontFamily: "inherit", cursor: "pointer", fontWeight: 700 }}>
              🔄 다시 생성하기
            </button>
          </div>
        )}

        {status === "done" && (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: 20, border: "1px solid #e0ecff" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🎉✨</div>
            <h2 style={{ margin: "0 0 10px", color: "#3a3a7a", fontSize: 22, fontWeight: 800 }}>노션 저장 완료!</h2>
            <p style={{ color: "#8888aa", fontSize: 14, margin: "0 0 24px", lineHeight: 1.7 }}>
              오늘의 세계 동화 교육 브리핑이<br />
              <strong style={{ color: "#5a5acc" }}>노션 데이터베이스</strong>에 저장됐어요 📝<br />
              <span style={{ fontSize: 12, color: "#aaaacc" }}>노션에서 바로 확인해보세요!</span>
            </p>
            <button onClick={() => { setStatus("idle"); setBriefing(""); }} style={S.btn}>
              📚 내일 브리핑 준비하기
            </button>
          </div>
        )}

        {status === "idle" && !briefing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 4 }}>
            {[
              { icon: "📖", bg: "#fff0fa", title: "상세 줄거리", desc: "시작-전개-절정-결말 5-7문장 서술" },
              { icon: "👥", bg: "#f0fff5", title: "등장인물 분석", desc: "주인공·조연 성격과 역할" },
              { icon: "💡", bg: "#fffaf0", title: "발달 영역별 가치", desc: "정서·사회성·인지 발달 분석" },
              { icon: "🎨", bg: "#f5f0ff", title: "연계 활동 3종", desc: "5단계 방법 + 확장 질문 3개" },
              { icon: "🇰🇷", bg: "#f0f8ff", title: "누리과정 5개 영역", desc: "의사소통·예술·신체·사회·자연탐구" },
              { icon: "💬", bg: "#fff5f8", title: "읽어주기 팁", desc: "목소리 연출·강조 장면·반응 유도법" },
            ].map((item, i) => (
              <div key={i} style={S.card}>
                <div style={{ ...S.iconCircle, background: item.bg }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#3a3a7a", marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
            <div style={S.hint}>📝 노션 데이터베이스에 자동 저장</div>
          </div>
        )}
      </div>

      <div style={{ background: "#fff", padding: "14px 18px", borderTop: "1px solid #e8e0ff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8b8f8" }}></div>
        <div style={{ fontSize: 11, color: "#aaaacc", fontWeight: 600 }}>접근 코드로 보호된 서비스</div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f8b8d8" }}></div>
      </div>
    </div>
  );
}
