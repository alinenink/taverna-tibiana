const fs = require('fs');
const XLSX = require('xlsx');

// Caminho para o arquivo JSON (achiv.txt)
const filePath = './achiv.txt';

// Lê o conteúdo do arquivo
const rawData = fs.readFileSync(filePath, 'utf8');

// Faz o parse do JSON
const data = JSON.parse(rawData);

// Pega apenas as conquistas ausentes
const missingAchievements = data.missing;

// Converte para planilha
const worksheet = XLSX.utils.json_to_sheet(missingAchievements);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Conquistas');

// Salva como arquivo Excel
const outputFile = 'conquistas_charlover.xlsx';
XLSX.writeFile(workbook, outputFile);
