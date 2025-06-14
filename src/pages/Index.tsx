
import FacialAnalysis from '@/components/FacialAnalysis';
import { Github } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Verificación Facial de Emociones</h1>
        <a href="https://github.com/vladmandic/human" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <Github className="w-6 h-6" />
        </a>
      </header>
      <main className="flex-grow">
        <FacialAnalysis />
      </main>
    </div>
  );
};

export default Index;
