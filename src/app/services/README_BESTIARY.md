# Bestiary Service - Documentação

## Visão Geral

O `BestiaryService` é um serviço Angular que fornece acesso à API de Bestiário de Tibia, permitindo buscar, filtrar e gerenciar informações sobre monstros do jogo.

## Características

- ✅ **TypeScript Completo**: Todas as interfaces e tipos definidos
- ✅ **Angular Signals**: Estado reativo com signals
- ✅ **Tratamento de Erros**: Tratamento robusto de erros da API
- ✅ **Paginação**: Suporte completo à paginação
- ✅ **Filtros Avançados**: Busca por nome, classe e dificuldade
- ✅ **Estatísticas**: Métodos para calcular estatísticas dos monstros
- ✅ **Testes Unitários**: Cobertura completa de testes
- ✅ **Componente de Exemplo**: Interface completa para visualização

## Instalação e Configuração

### 1. Importar o Serviço

```typescript
import { BestiaryService } from './services/bestiary.service';
```

### 2. Injetar no Componente

```typescript
constructor(private bestiaryService: BestiaryService) {}
```

## Uso Básico

### Buscar Todos os Monstros

```typescript
// Buscar primeira página com 20 itens
this.bestiaryService.getMonsters().subscribe({
  next: response => {
    console.log('Monstros:', response.monsters);
    console.log('Paginação:', response.pagination);
  },
  error: error => {
    console.error('Erro:', error.message);
  },
});
```

### Buscar com Paginação

```typescript
// Buscar página 2 com 50 itens
this.bestiaryService
  .getMonsters({
    page: 2,
    limit: 50,
  })
  .subscribe(response => {
    console.log('Monstros da página 2:', response.monsters);
  });
```

### Buscar por Nome

```typescript
// Buscar monstros que contenham "dragon"
this.bestiaryService.searchMonsters('dragon').subscribe(response => {
  console.log('Dragões encontrados:', response.monsters);
});
```

### Filtrar por Classe

```typescript
// Buscar apenas monstros mortos-vivos
this.bestiaryService.getMonstersByClass('undead').subscribe(response => {
  console.log('Mortos-vivos:', response.monsters);
});
```

### Filtrar por Dificuldade

```typescript
// Buscar monstros difíceis
this.bestiaryService.getMonstersByDifficulty('hard').subscribe(response => {
  console.log('Monstros difíceis:', response.monsters);
});
```

### Combinação de Filtros

```typescript
// Buscar dragões difíceis na página 1
this.bestiaryService
  .getMonsters({
    search: 'dragon',
    class: 'dragon',
    difficulty: 'hard',
    page: 1,
    limit: 10,
  })
  .subscribe(response => {
    console.log('Dragões difíceis:', response.monsters);
  });
```

## Métodos Utilitários

### Obter Classes Disponíveis

```typescript
const classes = this.bestiaryService.getAvailableClasses();
console.log('Classes disponíveis:', classes);
// ['animal', 'human', 'undead', 'demon', 'dragon', ...]
```

### Obter Dificuldades Disponíveis

```typescript
const difficulties = this.bestiaryService.getAvailableDifficulties();
console.log('Dificuldades:', difficulties);
// ['trivial', 'easy', 'medium', 'hard', 'extreme']
```

### Nomes de Exibição

```typescript
// Nome de exibição para classe
const displayName = this.bestiaryService.getClassDisplayName('dragon');
console.log(displayName); // 'Dragão'

// Nome de exibição para dificuldade
const difficultyName = this.bestiaryService.getDifficultyDisplayName('hard');
console.log(difficultyName); // 'Difícil'
```

### Cores para Dificuldades

```typescript
// Cor CSS para dificuldade
const color = this.bestiaryService.getDifficultyColor('extreme');
console.log(color); // '#F44336'
```

### Análise de Resistências

```typescript
// Verificar se monstro tem resistências significativas
const hasResistances = this.bestiaryService.hasSignificantResistances(monster);
console.log('Tem resistências:', hasResistances);

// Obter resistência mais alta
const highestResistance = this.bestiaryService.getHighestResistance(monster);
console.log('Maior resistência:', highestResistance);
// { type: 'fire', value: 50 }
```

### Estatísticas dos Monstros

```typescript
// Obter estatísticas gerais
this.bestiaryService.getMonsterStats().subscribe(stats => {
  console.log('Total de monstros:', stats.totalMonsters);
  console.log('Por classe:', stats.byClass);
  console.log('Por dificuldade:', stats.byDifficulty);
  console.log('HP médio:', stats.avgHitpoints);
  console.log('XP médio:', stats.avgExperience);
});
```

### Gerenciamento de Imagens

O serviço inclui funcionalidades para mapear imagens do backend para imagens locais:

````typescript
// Obter URL da imagem (mapeia automaticamente para local se disponível)
const imageUrl = this.bestiaryService.getMonsterImageUrl('/monster-images/532_Rotworm.gif');
console.log(imageUrl); // '/assets/monster-images/532_Rotworm.gif'

// Gerar nome de arquivo baseado no ID e nome do monstro
const fileName = this.bestiaryService.getMonsterImageFileName(532, 'Rotworm');
console.log(fileName); // '532_Rotworm.gif'

