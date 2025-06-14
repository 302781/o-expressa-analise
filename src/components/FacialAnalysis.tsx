
import React, { useRef, useState } from 'react';
import { Play, StopCircle } from 'lucide-react';
import { useHuman } from '../hooks/useHuman';
import ResultsDisplay from './ResultsDisplay';
import { Button } from '@/components/ui/button'; // Assuming shadcn button is available

const FacialAnalysis: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { result, status, startScan, stopScan } = useHuman(videoRef, canvasRef);
  const [isScanning, setIsScanning] = useState(false);

  const handleStart = () => {
    startScan();
    setIsScanning(true);
  };

  const handleStop = () => {
    stopScan();
    setIsScanning(false);
  };

  return (
    <div className="w-full h-full p-4 md:p-8 flex flex-col md:flex-row gap-8">
      <div className="flex-grow md:w-2/3 flex flex-col gap-4">
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
          <video ref={videoRef} className="w-full h-full" playsInline autoPlay muted />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        </div>
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
          <p className="text-sm font-medium text-primary">{status}</p>
          <div className="flex gap-4">
            {!isScanning ? (
              <Button onClick={handleStart} className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Iniciar Escaneo
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" className="flex items-center gap-2">
                <StopCircle className="w-5 h-5" />
                Detener Escaneo
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="md:w-1/3 h-full">
        <ResultsDisplay result={result} />
      </div>
    </div>
  );
};

export default FacialAnalysis;
