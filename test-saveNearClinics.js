const saveNearClinics = require('./src/saveNearClinics');

const result = saveNearClinics([], null, '2026-05-16');
console.log('Teste saveNearClinics com data 2026-05-16:');
console.log(JSON.stringify(result, null, 2));
