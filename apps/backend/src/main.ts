import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { apiReference } from '@scalar/nestjs-api-reference';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('The Reed API')
    .setDescription('The Reed API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer'
    }, 'token'
  )
  .build();

  const document = SwaggerModule.createDocument(app, config)
  writeFileSync('./swagger-spec.json', JSON.stringify(document))
  SwaggerModule.setup('api', app, document)

  app.use(
    '/swagger',
    apiReference({
      metaData: {
        title: 'The Reed API',
        description: 'The Reed API description',
        version: '1.0'
      },
      spec: {
        content: document
      }
    })
  )
  
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();