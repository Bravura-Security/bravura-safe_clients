import { HyprAuthenticationRequestModel } from "@bitwarden/common/vault/models/request/hyprAuthenticationRequestModel";
import { DIALOG_DATA, DialogConfig, DialogRef } from "@angular/cdk/dialog";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { CryptoService } from "@bitwarden/common/platform/abstractions/crypto.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";

import { PlatformUtilsService } from "@bitwarden/common/platform/abstractions/platform-utils.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";
import { UserVerificationService } from "@bitwarden/common/auth/abstractions/user-verification/user-verification.service.abstraction";
import { Utils } from "@bitwarden/common/platform/misc/utils";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { TwoFactorHyprAuthGetMagicLink } from "@bitwarden/common/auth/models/response/two-factor-hypr-auth-get-magic-link.response";

import { DialogService } from "@bitwarden/components";

export type OpenHyprDeviceManagerData = {
  organization: Organization;
  userId: string;
};

@Component({
  selector: "app-open-hypr-device-manager",
  templateUrl: "open-hypr-device-manager.component.html",
})
export class OpenHyprDeviceManager {
  formGroup = new FormGroup({});
  protected organization: Organization;
  protected userId: string;

  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) protected data: OpenHyprDeviceManagerData,
    private userVerificationService: UserVerificationService,
    private apiService: ApiService,
    private platformUtilsService: PlatformUtilsService,
    private i18nService: I18nService,
    private cryptoService: CryptoService,
    private syncService: SyncService,
    private logService: LogService,

  ) {
    this.organization = data.organization;
    this.userId = data.userId;
  }

  submit = async () => {
    try {
      //await this.formPromise;
      // maybe spinner on ok before closing
      const hyprAuthenticationRequestModel: HyprAuthenticationRequestModel = {
        Signature: null,
        Team: this.organization.id
      };
      const r: TwoFactorHyprAuthGetMagicLink = await this.apiService.postGoToHyprManagement(hyprAuthenticationRequestModel);
      this.platformUtilsService.showToast("success", null, this.i18nService.t("twoFactorHyprOpeningDeviceManager"));
      this.dialogRef.close();
      setTimeout(function(url){
        window.open(url);
      }, 2*1000, r.url);
    } catch (e) {
      this.logService.error(e);
    }
  };

  static open(dialogService: DialogService, config: DialogConfig<OpenHyprDeviceManagerData>) {
    return dialogService.open(OpenHyprDeviceManager, config);
  }
}
