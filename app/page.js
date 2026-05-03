"use client";
import { useState } from "react";

export default function Home() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");

  const [status, setStatus] = useState("idle");
  const [briefing, setBriefing] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleCodeSubmit() {
    if (codeInput.trim().toUpperCase() === (process.env.NEXT_PUBLIC_ACCESS_CODE || "FAIRY2026")) {
      setIsAuthed(true);
      setCodeError("");
    } else {
      setCodeError("접근 코드가 올바르지 않아요. 다시 확인해주세요.");
      setCodeInput("");
    }
  }

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

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

  async function sendEmail() {
    if (!recipientEmail) { setErrorMsg("이메일 주소를 입력해주세요."); return; }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipientEmail, briefing, date: today }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStatus("done");
    } catch (e) {
      setErrorMsg("이메일 전송 중 오류가 발생했어요.");
      setStatus("error");
    }
  }

  // 🔒 접근 코드 화면
  if (!isAuthed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f0ea", fontFamily: "Georgia, serif",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      }}>
        <div style={{
          width: "100%", maxWidth: 400, background: "#fff", borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.1)", overflow: "hidden", border: "1px solid #dcecd4",
        }}>
          <div style={{ background: "linear-gradient(160deg,#1a3a2a,#2d5a3a)", padding: "32px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🌿</div>
            <h1 style={{ margin: 0, color: "#e8f5e0", fontSize: 22, fontWeight: 700 }}>세계 동화 교육 브리핑</h1>
            <p style={{ margin: "8px 0 0", color: "#8fbc8f", fontSize: 13 }}>교육자 전용 서비스</p>
          </div>
          <div style={{ padding: "28px 24px" }}>
            <div style={{ background: "#f0f8ec", borderRadius: 12, padding: "14px 16px", marginBottom: 22, border: "1px solid #c8e0b8", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>🔒</span>
              <div style={{ fontSize: 13, color: "#2d5a1a", lineHeight: 1.6 }}>
                허용된 사용자만 접근 가능합니다.<br />관리자에게 받은 접근 코드를 입력해주세요.
              </div>
            </div>
            <input
              type="text" placeholder="접근 코드 입력"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
              style={{
                width: "100%", padding: "14px 15px",
                border: `1.5px solid ${codeError ? "#ffaaaa" : "#c8dcc0"}`,
                borderRadius: 10, fontSize: 16, fontFamily: "inherit",
                color: "#2a3a2a", background: "#f8fdf6", boxSizing: "border-box",
                outline: "none", marginBottom: 10,
                textAlign: "center", letterSpacing: "3px", fontWeight: 700,
              }}
            />
            {codeError && (
              <div style={{ marginBottom: 12, padding: "10px 14px", background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 8, color: "#c0392b", fontSize: 13, textAlign: "center" }}>
                ⚠️ {codeError}
              </div>
            )}
            <button onClick={handleCodeSubmit} style={{
              width: "100%", padding: "15px",
              background: "linear-gradient(135deg,#2d6a3a,#1e5028)",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 16, fontWeight: 700, fontFamily: "inherit",
              cursor: "pointer", boxShadow: "0 4px 14px rgba(30,80,40,0.3)",
            }}>
              🌿 입장하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0ea", fontFamily: "Georgia, serif" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(160deg, #1a3a2a 0%, #2d5a3a 60%, #1e4a30 100%)",
        padding: "36px 24px 28px", textAlign: "center",
      }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>🌿</div>
        <h1 style={{ margin: 0, color: "#e8f5e0", fontSize: "clamp(20px,5vw,28px)", fontWeight: 700 }}>
          세계 동화 교육 브리핑
        </h1>
        <p style={{ margin: "8px 0 0", color: "#8fbc8f", fontSize: 13 }}>{today}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {["📖 상세 줄거리", "👥 등장인물", "💡 발달 가치", "🎨 연계활동 3종", "🇰🇷 누리과정 연계"].map((tag, i) => (
            <span key={i} style={{
              background: "rgba(255,255,255,0.1)", color: "#c8e6c0",
              padding: "4px 10px", borderRadius: 20, fontSize: 11,
              border: "1px solid rgba(255,255,255,0.15)",
            }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 16px 48px" }}>
        {/* Educator badge */}
        <div style={{
          background: "linear-gradient(135deg,#e8f5e0,#d4edcc)",
          borderRadius: 12, padding: "14px 16px", marginBottom: 20,
          border: "1px solid #b8dca8", display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 22 }}>👩‍🏫</span>
          <div style={{ fontSize: 13, color: "#2d5a1a", lineHeight: 1.7 }}>
            <strong>교육자 & 부모 전용 심층 브리핑</strong><br />
            누리과정 5개 영역 연계 · 단계별 활동 · 확장 질문 · 읽어주기 팁 포함<br />
            <span style={{ color: "#5a8a4a", fontSize: 12 }}>현장에서 내일 바로 활용 가능</span>
          </div>
        </div>

        {/* Generate button */}
        {status !== "done" && (
          <button onClick={generateBriefing}
            disabled={status === "generating" || status === "sending"}
            style={{
              width: "100%", padding: "18px",
              background: status === "generating" ? "#5a7a5a" : "linear-gradient(135deg,#2d6a3a,#1e5028)",
              color: "#fff", border: "none", borderRadius: 14,
              fontSize: 17, fontWeight: 700, fontFamily: "inherit",
              cursor: status === "generating" ? "not-allowed" : "pointer",
              boxShadow: "0 4px 18px rgba(30,80,40,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
            {status === "generating" ? "🌿 브리핑 생성 중... (약 40-60초)" : "📚 오늘의 교육 브리핑 생성하기"}
          </button>
        )}

        {status === "generating" && (
          <div style={{ marginTop: 14, padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #d4e8c8", textAlign: "center", fontSize: 13, color: "#5a7a5a", lineHeight: 1.9 }}>
            🌍 세계 각국 동화 7-10편 수집 중<br />
            🎨 누리과정 연계 활동 설계 중<br />
            💬 확장 질문 & 읽어주기 팁 작성 중
          </div>
        )}

        {errorMsg && (
          <div style={{ marginTop: 14, padding: "13px 15px", background: "#fff5f5", border: "1px solid #ffcccc", borderRadius: 10, color: "#c0392b", fontSize: 14 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Preview */}
        {briefing && status !== "done" && (
          <div style={{ marginTop: 22 }}>
            <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px rgba(0,0,0,0.08)", overflow: "hidden", border: "1px solid #dcecd4" }}>
              <div style={{ background: "linear-gradient(135deg,#e8f5e0,#d8edcc)", padding: "14px 18px", borderBottom: "1px solid #c8e0b8", display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, color: "#2d5a1a", fontWeight: 700 }}>브리핑 미리보기</div>
                  <div style={{ fontSize: 11, color: "#5a8a4a" }}>동화 7-10편 · 연계활동 3종 · 누리과정 연계 포함</div>
                </div>
              </div>
              <div style={{ padding: 20, maxHeight: 500, overflowY: "auto", fontSize: 13, lineHeight: 1.95, color: "#2a3a2a", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {briefing}
              </div>
            </div>

            {/* Email section */}
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 2px 18px rgba(0,0,0,0.07)", border: "1px solid #dcecd4" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                ✉️ Gmail로 전송하기
              </div>
              <input type="email" placeholder="받으실 이메일 주소"
                value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)}
                style={{ width: "100%", padding: "13px 14px", border: "1.5px solid #c8dcc0", borderRadius: 10, fontSize: 15, fontFamily: "inherit", color: "#2a3a2a", background: "#f8fdf6", boxSizing: "border-box", outline: "none", marginBottom: 10 }} />
              <button onClick={sendEmail} disabled={status === "sending"}
                style={{ width: "100%", padding: 14, background: status === "sending" ? "#7aaa7a" : "linear-gradient(135deg,#2d6a3a,#1e5028)", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 3px 12px rgba(30,80,40,0.3)" }}>
                {status === "sending" ? "📨 전송 중..." : "📨 메일로 보내기"}
              </button>
            </div>

            <button onClick={generateBriefing}
              style={{ width: "100%", marginTop: 10, padding: 13, background: "transparent", color: "#5a8a5a", border: "1.5px solid #b0ccb0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", cursor: "pointer", fontWeight: 600 }}>
              🔄 다시 생성하기
            </button>
          </div>
        )}

        {/* Success */}
        {status === "done" && (
          <div style={{ textAlign: "center", padding: "50px 20px", background: "#fff", borderRadius: 20, boxShadow: "0 4px 30px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: 56, marginBottom: 14 }}>🌿</div>
            <h2 style={{ margin: "0 0 10px", color: "#1a3a1a", fontSize: 22 }}>전송 완료!</h2>
            <p style={{ color: "#5a8a5a", fontSize: 14, margin: "0 0 24px", lineHeight: 1.7 }}>
              오늘의 세계 동화 교육 브리핑이<br />
              <strong style={{ color: "#2d6a3a" }}>{recipientEmail}</strong>로 전송됐어요 📬
            </p>
            <button onClick={() => { setStatus("idle"); setBriefing(""); }}
              style={{ padding: "14px 28px", background: "linear-gradient(135deg,#2d6a3a,#1e5028)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
              📚 내일 브리핑 준비하기
            </button>
          </div>
        )}

        {/* Info */}
        {status === "idle" && !briefing && (
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "📖", title: "상세 줄거리", desc: "시작-전개-절정-결말 5-7문장 / 갈등과 해결 과정 상세 서술" },
              { icon: "👥", title: "등장인물 분석", desc: "주인공·조연의 성격, 특징, 이야기 속 역할" },
              { icon: "💡", title: "발달 영역별 가치", desc: "정서 발달 / 사회성 발달 / 인지 발달 분석" },
              { icon: "🎨", title: "연계 활동 3종 (단계별 상세)", desc: "이야기 심화 → 창의·표현 → 신체·놀이 / 각 5단계 + 확장 질문 3개" },
              { icon: "🇰🇷", title: "누리과정 5개 영역 연계", desc: "의사소통·예술경험·신체운동·사회관계·자연탐구" },
              { icon: "💬", title: "읽어주기 팁 & 교사 유의사항", desc: "목소리 연출, 강조 장면, 아이 반응 유도법" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #dcecd4", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a3a1a", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#6a8a6a", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
