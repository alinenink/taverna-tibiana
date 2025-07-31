# 🛠️ Ferramentas de Desenvolvimento

Este projeto está configurado com ferramentas de qualidade de código para garantir padrões consistentes e boas práticas.

## 📋 Ferramentas Configuradas

### 1. **ESLint** - Linter de Código

- **Configuração**: `.eslintrc.json`
- **Comando**: `npm run lint`
- **Correção automática**: `npm run lint:fix`

**Regras principais**:

- `no-console`: Avisa sobre uso de console.log (warn)
- `no-unused-vars`: Avisa sobre variáveis não utilizadas (warn)
- `prefer-const`: Força uso de const quando possível
- `no-var`: Proíbe uso de var
- `object-shorthand`: Força shorthand de objetos
- `prefer-template`: Força uso de template literals

### 2. **Prettier** - Formatador de Código

- **Configuração**: `.prettierrc`
- **Comando**: `npm run format`
- **Verificação**: `npm run format:check`

**Configurações**:

- Tab width: 2 espaços
- Single quotes: true
- Semicolons: true
- Trailing comma: es5
- Print width: 100 caracteres

### 3. **Husky + lint-staged** - Git Hooks

- **Configuração**: `.husky/pre-commit` e `.lintstagedrc.json`
- **Funcionalidade**: Executa lint e format automaticamente antes de cada commit

## 🚀 Comandos Disponíveis

```bash
# Linting
npm run lint          # Verifica problemas no código
npm run lint:fix      # Corrige problemas automaticamente

# Formatação
npm run format        # Formata todos os arquivos
npm run format:check  # Verifica se arquivos estão formatados

# Build e Deploy
npm run build         # Build de produção
npm run start         # Servidor de desenvolvimento
npm run test          # Executa testes
```

## 📁 Arquivos de Configuração

- `.eslintrc.json` - Configuração do ESLint
- `.prettierrc` - Configuração do Prettier
- `.prettierignore` - Arquivos ignorados pelo Prettier
- `.lintstagedrc.json` - Configuração do lint-staged
- `.husky/pre-commit` - Hook do Git para pré-commit

## 🔧 Workflow Recomendado

1. **Desenvolvimento**:

   ```bash
   npm run start
   ```

2. **Antes de commitar**:

   ```bash
   npm run lint:fix
   npm run format
   ```

3. **Verificação completa**:
   ```bash
   npm run lint
   npm run format:check
   npm run build
   ```

## ⚠️ Notas Importantes

- **Console.log**: O ESLint avisa sobre uso de console.log. Remova antes de commitar.
- **Variáveis não utilizadas**: O ESLint avisa sobre imports/variáveis não utilizadas.
- **Formatação**: O Prettier formata automaticamente o código. Sempre execute antes de commitar.
- **Git Hooks**: O Husky executa automaticamente lint e format antes de cada commit.

## 🎯 Padrões do Projeto

### Angular 18+ Standards

- ✅ Componentes standalone
- ✅ Angular Signals para estado reativo
- ✅ ChangeDetectionStrategy.OnPush
- ✅ Arquivos separados (TS, HTML, SCSS)
- ✅ styleUrl (não styleUrls)

### TypeScript

- ✅ Strict mode habilitado
- ✅ Nomenclatura kebab-case para arquivos
- ✅ Imports organizados

### Estrutura

- ✅ Serviços em `services/`
- ✅ Componentes em `components/`
- ✅ Modelos em `models/`
- ✅ Guards em `guards/`

## 🐛 Solução de Problemas

### ESLint não funciona

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Prettier não funciona

```bash
npm install --save-dev prettier
```

### Husky não funciona

```bash
npm run prepare
```

### Build falha por tamanho de arquivo

- Ajuste os budgets no `angular.json`
- Considere dividir componentes grandes
- Otimize imports desnecessários
