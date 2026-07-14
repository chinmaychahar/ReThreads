const logger = {
  info: (msg) => console.log(`[${new Date().toISOString()}] INFO: ${msg}`),
  error: (msg) => console.error(`[${new Date().toISOString()}] ERROR: ${msg}`),
  warn: (msg) => console.warn(`[${new Date().toISOString()}] WARN: ${msg}`),
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${new Date().toISOString()}] DEBUG: ${msg}`);
    }
  },
};

module.exports = { logger };
