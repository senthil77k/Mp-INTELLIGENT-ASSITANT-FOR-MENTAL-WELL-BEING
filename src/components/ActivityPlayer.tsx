// src/components/ActivityPlayer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  title: string;
  duration: string; // e.g. "5 min", "10 min"
}

interface ActivityPlayerProps {
  activity: Activity;
  onComplete: () => void;
}

function parseDurationToSeconds(duration: string | undefined): number {
  if (!duration) return 300; // default 5 min
  const match = duration.match(/(\d+)\s*min/i);
  if (match) {
    const mins = parseInt(match[1], 10);
    return mins * 60;
  }
  return 300;
}

function getAudioSrc(activity: Activity): string | null {
  if (activity.type === "music") {
    // background music
    return "/audio/relaxing-music.mp3";
  }
  if (activity.type === "audio") {
    // guided talk / meditation
    return "/audio/guided-meditation.mp3";
  }
  return null;
}

const ActivityPlayer: React.FC<ActivityPlayerProps> = ({ activity, onComplete }) => {
  const totalSeconds = useMemo(
    () => parseDurationToSeconds(activity.duration),
    [activity.duration]
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState("");
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">(
    "inhale"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer logic (shared by all types)
  useEffect(() => {
    if (!isPlaying) return;

    const start = Date.now() - elapsed * 1000;

    const id = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - start) / 1000);
      if (seconds >= totalSeconds) {
        setElapsed(totalSeconds);
        setIsPlaying(false);
        window.clearInterval(id);
        onComplete();
      } else {
        setElapsed(seconds);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [isPlaying, totalSeconds, elapsed, onComplete]);

  // Breathing phase logic (4-7-8 pattern => 19 sec per full cycle)
  useEffect(() => {
    if (activity.type !== "breathing" || !isPlaying) return;

    let phase: "inhale" | "hold" | "exhale" = "inhale";
    let phaseSeconds = 0;

    const phaseDurations: Record<typeof phase, number> = {
      inhale: 4,
      hold: 7,
      exhale: 8,
    };

    const id = window.setInterval(() => {
      phaseSeconds += 1;
      if (phaseSeconds >= phaseDurations[phase]) {
        if (phase === "inhale") phase = "hold";
        else if (phase === "hold") phase = "exhale";
        else phase = "inhale";
        phaseSeconds = 0;
        setBreathingPhase(phase);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [activity.type, isPlaying]);

  // Audio playback handling
  useEffect(() => {
    const src = getAudioSrc(activity);
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (isPlaying) {
      audio.currentTime = elapsed;   // sync timer & audio
      audio.muted = false;           // make sure not muted
      audio.volume = 1;              // ensure full volume
      audio.play().catch(err => {
        console.log("Audio play error:", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, activity]);

  // When audio ends, mark complete if timer also done
  const handleAudioEnded = () => {
    if (elapsed >= totalSeconds) {
      onComplete();
    } else {
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    // If at end, restart
    if (elapsed >= totalSeconds) {
      setElapsed(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsed(0);
    setNotes("");
  };

  const remaining = Math.max(totalSeconds - elapsed, 0);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = (elapsed / totalSeconds) * 100;

  // --- UI per activity type ---

  // Breathing activity
  if (activity.type === "breathing") {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-emerald-500/10 rounded-xl border border-sky-500/20 text-center">
          <h3 className="font-semibold text-lg mb-1">{activity.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Follow the 4-7-8 pattern: Inhale 4s, hold 7s, exhale 8s.
          </p>

          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-transform duration-700 ${
                isPlaying ? "scale-110" : "scale-100"
              } bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-lg`}
            >
              <span className="text-xl font-semibold capitalize">
                {breathingPhase}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {breathingPhase === "inhale" && "Breathe in slowly through your nose."}
              {breathingPhase === "hold" && "Hold your breath gently."}
              {breathingPhase === "exhale" && "Exhale fully through your mouth."}
            </p>

            <Progress value={progress} className="w-full max-w-sm" />
            <p className="text-xs text-muted-foreground">
              Time left: {mins.toString().padStart(2, "0")}:
              {secs.toString().padStart(2, "0")}
            </p>

            <div className="flex gap-3 justify-center">
              <Button onClick={handlePlayPause} variant="wellness">
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Start
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Journaling activity
  if (activity.type === "journaling") {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl border bg-card">
          <h3 className="font-semibold text-lg mb-1">{activity.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Take a few minutes to write freely about how you&apos;re feeling.
          </p>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start writing here..."
            className="min-h-[150px] mb-4"
          />

          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-muted-foreground mb-4">
            Time left: {mins.toString().padStart(2, "0")}:
            {secs.toString().padStart(2, "0")}
          </p>

          <div className="flex gap-3 justify-start">
            <Button onClick={handlePlayPause} variant="wellness">
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pause Timer
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Start Timer
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Music / audio activity
  const audioSrc = getAudioSrc(activity);

  if (activity.type === "music" || activity.type === "audio") {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
          <div className="text-center mb-4">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform ${
                isPlaying ? "scale-110 animate-pulse" : "scale-100"
              } bg-gradient-to-br from-primary to-accent text-white`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1">{activity.title}</h3>
            <p className="text-sm text-muted-foreground">
              {activity.type === "music"
                ? "Relaxing soundscape"
                : "Guided audio session"}
            </p>
          </div>

          {audioSrc ? (
            <audio
              ref={audioRef}
              src={audioSrc}
              preload="auto"
              controls={false}
              playsInline
            />
          ) : null}

          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Time left: {mins.toString().padStart(2, "0")}:
            {secs.toString().padStart(2, "0")}
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={handlePlayPause} variant="wellness" size="lg" className="px-8">
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" /> Play
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" /> Reset
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-center mt-4">
            <p className="text-sm text-muted-foreground">
              {activity.type === "music"
                ? "Close your eyes and let the sounds wash over you..."
                : "Listen carefully and follow along with the guidance..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic timer for any other type
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{activity.title}</h3>
      <Progress value={progress} />
      <p className="text-xs text-muted-foreground">
        Time left: {mins.toString().padStart(2, "0")}:
        {secs.toString().padStart(2, "0")}
      </p>
      <div className="flex gap-3">
        <Button onClick={handlePlayPause} variant="wellness">
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 mr-2" /> Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" /> Start
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default ActivityPlayer;
