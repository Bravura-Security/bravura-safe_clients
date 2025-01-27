import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { ModalService } from "@bitwarden/angular/services/modal.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { CipherService } from "@bitwarden/common/vault/abstractions/cipher.service";
import { PasswordRepromptService } from "@bitwarden/vault";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { PasswordStrengthServiceAbstraction } from "@bitwarden/common/tools/password-strength";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { FileDownloadService } from "@bitwarden/common/platform/abstractions/file-download/file-download.service";
import { NgxCaptureService } from "ngx-capture";
import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { OrganizationUserService } from "@bitwarden/common/admin-console/abstractions/organization-user/organization-user.service";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { SecurityAssessmentReportComponent as BaseSecurityAssessmentReportComponent } from "../../../tools/reports/pages/security-assessment-report.component";
import { ExposedPasswordsReportComponent } from "./exposed-passwords-report.component";
import { ReusedPasswordsReportComponent } from "./reused-passwords-report.component";
import { WeakPasswordsReportComponent } from "./weak-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./unsecured-websites-report.component";
import { InactiveTwoFactorReportComponent } from "./inactive-two-factor-report.component";
import { ConfiguredTwoFactorReportComponent } from "./configured-two-factor-report.component";

@Component({
  selector: "app-org-security-assessment-report",
  templateUrl: "../../../tools/reports/pages/security-assessment-report.component.html",
})

export class SecurityAssessmentReportComponent extends BaseSecurityAssessmentReportComponent {
  private organizationId: string = "";

  constructor(
    apiService: ApiService,
    cipherService: CipherService,
    auditService: AuditService,
    modalService: ModalService,
    stateService: StateService,
    organizationService: OrganizationService,
    private organizationUserService: OrganizationUserService,
    private route: ActivatedRoute,
    passwordRepromptService: PasswordRepromptService,
    passwordStrengthService: PasswordStrengthServiceAbstraction,
    logService: LogService,
    fileDownloadService: FileDownloadService,
    captureService: NgxCaptureService,
    syncService: SyncService,
    i18nService: I18nService,
  ) {
    super(
      apiService,
      cipherService,
      auditService,
      modalService,
      organizationService,
      stateService,
      passwordRepromptService,
      passwordStrengthService,
      logService,
      fileDownloadService,
      captureService,
      syncService,
      i18nService
    );

    this.exposedPasswords = new ExposedPasswordsReportComponent(cipherService, auditService, modalService, organizationService, route, passwordRepromptService, i18nService, syncService);
    this.reusedPasswords = new ReusedPasswordsReportComponent(cipherService, modalService, route, organizationService, passwordRepromptService, i18nService, syncService);
    this.weakPasswords = new WeakPasswordsReportComponent(cipherService, passwordStrengthService, modalService, route, organizationService, passwordRepromptService, i18nService, syncService);
    this.unsecuredWebsites = new UnsecuredWebsitesReportComponent(cipherService, modalService, route, organizationService, passwordRepromptService, i18nService, syncService);
    this.inactiveTwoFactor = new InactiveTwoFactorReportComponent(cipherService, modalService, route, logService, passwordRepromptService, organizationService, i18nService, syncService);
    this.configuredTwoFactor = new ConfiguredTwoFactorReportComponent(auditService, stateService, route, apiService, organizationService, organizationUserService);
  }

  async ngOnInit() {
    await this.exposedPasswords.ngOnInit();
    await this.reusedPasswords.ngOnInit();
    await this.weakPasswords.ngOnInit();
    await this.unsecuredWebsites.ngOnInit();
    await this.inactiveTwoFactor.ngOnInit();
    await this.configuredTwoFactor.ngOnInit();

    this.route.parent.parent.params.subscribe(async (params) => {
      this.organizationId = params.organizationId;
      const organization = await this.organizationService.get(this.organizationId);
      this.organizationName = organization.name;
    });

    await super.ngOnInit();
  }

  async getCiphersSize() {
    const ciphers = await this.cipherService.getAllFromApiForOrganization(this.organizationId);
    this.ciphersSize = ciphers.length;
  }

  async loadConfiguredTwoFactor() {
    await this.configuredTwoFactor.load();
    this.highlightedItemsTotal = this.configuredTwoFactor.unconfiguredUsersTotal;
    this.configuredTwoFactorLoaded = true;
  }
}
