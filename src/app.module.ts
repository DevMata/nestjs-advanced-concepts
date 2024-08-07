import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { SchedulerModule } from './scheduler/scheduler.module';
// import { CronModule } from './cron/cron.module';
import { FibonacciModule } from './fibonacci/fibonacci.module';
import { HttpClientModule } from './http-client/http-client.module';
import { RecipesModule } from './recipes/recipes.module';
import { TagsModule } from './tags/tags.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentsModule } from './payments/payments.module';
import { DataSourceModule } from './data-source/data-source.module';
import { UsersModule } from './users/users.module';
import { ContextIdFactory } from '@nestjs/core';
import { I18nModule } from './i18n/i18n.module';
import { AggregateByLocaleContextIdStrategy } from './core/aggregate-by-locale.strategy';
// import { AggregateByTenantContextIdStrategy } from './core/aggregate-by-tenant.strategy';

// ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
ContextIdFactory.apply(new AggregateByLocaleContextIdStrategy());

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CoffeesModule,
    SchedulerModule,
    FibonacciModule,
    RecipesModule,
    TagsModule,
    HttpClientModule.register({
      baseURL: 'https://nestjs.com',
    }),
    PaymentsModule,
    DataSourceModule,
    UsersModule,
    I18nModule,
    // HttpClientModule.register({
    //   baseURL: 'https://nestjs.com',
    // }),
    // HttpClientModule.register({
    //   baseURL: 'https://nestjs.com',
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
