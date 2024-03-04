import { I18nService as BaseI18nService } from "@bitwarden/common/platform/services/i18n.service";

export class I18nRendererService extends BaseI18nService {
  constructor(systemLanguage: string, localesDirectory: string) {
    super(systemLanguage, localesDirectory, (formattedLocale: string) => {
      return ipc.platform.getLanguageFile(formattedLocale);
    });

    // Please leave 'en' where it is, as it's our fallback language in case no translation can be found
    this.supportedTranslationLocales = [
      "en",
      "de",
      "en-GB",
      "es",
      "fr",
      "ja",
      "pt-BR",
      "zh-CN",
    ];
  }
}
