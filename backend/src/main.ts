import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('NyayaSetuBootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
  const corsOrigins = configService.get<string>('CORS_ORIGINS') || 'http://localhost:3000';

  // ─── 1. Security Headers (Helmet) ───────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          scriptSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: 'deny' }, // Anti-clickjacking
      noSniff: true,
      hidePoweredBy: true,
    }),
  );

  // ─── 2. Strict CORS Configuration ───────────────────────────
  const vercelDomains = [
    configService.get<string>('VERCEL_URL'),
    configService.get<string>('VERCEL_BRANCH_URL'),
    configService.get<string>('VERCEL_PROJECT_PRODUCTION_URL'),
  ].filter((domain): domain is string => Boolean(domain));
  const allowedOrigins = [
    ...new Set([
      ...corsOrigins.split(',').map((origin) => origin.trim()),
      ...vercelDomains.map((domain) => `https://${domain}`),
    ]),
  ];
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or in allowed list
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by strict CORS security policy`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  // ─── 3. Global API Route Prefix ─────────────────────────────
  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });

  // ─── 4. Input Validation & Sanitization ─────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not in DTOs
      forbidNonWhitelisted: true, // Throw error on unexpected fields
      transform: true,
      disableErrorMessages: nodeEnv === 'production', // Don't leak internals in prod
    }),
  );

  // ─── 5. Swagger / OpenAPI Documentation ─────────────────────
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NyayaSetu — Legal Aid & Rights Awareness Portal API')
      .setDescription(
        'Authoritative, secure REST API providing access to Indian legal rights guides, free legal aid directory, verified citations, and guided chatbot assistance.',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'NyayaSetu API Documentation',
    });
    logger.log(`OpenAPI documentation initialized at /api/docs`);
  }

  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`🚀 NyayaSetu Backend API running on port ${port} [Env: ${nodeEnv}]`);
}

bootstrap();
