import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Brain, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import wellnessHero from "@/assets/wellness-hero.jpg";

const WellnessHero = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    console.log('Starting wellness journey...');
    navigate('/mood-check');
  };


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${wellnessHero})` }}
      />
      
      {/* Breathing Orb */}
      <div className="absolute top-20 right-20 w-32 h-32 wellness-gradient rounded-full breathing-orb opacity-30" />
      <div className="absolute bottom-32 left-16 w-20 h-20 bg-accent rounded-full animate-pulse opacity-40" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-wellness leading-tight">
          Your AI Companion for
          <br />
          <span className="bg-gradient-breathing bg-clip-text text-transparent">
            Mental Wellness
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto">
          Discover emotional insights, track your mood journey, and receive personalized care
          with our empathetic AI assistant.
        </p>
        
        {/* CTA Button */}
        <div className="flex justify-center mb-16">
          <Button 
            variant="wellness" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={handleStartJourney}
          >
            Start Your Journey
          </Button>
        </div>
        
        {/* Feature Cards */}
        <div id="features-section" className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="floating-card p-6 bg-card/80 backdrop-blur-sm border-primary/10 shadow-card hover:shadow-soft transition-all duration-300">
            <div className="w-12 h-12 wellness-gradient rounded-full flex items-center justify-center mb-4 mx-auto">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Sentiment Analysis</h3>
            <p className="text-muted-foreground">
              Understand your emotions through intelligent text and voice analysis
            </p>
          </Card>
          
          <Card className="floating-card p-6 bg-card/80 backdrop-blur-sm border-primary/10 shadow-card hover:shadow-soft transition-all duration-300" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-gradient-breathing rounded-full flex items-center justify-center mb-4 mx-auto">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Mood Tracking</h3>
            <p className="text-muted-foreground">
              Visualize your emotional patterns and celebrate your progress
            </p>
          </Card>
          
          <Card className="floating-card p-6 bg-card/80 backdrop-blur-sm border-primary/10 shadow-card hover:shadow-soft transition-all duration-300" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 bg-accent-bright rounded-full flex items-center justify-center mb-4 mx-auto">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              Your mental health data is secure and completely private
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WellnessHero;