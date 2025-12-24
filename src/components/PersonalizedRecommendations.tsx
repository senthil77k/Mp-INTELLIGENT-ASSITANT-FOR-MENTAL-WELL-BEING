import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ActivityPlayer from "@/components/ActivityPlayer";
import { Music, BookOpen, Wind, Coffee, Headphones, Sun } from "lucide-react";

const recommendations = [
  { id: 1, type: "breathing", title: "4-7-8 Breathing Exercise", description: "A calming technique to reduce anxiety and promote relaxation", duration: "5 min", icon: Wind, tags: ["anxiety", "stress", "quick"], color: "bg-accent/20 border-accent/30" },
  { id: 2, type: "music", title: "Ambient Nature Sounds", description: "Peaceful forest sounds to help you focus and unwind", duration: "15 min", icon: Music, tags: ["focus", "relaxation", "nature"], color: "bg-primary/20 border-primary/30" },
  { id: 3, type: "journaling", title: "Gratitude Reflection", description: "Write about three things you're grateful for today", duration: "10 min", icon: BookOpen, tags: ["gratitude", "positivity", "self-care"], color: "bg-secondary/20 border-secondary-accent/40" },
  { id: 4, type: "meditation", title: "Body Scan Meditation", description: "Progressive relaxation to release tension and stress", duration: "20 min", icon: Sun, tags: ["meditation", "relaxation", "mindfulness"], color: "bg-accent-bright/20 border-accent-bright/40" },
  { id: 5, type: "activity", title: "Mindful Tea Break", description: "Take a few minutes to mindfully enjoy a warm beverage", duration: "8 min", icon: Coffee, tags: ["mindfulness", "break", "comfort"], color: "bg-muted border-border" },
  { id: 6, type: "audio", title: "Positive Affirmations", description: "Listen to uplifting affirmations to boost your mood", duration: "12 min", icon: Headphones, tags: ["positivity", "confidence", "motivation"], color: "bg-primary-light/20 border-primary-light/40" }
];

const PersonalizedRecommendations = () => {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<typeof recommendations[0] | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityInProgress, setActivityInProgress] = useState(false);

  const [currentMood, setCurrentMood] = useState<{ selectedMood: string; sentiment: string } | null>(null);
  const [recommendationList, setRecommendationList] = useState(recommendations);

  // Load mood data
  useEffect(() => {
    const moodData = sessionStorage.getItem("currentMoodData");
    if (moodData) {
      try {
        const parsed = JSON.parse(moodData);
        setCurrentMood({
          selectedMood: parsed.selectedMood,
          sentiment: parsed.analysis?.sentiment || "neutral"
        });
      } catch (e) {
        console.error("Mood parsing error:", e);
      }
    }
  }, []);

  // Dynamic Recommendation Logic
  const getFilteredRecommendations = () => {
    if (!currentMood) return recommendations;
    const mood = currentMood.selectedMood;
    const sentiment = currentMood.sentiment;

    const moodMap: Record<string, string[]> = {
      happy: ["Positive Affirmations", "Gratitude Reflection", "Ambient Nature Sounds"],
      excited: ["Positive Affirmations", "Ambient Nature Sounds", "4-7-8 Breathing Exercise"],
      grateful: ["Gratitude Reflection", "Mindful Tea Break", "Ambient Nature Sounds"],
      anxious: ["4-7-8 Breathing Exercise", "Body Scan Meditation", "Ambient Nature Sounds"],
      sad: ["Positive Affirmations", "Mindful Tea Break", "Body Scan Meditation"],
      neutral: ["Mindful Tea Break", "Ambient Nature Sounds", "Gratitude Reflection"]
    };

    let selected = moodMap[mood] || [];

    if (sentiment === "negative" && !selected.includes("Body Scan Meditation")) selected.unshift("Body Scan Meditation");
    if (sentiment === "positive" && !selected.includes("Positive Affirmations")) selected.unshift("Positive Affirmations");

    const primary = recommendations.filter(r => selected.includes(r.title));
    const others = recommendations.filter(r => !selected.includes(r.title));
    return [...primary, ...others];
  };

  useEffect(() => {
    setRecommendationList(getFilteredRecommendations());
  }, [currentMood]);

  const handleStartActivity = (activity: typeof recommendations[0]) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleBeginActivity = () => setActivityInProgress(true);

  const handleCompleteActivity = () => {
    setActivityInProgress(false);
    setShowActivityModal(false);

    fetch("http://localhost:4000/api/moods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: currentMood?.selectedMood,
        sentiment: currentMood?.sentiment,
        activity: selectedActivity?.title
      })
    });

    toast({
      title: "Great job! 🎉",
      description: `You completed ${selectedActivity?.title}. Your progress has been saved.`,
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-calm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-wellness">Personalized for You</h2>
          {currentMood && (
            <Badge variant="secondary" className="mt-3">
              Current mood: {currentMood.selectedMood} ({currentMood.sentiment})
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendationList.map((rec) => {
            const Icon = rec.icon;
            return (
              <Card key={rec.id} className={`floating-card shadow-card hover:shadow-soft transition-all duration-300 ${rec.color}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 wellness-gradient rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">{rec.duration}</Badge>
                  </div>
                  <CardTitle>{rec.title}</CardTitle>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="wellness" className="w-full" onClick={() => handleStartActivity(rec)}>
                    Start Activity
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dashboard Navigation Button */}
        <div className="text-center mt-10">
          <Button variant="wellness" onClick={() => (window.location.href = "/dashboard")}>
            View My Progress Dashboard
          </Button>
        </div>

        {/* Activity Modal */}
        <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedActivity?.title}</DialogTitle>
              <DialogDescription>{selectedActivity?.description}</DialogDescription>
            </DialogHeader>

            {!activityInProgress ? (
              <Button variant="wellness" className="w-full" onClick={handleBeginActivity}>
                <Play className="w-4 h-4 mr-2" /> Begin Activity
              </Button>
            ) : (
              <ActivityPlayer activity={selectedActivity!} onComplete={handleCompleteActivity} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
