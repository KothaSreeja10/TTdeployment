import { useState, useRef, useEffect } from 'react'
import { getUser } from '../utills/auth'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

const QUICK_PROMPTS = [
  { icon: '🎯', label: 'Improve my score',    text: 'How can I improve my placement readiness score? Give me a personalized action plan.' },
  { icon: '🎤', label: 'Interview tips',       text: 'Give me top 5 tips to ace a technical placement interview.' },
  { icon: '📚', label: 'Skills to learn',      text: 'What are the most in-demand skills for placements in 2025? Prioritize by impact.' },
  { icon: '📝', label: 'Resume advice',        text: 'How should a fresh graduate structure their resume for campus placements?' },
  { icon: '🏢', label: 'Company research',     text: 'How do I research a company before a placement interview?' },
  { icon: '💡', label: 'Aptitude tips',        text: 'Give me strategies to crack aptitude and reasoning tests in placement exams.' },
]

function buildSystemPrompt(user) {
  const base = `You are PlacePro AI, an expert placement and career coach embedded in a college placement portal called PlacementPro. 
You help students improve their job readiness, prepare for interviews, and bridge skill gaps.
Be concise, practical, and encouraging. Use bullet points and emojis for clarity. Keep responses under 250 words.`

  if (!user) return base
  return `${base}

The student you are helping:
- Name: ${user.fullName || user.name || 'Student'}
- Branch: ${user.branch || 'Not specified'}
- CGPA: ${user.cgpa || 'Not specified'}
- Readiness Score: ${user.readinessScore || 0}/100
- Readiness Level: ${user.readinessLevel || 'Not evaluated'}

Tailor your advice specifically to this student's profile when relevant.`
}

export default function AICoach() {
  const user = getUser()
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: `👋 Hi ${user?.fullName || user?.name || 'there'}! I'm **PlacePro AI**, your personal career coach.\n\nAsk me anything about placements, skills, interviews, or your readiness score! 🚀` }
  ])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [pulse,    setPulse]    = useState(false)
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  /* pulse the button every 8s to draw attention */
  useEffect(() => {
    const t = setInterval(() => { setPulse(true); setTimeout(() => setPulse(false), 1000) }, 8000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = async (text) => {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setLoading(true)

    try {
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] }))

      const body = {
        system_instruction: { parts: [{ text: buildSystemPrompt(user) }] },
        contents: [...history, { role: 'user', parts: [{ text: q }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
      }

      const res  = await fetch(GEMINI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ Sorry, I could not get a response. Please try again.'
      setMessages(m => [...m, { role: 'ai', text: reply }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Connection error. Please check your API key or internet.' }])
    } finally {
      setLoading(false)
    }
  }

  const formatText = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')

  return (
    <>
      {/* ── Floating Button ─────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="AI Career Coach"
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999,
          width: '58px', height: '58px', borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
          boxShadow: pulse
            ? '0 0 0 12px rgba(124,58,237,0.15), 0 8px 32px rgba(124,58,237,0.5)'
            : '0 0 0 0px rgba(124,58,237,0), 0 8px 24px rgba(124,58,237,0.4)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem',
          transition: 'box-shadow 0.4s ease, transform 0.2s ease',
          transform: open ? 'rotate(20deg) scale(1.05)' : 'scale(1)',
        }}
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* ── Chat Panel ──────────────────────────────────── */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '28px', zIndex: 9998,
          width: 'min(420px, calc(100vw - 32px))',
          height: 'min(580px, calc(100vh - 130px))',
          display: 'flex', flexDirection: 'column',
          background: 'rgba(15, 10, 30, 0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
          overflow: 'hidden',
          animation: 'slideUpIn 0.25s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 18px',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', flexShrink: 0,
              boxShadow: '0 0 16px rgba(124,58,237,0.5)'
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem', fontFamily: "'Syne', sans-serif" }}>PlacePro AI</div>
              <div style={{ fontSize: '0.72rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
                Online · Powered by Gemini
              </div>
            </div>
            <button
              onClick={() => setMessages([{ role: 'ai', text: `👋 Chat cleared! Ask me anything about your placement journey.` }])}
              style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', borderRadius: '8px', padding: '4px 10px', fontSize: '0.72rem', cursor: 'pointer' }}
            >Clear</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,#2563eb,#7c3aed)'
                    : 'rgba(255,255,255,0.06)',
                  border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: '#f1f5f9',
                  fontSize: '0.84rem',
                  lineHeight: '1.55',
                  boxShadow: m.role === 'user' ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
                }}
                  dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
                />
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', gap: '5px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(d => (
                    <span key={d} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#7c3aed', display: 'inline-block',
                      animation: `bounce 1.2s ease-in-out ${d * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p.label}
                  onClick={() => send(p.text)}
                  style={{
                    padding: '5px 10px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.35)',
                    background: 'rgba(124,58,237,0.1)', color: '#c4b5fd',
                    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.target.style.background = 'rgba(124,58,237,0.25)'; e.target.style.color = '#fff' }}
                  onMouseLeave={e => { e.target.style.background = 'rgba(124,58,237,0.1)'; e.target.style.color = '#c4b5fd' }}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0,
            background: 'rgba(255,255,255,0.02)',
          }}>
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask anything about placements…"
              style={{
                flex: 1, resize: 'none', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px',
                color: '#f1f5f9', padding: '10px 14px', fontFamily: 'inherit',
                fontSize: '0.84rem', outline: 'none', lineHeight: '1.5',
                maxHeight: '100px', overflowY: 'auto',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.25)'}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                width: '40px', height: '40px', borderRadius: '12px', border: 'none',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                  : 'rgba(255,255,255,0.07)',
                color: input.trim() && !loading ? '#fff' : '#64748b',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.2s',
                boxShadow: input.trim() && !loading ? '0 4px 14px rgba(124,58,237,0.35)' : 'none',
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes slideUpIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.4; }
          40%           { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
    </>
  )
}
