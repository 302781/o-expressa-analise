
import React from 'react';
import { Result } from '@vladmandic/human';

interface ResultsDisplayProps {
  result: Result | null;
}

const formatData = (data: any) => {
  if (typeof data === 'number') return data.toFixed(2);
  if (Array.isArray(data)) return data.map(item => typeof item === 'number' ? item.toFixed(2) : item).join(', ');
  return String(data);
};

const ResultRow: React.FC<{ label: string; data: any }> = ({ label, data }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-700">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-sm font-medium text-white">{formatData(data)}</span>
  </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const face = result?.face[0];

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white mb-4">Resultados del Análisis</h3>
      {face ? (
        <div className="space-y-2">
          <ResultRow label="Edad" data={face.age} />
          <ResultRow label="Género" data={`${face.gender} (${face.genderScore})`} />
          <ResultRow label="Emoción Principal" data={face.emotion.reduce((prev, curr) => (prev.score > curr.score ? prev : curr)).emotion} />
          {face.emotion.map(e => <ResultRow key={e.emotion} label={`- ${e.emotion}`} data={e.score} />)}
          <ResultRow label="Postura Cabeza" data={face.rotation?.angle.map(a => (a * 180 / Math.PI).toFixed(0) + '°').join(' | ')} />
          <ResultRow label="Mirada" data={face.iris > 0 ? `~${(face.iris * 100).toFixed(0)}% a la derecha` : `~${(Math.abs(face.iris) * 100).toFixed(0)}% a la izquierda`} />
          <ResultRow label="Gestos" data={result.gesture.length > 0 ? result.gesture.map(g => `${g.gesture}`).join(', ') : 'Ninguno'} />
        </div>
      ) : (
        <p className="text-gray-400 text-center py-10">Esperando datos del paciente...</p>
      )}
    </div>
  );
};

export default ResultsDisplay;
