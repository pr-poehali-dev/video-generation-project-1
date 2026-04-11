import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HEARTS = ["❤️", "🩷", "💜", "🤍", "💖", "💗", "💓", "💝"];

function FloatingHeart({ emoji, style }: { emoji: string; style: React.CSSProperties }) {
  return (
    <span
      className="fixed pointer-events-none select-none animate-bounce"
      style={{ fontSize: "1.5rem", opacity: 0.7, ...style }}
    >
      {emoji}
    </span>
  );
}

export default function FromKatya() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answered, setAnswered] = useState<null | "yes" | "no">(null);
  const [noCount, setNoCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; emoji: string; left: string; top: string; delay: string }[]>([]);

  useEffect(() => {
    const hearts = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      emoji: HEARTS[i % HEARTS.length],
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 5}%`,
      delay: `${(Math.random() * 2).toFixed(1)}s`,
    }));
    setFloatingHearts(hearts);
  }, []);

  useEffect(() => {
    if (step < 3) {
      const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 400 : 900);
      return () => clearTimeout(t);
    }
  }, [step]);

  const noLabels = [
    "Нет",
    "Ну подумай ещё...",
    "Точно нет?",
    "Ну пожалуйста 🥺",
    "Катя расстроится...",
    "Последний шанс!",
    "Окей, буду плакать 😭",
  ];

  const noLabel = noLabels[Math.min(noCount, noLabels.length - 1)];
  const noScale = Math.max(0.4, 1 - noCount * 0.12);
  const yesScale = Math.min(2.2, 1 + noCount * 0.18);

  return (
    <div className="min-h-screen bg-[#0d0010] flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: "url(https://cdn.poehali.dev/projects/b49cde66-31cd-4267-b05f-21edc7374e14/files/d73026a5-0e08-449a-bfe5-87da7d2ade30.jpg)" }}
      />

      {/* Floating hearts */}
      {floatingHearts.map((h) => (
        <FloatingHeart
          key={h.id}
          emoji={h.emoji}
          style={{ left: h.left, top: h.top, animationDelay: h.delay, animationDuration: `${2 + Math.random() * 2}s` }}
        />
      ))}

      {/* Gradient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, #7C3AED22 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-sm w-full text-center">
        {/* From Katya label */}
        <div
          className={`transition-all duration-700 ${step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 mb-5">
            <span className="font-oswald text-xs tracking-[0.4em] text-pink-300 uppercase">От Кати ❤️</span>
          </div>
        </div>

        {/* Main message */}
        <div
          className={`transition-all duration-700 delay-300 ${step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="text-7xl mb-5 drop-shadow-[0_0_32px_#ec4899]">❤️</div>
          <h1 className="font-oswald font-black text-white text-3xl tracking-wider leading-tight mb-3"
            style={{ textShadow: "0 0 30px #ec489966" }}>
            Мой любимый
          </h1>
          <p className="font-rubik text-white/70 text-base leading-relaxed mb-2">
            Тебе понравилось моё произведение?
          </p>
          <p className="font-rubik text-white/40 text-sm italic mb-8">
            Я старалась ❤️
          </p>
        </div>

        {/* Buttons */}
        {!answered && (
          <div
            className={`transition-all duration-700 delay-500 ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={() => setAnswered("yes")}
                className="font-oswald font-bold text-white px-8 py-3 rounded-2xl shadow-lg transition-all duration-200 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  fontSize: `${yesScale}rem`,
                  boxShadow: `0 0 ${20 + noCount * 8}px #ec489988`,
                  transform: `scale(${yesScale > 1.5 ? 1 : 1})`,
                }}
              >
                Да! 💖
              </button>

              <button
                onClick={() => setNoCount((c) => c + 1)}
                className="font-oswald font-bold text-white/50 px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 transition-all duration-200 hover:bg-white/10"
                style={{ transform: `scale(${noScale})`, fontSize: "0.95rem" }}
              >
                {noLabel}
              </button>
            </div>

            {noCount > 0 && (
              <p className="font-rubik text-white/30 text-xs mt-4 italic animate-pulse">
                {noCount >= 4 ? "кнопка \"Нет\" сломалась от слёз 😭" : "кнопка уменьшается..."}
              </p>
            )}
          </div>
        )}

        {/* Yes answer */}
        {answered === "yes" && (
          <div className="animate-bounce-in">
            <div className="text-6xl mb-4">🥰</div>
            <h2 className="font-oswald font-black text-white text-2xl tracking-wider mb-3"
              style={{ textShadow: "0 0 30px #ec489999" }}>
              Я так и знала! ❤️
            </h2>
            <p className="font-rubik text-white/60 text-sm leading-relaxed mb-6">
              Ты лучший, правда ❤️
            </p>
            <button
              onClick={() => navigate("/")}
              className="font-oswald text-sm tracking-widest px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/80 transition-all"
            >
              ← Вернуться к сториборду
            </button>
          </div>
        )}

        {/* Back button */}
        {!answered && step >= 3 && (
          <button
            onClick={() => navigate("/")}
            className="mt-8 font-rubik text-xs text-white/20 hover:text-white/40 transition-colors underline underline-offset-4"
          >
            ← назад к сториборду
          </button>
        )}
      </div>
    </div>
  );
}
