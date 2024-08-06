import { Injectable } from '@nestjs/common';
import { PaymentFailedEvent } from './events/payment-failed.event';
import { OnEvent } from '@nestjs/event-emitter';
import { ModuleRef } from '@nestjs/core';
import { EventContext } from './context/event-context';

@Injectable()
export class NotificationsService {
  constructor(private readonly moduleRef: ModuleRef) {}

  @OnEvent(PaymentFailedEvent.key)
  async sendPaymentNotification(event: PaymentFailedEvent) {
    // Resolve the EventContext instance from the contextId and stores it in the eventContext variable
    const eventContext = await this.moduleRef.resolve(
      EventContext,
      event.meta.contextId,
    );

    // console.log('eventContext: ', eventContext);

    console.log('Sending a payment notification: ', eventContext.request.url);
  }
}
