try {
  process.loadEnvFile();
} catch {
  // No Render, as variáveis vêm direto do painel (Environment)
}

if (!process.env.DATABASE_URL) {
  throw new Error("A variável DATABASE_URL não foi encontrada no arquivo .env ou no servidor.");
}

const dbUrl = new URL(process.env.DATABASE_URL);

const configuracaoNuvem = {
  dialect: 'postgres',
  host: dbUrl.hostname,
  port: dbUrl.port || 5432,
  username: dbUrl.username,
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.replace('/', ''),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true,
    underscored: true,
  }
};

export default {
  ...configuracaoNuvem,
  development: configuracaoNuvem,
  test: configuracaoNuvem,
  production: configuracaoNuvem
};