import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { INTERVAL_HOST_KEY } from '../decorator/interval-host.decorator';
import { INTERVAL_KEY } from '../decorator/interval.decorator';

@Injectable()
export class IntervalScheduler
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly intervals: NodeJS.Timeout[] = [];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    //  getting all the providers in the application
    const providers = this.discoveryService.getProviders();

    // iterating over all the providers
    providers.forEach((wrapper) => {
      // filtering out the providers that are not decorated with @Injectable
      const { instance } = wrapper;
      const prototype = instance && Object.getPrototypeOf(instance);
      if (!instance || !prototype) {
        return;
      }

      //  checking if the provider is decorated with @IntervalHost
      const isIntervalHost =
        this.reflector.get<boolean>(INTERVAL_HOST_KEY, instance.constructor) ??
        false;
      if (!isIntervalHost) {
        return;
      }

      //  getting all the methods of the provider
      const methodKeys = this.metadataScanner.getAllMethodNames(prototype);

      //  iterating over all the methods of the provider
      methodKeys.forEach((methodKey) => {
        //  checking if the method is decorated with @Interval
        const interval = this.reflector.get<number>(
          INTERVAL_KEY,
          instance[methodKey],
        );
        if (interval === undefined) {
          return;
        }

        const intervalRef = setInterval(() => instance[methodKey](), interval);
        this.intervals.push(intervalRef);
      });
    });
  }

  onApplicationShutdown(signal?: string) {
    this.intervals.forEach((interval) => clearInterval(interval));
  }
}
