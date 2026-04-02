import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ── Story Data ──────────────────────────────────────────────────────────────

interface Choice {
  text: string;
  nextScene: string;
}

interface Scene {
  text: string;
  emoji: string;
  choices: Choice[];
  bg: string; // tailwind bg class via design tokens
  ending?: "good" | "bad" | "neutral";
}

const story: Record<string, Scene> = {
  start: {
    emoji: "🏰",
    text: "You stand at the edge of a misty forest. A crumbling stone path leads deeper into the trees, while a faint light glows from a cave to the east. The wind carries a distant melody.",
    bg: "from-secondary to-muted",
    choices: [
      { text: "🌲 Follow the stone path", nextScene: "forest" },
      { text: "🔦 Enter the glowing cave", nextScene: "cave" },
      { text: "🎵 Follow the melody", nextScene: "melody" },
    ],
  },
  forest: {
    emoji: "🌳",
    text: "The forest thickens around you. Ancient trees tower overhead, their branches forming a natural cathedral. You discover a wooden bridge over a rushing river — and a hooded figure sitting beside it.",
    bg: "from-story-success/20 to-secondary",
    choices: [
      { text: "🗣️ Talk to the figure", nextScene: "figure" },
      { text: "🌉 Cross the bridge silently", nextScene: "bridge" },
    ],
  },
  cave: {
    emoji: "🕯️",
    text: "The cave is warm and glittering with crystals. Deep inside, you find an ancient chest covered in runes. A small dragon sleeps coiled around it, smoke curling from its nostrils.",
    bg: "from-story-warning/20 to-muted",
    choices: [
      { text: "📦 Try to open the chest quietly", nextScene: "chest" },
      { text: "🐉 Wake the dragon gently", nextScene: "dragon" },
      { text: "🚪 Leave the cave", nextScene: "start" },
    ],
  },
  melody: {
    emoji: "🎶",
    text: "You follow the haunting melody to a moonlit clearing. A spectral bard plays a silver lute, their translucent form shimmering. They notice you and stop playing.",
    bg: "from-primary/15 to-secondary",
    choices: [
      { text: "🎤 Ask them to teach you a song", nextScene: "song" },
      { text: "👻 Ask why they're here", nextScene: "ghost_story" },
    ],
  },
  figure: {
    emoji: "🧙",
    text: "The hooded figure reveals herself as a forest guardian. 'Few travelers come this way,' she says. 'I can grant you a gift — wisdom to see truth, or strength to face what lies ahead.'",
    bg: "from-story-success/25 to-secondary",
    choices: [
      { text: "🧠 Choose wisdom", nextScene: "wisdom_ending" },
      { text: "💪 Choose strength", nextScene: "strength_ending" },
    ],
  },
  bridge: {
    emoji: "🌊",
    text: "You cross the bridge, but halfway across, the planks crack beneath you! You plunge into the icy river. The current is strong, pulling you downstream toward a waterfall.",
    bg: "from-story-danger/20 to-muted",
    choices: [
      { text: "🏊 Swim to shore", nextScene: "shore_ending" },
      { text: "🪵 Grab a floating log", nextScene: "waterfall_ending" },
    ],
  },
  chest: {
    emoji: "💎",
    text: "Your fingers trace the runes and the chest clicks open, revealing a compass that points not north — but toward your deepest desire. The dragon stirs but doesn't wake. You slip away with your prize.",
    bg: "from-story-warning/30 to-primary/10",
    choices: [],
    ending: "good",
  },
  dragon: {
    emoji: "🐲",
    text: "The dragon opens one golden eye and regards you calmly. 'A brave one,' it rumbles. 'Most run. I am the last guardian of this mountain. Will you stay and learn, or take a scale and go?'",
    bg: "from-accent/20 to-story-warning/15",
    choices: [
      { text: "📚 Stay and learn", nextScene: "dragon_good" },
      { text: "✨ Take a scale", nextScene: "dragon_neutral" },
    ],
  },
  song: {
    emoji: "🎵",
    text: "The bard teaches you an ancient melody — one that can calm storms and mend broken things. As you learn the final note, the bard smiles and fades into starlight. The song remains with you forever.",
    bg: "from-primary/20 to-story-success/15",
    choices: [],
    ending: "good",
  },
  ghost_story: {
    emoji: "👻",
    text: "The bard tells of a curse that binds them here — they can only be freed if someone remembers their name. But their name has been lost to time. They fade with a sorrowful chord, and the clearing grows cold.",
    bg: "from-muted to-story-danger/10",
    choices: [],
    ending: "neutral",
  },
  wisdom_ending: {
    emoji: "✨",
    text: "With the gift of wisdom, the world reveals its hidden patterns. You see the connections between all living things, the stories woven into the land. You become a legendary sage, sought by kings and wanderers alike.",
    bg: "from-primary/25 to-story-success/20",
    choices: [],
    ending: "good",
  },
  strength_ending: {
    emoji: "⚔️",
    text: "With newfound strength, you venture deeper into the wild. You face many challenges and triumph over them all. But strength alone cannot fill the quiet moments, and you wonder what wisdom might have shown you.",
    bg: "from-story-warning/20 to-muted",
    choices: [],
    ending: "neutral",
  },
  shore_ending: {
    emoji: "🏖️",
    text: "You fight the current and drag yourself onto the riverbank, exhausted but alive. As you catch your breath, you notice a hidden village nestled in the valley — a place untouched by time. They welcome you as family.",
    bg: "from-story-success/25 to-secondary",
    choices: [],
    ending: "good",
  },
  waterfall_ending: {
    emoji: "🌊",
    text: "You grab the log, but the waterfall's edge approaches too fast. You plunge over — and land in a deep, warm pool below. Bruised but unbroken, you crawl out into an underground kingdom of bioluminescent fungi. Beautiful, but you're lost.",
    bg: "from-story-danger/15 to-primary/10",
    choices: [],
    ending: "bad",
  },
  dragon_good: {
    emoji: "📖",
    text: "Years pass in the dragon's cave. You learn the language of fire, the memory of stones, and the dreams of mountains. When you finally emerge, centuries have passed — but you carry ancient wisdom that will shape the world.",
    bg: "from-story-success/30 to-primary/15",
    choices: [],
    ending: "good",
  },
  dragon_neutral: {
    emoji: "🪙",
    text: "The dragon plucks a single iridescent scale and places it in your palm. 'This will protect you once,' it says. You leave the cave richer, but you can't shake the feeling you missed something extraordinary.",
    bg: "from-story-warning/25 to-muted",
    choices: [],
    ending: "neutral",
  },
};

