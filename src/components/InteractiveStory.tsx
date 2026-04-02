import { useState, useCallback, useEffect } from "react";
import { story, MAX_STORY_DEPTH } from "@/data/storyData";

// ── Constants ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "interactive-story-state";
const TRANSITION_MS = 320; // fade-out duration in ms

// ── Ending badge config ───────────────────────────────────────────────────────

const endingConfig = {
  good:    { label: "🌟 Good Ending",    color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  bad:     { label: "💀 Bad Ending",     color: "#f87171", bg: "rgba(248,113,113,0.15)" },
  neutral: { label: "🌀 Neutral Ending", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Save scene + history to localStorage so progress survives a page refresh. */
function saveProgress(sceneKey: string, history: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sceneKey, history }));
  } catch {
    // localStorage may be unavailable in some environments – that's fine.
  }
}

/** Load saved progress from localStorage, falling back to defaults. */
function loadProgress(): { sceneKey: string; history: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (story[parsed.sceneKey] && Array.isArray(parsed.history)) {
        return { sceneKey: parsed.sceneKey, history: parsed.history };
      }
    }
  } catch {
    // ignore
  }
  return { sceneKey: "start", history: [] };
}

// ── Component ─────────────────────────────────────────────────────────────────

const InteractiveStory = () => {
  // Load saved progress on first render
  const initial = loadProgress();

  // Current scene key – drives everything that renders
  const [sceneKey, setSceneKey] = useState<string>(initial.sceneKey);

  // History stack – array of scene keys the player has visited so we can go back
  const [history, setHistory] = useState<string[]>(initial.history);

  // Controls the fade-in / fade-out animation between scenes
  const [visible, setVisible] = useState(true);

  // Background gradient colour of the current scene (animated separately so it
  // keeps transitioning even while the card is invisible)
  const [bgGradient, setBgGradient] = useState(story[initial.sceneKey].gradient);

  const scene = story[sceneKey];
  const isEnding = scene.choices.length === 0;

  // Progress 0-100: how far through the story the player is
  const progress = isEnding
    ? 100
    : Math.min(Math.round((history.length / MAX_STORY_DEPTH) * 100), 95);

  // Keep the background in sync with the current scene
  useEffect(() => {
    setBgGradient(story[sceneKey].gradient);
  }, [sceneKey]);

  // ── Navigation helpers ──────────────────────────────────────────────────────

  /**
   * Navigate forward to a new scene.
   * Fades out → swaps scene state → fades back in.
   */
  const navigate = useCallback(
    (nextKey: string) => {
      setVisible(false);
      setTimeout(() => {
        const newHistory = [...history, sceneKey];
        setSceneKey(nextKey);
        setHistory(newHistory);
        saveProgress(nextKey, newHistory);
        setVisible(true);
      }, TRANSITION_MS);
    },
    [history, sceneKey]
  );

  /**
   * Go back one step using the history stack.
   */
  const goBack = useCallback(() => {
    if (history.length === 0) return;
    setVisible(false);
    setTimeout(() => {
      const prevKey = history[history.length - 1];
      const newHistory = history.slice(0, -1);
      setSceneKey(prevKey);
      setHistory(newHistory);
      saveProgress(prevKey, newHistory);
      setVisible(true);
    }, TRANSITION_MS);
  }, [history]);

  /**
   * Restart from the very beginning.
   */
  const restart = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setSceneKey("start");
      setHistory([]);
      saveProgress("start", []);
      setVisible(true);
    }, TRANSITION_MS);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="story-root"
      style={{ background: bgGradient }}
    >
      {/* Starfield decorative overlay */}
      <div className="story-overlay" aria-hidden="true" />

      {/* Main content column */}
      <div className="story-container">

        {/* ── Header ── */}
        <header className="story-header">
          <h1 className="story-title">📜 Your Story</h1>
          <button
            id="btn-restart-top"
            onClick={restart}
            className="story-link-btn"
            title="Start the story from the beginning"
          >
            Start over
          </button>
        </header>

        {/* ── Progress bar ── */}
        <div className="progress-wrapper" aria-label={`Story progress: ${progress}%`}>
          <div className="progress-labels">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── Story card (fades in/out between scenes) ── */}
        <div
          className={`story-card ${visible ? "story-card--visible" : "story-card--hidden"}`}
        >
          {/* Emoji + ending badge */}
          <div className="scene-top-row">
            <span className="scene-emoji" aria-label="scene icon">{scene.emoji}</span>
            {isEnding && scene.ending && (
              <span
                className="ending-badge"
                style={{
                  color: endingConfig[scene.ending].color,
                  background: endingConfig[scene.ending].bg,
                  border: `1px solid ${endingConfig[scene.ending].color}40`,
                }}
              >
                {endingConfig[scene.ending].label}
              </span>
            )}
          </div>

          {/* Scene text */}
          <p className="scene-text">{scene.text}</p>

          {/* Choice buttons – rendered dynamically from story data */}
          {scene.choices.length > 0 && (
            <div className="choices-list" role="list">
              {scene.choices.map((choice, i) => (
                <button
                  key={i}
                  id={`btn-choice-${i}`}
                  role="listitem"
                  onClick={() => navigate(choice.nextScene)}
                  className="choice-btn"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          )}

          {/* Restart button shown only at endings */}
          {isEnding && (
            <button
              id="btn-play-again"
              onClick={restart}
              className="restart-btn"
            >
              🔄 Play Again
            </button>
          )}
        </div>

        {/* ── Back button – only shown when there is history to go back to ── */}
        {history.length > 0 && (
          <button
            id="btn-back"
            onClick={goBack}
            className="back-btn"
            title="Go back to the previous scene"
          >
            ← Go back
          </button>
        )}

        {/* ── Scene counter ── */}
        <p className="scene-counter">
          Scene {history.length + 1} · {Object.keys(story).length} scenes total
        </p>

      </div>
    </div>
  );
};

export default InteractiveStory;
