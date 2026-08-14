const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`[server] SkillProof API running on port ${env.port} (${env.nodeEnv})`);
  });
}

start();
