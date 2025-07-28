// Configuration interface with type definitions

export interface Config {
  database: {
    url: string;
  };
  jwt: {
    secret: string;
  };
  app: {
    nodeEnv: 'development' | 'production' | 'test';
    port: number;
  };
}
