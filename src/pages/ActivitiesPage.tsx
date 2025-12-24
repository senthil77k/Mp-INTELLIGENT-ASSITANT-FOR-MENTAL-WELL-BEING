import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActivitiesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/mood-check')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Mood Check
            </Button>
          </div>
          
          <h1 className="text-4xl font-bold text-wellness mb-2 text-center">
            Your Personalized Activities
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Based on your mood, here are some activities to help you feel better
          </p>
          <PersonalizedRecommendations />
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;