// Verificar se uma imagem está disponível localmente
const isAvailable = this.bestiaryService.isImageAvailable('532_Rotworm.gif');
console.log(isAvailable); // true

// Obter estatísticas das imagens disponíveis
const imageStats = this.bestiaryService.getImageStats();
console.log('Total de imagens:', imageStats.total);
console.log('Por extensão:', imageStats.byExtension);
console.log('Por ID do monstro:', imageStats.byMonsterId);

**Mapeamento de Imagens:**
- ✅ **Imagens Locais**: Prioriza imagens em `assets/monster-images/`
- ✅ **Fallback**: Usa URL do backend se imagem local não existir
- ✅ **Mapeamento por ID**: Busca imagens alternativas pelo ID do monstro
- ✅ **URLs Absolutas**: Preserva URLs completas (http/https)
- ✅ **Configuração Centralizada**: Arquivo `bestiary-image-config.ts` para gerenciar imagens
- ✅ **Estatísticas**: Métodos para obter estatísticas das imagens disponíveis
- ✅ **Utilitários**: Classe `ImageMappingUtils` com métodos auxiliares

## Uso com Angular Signals

### Configuração no Componente

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { BestiaryService, Monster, BestiaryResponse } from './services/bestiary.service';

@Component({
  selector: 'app-bestiary',
  standalone: true,
  template: `
    <div *ngIf="loading()">Carregando...</div>
    <div *ngIf="error()">Erro: {{ error() }}</div>
    <div *ngIf="!loading() && !error()">
      <div *ngFor="let monster of monsters()">
        <h3>{{ monster.name }}</h3>
        <p>HP: {{ monster.hitpoints }}</p>
        <p>XP: {{ monster.experience }}</p>
      </div>
    </div>
  `
})
export class BestiaryComponent {
  private bestiaryService = inject(BestiaryService);

  // Signals para estado
  readonly monsters = signal<Monster[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Computed values
  readonly hasMonsters = computed(() => this.monsters().length > 0);
  readonly hasError = computed(() => this.error() !== null);

  ngOnInit() {
    this.loadMonsters();
  }

  private loadMonsters() {
    this.loading.set(true);
    this.error.set(null);

    this.bestiaryService.getMonsters({
      page: this.pagination().currentPage,
      limit: this.pagination().itemsPerPage
    }).subscribe({
      next: (response: BestiaryResponse) => {
        this.monsters.set(response.monsters);
        this.pagination.set(response.pagination);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.loading.set(false);
        this.monsters.set([]);
      }
    });
  }
}
````

## Estrutura de Dados

### Interface Monster

```typescript
interface Monster {
  id: number;
  name: string;
  order: number;
  hitpoints: number;
  experience: number;
  speed: number;
  mitigation: number;
  armor: number;
  difficulty: MonsterDifficulty;
  occurrence: string;
  locations: string[];
  image: string;
  class: MonsterClass;
  resistances: MonsterResistances;
  charm: MonsterCharm;
}
```

### Interface BestiaryResponse

```typescript
interface BestiaryResponse {
  monsters: Monster[];
  pagination: Pagination;
  filters: BestiaryFilters;
}
```

### Tipos de Classe

```typescript
type MonsterClassType =
  | 'animal'
  | 'human'
  | 'undead'
  | 'demon'
  | 'dragon'
  | 'elemental'
  | 'construct'
  | 'plant'
  | 'slime'
  | 'amphibic'
  | 'aquatic'
  | 'bird'
  | 'bug'
  | 'fey'
  | 'goblinoid'
  | 'humanoid'
  | 'magical'
  | 'mammal'
  | 'reptile'
  | 'vermin';
```

### Tipos de Dificuldade

```typescript
type MonsterDifficulty = 'trivial' | 'easy' | 'medium' | 'hard' | 'extreme';
```

## Tratamento de Erros

O serviço trata automaticamente os seguintes tipos de erro:

- **400**: Parâmetros inválidos na requisição
- **429**: Limite de requisições excedido
- **500**: Erro interno do servidor
- **Erros de rede**: Erro inesperado

```typescript
this.bestiaryService.getMonsters().subscribe({
  next: response => {
    // Sucesso
  },
  error: error => {
    console.error('Mensagem de erro:', error.message);
    // Exibir mensagem amigável para o usuário
  },
});
```

## Limitações da API

- **Máximo de itens por página**: 100
- **Rate limit**: 100 requests por minuto
- **Tamanho da resposta**: Limitado a 12MB

## Exemplo Completo de Componente

Veja o arquivo `bestiary.component.ts` para um exemplo completo de implementação com:

- ✅ Filtros avançados
- ✅ Paginação
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Interface responsiva
- ✅ Otimizações de performance

## Testes

Execute os testes unitários:

```bash
ng test --include="**/bestiary.service.spec.ts"
ng test --include="**/bestiary.component.spec.ts"
```

## Contribuição

Para adicionar novas funcionalidades:

1. Atualize as interfaces em `bestiary.service.ts`
2. Implemente os métodos no serviço
3. Adicione testes unitários
4. Atualize a documentação
5. Teste com o componente de exemplo

## Changelog

### v1.0.0

- ✅ Implementação inicial do serviço
- ✅ Suporte completo à API de Bestiário
- ✅ Componente de exemplo com interface completa
- ✅ Testes unitários abrangentes
- ✅ Documentação completa
