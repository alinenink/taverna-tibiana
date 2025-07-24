import { environment } from '../environments/environments';

/**
 * Configuração das imagens de monstros disponíveis localmente
 * Este arquivo centraliza a lista de imagens em assets/monster-images/
 */

export const AVAILABLE_MONSTER_IMAGES = [
  // Monstros da API (primeiros resultados)
  '1_Toad.gif',
  '2_Green_Frog.gif',
  '3_Azure_Frog.gif',
  '4_Coral_Frog.gif',
  '5_Crimson_Frog.gif',
  '6_Orchid_Frog.gif',
  '7_Infernal_Frog.gif',
  '8_Bog_Frog.gif',
  '9_Salamander.gif',
  '10_Crab.gif',
  '11_Quara_Predator.gif',
  '12_Quara_Predator_Scout.gif',
  '13_Quara_Constrictor.gif',
  '14_Quara_Constrictor_Scout.gif',
  '15_Quara_Mantassin.gif',
  '16_Quara_Mantassin_Scout.gif',
  '17_Quara_Hydromancer.gif',
  '18_Quara_Hydromancer_Scout.gif',
  '25_Filth_Toad.gif',
  '679_Makara.gif',

  // Monstros Deepling
  '37_Deepling_Master_Librarian.gif',
  '38_Deepling_Tyrant.gif',
  '39_Deepling_Elite.gif',
  '40_Deepling_Guard.gif',
  '41_Deepling_Scout.gif',
  '42_Deepling_Spellsinger.gif',
  '43_Deepling_Warrior.gif',
  '44_Deepling_Outcast.gif',
  '45_Deepling_Brawler.gif',
  '46_Deepling_Elite_Guard.gif',
  '47_Deepling_Elite_Scout.gif',
  '48_Deepling_Elite_Spellsinger.gif',
  '49_Deepling_Elite_Warrior.gif',
  '50_Deepling_Elite_Outcast.gif',
  '51_Deepling_Elite_Brawler.gif',
  '52_Deepling_Elite_Master_Librarian.gif',
  '53_Deepling_Elite_Tyrant.gif',

  // Outros monstros comuns
  '19_Rat.gif',
  '20_Cave_Rat.gif',
  '21_Giant_Rat.gif',
  '22_Rat_Guard.gif',
  '23_Rat_Soldier.gif',
  '24_Rat_Scout.gif',
  '26_Rat_Archer.gif',
  '27_Rat_Assassin.gif',
  '28_Rat_Champion.gif',
  '29_Rat_Guardian.gif',
  '30_Rat_Hunter.gif',
  '31_Rat_Knight.gif',
  '32_Rat_Mage.gif',
  '33_Rat_Priest.gif',
  '34_Rat_Scout.gif',
  '35_Rat_Soldier.gif',
  '36_Rat_Thief.gif',

  // Monstros básicos
  '532_Rotworm.gif',
  '533_Spider.gif',
  '534_Poison_Spider.gif',
  '535_Giant_Spider.gif',
  '536_Scorpion.gif',
  '537_Wasp.gif',
  '538_Bug.gif',
  '539_Ancient_Scarab.gif',
  '540_Larva.gif',
  '541_Scarab.gif',
  '542_Centipede.gif',
  '544_Tarantula.gif',
  '547_Carrion_Worm.gif',
  '548_Insect_Swarm.gif',
  '549_Terramite.gif',
  '550_Wailing_Widow.gif',
  '551_Lancer_Beetle.gif',
  '552_Sandcrawler.gif',
  '553_Brimstone_Bug.gif',
  '554_Berrypest.gif',
  '555_Sacred_Spider.gif',
  '556_Slug.gif',
  '557_Insectoid_Scout.gif',
  '558_Ladybug.gif',
  '559_Crawler.gif',
  '560_Spidris.gif',
  '561_Kollos.gif',
  '562_Swarmer.gif',
  '563_Spitter.gif',
  '564_Waspoid.gif',
  '565_Insectoid_Worker.gif',
  '566_Spidris_Elite.gif',
  '567_Hive_Overseer.gif',
  '568_Drillworm.gif',
  '569_Wiggler.gif',
  '570_Emerald_Damselfly.gif',
  '571_Deepworm.gif',
  '572_Diremaw.gif',
  '573_Cave_Devourer.gif',
  '574_Tunnel_Tyrant.gif',
  '575_Chasm_Spawn.gif',
  '583_Hibernal_Moth.gif',
  '584_Lacewing_Moth.gif',
  '650_Exotic_Cave_Spider.gif',
  '669_Lavaworm.gif',
  '670_Streaked_Devourer.gif',
  '671_Tremendous_Tyrant.gif',
  '672_Varnished_Diremaw.gif',
  '664_Eyeless_Devourer.gif',
  '659_Blemished_Spawn.gif',
  '657_Afflicted_Strider.gif',
  '662_Cave_Chimera.gif',
  '695_Sulphider.gif',
  '696_Undertaker.gif',
  '730_Mycobiontic_Beetle.gif',
  '764_Wafer_Paper_Butterfly.gif',
  '786_Gloom_Maw.gif',
  '793_Orclops_Bloodbreaker.gif',

  // Livros e criaturas mágicas
  '87_Biting_Book.gif',
  '366_Brain_Squid.gif',
  '367_Flying_Book.gif',
  '368_Cursed_Book.gif',
  '369_Guardian_of_Tales.gif',
  '370_Burning_Book.gif',
  '371_Icecold_Book.gif',
  '372_Energetic_Book.gif',
  '373_Energuardian_of_Tales.gif',
  '374_Rage_Squid.gif',
  '375_Squid_Warden.gif',
  '376_Animated_Feather.gif',
  '481_Ink_Blob.gif',

  // Cavalos
  '421_Horse_Gray.gif',
  '422_Horse_Brown.gif',
  '423_Horse_Taupe.gif',

  // Nômades
  '232_Nomad_Blue.gif',
  '233_Nomad_Female.gif',

  // Monstros especiais
  '305_Moohtah_Warrior.gif',
  '589_SoulBroken_Harbinger.gif',
  '642_Distorted_Phantom.gif',
  '646_Druids_Apparition.gif',
  '647_Knights_Apparition.gif',
  '648_Paladins_Apparition.gif',
  '649_Sorcerers_Apparition.gif',
  '678_Shrieking_CryStal.gif',
  '689_TwoHeaded_Turtle.gif',
  '775_Monks_Apparition.gif',

  // Maggots
  '729_Bloated_ManMaggot.gif',
  '731_Rotten_ManMaggot.gif',

  // Borboletas
  '543_Butterfly_Purple.gif',
  '545_Butterfly_Blue.gif',
  '546_Butterfly_Red.gif',

  // Wyrmlings e criaturas voadoras
  '782_Bramble_Wyrmling.gif',
  '783_Cinder_Wyrmling.gif',
  '784_Crusader.gif',
  '787_Hawk_Hopper.gif',
  '788_Headwalker.gif',
  '789_Ink_Splash.gif',
  '790_Lion_Hydra.gif',
  '794_Shell_Drake.gif',

  // Outros
  '780_Bluebeak.gif'
] as const;

