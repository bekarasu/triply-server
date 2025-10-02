import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DEBUG_CONFIG } from '@infras/common';
import { ConfigService } from '@nestjs/config';

export default (app: INestApplication) => {
  const sampleAccessToken = process.env.SWAGGER_SAMPLE_ACCESS_TOKEN;
  const configService = app.get(ConfigService);
  const debugConfig = configService.get(DEBUG_CONFIG);
  if (debugConfig.enableSwagger) {
    // setup swagger
    const config = new DocumentBuilder()
      .setTitle('Recommandation Service')
      .setVersion('1.0')
      .setDescription(getSampleAccessTokenDescription(sampleAccessToken))
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${process.env.SERVICE_NAME}/swagger`, app, document);
  }
};

const getSampleAccessTokenDescription = (accessToken: string) =>
  `
<h4>Sample Access Token: </h4>
<p>${accessToken} </p>
`;
