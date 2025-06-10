export function validateEnv(config: any) {
  if (!config.httpPassword || !config.httpHost) {
    console.error('HTTP_PASSWORD and HTTP_HOST are required but not set in the environment variables.');
    process.exit(1);
  }
}
