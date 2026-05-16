# BenCorp Backend Case

Projeto de exemplo para o case técnico BenCorp, com função para salvar clínicas próximas e conversão de data/hora.

## Descrição

O principal arquivo é `src/saveNearClinics.js`.
Ele recebe:
- `clinics`: lista de clínicas
- `localization`: coordenadas de referência
- `dataAmericana`: string de data no formato ISO (`YYYY-MM-DD`)

A função retorna um objeto com:
- `clinicasA10Km`
- `clinicasA30Km`
- `clinicasA50Km`
- `dataFormatada`
- `dataPorExtenso`

A conversão de data usa `Intl.DateTimeFormat` com `timeZone: 'America/Sao_Paulo'` para garantir consistência do fuso horário.

## Scripts

No `package.json` existem os scripts:

- `npm start` - executa `src/saveNearClinics.js`
- `npm test` - executa `test-saveNearClinics.js`

## Como usar

1. Instale dependências (se necessário):

```powershell
npm install
```

2. Execute o teste:

```powershell
npm test
```

3. Execute o projeto diretamente:

```powershell
npm start
```

## Teste

O arquivo de teste `test-saveNearClinics.js` importa `src/saveNearClinics.js` e exibe o resultado de uma chamada de exemplo com data `2026-05-16`.

## Estrutura do projeto

- `package.json` - configuração do npm e scripts
- `src/saveNearClinics.js` - implementação principal
- `test-saveNearClinics.js` - teste simples de console
- `README.md` - documentação do projeto
