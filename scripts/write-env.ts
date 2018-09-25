// Read process.env.* for env variables and write to .env
// Used as a pre-test step on CI

import fs from 'fs';
import path from 'path';

const isCi = Boolean(process.env.CI);
if (isCi === false) {
  // tslint:disable-next-line
  console.error('This is only meant to run in CI');
  process.exit(0);
}

const content = `
TYPEORM_CONNECTION=${process.env.TYPEORM_CONNECTION}
TYPEORM_HOST=${process.env.TYPEORM_HOST}
TYPEORM_PORT=${process.env.TYPEORM_PORT}
TYPEORM_USERNAME=${process.env.TYPEORM_USERNAME}
TYPEORM_PASSWORD=${process.env.TYPEORM_PASSWORD}
TYPEORM_DATABASE=${process.env.TYPEORM_DATABASE}
TYPEORM_SYNCHRONIZE=${process.env.TYPEORM_SYNCHRONIZE}
`;

fs.writeFileSync(path.resolve(__dirname, '../', '.env'), content);
