export interface MonsterClass {
  id: number;
  name: string;
  displayName: string;
  image?: string;
}

export interface MonsterDifficulty {
  value: string;
  displayName: string;
  color: string;
  stars: number;
}

export const MONSTER_CLASSES: MonsterClass[] = [
  { id: 1, name: 'Amphibic', displayName: 'Anfíbio' },
  { id: 2, name: 'Aquatic', displayName: 'Aquático' },
  { id: 3, name: 'Bird', displayName: 'Ave' },
  { id: 4, name: 'Construct', displayName: 'Constructo' },
  { id: 5, name: 'Demon', displayName: 'Demônio' },
  { id: 6, name: 'Dragon', displayName: 'Dragão' },
  { id: 7, name: 'Elemental', displayName: 'Elemental' },
  { id: 8, name: 'Extra Dimensional', displayName: 'Extra Dimensional' },
  { id: 9, name: 'Fey', displayName: 'Fada' },
  { id: 10, name: 'Giant', displayName: 'Gigante' },
  { id: 11, name: 'Human', displayName: 'Humano' },
  { id: 12, name: 'Humanoid', displayName: 'Humanoide' },
  { id: 13, name: 'Inkborn', displayName: 'Inkborn' },
  { id: 14, name: 'Lycanthrope', displayName: 'Licantropo' },
  { id: 15, name: 'Magical', displayName: 'Mágico' },
  { id: 16, name: 'Mammal', displayName: 'Mamífero' },
  { id: 17, name: 'Plant', displayName: 'Planta' },
  { id: 18, name: 'Reptile', displayName: 'Réptil' },
  { id: 19, name: 'Slime', displayName: 'Lodo' },
  { id: 20, name: 'Undead', displayName: 'Morto-Vivo' },
  { id: 21, name: 'Vermin', displayName: 'Vermin' },
];

export const MONSTER_DIFFICULTIES: MonsterDifficulty[] = [
  { value: 'Harmless', displayName: 'Inofensivo', color: '#4CAF50', stars: 1 },
  { value: 'Trivial', displayName: 'Trivial', color: '#8BC34A', stars: 2 },
  { value: 'Easy', displayName: 'Fácil', color: '#CDDC39', stars: 3 },
  { value: 'Medium', displayName: 'Médio', color: '#FFC107', stars: 4 },
  { value: 'Hard', displayName: 'Difícil', color: '#FF9800', stars: 5 },
  { value: 'Challenging', displayName: 'Desafiador', color: '#F44336', stars: 6 },
];

export function getClassDisplayName(className: string): string {
  const monsterClass = MONSTER_CLASSES.find(c => c.name === className);
  return monsterClass ? monsterClass.displayName : className;
}

export function getDifficultyDisplayName(difficulty: string): string {
  const monsterDifficulty = MONSTER_DIFFICULTIES.find(d => d.value === difficulty);
  return monsterDifficulty ? monsterDifficulty.displayName : difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const monsterDifficulty = MONSTER_DIFFICULTIES.find(d => d.value === difficulty);
  return monsterDifficulty ? monsterDifficulty.color : '#8b6f3d';
}

export function getDifficultyStars(difficulty: string): number {
  const monsterDifficulty = MONSTER_DIFFICULTIES.find(d => d.value === difficulty);
  return monsterDifficulty ? monsterDifficulty.stars : 1;
}

export function getAvailableClasses(): string[] {
  return MONSTER_CLASSES.map(c => c.name);
}

export function getAvailableDifficulties(): string[] {
  return MONSTER_DIFFICULTIES.map(d => d.value);
}
