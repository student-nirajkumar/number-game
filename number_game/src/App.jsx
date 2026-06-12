import { useState, useEffect } from "react";

const MAX_ATTEMPTS = 7;
const MIN = 1;
const MAX = 100;

function getScore(attempts) {
  if (attempts <= 2) return 100;
  if (attempts <= 4) return 75;
  if (attempts <= 6) return 50;
  return 25;
}

function generateNumber() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

export default function NumberGame() {
  const [secret, setSecret] = useState(generateNumber());
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [history, setHistory] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const attemptsLeft = MAX_ATTEMPTS - attempts;

  function handleGuess() {
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < MIN || num > MAX) {
      setFeedback({ type: "error", msg: `Enter a number between ${MIN} and ${MAX}.` });
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const entry = { guess: num, attempt: newAttempts };

    if (num === secret) {
      const score = getScore(newAttempts);
      entry.result = "correct";
      setFeedback({ type: "success", msg: `🎉 Correct! The number was ${secret}. You earned ${score} points!` });
      setStatus("won");
      setTotalScore(s => s + score);
      setRounds(r => [...r, { result: "won", attempts: newAttempts, score }]);
    } else if (newAttempts >= MAX_ATTEMPTS) {
      entry.result = num > secret ? "high" : "low";
      setFeedback({ type: "danger", msg: `😞 Out of attempts! The number was ${secret}.` });
      setStatus("lost");
      setRounds(r => [...r, { result: "lost", attempts: newAttempts, score: 0 }]);
    } else if (num > secret) {
      entry.result = "high";
      setFeedback({ type: "warning", msg: `📉 Too high! ${MAX_ATTEMPTS - newAttempts} attempt(s) left.` });
    } else {
      entry.result = "low";
      setFeedback({ type: "info", msg: `📈 Too low! ${MAX_ATTEMPTS - newAttempts} attempt(s) left.` });
    }

    setHistory(h => [...h, entry]);
    setGuess("");
  }

  function playAgain() {
    setSecret(generateNumber());
    setGuess("");
    setAttempts(0);
    setFeedback(null);
    setStatus("playing");
    setHistory([]);
  }

  const feedbackColors = {
    error: "#ef4444",
    success: "#22c55e",
    danger: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎲</div>
          <h1 style={{ color: "#e0e7ff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Number Guesser</h1>
          <p style={{ color: "#a5b4fc", margin: "6px 0 0", fontSize: 14 }}>Guess the secret number between {MIN} and {MAX}</p>
        </div>

        {/* Score & Rounds */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Score", value: totalScore, icon: "⭐" },
            { label: "Rounds", value: rounds.length, icon: "🔄" },
            { label: "Wins", value: rounds.filter(r => r.result === "won").length, icon: "🏆" },
          ].map(stat => (
            <div key={stat.label} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(165,180,252,0.2)" }}>
              <div style={{ fontSize: 20 }}>{stat.icon}</div>
              <div style={{ color: "#e0e7ff", fontWeight: 700, fontSize: 20 }}>{stat.value}</div>
              <div style={{ color: "#818cf8", fontSize: 11 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Game Card */}
        <div style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", borderRadius: 20, padding: 28, border: "1px solid rgba(165,180,252,0.15)" }}>
          {/* Attempt bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#a5b4fc", fontSize: 13, marginBottom: 8 }}>
              <span>Attempts used: {attempts}/{MAX_ATTEMPTS}</span>
              <span style={{ color: attemptsLeft <= 2 ? "#f87171" : "#86efac" }}>{attemptsLeft} left</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${(attempts / MAX_ATTEMPTS) * 100}%`, background: attempts >= 5 ? "linear-gradient(90deg,#f87171,#ef4444)" : "linear-gradient(90deg,#818cf8,#6366f1)", transition: "width 0.3s ease" }} />
            </div>
          </div>

          {/* Input */}
          {status === "playing" && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                type="number"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGuess()}
                placeholder={`${MIN} – ${MAX}`}
                style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(165,180,252,0.3)", borderRadius: 10, padding: "12px 16px", color: "#e0e7ff", fontSize: 18, fontWeight: 700, outline: "none", textAlign: "center" }}
              />
              <button
                onClick={handleGuess}
                style={{ background: "linear-gradient(135deg,#818cf8,#6366f1)", border: "none", borderRadius: 10, padding: "12px 22px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
              >Guess</button>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div style={{ background: `${feedbackColors[feedback.type]}22`, border: `1px solid ${feedbackColors[feedback.type]}55`, borderRadius: 10, padding: "12px 16px", color: feedbackColors[feedback.type], fontSize: 14, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>
              {feedback.msg}
            </div>
          )}

          {/* Game over buttons */}
          {status !== "playing" && (
            <button onClick={playAgain} style={{ width: "100%", background: "linear-gradient(135deg,#22c55e,#16a34a)", border: "none", borderRadius: 10, padding: "14px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
              🎮 Play Again
            </button>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <div style={{ color: "#818cf8", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Guess History</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {history.map((h, i) => (
                  <span key={i} style={{
                    background: h.result === "correct" ? "#22c55e33" : h.result === "high" ? "#ef444433" : "#f59e0b33",
                    border: `1px solid ${h.result === "correct" ? "#22c55e" : h.result === "high" ? "#ef4444" : "#f59e0b"}55`,
                    borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 700,
                    color: h.result === "correct" ? "#86efac" : h.result === "high" ? "#fca5a5" : "#fcd34d"
                  }}>
                    {h.guess} {h.result === "correct" ? "✓" : h.result === "high" ? "↓" : "↑"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Round history */}
        {rounds.length > 0 && (
          <div style={{ marginTop: 20, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, border: "1px solid rgba(165,180,252,0.1)" }}>
            <div style={{ color: "#818cf8", fontSize: 12, fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Round History</div>
            {rounds.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < rounds.length - 1 ? "1px solid rgba(165,180,252,0.1)" : "none" }}>
                <span style={{ color: "#a5b4fc", fontSize: 13 }}>Round {i + 1}</span>
                <span style={{ color: r.result === "won" ? "#86efac" : "#fca5a5", fontSize: 13, fontWeight: 600 }}>{r.result === "won" ? "🏆 Won" : "💀 Lost"} in {r.attempts} attempts</span>
                <span style={{ color: "#fbbf24", fontSize: 13, fontWeight: 700 }}>+{r.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
