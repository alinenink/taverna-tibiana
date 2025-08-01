import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { loadBestiaryData, Monster, BestiaryData } from '../lib/bestiary-data';

// Configurar CORS
const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true,
});

// Cache para o JSON parseado
let bestiaryCache: BestiaryData | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Função para carregar o JSON com cache
function loadBestiaryDataWithCache(): BestiaryData | null {
  const now = Date.now();

  if (bestiaryCache && now - lastCacheTime < CACHE_DURATION) {
    console.log('📦 Retornando dados do cache');
    return bestiaryCache;
  }

  try {
    console.log('🔄 Carregando dados do bestiary...');
    bestiaryCache = loadBestiaryData();
    lastCacheTime = now;
    return bestiaryCache;
  } catch (error) {
    console.error('Erro ao carregar bestiary data:', error);
    return null;
  }
}

// Função para filtrar dados básicos
function filterData(
  data: Monster[],
  search?: string,
  classFilter?: string,
  difficultyFilter?: string
): Monster[] {
  let filtered = data;

  if (search) {
    const searchTerm = search.toLowerCase();
    filtered = filtered.filter(
      monster =>
        monster.name.toLowerCase().includes(searchTerm) ||
        monster.class.name.toLowerCase().includes(searchTerm)
    );
  }

  if (classFilter) {
    const classFilterLower = classFilter.toLowerCase();
    filtered = filtered.filter(monster => monster.class.name.toLowerCase() === classFilterLower);
  }

  if (difficultyFilter) {
    filtered = filtered.filter(monster => monster.difficulty === difficultyFilter);
  }

  return filtered;
}

// Função para obter dados do usuário (simulada - você precisará implementar)
async function getUserBestiary(userId: string): Promise<any> {
  // TODO: Implementar busca real do bestiary do usuário
  // Por enquanto, retorna null
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Aplicar CORS
  await new Promise(resolve => corsMiddleware(req, res, resolve));

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      message: 'Apenas requisições GET são permitidas',
    });
  }

  try {
    // Verificar se há token de autorização (opcional)
    const authHeader = req.headers['authorization'];
    let user_id: string | null = null;
    let userBestiary: any = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
        const decoded = jwt.verify(token, JWT_SECRET) as { user_id: string };
        user_id = decoded.user_id;

        // Se JWT válido (não visitante), buscar bestiary do usuário
        if (user_id && user_id !== 'e08352fe-b033-4858-a7f6-8a86766d9b3a') {
          const existingUserBestiary = await getUserBestiary(user_id);
          if (existingUserBestiary) {
            userBestiary = existingUserBestiary;
          }
        }
      } catch (err) {
        console.log('Token inválido para /api/bestiary-all, continuando sem autenticação');
      }
    }

    // Carregar dados
    const bestiaryData = loadBestiaryDataWithCache();
    if (!bestiaryData) {
      return res.status(500).json({
        success: false,
        error: 'Failed to load bestiary data',
        message: 'Erro ao carregar dados do bestiary',
      });
    }

    // Aplicar filtros básicos se fornecidos
    const { search, class: classFilter, difficulty: difficultyFilter } = req.query;
    const filteredData = filterData(
      bestiaryData.data,
      search as string,
      classFilter as string,
      difficultyFilter as string
    );

    // Processar dados para extrair apenas o nome do arquivo da imagem
    const processedData = filteredData.map(monster => ({
      ...monster,
      image: monster.image ? path.basename(monster.image) : null,
    }));

    // Adicionar informações do usuário se autenticado
    let userInfo = null;
    if (userBestiary && user_id) {
      const selectedMonsterIds = new Set(
        userBestiary.monstros_selecionados
          ?.filter((m: any) => m.is_selected)
          ?.map((m: any) => m.id) || []
      );

      const completedMonsterIds = new Set(
        userBestiary.monstros_selecionados
          ?.filter((m: any) => m.completed === true)
          ?.map((m: any) => m.id) || []
      );

      // Adicionar flags de status do usuário
      processedData.forEach(monster => {
        (monster as any).user_selected = selectedMonsterIds.has(monster.id);
        (monster as any).user_completed = completedMonsterIds.has(monster.id);
      });

      userInfo = {
        user_id,
        total_selected: selectedMonsterIds.size,
        total_completed: completedMonsterIds.size,
      };
    }

    // Preparar resposta
    const response = {
      success: true,
      data: processedData,
      meta: {
        total_monsters: processedData.length,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        authenticated: !!user_id,
        user_info: userInfo,
        filters_applied: {
          search: search || null,
          class: classFilter || null,
          difficulty: difficultyFilter || null,
        },
      },
    };

    // Resposta otimizada
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache por 5 minutos

    return res.status(200).json(response);
  } catch (error) {
    console.error('Erro no endpoint bestiary-all:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  }
}
