import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import { loadBestiaryData } from '../../lib/bestiary-data';

// Configurar CORS
const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Aplicar CORS
  await new Promise(resolve => corsMiddleware(req, res, resolve));

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Apenas requisições GET são permitidas',
    });
  }

  try {
    const bestiaryData = loadBestiaryData();

    if (!bestiaryData || !bestiaryData.data) {
      return res.status(500).json({
        success: false,
        error: 'Failed to load bestiary data',
        message: 'Erro ao carregar dados do bestiary',
      });
    }

    // Extrair classes únicas e ordenar alfabeticamente
    const classes = [...new Set(bestiaryData.data.map(m => m.class.name))]
      .sort((a, b) => a.localeCompare(b))
      .map(className => {
        const classData = bestiaryData.data.find(m => m.class.name === className)?.class;
        return {
          id: classData?.id || 0,
          name: className,
          displayName: getClassDisplayName(className),
          count: bestiaryData.data.filter(m => m.class.name === className).length,
        };
      });

    // Extrair dificuldades únicas e ordenar por nível
    const difficulties = [...new Set(bestiaryData.data.map(m => m.difficulty))]
      .sort((a, b) => getDifficultyOrder(a) - getDifficultyOrder(b))
      .map(difficulty => ({
        value: difficulty,
        displayName: getDifficultyDisplayName(difficulty),
        color: getDifficultyColor(difficulty),
        stars: getDifficultyStars(difficulty),
        count: bestiaryData.data.filter(m => m.difficulty === difficulty).length,
      }));

    // Estatísticas gerais
    const stats = {
      total_monsters: bestiaryData.data.length,
      total_classes: classes.length,
      total_difficulties: difficulties.length,
      average_level: Math.round(
        bestiaryData.data.reduce((sum, m) => sum + m.order, 0) / bestiaryData.data.length
      ),
      min_level: Math.min(...bestiaryData.data.map(m => m.order)),
      max_level: Math.max(...bestiaryData.data.map(m => m.order)),
    };

    return res.status(200).json({
      success: true,
      data: {
        classes,
        difficulties,
        stats,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    console.error('Error in bestiary filters endpoint:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Erro interno do servidor',
    });
  }
}

// Funções auxiliares para nomes de exibição
function getClassDisplayName(className: string): string {
  const displayNames: Record<string, string> = {
    Amphibic: 'Anfíbio',
    Aquatic: 'Aquático',
    Bird: 'Ave',
    Construct: 'Constructo',
    Demon: 'Demônio',
    Dragon: 'Dragão',
    Elemental: 'Elemental',
    'Extra Dimensional': 'Extra Dimensional',
    Fey: 'Fada',
    Giant: 'Gigante',
    Human: 'Humano',
    Humanoid: 'Humanoide',
    Inkborn: 'Inkborn',
    Lycanthrope: 'Licantropo',
    Magical: 'Mágico',
    Mammal: 'Mamífero',
    Plant: 'Planta',
    Reptile: 'Réptil',
    Slime: 'Slime',
    Undead: 'Morto-vivo',
    Vermin: 'Verme',
  };

  return displayNames[className] || className;
}

function getDifficultyDisplayName(difficulty: string): string {
  const displayNames: Record<string, string> = {
    Challenging: 'Desafiador',
    Easy: 'Fácil',
    Hard: 'Difícil',
    Harmless: 'Inofensivo',
    Medium: 'Médio',
    Trivial: 'Trivial',
  };

  return displayNames[difficulty] || difficulty;
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    Harmless: '#4CAF50',
    Trivial: '#8BC34A',
    Easy: '#CDDC39',
    Medium: '#FFC107',
    Challenging: '#FF9800',
    Hard: '#F44336',
  };

  return colors[difficulty] || '#757575';
}

function getDifficultyStars(difficulty: string): number {
  const stars: Record<string, number> = {
    Harmless: 1,
    Trivial: 2,
    Easy: 3,
    Medium: 4,
    Challenging: 5,
    Hard: 6,
  };

  return stars[difficulty] || 1;
}

function getDifficultyOrder(difficulty: string): number {
  const order: Record<string, number> = {
    Harmless: 1,
    Trivial: 2,
    Easy: 3,
    Medium: 4,
    Challenging: 5,
    Hard: 6,
  };

  return order[difficulty] || 0;
}
