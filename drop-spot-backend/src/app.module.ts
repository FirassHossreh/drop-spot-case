import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/auth/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { DropsController } from './modules/drops/drops.controller';
import { DropsModule } from './modules/drops/drops.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('PROJECT_ENV') === 'prod';

        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: 5432,
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: !isProd,
        };
      },
    }),
    AuthModule,
    DropsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
