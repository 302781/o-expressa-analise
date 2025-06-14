
import { useEffect, useState, useRef } from 'react';
import { Human, Config, Result } from '@vladmandic/human';

const humanConfig: Partial<Config> = {
  backend: 'webgl',
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/',
  filter: { enabled: true, equalization: false },
  face: { 
    enabled: true,
    detector: { rotation: true },
    mesh: { enabled: true },
    iris: { enabled: true },
    description: { enabled: true },
    emotion: { enabled: true },
  },
  body: { enabled: true },
  hand: { enabled: true },
  gesture: { enabled: true },
  object: { enabled: false }, // As requested, disabled
  segmentation: { enabled: false }, // As requested, disabled
};

export function useHuman(videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) {
  const humanRef = useRef<Human | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<string>("Cargando modelos...");
  const animationFrame = useRef<number>(0);

  useEffect(() => {
    humanRef.current = new Human(humanConfig);
    humanRef.current.load().then(() => {
      setStatus("Listo para escanear");
    }).catch(err => {
      console.error("Human Error:", err);
      setStatus("Error al cargar modelos");
    });

    return () => {
      stopScan();
      humanRef.current?.video(null);
    }
  }, []);

  const detectionLoop = async () => {
    if (!humanRef.current || !videoRef.current || videoRef.current.paused) {
      cancelAnimationFrame(animationFrame.current);
      return;
    }
    const newResult = await humanRef.current.detect(videoRef.current);
    setResult(newResult);
    if (canvasRef.current) {
      humanRef.current.draw.all(canvasRef.current, newResult);
    }
    animationFrame.current = requestAnimationFrame(detectionLoop);
  };

  const startScan = async () => {
    if (!humanRef.current || !videoRef.current) return;
    
    // Attach video element
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    videoRef.current.srcObject = stream;
    
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        setStatus("Escaneando...");
        detectionLoop();
      }).catch(error => {
        console.error("Error al iniciar video:", error);
        setStatus("Error de cámara");
      });
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    cancelAnimationFrame(animationFrame.current);
    setStatus("Listo para escanear");
  };

  return { result, status, startScan, stopScan };
}
