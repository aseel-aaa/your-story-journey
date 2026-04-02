// ── Types ─────────────────────────────────────────────────────────────────────

export interface Choice {
  text: string;
  nextScene: string;
}

export interface Scene {
  text: string;
  emoji: string;
  choices: Choice[];
  ending?: "good" | "bad" | "neutral";
  /** CSS linear-gradient string used as the page background */
  gradient: string;
}

// ── Story Data ────────────────────────────────────────────────────────────────
// Each scene has: display text, an emoji icon, an array of choices, and a
// gradient background colour.  Ending scenes have no choices and mark the type
// of ending the player reached.

export const story: Record<string, Scene> = {
  // ── Opening ──────────────────────────────────────────────────────────────
  start: {
    emoji: "🏰",
    text: "You stand at the edge of a misty forest. A crumbling stone path leads deeper into the trees, while a faint light glows from a cave to the east. The wind carries a distant melody.",
    gradient: "linear-gradient(135deg, #1a0a2e 0%, #0d0d1a 100%)",
    choices: [
      { text: "🌲 Follow the stone path", nextScene: "forest" },
      { text: "🔦 Enter the glowing cave", nextScene: "cave" },
      { text: "🎵 Follow the melody", nextScene: "melody" },
    ],
  },

  // ── Branch: Forest ───────────────────────────────────────────────────────
  forest: {
    emoji: "🌳",
    text: "The forest thickens around you. Ancient trees tower overhead, their branches forming a natural cathedral. You discover a wooden bridge over a rushing river — and a hooded figure sitting beside it.",
    gradient: "linear-gradient(135deg, #0a1f0d 0%, #0d1a0a 100%)",
    choices: [
      { text: "🗣️ Talk to the figure", nextScene: "figure" },
      { text: "🌉 Cross the bridge silently", nextScene: "bridge" },
    ],
  },

  // ── Branch: Cave ─────────────────────────────────────────────────────────
  cave: {
    emoji: "🕯️",
    text: "The cave is warm and glittering with crystals. Deep inside, you find an ancient chest covered in runes. A small dragon sleeps coiled around it, smoke curling from its nostrils.",
    gradient: "linear-gradient(135deg, #1f1208 0%, #1a0f00 100%)",
    choices: [
      { text: "📦 Try to open the chest quietly", nextScene: "chest" },
      { text: "🐉 Wake the dragon gently", nextScene: "dragon" },
      { text: "🚪 Leave the cave", nextScene: "start" },
    ],
  },

  // ── Branch: Melody ───────────────────────────────────────────────────────
  melody: {
    emoji: "🎶",
    text: "You follow the haunting melody to a moonlit clearing. A spectral bard plays a silver lute, their translucent form shimmering. They notice you and stop playing.",
    gradient: "linear-gradient(135deg, #150d2e 0%, #0d0820 100%)",
    choices: [
      { text: "🎤 Ask them to teach you a song", nextScene: "song" },
      { text: "👻 Ask why they're here", nextScene: "ghost_story" },
    ],
  },

  // ── Mid-scenes ───────────────────────────────────────────────────────────
  figure: {
    emoji: "🧙",
    text: "The hooded figure reveals herself as a forest guardian. 'Few travelers come this way,' she says. 'I can grant you a gift — wisdom to see truth, or strength to face what lies ahead.'",
    gradient: "linear-gradient(135deg, #081a15 0%, #0d1f1a 100%)",
    choices: [
      { text: "🧠 Choose wisdom", nextScene: "wisdom_ending" },
      { text: "💪 Choose strength", nextScene: "strength_ending" },
    ],
  },
  bridge: {
    emoji: "🌊",
    text: "You cross the bridge, but halfway across, the planks crack beneath you! You plunge into the icy river. The current is strong, pulling you downstream toward a waterfall.",
    gradient: "linear-gradient(135deg, #081520 0%, #0d1530 100%)",
    choices: [
      { text: "🏊 Swim to shore", nextScene: "shore_ending" },
      { text: "🪵 Grab a floating log", nextScene: "waterfall_ending" },
    ],
  },
  dragon: {
    emoji: "🐲",
    text: "The dragon opens one golden eye and regards you calmly. 'A brave one,' it rumbles. 'Most run. I am the last guardian of this mountain. Will you stay and learn, or take a scale and go?'",
    gradient: "linear-gradient(135deg, #1f0808 0%, #1a0505 100%)",
    choices: [
      { text: "📚 Stay and learn", nextScene: "dragon_good" },
      { text: "✨ Take a scale", nextScene: "dragon_neutral" },
    ],
  },

  // ── Endings ───────────────────────────────────────────────────────────────
  chest: {
    emoji: "💎",
    text: "Your fingers trace the runes and the chest clicks open, revealing a compass that points not north — but toward your deepest desire. The dragon stirs but doesn't wake. You slip away with your prize.",
    gradient: "linear-gradient(135deg, #1f1a08 0%, #1a1500 100%)",
    choices: [],
    ending: "good",
  },
  song: {
    emoji: "🎵",
    text: "The bard teaches you an ancient melody — one that can calm storms and mend broken things. As you learn the final note, the bard smiles and fades into starlight. The song remains with you forever.",
    gradient: "linear-gradient(135deg, #1f0820 0%, #150010 100%)",
    choices: [],
    ending: "good",
  },
  ghost_story: {
    emoji: "👻",
    text: "The bard tells of a curse that binds them here — they can only be freed if someone remembers their name. But their name has been lost to time. They fade with a sorrowful chord, and the clearing grows cold.",
    gradient: "linear-gradient(135deg, #101013 0%, #0d0d10 100%)",
    choices: [],
    ending: "neutral",
  },
  wisdom_ending: {
    emoji: "✨",
    text: "With the gift of wisdom, the world reveals its hidden patterns. You see the connections between all living things, the stories woven into the land. You become a legendary sage, sought by kings and wanderers alike.",
    gradient: "linear-gradient(135deg, #080f1f 0%, #0a0d1a 100%)",
    choices: [],
    ending: "good",
  },
  strength_ending: {
    emoji: "⚔️",
    text: "With newfound strength, you venture deeper into the wild. You face many challenges and triumph over them all. But strength alone cannot fill the quiet moments, and you wonder what wisdom might have shown you.",
    gradient: "linear-gradient(135deg, #101010 0%, #0d0d0d 100%)",
    choices: [],
    ending: "neutral",
  },
  shore_ending: {
    emoji: "🏖️",
    text: "You fight the current and drag yourself onto the riverbank, exhausted but alive. As you catch your breath, you notice a hidden village nestled in the valley — a place untouched by time. They welcome you as family.",
    gradient: "linear-gradient(135deg, #081f1f 0%, #0a1a1a 100%)",
    choices: [],
    ending: "good",
  },
  waterfall_ending: {
    emoji: "🌊",
    text: "You grab the log, but the waterfall's edge approaches too fast. You plunge over — and land in a deep, warm pool below. Bruised but unbroken, you crawl out into an underground kingdom of bioluminescent fungi. Beautiful, but you're lost.",
    gradient: "linear-gradient(135deg, #080d1f 0%, #050a1a 100%)",
    choices: [],
    ending: "bad",
  },
  dragon_good: {
    emoji: "📖",
    text: "Years pass in the dragon's cave. You learn the language of fire, the memory of stones, and the dreams of mountains. When you finally emerge, centuries have passed — but you carry ancient wisdom that will shape the world.",
    gradient: "linear-gradient(135deg, #081f0a 0%, #0a1a0d 100%)",
    choices: [],
    ending: "good",
  },
  dragon_neutral: {
    emoji: "🪙",
    text: "The dragon plucks a single iridescent scale and places it in your palm. 'This will protect you once,' it says. You leave the cave richer, but you can't shake the feeling you missed something extraordinary.",
    gradient: "linear-gradient(135deg, #1f1508 0%, #1a1200 100%)",
    choices: [],
    ending: "neutral",
  },
};

// The longest path to an ending is 3 choices deep.
// Used to calculate the progress bar percentage.
export const MAX_STORY_DEPTH = 3;