/**
 * Interface para configuração de mapeamento de imagens
 */
export interface ImageMappingConfig {
  /** Lista de imagens disponíveis localmente */
  availableImages: readonly string[];
  /** Caminho base para imagens locais */
  localBasePath: string;
  /** Caminho base para imagens do backend */
  backendBasePath: string;
  /** Extensões de arquivo suportadas */
  supportedExtensions: string[];
}

/**
 * Obtém a URL base do backend para imagens
 */
function getBackendBaseUrl(): string {
  return environment.apiUrl.replace('/api', '');
}

/**
 * Configuração padrão para mapeamento de imagens
 */
export const IMAGE_MAPPING_CONFIG: ImageMappingConfig = {
  availableImages: AVAILABLE_MONSTER_IMAGES,
  localBasePath: '/assets/monster-images/',
  backendBasePath: `${getBackendBaseUrl()}/monster-images/`,
  supportedExtensions: ['.gif', '.png', '.jpg', '.jpeg', '.webp']
};

/**
 * Utilitários para gerenciamento de imagens
 */
export class ImageMappingUtils {
  /**
   * Verifica se uma imagem está disponível localmente
   */
  static isImageAvailable(fileName: string): boolean {
    return AVAILABLE_MONSTER_IMAGES.includes(fileName as any);
  }

  /**
   * Obtém o caminho local para uma imagem
   */
  static getLocalPath(fileName: string): string {
    return `${IMAGE_MAPPING_CONFIG.localBasePath}${fileName}`;
  }

  /**
   * Obtém o caminho do backend para uma imagem
   */
  static getBackendPath(fileName: string): string {
    return `${IMAGE_MAPPING_CONFIG.backendBasePath}${fileName}`;
  }

  /**
   * Extrai o ID do monstro do nome do arquivo
   */
  static extractMonsterId(fileName: string): number | null {
    const match = fileName.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Encontra imagens alternativas pelo ID do monstro
   */
  static findAlternativeImages(monsterId: number): string[] {
    return AVAILABLE_MONSTER_IMAGES.filter(img => 
      img.startsWith(`${monsterId}_`)
    );
  }

  /**
   * Gera estatísticas das imagens disponíveis
   */
  static getImageStats(): {
    total: number;
    byExtension: Record<string, number>;
    byMonsterId: Record<number, number>;
  } {
    const stats = {
      total: AVAILABLE_MONSTER_IMAGES.length,
      byExtension: {} as Record<string, number>,
      byMonsterId: {} as Record<number, number>
    };

    AVAILABLE_MONSTER_IMAGES.forEach(fileName => {
      // Contar por extensão
      const extension = fileName.split('.').pop() || '';
      stats.byExtension[extension] = (stats.byExtension[extension] || 0) + 1;

      // Contar por ID do monstro
      const monsterId = this.extractMonsterId(fileName);
      if (monsterId) {
        stats.byMonsterId[monsterId] = (stats.byMonsterId[monsterId] || 0) + 1;
      }
    });

    return stats;
  }
} 