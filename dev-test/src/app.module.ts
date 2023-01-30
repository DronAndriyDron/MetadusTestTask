import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {LoggingInterceptor} from "./interceptors/logging.interceptor";
import {TransformInterceptor} from "./interceptors/transform.interceptor";
import { PassportModule } from '@nestjs/passport';
require('dotenv').config({path: '.env'})

@Module({
    imports: [MongooseModule.forRoot(
        process.env.MONGO_URI
    ), UsersModule, AuthModule,PassportModule.register({ defaultStrategy: 'local' })],
    controllers: [AppController],
    providers: [AppService, {
        provide: APP_INTERCEPTOR,
        useClass: LoggingInterceptor,
    },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },],
})
export class AppModule {
}
