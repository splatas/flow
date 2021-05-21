module.exports = {
  DATABASE_USER: process.env.DATABASE_USER || 'retail',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'retail',
  DATABASE_DB: process.env.DATABASE_DB || 'src/retail.db',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'sqlite',
}
