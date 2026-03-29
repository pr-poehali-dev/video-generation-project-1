import { useEffect, useRef, useState, useCallback } from "react";

const SCENES = [
  {
    id: 1,
    title: "СБОР У ПОРТАЛА",
    time: "0–7 сек",
    duration: 7,
    emoji: "🌀",
    color: "#7C3AED",
    glow: "#A78BFA",
    bgFrom: "#0a0010",
    bgTo: "#1a0030",
    description: "Четыре игрока в алмазной броне стоят у портала",
    overlay: null,
    lines: ["Том и Джерри переглядываются...", "Алекс и Марк готовятся к битве", "Портал мерцает фиолетовым", "Все прыгают — вспышка!"],
  },
  {
    id: 2,
    title: "БИТВА С ДРАКОНОМ",
    time: "7–20 сек",
    duration: 13,
    emoji: "🐉",
    color: "#DC2626",
    glow: "#F87171",
    bgFrom: "#100000",
    bgTo: "#250000",
    description: "Дракон кружит и атакует в Энде",
    overlay: null,
    lines: ["Дракон атакует!", "Все четверо стреляют из луков", "Slow-mo: последний удар Тома", "💥 ВЗРЫВ — дракон повержен!"],
  },
  {
    id: 3,
    title: "КРАЖА ЯЙЦА",
    time: "20–28 сек",
    duration: 8,
    emoji: "🥚",
    color: "#059669",
    glow: "#34D399",
    bgFrom: "#00100a",
    bgTo: "#001a10",
    description: "Том и Джерри хватают яйцо и бегут",
    overlay: null,
    lines: ["Яйцо появляется на пьедестале", "Том хватает яйцо!", "Фиолетовые частицы — побег", "Алекс и Марк в шоке..."],
  },
  {
    id: 4,
    title: "РАССЛЕДОВАНИЕ",
    time: "28–35 сек",
    duration: 7,
    emoji: "🔍",
    color: "#D97706",
    glow: "#FBBF24",
    bgFrom: "#0f0800",
    bgTo: "#1a0f00",
    description: "Алекс и Марк находят координаты",
    overlay: null,
    lines: ["Осмотр базы предателей", "Сундук с запиской найден!", "В чате: «Нас предали»", "Алекс берёт меч — вперёд!"],
  },
  {
    id: 5,
    title: "ПОГОНЯ!",
    time: "35–43 сек",
    duration: 8,
    emoji: "💨",
    color: "#2563EB",
    glow: "#60A5FA",
    bgFrom: "#00051a",
    bgTo: "#000a30",
    description: "Алекс и Марк мчатся по координатам",
    overlay: { text: "ПОГОНЯ!", color: "#60A5FA" },
    lines: ["Бег от первого лица!", "Лес... горы... пустошь...", "Бункер найден!", "Том и Джерри внутри..."],
  },
  {
    id: 6,
    title: "ФИНАЛЬНАЯ БИТВА",
    time: "43–53 сек",
    duration: 10,
    emoji: "⚔️",
    color: "#DC2626",
    glow: "#F87171",
    bgFrom: "#1a0000",
    bgTo: "#2d0000",
    description: "PvP: Джерри мёртв → Том мёртв → яйцо",
    overlay: { text: "ФИНАЛ", color: "#F87171" },
    lines: ["Они врываются на базу!", "Джерри повержен ✕", "Том повержен ✕", "🥚 Яйцо возвращено!"],
  },
  {
    id: 7,
    title: "ЭПИЛОГ",
    time: "53–57 сек",
    duration: 4,
    emoji: "🌅",
    color: "#7C3AED",
    glow: "#C4B5FD",
    bgFrom: "#0d0015",
    bgTo: "#1a002d",
    description: "Алекс и Марк возвращаются домой с яйцом",
    overlay: null,
    lines: ["Герои стоят над поверженными", "Том пишет в чат угрозы...", "Яйцо в руках Алекса", "Закат. Домой."],
  },
  {
    id: 8,
    title: "ТИТРЫ",
    time: "57–60 сек",
    duration: 3,
    emoji: "🎬",
    color: "#6B7280",
    glow: "#D1D5DB",
    bgFrom: "#000000",
    bgTo: "#0a0a0a",
    description: "Чёрный экран. Текст по центру.",
    overlay: null,
    lines: ["", "", "Снято игроком BlackYT", ""],
  },
];

