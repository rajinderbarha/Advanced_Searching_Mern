const fs = require('fs')
const csc = require('csv-parser');
const results = [];

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results);
    });

