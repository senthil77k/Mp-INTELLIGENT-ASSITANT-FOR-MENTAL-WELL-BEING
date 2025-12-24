import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, Heart, Zap, Cloud, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const moodOptions = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-accent-bright', sentiment: 'positive' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-secondary', sentiment: 'neutral' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'bg-muted', sentiment: 'negative' },
  { id: 'excited', label: 'Excited', icon: Zap, color: 'bg-primary-light', sentiment: 'positive' },
  { id: 'anxious', label: 'Anxious', icon: Cloud, color: 'bg-secondary-accent', sentiment: 'negative' },
  { id: 'grateful', label: 'Grateful', icon: Heart, color: 'wellness-gradient', sentiment: 'positive' },
];

const MoodTracker = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moodText, setMoodText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    sentiment: string;
    confidence: number;
    emotions: string[];
  } | null>(null);

  const handleMoodSelection = (moodId: string) => {
    console.log(`Selected mood: ${moodId}`);
    setSelectedMood(moodId);
    const mood = moodOptions.find(m => m.id === moodId);
    toast({
      title: "Mood Selected",
      description: `You're feeling ${mood?.label.toLowerCase()}. That's okay, we're here for you.`,
    });
  };

  const analyzeSentiment = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Enhanced keyword detection
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'excited', 'joy', 'love', 'grateful', 'blessed', 'thankful', 'proud', 'accomplished', 'better', 'awesome', 'fantastic'];
    const negativeWords = ['sad', 'bad', 'difficult', 'hard', 'struggling', 'anxious', 'worried', 'stressed', 'depressed', 'lonely', 'hurt', 'pain', 'upset', 'angry', 'frustrated', 'terrible', 'awful'];
    const anxiousWords = ['anxious', 'worried', 'nervous', 'stress', 'overwhelmed', 'panic', 'fear', 'scared'];
    const excitedWords = ['excited', 'thrilled', 'pumped', 'eager', 'energized', 'motivated'];
    const gratefulWords = ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate'];
    
    // Count occurrences
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const anxiousCount = anxiousWords.filter(word => lowerText.includes(word)).length;
    const excitedCount = excitedWords.filter(word => lowerText.includes(word)).length;
    const gratefulCount = gratefulWords.filter(word => lowerText.includes(word)).length;
    
    // Detect emotions
    const detectedEmotions: string[] = [];
    if (anxiousCount > 0) detectedEmotions.push('anxious', 'concerned');
    if (excitedCount > 0) detectedEmotions.push('excited', 'energetic');
    if (gratefulCount > 0) detectedEmotions.push('grateful', 'appreciative');
    if (positiveCount > negativeCount && positiveCount > 0) detectedEmotions.push('hopeful', 'optimistic');
    if (negativeCount > positiveCount && negativeCount > 0) detectedEmotions.push('struggling', 'reflective');
    if (detectedEmotions.length === 0) detectedEmotions.push('thoughtful', 'introspective', 'contemplative');
    
    // Determine overall sentiment
    let sentiment = 'neutral';
    let confidence = 0.65;
    
    if (positiveCount > negativeCount && positiveCount > 0) {
      sentiment = 'positive';
      confidence = Math.min(0.95, 0.65 + (positiveCount * 0.08));
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = 'negative';
      confidence = Math.min(0.95, 0.65 + (negativeCount * 0.08));
    } else if (positiveCount > 0 && negativeCount > 0) {
      sentiment = 'mixed';
      confidence = 0.72;
    } else if (anxiousCount > 0) {
      sentiment = 'anxious';
      confidence = 0.78;
    } else if (excitedCount > 0) {
      sentiment = 'excited';
      confidence = 0.8;
    } else if (gratefulCount > 0) {
      sentiment = 'grateful';
      confidence = 0.82;
    }
    
    return {
      sentiment,
      confidence,
      emotions: detectedEmotions.slice(0, 4) // Limit to 4 emotions
    };
  };

  const getSupportiveMessage = (sentiment: string) => {
    const messages = {
      positive: "That's wonderful! It's great to hear you're doing well. Keep nurturing this positive energy!",
      negative: "I hear you, and your feelings are valid. Remember, it's okay to not be okay. Let's find some activities that might help.",
      mixed: "It sounds like you're experiencing a mix of emotions. That's completely normal. Let's explore some activities to support you.",
      neutral: "Thank you for sharing. Let's find some activities that resonate with how you're feeling right now."
    };
    return messages[sentiment as keyof typeof messages] || messages.neutral;
  };

  const analyzeMood = () => {
    if (!moodText.trim()) {
      toast({
        title: "Please share your thoughts",
        description: "Write something about how you're feeling before analyzing.",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Analyzing mood text:', moodText);
    console.log('Selected mood:', selectedMood);
    setIsAnalyzing(true);
    
    // Real sentiment analysis
    setTimeout(() => {
      const analysis = analyzeSentiment(moodText);
      
      setAnalysis(analysis);
      setIsAnalyzing(false);
      
      console.log('Analysis complete:', analysis);
      
      // Show supportive message
      toast({
        title: "Analysis Complete",
        description: getSupportiveMessage(analysis.sentiment),
      });
      
      // Store mood data in sessionStorage for activities page
      const moodData = {
        selectedMood,
        moodText,
        analysis,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('currentMoodData', JSON.stringify(moodData));
      
      // Navigate to activities page after analysis
      setTimeout(() => {
        console.log('Navigating to activities page...');
        navigate('/activities');
      }, 2000);
    }, 1500);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-wellness">
            How are you feeling today?
          </h2>
          <p className="text-xl text-muted-foreground">
            Share your thoughts and let our AI help you understand your emotions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mood Selection */}
          <Card className="shadow-card border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Quick Mood Check
              </CardTitle>
              <CardDescription>
                Select how you're feeling right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => {
                  const IconComponent = mood.icon;
                  return (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "wellness" : "outline"}
                      className={`h-20 flex-col gap-2 p-4 transition-all duration-300 ${
                        selectedMood === mood.id ? 'scale-105 shadow-glow' : 'hover:scale-105'
                      }`}
                      onClick={() => handleMoodSelection(mood.id)}
                    >
                      <IconComponent className="w-6 h-6" />
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Text Analysis */}
          <Card className="shadow-card border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Express Yourself
              </CardTitle>
              <CardDescription>
                Write about your thoughts and feelings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="What's on your mind today? Share your thoughts, feelings, or what happened..."
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                className="min-h-32 resize-none border-primary/20 focus:border-primary/40"
              />
              
              <Button 
                onClick={analyzeMood}
                variant="wellness"
                className="w-full"
                disabled={!moodText.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze My Mood'
                )}
              </Button>

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-6 p-4 bg-gradient-breathing rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-foreground">AI Analysis Results</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sentiment:</span>
                      <Badge variant={
                        analysis.sentiment === 'positive' ? 'default' : 
                        analysis.sentiment === 'negative' ? 'destructive' : 
                        'secondary'
                      }>
                        {analysis.sentiment}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({Math.round(analysis.confidence * 100)}% confidence)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">Detected emotions:</span>
                      {analysis.emotions.map((emotion) => (
                        <Badge key={emotion} variant="outline" className="text-xs">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MoodTracker;