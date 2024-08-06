import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { Request } from 'express';
import { pick } from 'accept-language-parser';
import { I18nService } from '../i18n/i18n.service';

export class AggregateByLocaleContextIdStrategy implements ContextIdStrategy {
  //  NOTE: the locales map is used to store the contextId for each locale
  private readonly locales = new Map<string, ContextId>();

  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const localeCode =
      pick(
        I18nService.supportedLanguages,
        request.headers['accept-language'],
      ) ?? I18nService.defaultLanguage;

    let localeSubTreeId: ContextId;
    if (this.locales.has(localeCode)) {
      localeSubTreeId = this.locales.get(localeCode);
    } else {
      //  NOTE: construct a new contextId
      localeSubTreeId = ContextIdFactory.create();
      this.locales.set(localeCode, localeSubTreeId);
    }

    return {
      payload: { localeCode }, //  NOTE: this payload will reach the I18nService constructor
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? localeSubTreeId : contextId,
    };
  }
}
