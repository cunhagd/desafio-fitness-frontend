// /frontend/src/pages/AchievementsPage.tsx

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Award, Trophy, Weight, Target, Lock, CheckCircle } from 'lucide-react';

// Tipagem para os dados de conquista que vêm da API
interface Achievement {
  type: string;
  name: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

// Mapeamento dos tipos de conquista para ícones
const achievementIcons: { [key: string]: React.ReactNode } = {
  FIRST_WEIGHT_LOG: <Weight size={24} />,
  WEIGHT_LOSS_1KG: <Trophy size={24} />,
  WEIGHT_LOSS_3KG: <Trophy size={24} />,
  WEIGHT_LOSS_5KG: <Trophy size={24} />,
  WEIGHT_LOSS_10KG: <Trophy size={24} />,
  FIRST_ERROR_LOG: <Target size={24} />,
};

export function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/achievements');
        setAchievements(response.data);
      } catch (err) {
        setError('Não foi possível carregar suas conquistas.');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return <div className="text-center text-clickup-text-muted">Carregando conquistas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <Award className="mx-auto h-16 w-16 text-clickup-purple mb-4" />
        <h1 className="text-4xl font-bold text-clickup-text-dark">Sua Galeria de Conquistas</h1>
        <p className="text-clickup-text-muted mt-2">Veja seu progresso e as metas que você já alcançou!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map(achieve => (
          <div
            key={achieve.type}
            className={`bg-white rounded-lg shadow-clickup-card-shadow border transition-all duration-300 ${
              achieve.isUnlocked ? 'border-green-300' : 'border-gray-200'
            }`}
          >
            <div className={`p-6 ${!achieve.isUnlocked ? 'opacity-50 filter grayscale' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${achieve.isUnlocked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {achievementIcons[achieve.type] || <Trophy size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-clickup-text-dark">{achieve.name}</h3>
                </div>
              </div>
              <p className="text-sm text-clickup-text-muted mt-4 h-10">{achieve.description}</p>
            </div>
            
            <div className="bg-gray-50/80 px-6 py-3 border-t rounded-b-lg">
              {achieve.isUnlocked && achieve.unlockedAt ? (
                <div className="flex items-center gap-2 text-xs text-green-700 font-semibold">
                  <CheckCircle size={14} />
                  <span>
                    Desbloqueado em {new Date(achieve.unlockedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                  <Lock size={14} />
                  <span>Bloqueado</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}