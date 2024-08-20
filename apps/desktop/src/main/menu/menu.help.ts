import { shell, MenuItemConstructorOptions, app } from "electron";

import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { DesktopSettingsService } from "../../platform/services/desktop-settings.service";
import { isMacAppStore, isWindowsStore } from "../../utils";

import { AboutMenu } from "./menu.about";
import { IMenubarMenu } from "./menubar";

export class HelpMenu implements IMenubarMenu {
  readonly id: string = "help";

  get label(): string {
    return this.localize("help");
  }

  get items(): MenuItemConstructorOptions[] {
    const items = [
      this.helpAndFeedback,
      this.legal,
      this.separator,
      this.goToWebVault,
      this.separator,
      this.troubleshooting,
    ];

    if (this.aboutMenu != null) {
      items.push(...this.aboutMenu.items);
    }
    return items;
  }

  constructor(
    private i18nService: I18nService,
    private desktopSettingsService: DesktopSettingsService,
    private webVaultUrl: string,
    private hardwareAccelerationEnabled: boolean,
    private aboutMenu: AboutMenu,
  ) {}

  private get helpAndFeedback(): MenuItemConstructorOptions {
    return {
      id: "helpAndFeedback",
      label: this.localize("helpAndFeedback"),
      click: () => shell.openExternal("https://bravurasecuritydocs.com/safe/#/home/2202/10/11"),
    };
  }

  private get fileBugReport(): MenuItemConstructorOptions {
    return {
      id: "fileBugReport",
      label: this.localize("fileBugReport"),
      click: () => shell.openExternal("https://www.bravurasecurity.com/support/"),
    };
  }

  private get legal(): MenuItemConstructorOptions {
    return {
      id: "legal",
      label: this.localize("legal"),
      visible: isMacAppStore(),
      submenu: this.legalSubmenu,
    };
  }

  private get legalSubmenu(): MenuItemConstructorOptions[] {
    return [
      {
        id: "termsOfService",
        label: this.localize("termsOfService"),
        click: () => shell.openExternal("https://bravurasecurity.com/terms-of-use/"),
      },
      {
        id: "privacyPolicy",
        label: this.localize("privacyPolicy"),
        click: () => shell.openExternal("https://bravurasecurity.com/privacy/"),
      },
    ];
  }

  private get separator(): MenuItemConstructorOptions {
    return { type: "separator" };
  }

  private get followUs(): MenuItemConstructorOptions {
    return {
      id: "followUs",
      label: this.localize("followUs"),
      submenu: this.followUsSubmenu,
    };
  }

  private get followUsSubmenu(): MenuItemConstructorOptions[] {
    return [
      {
        id: "blog",
        label: this.localize("blog"),
        click: () => shell.openExternal("https://blog.example.com"),
      },
      {
        id: "twitter",
        label: "Twitter",
        click: () => shell.openExternal("https://twitter.com/example"),
      },
      {
        id: "facebook",
        label: "Facebook",
        click: () => shell.openExternal("https://www.facebook.com/example/"),
      },
      {
        id: "github",
        label: "GitHub",
        click: () => shell.openExternal("https://github.com/example"),
      },
      {
        id: "mastodon",
        label: "Mastodon",
        click: () => shell.openExternal("https://fosstodon.org/@example"),
      },
    ];
  }

  private get goToWebVault(): MenuItemConstructorOptions {
    return {
      id: "goToWebVault",
      label: this.localize("goToWebVault"),
      click: () => shell.openExternal(this.webVaultUrl),
    };
  }

  private get getMobileApp(): MenuItemConstructorOptions {
    return {
      id: "getMobileApp",
      label: this.localize("getMobileApp"),
      visible: !isWindowsStore(),
      submenu: this.getMobileAppSubmenu,
    };
  }

  private get getMobileAppSubmenu(): MenuItemConstructorOptions[] {
    return [
      {
        id: "iOS",
        label: "iOS",
        click: () =>
          shell.openExternal(
            "https://itunes.apple.com/app/" + "bravura-safe/id1635873468"
          ),
      },
      {
        id: "android",
        label: "Android",
        visible: !isMacAppStore(), // Apple Guideline 2.3.10 - Accurate Metadata
        click: () =>
          shell.openExternal(
            "https://play.google.com/store/apps/" + "details?id=com.hitachi_id.safe"
          ),
      },
    ];
  }

  private get getBrowserExtension(): MenuItemConstructorOptions {
    return {
      id: "getBrowserExtension",
      label: this.localize("getBrowserExtension"),
      visible: !isWindowsStore(),
      submenu: this.getBrowserExtensionSubmenu,
    };
  }

  private get getBrowserExtensionSubmenu(): MenuItemConstructorOptions[] {
    return [
      {
        id: "chrome",
        label: "Chrome",
        click: () =>
          shell.openExternal(
            "https://chromewebstore.google.com/detail/" +
              "bravura-safe/cjidmfgdjckibjdfnglfdgohkaballnn"
          ),
      },
      {
        id: "firefox",
        label: "Firefox",
        click: () =>
          shell.openExternal(
            "https://github.com/Hitachi-ID/bravura-safe_browser/releases/"

          ),
      },
      {
        id: "firefox",
        label: "Opera",
        click: () =>
          shell.openExternal(
            "https://addons.opera.com/extensions/details/" + "bravura-safe/"
          ),
      },
      {
        id: "firefox",
        label: "Edge",
        click: () =>
          shell.openExternal(
            "https://microsoftedge.microsoft.com/addons/" +
              "detail/lgjgabmkhcjfpcmflkhmhjgmnnpfgmnc"
          ),
      },
      {
        id: "safari",
        label: "Safari",
        click: () => shell.openExternal("https://apps.apple.com/us/app/bravura-safe-desktop/id1633310016"),
      },
    ];
  }

  private get troubleshooting(): MenuItemConstructorOptions {
    return {
      id: "troubleshooting",
      label: this.localize("troubleshooting"),
      submenu: this.troubleshootingSubmenu,
    };
  }

  private get troubleshootingSubmenu(): MenuItemConstructorOptions[] {
    return [
      {
        id: "hardwareAcceleration",
        label: this.localize(
          this.hardwareAccelerationEnabled
            ? "disableHardwareAccelerationRestart"
            : "enableHardwareAccelerationRestart",
        ),
        click: async () => {
          await this.desktopSettingsService.setHardwareAcceleration(
            !this.hardwareAccelerationEnabled,
          );
          // `app.relaunch` crashes the app on Mac Store builds. Disabling it for now.
          // https://github.com/electron/electron/issues/41690
          if (!isMacAppStore()) {
            app.relaunch();
          }
          app.exit();
        },
      },
    ];
  }

  private localize(s: string) {
    return this.i18nService.t(s);
  }
}
