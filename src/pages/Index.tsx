import { useState, useEffect, useRef } from "react";
import VideoPreview from "@/components/VideoPreview";

const SCENES = [
  {
    id: 1,
    title: "СБОР У ПОРТАЛА",
    time: "0–7 сек",
    duration: 7,
    emoji: "🌀",
    color: "#7C3AED",
    glow: "#A78BFA",
    bg: "from-[#0a0010] to-[#1a0030]",
    description:
      "Четыре игрока в алмазной броне стоят у портала в Энд. Том и Джерри переглядываются — шепчутся о плане. Алекс и Марк спокойно готовятся к битве.",
    vibe: "Тревожный саундтрек, низкие басы",
    notes: [
      "Крупный план: блеск алмазной брони",
      "Тихие переглядывания Тома и Джерри",
      "Портал мерцает фиолетовым",
      "Все прыгают — вспышка!",
    ],
    overlay: null,
    camera: "Средний план → крупный → вспышка прыжка",
  },
  {
    id: 2,
    title: "БИТВА С ДРАКОНОМ",
    time: "7–20 сек",
    duration: 13,
    emoji: "🐉",
    color: "#DC2626",
    glow: "#F87171",
    bg: "from-[#100000] to-[#200000]",
    description:
      "Энд. Дракон кружит и атакует. Четверо стреляют из луков. Том наносит финальный удар — дракон взрывается!",
    vibe: "Эпичный оркестр, нарастающий ритм",
    notes: [
      "Широкий план — драkon в небе",
      "Быстрые cuts: луки, мечи, дракон",
      "Slow-mo: последний удар Тома",
      "ВЗРЫВ — полный экран",
    ],
    overlay: null,
    camera: "Динамичные cuts + slow-mo финального удара",
  },
  {
    id: 3,
    title: "КРАЖА ЯЙЦА",
    time: "20–28 сек",
    duration: 8,
    emoji: "🥚",
    color: "#059669",
    glow: "#34D399",
    bg: "from-[#00100a] to-[#001a10]",
    description:
      "Яйцо появляется на пьедестале. Том и Джерри хватают его и исчезают в фиолетовых частицах портала. Алекс и Марк оборачиваются — пусто.",
    vibe: "Резкий обрыв музыки → тишина → тревожный звук",
    notes: [
      "Крупный план: яйцо на пьедестале",
      "Быстрые руки Тома хватают яйцо",
      "Фиолетовые частицы — побег",
      "Лицо Алекса: шок",
    ],
    overlay: null,
    camera: "Крупные планы → реакция Алекса и Марка",
  },
  {
    id: 4,
    title: "РАССЛЕДОВАНИЕ",
    time: "28–35 сек",
    duration: 7,
    emoji: "🔍",
    color: "#D97706",
    glow: "#FBBF24",
    bg: "from-[#0f0800] to-[#1a0f00]",
    description:
      "База предателей. Алекс и Марк находят сундук с запиской и координатами. Понимают — их предали. Алекс кричит в микрофон.",
    vibe: "Детективный мотив, напряжение растёт",
    notes: [
      "Осмотр базы — крупно: следы пороха",
      "Открытый сундук, записка с координатами",
      "Текст в чате: «Нас предали»",
      "Алекс берёт меч — решение принято",
    ],
    overlay: null,
    camera: "Медленный осмотр → резкий поворот к камере",
  },
  {
    id: 5,
    title: "ПОГОНЯ!",
    time: "35–43 сек",
    duration: 8,
    emoji: "💨",
    color: "#2563EB",
    glow: "#60A5FA",
    bg: "from-[#00051a] to-[#000a30]",
    description:
      "Алекс и Марк мчатся по координатам. Пейзажи мелькают. Находят скрытый бункер — Том и Джерри внутри.",
    vibe: "ДРОП МУЗЫКИ — быстрый бит, адреналин",
    notes: [
      "Бег от первого лица — скорость!",
      "Титр: ПОГОНЯ! (взрывной эффект)",
      "Смена пейзажей — лес, горы, пустошь",
      "Бункер найден — стоп-кадр",
    ],
    overlay: { text: "ПОГОНЯ!", type: "chase" },
    camera: "POV бег → zoom in на бункер",
  },
  {
    id: 6,
    title: "ФИНАЛЬНАЯ БИТВА",
    time: "43–53 сек",
    duration: 10,
    emoji: "⚔️",
    color: "#DC2626",
    glow: "#F87171",
    bg: "from-[#1a0000] to-[#2d0000]",
    description:
      "Алекс и Марк врываются. PvP бой: сначала падает Джерри, потом Том. Яйцо дракона выпадает. Алекс подбирает.",
    vibe: "Пик музыки — бас-удары в такт боям",
    notes: [
      "Взрыв двери — они врываются!",
      "Титр: ФИНАЛ (красный флэш)",
      "Бой: cuts в ритм музыки",
      "Джерри мёртв → Том мёртв → яйцо",
    ],
    overlay: { text: "ФИНАЛ", type: "final" },
    camera: "Cuts в ритм бит-дропа",
  },
  {
    id: 7,
    title: "ЭПИЛОГ",
    time: "53–57 сек",
    duration: 4,
    emoji: "🌅",
    color: "#7C3AED",
    glow: "#C4B5FD",
    bg: "from-[#0d0015] to-[#1a002d]",
    description:
      "Алекс и Марк стоят над местом смерти предателей. Сообщения мести в чате. Камера отдаляется — закат, герои идут домой с яйцом.",
    vibe: "Музыка стихает → торжественные аккорды",
    notes: [
      "Широкий план на фоне заката",
      "Текст чата: злые сообщения от Тома",
      "Яйцо в руках Алекса — крупно",
      "Камера уходит вдаль",
    ],
    overlay: null,
    camera: "Медленный zoom out → закат",
  },
  {
    id: 8,
    title: "ТИТРЫ",
    time: "57–60 сек",
    duration: 3,
    emoji: "🎬",
    color: "#6B7280",
    glow: "#D1D5DB",
    bg: "from-[#000000] to-[#0a0a0a]",
    description:
      "Чёрный экран. Белый текст по центру: «Снято игроком BlackYT». Звук шагов по песку. Тишина.",
    vibe: "Тишина → звук шагов по песку → fade out",
    notes: [
      "Fade to black",
      "Текст появляется по буквам",
      '"Снято игроком BlackYT"',
      "Звук шагов → тишина",
    ],
    overlay: null,
    camera: "Статика — черный экран",
  },
];

