import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

async function createDatabase() {
  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${process.env.DATABASE_NAME}`);
    console.log('Database created successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

createDatabase();
