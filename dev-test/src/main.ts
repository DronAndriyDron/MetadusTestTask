import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import {ValidationPipe} from '@nestjs/common';
import {LoggingInterceptor} from "./interceptors/logging.interceptor";
import {TransformInterceptor} from "./interceptors/transform.interceptor";
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import SecureSession from '@fastify/secure-session';
import * as fastify from 'fastify';
import fastifySession from 'fastify-session';
import fastifyCookie from 'fastify-cookie';

const FastifyAdapterParams = {logger: true}
async function bootstrap() {
    const fastifyApp = fastify({});
    fastifyApp.register(fastifyCookie);
    fastifyApp.register(fastifySession, { secret: process.env.SESSION_SECRET});

    const app = await NestFactory.create(AppModule, new FastifyAdapter(fastifyApp));
    app.useGlobalPipes(new ValidationPipe());



    app.use(async (req, res, next) => {
        req.session = {};
        next();
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.use(passport.initialize());
    app.use(passport.session());
    await app.listen(3000);
}

bootstrap();
