/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(
  configService: ConfigService,
): Promise<void> {
  const AppDataSource = await new DataSource({
    type: 'postgres',
    synchronize: configService.get('database.synchronize'),
    port: configService.get('database.port'),
    username: configService.get('database.user'),
    password: configService.get('database.password'),
    host: configService.get('database.host'),
    database: configService.get('database.name'),
  }).initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.destroy();
}