// ── Ending Badge ────────────────────────────────────────────────────────────

const endingLabel = {
  good: { text: "🌟 Good Ending", className: "bg-story-success/20 text-story-success" },
  bad: { text: "💀 Bad Ending", className: "bg-story-danger/20 text-story-danger" },
  neutral: { text: "🌀 Neutral Ending", className: "bg-story-warning/20 text-story-warning" },
};

// ── Component ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "interactive-story-scene";

const InteractiveStory = () => {
  const [sceneKey, setSceneKey] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && story[saved] ? saved : "start";
    } catch {
      return "start";
    }
  });
  const [visible, setVisible] = useState(true);

  const scene = story[sceneKey];

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, sceneKey);
    } catch {}
  }, [sceneKey]);

  const navigate = useCallback((key: string) => {
    setVisible(false);
    setTimeout(() => {
      setSceneKey(key);
      setVisible(true);
    }, 300);
  }, []);

  const restart = useCallback(() => {
    navigate("start");
  }, [navigate]);

  const isEnding = scene.choices.length === 0;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${scene.bg} transition-all duration-700`}>
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 tracking-tight animate-fade-in">
        📜 Interactive Story
      </h1>

      {/* Story Card */}
      <Card
        className={`max-w-lg w-full shadow-xl transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Emoji + Ending badge */}
          <div className="flex items-center justify-between">
            <span className="text-4xl">{scene.emoji}</span>
            {isEnding && scene.ending && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${endingLabel[scene.ending].className}`}>
                {endingLabel[scene.ending].text}
              </span>
            )}
          </div>

          {/* Story text */}
          <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
            {scene.text}
          </p>

          {/* Choices */}
          <div className="flex flex-col gap-3">
            {scene.choices.map((choice, i) => (
              <Button
                key={i}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4 text-sm md:text-base hover:bg-primary/10 hover:border-primary transition-all duration-200"
                onClick={() => navigate(choice.nextScene)}
              >
                {choice.text}
              </Button>
            ))}
          </div>

          {/* Restart */}
          {isEnding && (
            <Button onClick={restart} className="w-full animate-slide-up">
              🔄 Restart Story
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Restart link (always visible) */}
      {!isEnding && (
        <button
          onClick={restart}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
        >
          Start over
        </button>
      )}
    </div>
  );
};

export default InteractiveStory;
