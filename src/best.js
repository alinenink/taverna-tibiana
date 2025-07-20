const fs = require('fs');
const xlsx = require('xlsx');

// Carrega o arquivo JSON
const rawData = fs.readFileSync('./likkabest.json', 'utf-8');
const monsters = JSON.parse(rawData);

// Extrai os dados desejados
const dataToExport = monsters.map(monstro => ({
  name: monstro.name,
  difficulty: monstro.difficulty,
  third_stage: monstro.charm_details?.third_stage ?? null,
  charm_point: monstro.charm_details?.charm_points ?? null
}));

// Cria a planilha
const worksheet = xlsx.utils.json_to_sheet(dataToExport);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Monstros');

// Salva o arquivo Excel
const outputFileName = 'monstros.xlsx';
xlsx.writeFile(workbook, outputFileName);
