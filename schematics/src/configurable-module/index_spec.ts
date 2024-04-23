import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('configurable-module', () => {
  it('works', async () => {
    const runner = new SchematicTestRunner(
      'configurable-module',
      collectionPath,
    );
    const tree = await runner.runSchematic(
      'configurable-module',
      {},
      Tree.empty(),
    );

    expect(tree.files).toEqual([]);
  });
});