const TOTAL_DURATION = 60;
const FPS = 30;
const W = 360;
const H = 640;

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  scene: typeof SCENES[0],
  localT: number,
  globalFrame: number
) {
  const w = W, h = H;
  const from = hexToRgb(scene.bgFrom);
  const to = hexToRgb(scene.bgTo);

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, `rgb(${from.r},${from.g},${from.b})`);
  grad.addColorStop(1, `rgb(${to.r},${to.g},${to.b})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Grid pattern
  ctx.strokeStyle = `${scene.color}18`;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Glow center
  const glowRad = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, w * 0.7);
  const gc = hexToRgb(scene.color);
  glowRad.addColorStop(0, `rgba(${gc.r},${gc.g},${gc.b},0.18)`);
  glowRad.addColorStop(1, `rgba(${gc.r},${gc.g},${gc.b},0)`);
  ctx.fillStyle = glowRad;
  ctx.fillRect(0, 0, w, h);

  // Emoji big
  const emojiScale = 1 + Math.sin(globalFrame * 0.08) * 0.04;
  ctx.save();
  ctx.translate(w / 2, h * 0.28);
  ctx.scale(emojiScale, emojiScale);
  ctx.font = "88px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(scene.emoji, 0, 0);
  ctx.restore();

  // Scene number badge
  ctx.save();
  ctx.fillStyle = scene.color + "cc";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 38, h * 0.13, 76, 26, 13);
  ctx.fill();
  ctx.font = "bold 12px 'Oswald', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`СЦЕНА ${scene.id}  ·  ${scene.time}`, w / 2, h * 0.13 + 13);
  ctx.restore();

  // Title
  const titleAlpha = Math.min(1, localT * 4);
  ctx.save();
  ctx.globalAlpha = titleAlpha;
  ctx.font = "bold 30px 'Oswald', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = scene.glow;
  ctx.shadowBlur = 18;
  ctx.fillText(scene.title, w / 2, h * 0.45);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Description
  ctx.save();
  ctx.globalAlpha = Math.min(1, Math.max(0, localT * 3 - 0.3));
  ctx.font = "15px 'Rubik', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Wrap description
  const words = scene.description.split(" ");
  let line = "";
  const lineHeight = 22;
  const maxW = w - 48;
  let lineY = h * 0.53;
  const linesArr: string[] = [];
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxW && line) {
      linesArr.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) linesArr.push(line);
  for (const l of linesArr) {
    ctx.fillText(l, w / 2, lineY);
    lineY += lineHeight;
  }
  ctx.restore();

  // Notes/lines — appear one by one
  const lineCount = scene.lines.filter(Boolean).length;
  const lineStartT = 0.25;
  ctx.save();
  let noteY = h * 0.65;
  for (let i = 0; i < scene.lines.length; i++) {
    if (!scene.lines[i]) continue;
    const threshold = lineStartT + i * (0.18 / lineCount);
    const alpha = Math.min(1, Math.max(0, (localT - threshold) * 8));
    if (alpha <= 0) continue;
    ctx.globalAlpha = alpha;
    const offsetX = lerp(16, 0, Math.min(1, (localT - threshold) * 8));
    ctx.font = "13px 'Rubik', sans-serif";
    ctx.fillStyle = scene.glow;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`▸  ${scene.lines[i]}`, 24 + offsetX, noteY);
    noteY += 24;
  }
  ctx.restore();

  // Overlay — ПОГОНЯ! / ФИНАЛ
  if (scene.overlay) {
    const pulse = 1 + Math.sin(globalFrame * 0.25) * 0.06;
    ctx.save();
    ctx.translate(w / 2, h * 0.78);
    ctx.scale(pulse, pulse);
    const ov = scene.overlay;
    const ovRgb = hexToRgb(ov.color);
    ctx.shadowColor = ov.color;
    ctx.shadowBlur = 30;
    ctx.font = "bold 58px 'Oswald', sans-serif";
    ctx.fillStyle = ov.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Skew
    ctx.transform(1, 0, -0.1, 1, 0, 0);
    ctx.fillText(ov.text, 0, 0);
    // Stroke
    ctx.strokeStyle = `rgba(${ovRgb.r},${ovRgb.g},${ovRgb.b},0.4)`;
    ctx.lineWidth = 2;
    ctx.strokeText(ov.text, 0, 0);
    ctx.shadowBlur = 0;
    // Glitch offset
    if (Math.sin(globalFrame * 1.5) > 0.7) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(ov.text, 3, -2);
    }
    ctx.restore();
  }

  // Scene 8 special: credits
  if (scene.id === 8) {
    ctx.save();
    const fadeIn = Math.min(1, localT * 2);
    ctx.globalAlpha = fadeIn;
    ctx.fillStyle = "#000000cc";
    ctx.fillRect(0, 0, w, h);
    ctx.font = "bold 22px 'Oswald', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Снято игроком", w / 2, h / 2 - 20);
    ctx.font = "bold 36px 'Oswald', sans-serif";
    ctx.fillStyle = scene.glow;
    ctx.shadowColor = scene.glow;
    ctx.shadowBlur = 20;
    ctx.fillText("BlackYT", w / 2, h / 2 + 20);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // Bottom gradient bar (timeline progress)
  const barH = 4;
  ctx.fillStyle = `${scene.color}44`;
  ctx.fillRect(0, h - barH, w, barH);
  ctx.fillStyle = scene.glow;
  ctx.fillRect(0, h - barH, w * localT, barH);

  // Scanline overlay
  const scanY = ((globalFrame * 3) % (h + 60)) - 60;
  const scanGrad = ctx.createLinearGradient(0, scanY, 0, scanY + 60);
  scanGrad.addColorStop(0, "rgba(255,255,255,0)");
  scanGrad.addColorStop(0.5, "rgba(255,255,255,0.04)");
  scanGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY, w, 60);

  // Flash on scene change (localT near 0)
  if (localT < 0.08 && scene.id !== 8) {
    ctx.fillStyle = `rgba(255,255,255,${(0.08 - localT) * 8})`;
    ctx.fillRect(0, 0, w, h);
  }
}

export default function VideoPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const getSceneAt = useCallback((elapsed: number) => {
    let acc = 0;
    for (const s of SCENES) {
      if (elapsed < acc + s.duration) {
        return { scene: s, localT: (elapsed - acc) / s.duration };
      }
      acc += s.duration;
    }
    return { scene: SCENES[SCENES.length - 1], localT: 1 };
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = (timestamp - startTimeRef.current) / 1000;

    if (elapsed >= TOTAL_DURATION) {
      setIsPlaying(false);
      setProgress(1);
      startTimeRef.current = null;
      return;
    }

    const { scene, localT } = getSceneAt(elapsed);
    const globalFrame = Math.floor(elapsed * FPS);

    setProgress(elapsed / TOTAL_DURATION);
    setCurrentSceneId(scene.id);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawScene(ctx, scene, localT, globalFrame);

    rafRef.current = requestAnimationFrame(animate);
  }, [getSceneAt]);

  const play = useCallback(() => {
    startTimeRef.current = null;
    setIsPlaying(true);
    setProgress(0);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    startTimeRef.current = null;
    setProgress(0);

    // Draw first frame
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawScene(ctx, SCENES[0], 0, 0);
  }, []);

  const downloadVideo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecording(true);
    recordedChunksRef.current = [];

    const stream = canvas.captureStream(FPS);
    const mr = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
      videoBitsPerSecond: 2_500_000,
    });
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    mr.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "BlackYT_storyboard_preview.webm";
      a.click();
      URL.revokeObjectURL(url);
      setIsRecording(false);
    };

    mr.start(100);

    // Animate and record
    startTimeRef.current = null;
    setIsPlaying(true);
    setProgress(0);

    let recStart: number | null = null;
    const recAnimate = (timestamp: number) => {
      if (!recStart) recStart = timestamp;
      const elapsed = (timestamp - recStart) / 1000;

      if (elapsed >= TOTAL_DURATION) {
        mr.stop();
        setIsPlaying(false);
        startTimeRef.current = null;
        setProgress(1);
        return;
      }

      const { scene, localT } = getSceneAt(elapsed);
      const globalFrame = Math.floor(elapsed * FPS);
      setProgress(elapsed / TOTAL_DURATION);
      setCurrentSceneId(scene.id);
      const ctx = canvas.getContext("2d");
      if (ctx) drawScene(ctx, scene, localT, globalFrame);
      rafRef.current = requestAnimationFrame(recAnimate);
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(recAnimate);
  }, [getSceneAt]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawScene(ctx, SCENES[0], 0, 0);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const currentScene = SCENES.find((s) => s.id === currentSceneId)!;

  return (
    <div className="mt-10 mb-4">
      <div className="font-oswald text-xs tracking-[0.35em] text-white/30 uppercase mb-4 text-center">
        Анимированное превью
      </div>

      {/* Phone frame */}
      <div className="flex justify-center">
        <div
          className="relative rounded-[36px] p-[6px] shadow-2xl"
          style={{
            background: "linear-gradient(145deg, #222, #111)",
            boxShadow: `0 0 60px ${currentScene.color}44, 0 30px 80px #000a`,
          }}
        >
          {/* Notch */}
          <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-16 h-[10px] bg-[#111] rounded-full z-20" />

          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="rounded-[30px] block"
            style={{ width: "100%", maxWidth: "260px", height: "auto" }}
          />

          {/* Bottom home indicator */}
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-20 h-[4px] bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 mx-auto max-w-[260px]">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${progress * 100}%`,
              background: currentScene.glow,
              boxShadow: `0 0 8px ${currentScene.glow}`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-rubik text-xs text-white/30">
            {Math.floor(progress * TOTAL_DURATION)}с
          </span>
          <span
            className="font-oswald text-xs font-bold tracking-wider"
            style={{ color: currentScene.glow }}
          >
            {currentScene.title}
          </span>
          <span className="font-rubik text-xs text-white/30">60с</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center mt-4">
        {!isPlaying ? (
          <button
            onClick={play}
            disabled={isRecording}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-oswald font-bold text-sm tracking-widest text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            style={{ background: currentScene.glow }}
          >
            ▶ СМОТРЕТЬ
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-oswald font-bold text-sm tracking-widest text-white border-2 transition-all hover:scale-105 active:scale-95"
            style={{ borderColor: currentScene.glow, color: currentScene.glow }}
          >
            ■ СТОП
          </button>
        )}

        <button
          onClick={downloadVideo}
          disabled={isRecording || isPlaying}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-oswald font-bold text-sm tracking-widest border-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
        >
          {isRecording ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              ЗАПИСЬ...
            </>
          ) : (
            <>⬇ СКАЧАТЬ</>
          )}
        </button>
      </div>

      {isRecording && (
        <p className="text-center font-rubik text-xs text-white/30 mt-2">
          Идёт запись видео — не закрывай вкладку...
        </p>
      )}
    </div>
  );
}
