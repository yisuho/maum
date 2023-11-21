import { DataSource } from 'typeorm';
import { ConfigType } from '@nestjs/config';
import postgresqlConfig from 'src/config/postgresql.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (config: ConfigType<typeof postgresqlConfig>) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.user,
        password: config.password,
        database: config.name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
      });

      try {
        await dataSource.initialize();
        console.log('Database connection successful');
      } catch (error) {
        console.error('Database connection error:', error);
      }

      return dataSource;
    },
    inject: [postgresqlConfig.KEY],
  },
];
