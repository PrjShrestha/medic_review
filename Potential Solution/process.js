const { argv } = require('yargs');
const csv = require('fast-csv');
const fs = require('fs');
const path = require('path');
const { isEmpty } = require('lodash');

const execute = () => {  
  const files = getArgs();  
  //Added for testing purpose
  files.input = 'w:/Medic/App Developer Potential Solution/Potential Solution/users.csv';
  console.log(`processing ${files.input}...`);

  processFile(files.input, files.output);
}
// Hoist it here so that users can see how to use the app in case of error
// const doc = `
//   Usage:
//     node process-file.js --filename=<input_file>.csv --output=<output_file>.csv

//   Args:
//       --filename                      The file to be processed
//       --output                        The file in which to save the output. Defaults to output.csv if not specified
//   `;
// console.log(doc);

const getArgs = () => {
  const usage = () => {
    const doc = `
      Usage:
        node process-file.js --filename=<input_file>.csv --output=<output_file>.csv
  
      Args:
         --filename                      The file to be processed
         --output                        The file in which to save the output. Defaults to output.csv if not specified
      `;
    console.log(doc);
  }
  
  if (typeof require !== 'undefined' && require.main === module) {
    if (!argv.filename) {
      usage();
      throw Error('Missing required parameter "filename"');
    }
  }
  const files = {
    input: argv.filename,
    output: path.resolve(__dirname, argv.output || 'output.csv'),
  }

  return files;
}

const processFile = (inputFile, outputFile) => {

  if (typeof inputFile !== 'string') {
    throw Error('You have entered incorrect value "filename"');
  }
  const debtList = [];
  csv.parseFile(inputFile, { headers: ['debtor', 'creditor', 'debit'], ignoreEmpty: true, strictColumnHandling: true })
    .validate(
      (row, cb) => {
        if (isEmpty(row.debtor)) {
          return cb(null, false, 'Missing value: debtor');
        }
        if (isEmpty(row.creditor)) {
          return cb(null, false, 'Missing value: creditor');
        }
        if (isNaN(row.debit)) {
          return cb(null, false, 'Invalid debit value');
        }
        return cb(null, true);
      })
    .on('data-invalid', (row, rowNumber, reason) => { throw Error(`${reason} [row: ${rowNumber}] [row=${JSON.stringify(row)}]`) })
    .on('data', data => {
      data = {
        debtor: data.debtor,
        creditor: data.creditor,
        debit: Number(data.debit),
      }

      const debtListItem = debtList.find(item => `${item.debtor}-${item.creditor}` === `${data.debtor}-${data.creditor}`);
      if (!debtListItem) {
        debtList.push(data);
      } else {
        debtListItem.debit += data.debit;
      }     
    })
    .on('end', () => {
      debtList.sort(function (a, b) {
        if (a.debtor != b.debtor) {
          return a.debtor.localeCompare(b.debtor); 
        }
        return a.creditor.localeCompare(b.creditor);
      });

      const outputStream = fs.createWriteStream(outputFile);
      console.log(`Writing to ${outputFile}...`);
      csv
        .write(debtList)
        .pipe(outputStream);
    });

  console.log('Complete');
  console.log(path.resolve(__dirname, 'test', 'testFiles'));
}

module.exports = {
  execute,
  processFile
}


function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
