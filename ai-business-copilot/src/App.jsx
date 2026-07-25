import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import AIAgents from "./components/AIAgents"
import WorkflowSection from "./components/WorkflowSection"
import DashboardSection from "./components/DashboardSection"
import TestimonialsSection from "./components/TestimonialsSection"
import TechStackSection from "./components/TechStackSection"
import ProjectStorySection from "./components/ProjectStorySection"
import FinalCTA from "./components/FinalCTA"

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <AIAgents />
      <WorkflowSection />
      <DashboardSection />
      <TestimonialsSection />
      <TechStackSection />
      <ProjectStorySection />
      <FinalCTA />
    </div>
  )
}
