const { doesNotReject } = require('assert');
const { expect, assert } = require('chai');
const fs = require('fs');
const path = require('path');
const rewire = require('rewire');
let processFile;

// specify directory paths to use
const filesDir = path.resolve(__dirname, 'testFiles');

describe('Process File', function () {

  beforeEach(async () => {
    processFile = rewire('../process');
    
  });

  afterEach(async () => {
    
  });

  it(`should throw error if input file is not specified`, async function () {


    await processFile.execute();


  });

  it(`should throw error if input file is missing`, async function () {

  });

  it(`should indicate to user if file is empty`, async function () {

  });

  it(`should throw error if debtor's value is empty ${filesDir}/output.csv`, async function () {

    try {
      await processFile.processFile(`${filesDir}/invalid_debtor.csv`, '../test/output.csv');
      assert.fail('should throw an error when a row is missing the debtor value');
    } catch (err) {
      expect(err.message).to.be.include('Missing value: debtor');
    }
  });

  it(`should throw error if creditor's value is empty`, async function () {

    try {
      await processFile.processFile(`${filesDir}/invalid_creditor.csv`, '../test/output.csv');
      assert.fail('should throw an error when a row is missing the creditor value');
    } catch (err) {
      expect(err.message).to.be.include('Missing value: creditor');
    }
  });

  it(`should throw error if debt value is not a number`, async function () {
    try {
      await processFile.processFile(`${filesDir}/invalid_debt_value.csv`, '../test/output.csv');
      assert.fail('should throw an error when a row is has an invalid debt value');
    } catch (err) {
      expect(err.message).to.be.include('Invalid debit value');
    }

  });


  it(`should fail when input file has less columns`, async function () {
  });
 
});