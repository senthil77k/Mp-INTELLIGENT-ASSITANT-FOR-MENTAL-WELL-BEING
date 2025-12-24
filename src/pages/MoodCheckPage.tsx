import MoodTracker from "@/components/MoodTracker";

const MoodCheckPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-wellness mb-2 text-center">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Share your mood and thoughts to get personalized wellness recommendations
          </p>
          <MoodTracker />
        </div>
      </div>
    </div>
  );
};

export default MoodCheckPage;