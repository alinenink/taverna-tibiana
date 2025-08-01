import bestiaryData from '../src/bestiarios.json';

export interface Monster {
  id: number;
  name: string;
  order: number;
  hitpoints: number;
  experience: number;
  speed: number;
  mitigation: string;
  armor: number;
  difficulty: string;
  occurrence: string;
  locations: string;
  image: string;
  class: {
    id: number;
    name: string;
    image: string;
  };
  resistances: Array<{
    type: string;
    value: number;
  }>;
  charm_details: {
    first_stage: number;
    second_stage: number;
    third_stage: number;
    charm_points: number;
  };
}

export interface BestiaryData {
  data: Monster[];
}

export function loadBestiaryData(): BestiaryData {
  return bestiaryData as BestiaryData;
}
