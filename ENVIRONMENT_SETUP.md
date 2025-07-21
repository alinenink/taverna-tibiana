# Configuração de Environments

Este projeto possui configurações separadas para desenvolvimento local e produção.

## Arquivos de Environment

### `src/app/environments/environment.ts` (Desenvolvimento Local)
- **apiUrl**: `http://localhost:3001/api`
- **production**: `false`
- **analyticsEnabled**: `false`
- **debugMode**: `true`
- **version**: `1.0.0-dev`

### `src/app/environments/environment.prod.ts` (Produção)
- **apiUrl**: `https://taverna-backend-vc-rrk3.vercel.app/api`
- **production**: `true`
- **analyticsEnabled**: `true`
- **debugMode**: `false`
- **version**: `1.0.0`

## Como Funciona

O Angular CLI automaticamente substitui o arquivo `environment.ts` pelo `environment.prod.ts` durante o build de produção através da configuração `fileReplacements` no `angular.json`.

## Comandos

### Desenvolvimento Local
```bash
ng serve
# ou
ng serve --configuration=development
```

### Build de Produção
```bash
ng build
# ou
ng build --configuration=production
```

### Deploy
```bash
ng deploy
# Este comando usa automaticamente a configuração de produção
```

## Variáveis Disponíveis

- `environment.apiUrl`: URL base da API
- `environment.production`: Indica se está em produção
- `environment.analyticsEnabled`: Habilita/desabilita analytics
- `environment.debugMode`: Habilita/desabilita modo debug
- `environment.version`: Versão da aplicação

## Importação

Em qualquer serviço ou componente, importe assim:
```typescript
import { environment } from '../environments/environments';
``` 