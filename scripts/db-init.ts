import { createConnection } from 'typeorm';

async function main() {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: true,
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
