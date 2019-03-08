const clientGen = require('./');
const fs = require('fs');
const fsx = require('fs-extra');
const path = require('path');
const examples = require('@open-rpc/examples');

const { promisify } = require('util');
const stat = promisify(fs.stat);
const rmdir = promisify(fs.rmdir);


describe(`Examples to generate Js clients}`, async () => {
  const testDir = `${process.cwd()}/test`;

  beforeAll(async () => {
    await fsx.emptyDir(testDir);
    return await rmdir(testDir);
  });

  afterAll(async () => {
    await fsx.emptyDir(testDir);
    return await rmdir(testDir);
  });

  Object.values(examples).forEach((example) => {
    it(`creates a new client for example: ${example.info.title}`, async () => {
      expect.assertions(1);

      await clientGen({
        clientName: 'test',
        schema: example
      });

      await expect(stat(`${process.cwd()}/test`)).resolves.toBeTruthy();
    }, 30000);

    it(`the generated lib can be imported ${example.info.title}`, () => {
      const generated = require(`${testDir}/dist/test.js`).default;
      expect(typeof generated).toBe('function');

      const instance = new generated({ transport: { type: 'http' } });

      expect(instance).toBeInstanceOf(generated);
    });
  });
});