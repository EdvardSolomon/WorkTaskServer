import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(session({
    secret: 'dsfdfsddgwqdaadqfewffg',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .setTitle('Nest-REST-API')
    .setDescription('RESTful API for management of users and their posts.')
    .setVersion('1.0')
    .addSecurity('JWT', {
      type: 'http',
      scheme: 'bearer',
    })
    .addTag('REST-API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();