const TOTAL_DURATION = 60;

function OverlayBadge({ overlay }: { overlay: { text: string; type: string } }) {
  const isChase = overlay.type === "chase";
  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center pointer-events-none
        ${isChase ? "bg-blue-900/30" : "bg-red-900/30"}
      `}
    >
      <div
        className={`
          font-oswald font-black text-4xl tracking-widest px-6 py-2
          border-4 skew-x-[-6deg]
          ${isChase
            ? "text-[#60A5FA] border-[#60A5FA] shadow-[0_0_30px_#60A5FA]"
            : "text-[#F87171] border-[#F87171] shadow-[0_0_30px_#F87171]"
          }
          animate-beat
        `}
      >
        {overlay.text}
        {isChase && (
          <span className="ml-2 inline-block animate-pulse">!</span>
        )}
      </div>
    </div>
  );
}

function Particle({ color, index }: { color: string; index: number }) {
  const style = {
    left: `${20 + index * 15}%`,
    top: `${40 + (index % 3) * 15}%`,
    animationDelay: `${index * 0.2}s`,
    backgroundColor: color,
  };
  return (
    <div
      className="absolute w-2 h-2 rounded-full animate-particle-float opacity-0"
      style={style}
    />
  );
}

function SceneCard({
  scene,
  isActive,
  onClick,
}: {
  scene: typeof SCENES[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300
        border-2 select-none
        ${isActive
          ? "border-white scale-[1.02] shadow-2xl"
          : "border-white/10 hover:border-white/30 hover:scale-[1.01]"
        }
      `}
      style={{
        boxShadow: isActive ? `0 0 30px ${scene.glow}55` : undefined,
      }}
    >
      <div className={`bg-gradient-to-br ${scene.bg} p-4 relative min-h-[110px]`}>
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${scene.color} 0px, transparent 1px, transparent 20px)`,
          }}
        />

        {scene.overlay && <OverlayBadge overlay={scene.overlay} />}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{scene.emoji}</span>
              <span
                className="font-oswald font-bold text-sm tracking-widest uppercase"
                style={{ color: scene.glow }}
              >
                Сцена {scene.id}
              </span>
            </div>
            <span className="font-rubik text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
              {scene.time}
            </span>
          </div>

          <h3 className="font-oswald font-black text-white text-xl tracking-wider mb-1">
            {scene.title}
          </h3>
          <p className="font-rubik text-white/50 text-xs italic">{scene.vibe}</p>
        </div>

        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: scene.glow }} />
        )}
      </div>
    </div>
  );
}

function DetailPanel({ scene }: { scene: typeof SCENES[0] }) {
  const [visible, setVisible] = useState(false);
  const prevId = useRef(scene.id);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    prevId.current = scene.id;
    return () => clearTimeout(t);
  }, [scene.id]);

  return (
    <div
      className={`
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      <div
        className={`rounded-2xl overflow-hidden border-2 bg-gradient-to-br ${scene.bg}`}
        style={{ borderColor: `${scene.glow}66` }}
      >
        <div className="relative p-5" style={{ background: `${scene.color}15` }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{scene.emoji}</span>
            <div>
              <div
                className="font-oswald text-xs tracking-[0.3em] uppercase mb-0.5"
                style={{ color: scene.glow }}
              >
                Сцена {scene.id} · {scene.time} · {scene.duration} сек
              </div>
              <h2 className="font-oswald font-black text-white text-2xl tracking-wider">
                {scene.title}
              </h2>
            </div>
          </div>

          {scene.overlay && (
            <div
              className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg border"
              style={{
                borderColor: `${scene.glow}44`,
                background: `${scene.color}22`,
              }}
            >
              <span className="text-lg">🎯</span>
              <div>
                <div
                  className="font-oswald font-bold text-sm tracking-widest"
                  style={{ color: scene.glow }}
                >
                  ЭКРАННЫЙ ОВЕРЛЕЙ
                </div>
                <div
                  className="font-oswald font-black text-2xl tracking-widest"
                  style={{ color: scene.glow, textShadow: `0 0 20px ${scene.glow}` }}
                >
                  {scene.overlay.text}
                  {scene.overlay.type === "chase" ? "!" : ""}
                </div>
              </div>
            </div>
          )}

          <p className="font-rubik text-white/75 text-sm leading-relaxed mb-4">
            {scene.description}
          </p>

          <div className="mb-4">
            <div
              className="font-oswald text-xs tracking-[0.25em] uppercase mb-2"
              style={{ color: scene.glow }}
            >
              📷 КАМЕРА
            </div>
            <p className="font-rubik text-white/60 text-sm italic">{scene.camera}</p>
          </div>

          <div>
            <div
              className="font-oswald text-xs tracking-[0.25em] uppercase mb-3"
              style={{ color: scene.glow }}
            >
              🎬 КЛЮЧЕВЫЕ КАДРЫ
            </div>
            <div className="space-y-2">
              {scene.notes.map((note, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold font-oswald mt-0.5"
                    style={{ background: scene.color, color: "#fff" }}
                  >
                    {i + 1}
                  </div>
                  <span className="font-rubik text-white/70 text-sm">{note}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: `${scene.color}18` }}
          >
            <span className="text-sm">🎵</span>
            <span className="font-rubik text-sm italic" style={{ color: `${scene.glow}cc` }}>
              {scene.vibe}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ activeId, onSelect }: { activeId: number; onSelect: (id: number) => void }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-0 mb-1">
        {SCENES.map((scene) => {
          const widthPct = (scene.duration / TOTAL_DURATION) * 100;
          const isActive = scene.id === activeId;
          return (
            <button
              key={scene.id}
              onClick={() => onSelect(scene.id)}
              className="relative group h-8 transition-all duration-200 hover:brightness-110"
              style={{ width: `${widthPct}%` }}
            >
              <div
                className={`h-full transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-75"
                } ${scene.id === 1 ? "rounded-l-full" : ""} ${
                  scene.id === 8 ? "rounded-r-full" : ""
                }`}
                style={{ background: scene.color }}
              />
              {isActive && (
                <div
                  className="absolute inset-0 rounded animate-pulse"
                  style={{ background: `${scene.glow}33` }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between font-rubik text-white/30 text-xs px-0.5">
        <span>0с</span>
        <span>15с</span>
        <span>30с</span>
        <span>45с</span>
        <span>60с</span>
      </div>
    </div>
  );
}

export default function Index() {
  const [activeId, setActiveId] = useState(1);
  const activeScene = SCENES.find((s) => s.id === activeId)!;

  return (
    <div className="min-h-screen bg-[#06060a] font-rubik overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${activeScene.color}18 0%, transparent 70%)`,
          transition: "background 0.6s ease",
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto px-4 pt-6 pb-10">
        <div className="text-center mb-6">
          <div className="font-oswald text-xs tracking-[0.4em] text-white/30 uppercase mb-1">
            Minecraft Предательство
          </div>
          <h1 className="font-oswald font-black text-white text-3xl tracking-wider">
            СТОРИБОРД
          </h1>
          <div
            className="font-oswald text-sm tracking-widest font-semibold mt-1"
            style={{ color: activeScene.glow }}
          >
            BlackYT · 60 сек · 9:16
          </div>
        </div>

        <div className="mb-5">
          <Timeline activeId={activeId} onSelect={setActiveId} />
        </div>

        <div className="mb-5">
          <DetailPanel scene={activeScene} />
        </div>

        <div className="space-y-2">
          <div className="font-oswald text-xs tracking-[0.3em] text-white/30 uppercase mb-3">
            Все сцены
          </div>
          {SCENES.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={scene.id === activeId}
              onClick={() => setActiveId(scene.id)}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: activeScene.glow }}
            />
            <span className="font-oswald text-xs tracking-widest text-white/50 uppercase">
              Сцена {activeId} из {SCENES.length} · {activeScene.time}
            </span>
          </div>
        </div>

        <VideoPreview />
      </div>
    </div>
  );
}