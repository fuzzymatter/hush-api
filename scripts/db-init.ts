import { createConnection } from 'typeorm';
import { ConfigService } from '../src/config/config.service';

async function main() {
  const config = new ConfigService('.env');
  const connection = await createConnection({
    type: config.env.TYPEORM_CONNECTION,
    host: config.env.TYPEORM_HOST,
    port: config.env.TYPEORM_PORT,
    username: config.env.TYPEORM_USERNAME,
    password: config.env.TYPEORM_PASSWORD,
    database: config.env.TYPEORM_DATABASE,
    synchronize: config.env.TYPEORM_SYNCHRONIZE,
  });

  const dbs: { datname: string }[] = await connection.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname IN ('hush', 'hush_test')`,
  );

  if (dbs.length === 2) {
    console.log('"hush" and "hush_test" databases already exist.'); // tslint:disable-line
  }

  const hush = dbs.find(db => db.datname === 'hush');
  if (hush == null) {
    await connection.query('CREATE DATABASE hush');
    console.log('Created "hush" database.'); // tslint:disable-line
  }

  const hushTest = dbs.find(db => db.datname === 'hush_test');
  if (hushTest == null) {
    await connection.query('CREATE DATABASE hush_test');
    console.log('Created "hush_test" database.'); // tslint:disable-line
  }

  await connection.close();
}

main();
