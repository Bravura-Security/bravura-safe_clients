import { Component, OnInit, ViewChild } from "@angular/core";
import { Buffer } from "buffer";

import { ApiService } from "@bitwarden/common/abstractions/api.service";
import { ModalService } from "@bitwarden/angular/services/modal.service";
import { AuditService } from "@bitwarden/common/abstractions/audit.service";
import { CipherService } from "@bitwarden/common/vault/abstractions/cipher.service";
import { OrganizationService } from "@bitwarden/common/admin-console/abstractions/organization/organization.service.abstraction";
import { PasswordRepromptService } from "@bitwarden/vault";
import { StateService } from "@bitwarden/common/platform/abstractions/state.service";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";
import { PasswordStrengthServiceAbstraction } from "@bitwarden/common/tools/password-strength";
import { LogService } from "@bitwarden/common/platform/abstractions/log.service";
import { FileDownloadService } from "@bitwarden/common/platform/abstractions/file-download/file-download.service";
import { NgxCaptureService } from "ngx-capture";
import { SyncService } from "@bitwarden/common/vault/abstractions/sync/sync.service.abstraction";
import { Icons } from "@bitwarden/components";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";

import { ExposedPasswordsReportComponent } from "./exposed-passwords-report.component";
import { ReusedPasswordsReportComponent } from "./reused-passwords-report.component";
import { WeakPasswordsReportComponent } from "./weak-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./unsecured-websites-report.component";
import { InactiveTwoFactorReportComponent } from "./inactive-two-factor-report.component";
import { ConfiguredTwoFactorReportComponent } from "./configured-two-factor-report.component";

@Component({
  selector: "app-security-assessment-report",
  templateUrl: "security-assessment-report.component.html",
})

export class SecurityAssessmentReportComponent implements OnInit {
  protected exposedPasswords: ExposedPasswordsReportComponent;
  protected exposedPasswordsCiphers: CipherView[] = [];
  protected exposedPasswordsLoaded = false;
  protected reusedPasswords: ReusedPasswordsReportComponent;
  protected reusedPasswordsCiphers: CipherView[] = [];
  protected reusedPasswordsLoaded = false;
  protected weakPasswords: WeakPasswordsReportComponent;
  protected weakPasswordsCiphers: CipherView[] = [];
  protected weakPasswordsLoaded = false;
  protected unsecuredWebsites: UnsecuredWebsitesReportComponent;
  protected unsecuredWebsitesCiphers: CipherView[] = [];
  protected unsecuredWebsitesLoaded = false;
  protected inactiveTwoFactor: InactiveTwoFactorReportComponent;
  protected inactiveTwoFactorCiphers: CipherView[] = [];
  protected inactiveTwoFactorLoaded = false;
  protected configuredTwoFactor: ConfiguredTwoFactorReportComponent;
  protected highlightedItemsTotal = 0;
  protected configuredTwoFactorLoaded = false;
  protected pageLoaded = false;
  protected executionDate: Date;
  protected userEmail = "";
  protected organizationName = "";
  protected ciphersSize = 0;
  protected noItemIcon = Icons.Search;

  @ViewChild('reportResults', { static: true }) screen: any;

  constructor(
    protected apiService: ApiService,
    protected cipherService: CipherService,
    protected auditService: AuditService,
    protected modalService: ModalService,
    protected organizationService: OrganizationService,
    protected stateService: StateService,
    protected passwordRepromptService: PasswordRepromptService,
    protected passwordStrengthService: PasswordStrengthServiceAbstraction,
    protected logService: LogService,
    protected fileDownloadService: FileDownloadService,
    protected captureService: NgxCaptureService,
    protected syncService: SyncService,
    protected i18nService: I18nService,
  ) {
    this.exposedPasswords = new ExposedPasswordsReportComponent(cipherService, auditService, organizationService, modalService, passwordRepromptService, i18nService, syncService);
    this.reusedPasswords = new ReusedPasswordsReportComponent(cipherService, organizationService, modalService, passwordRepromptService, i18nService, syncService);
    this.weakPasswords = new WeakPasswordsReportComponent(cipherService, passwordStrengthService, organizationService, modalService, passwordRepromptService, i18nService, syncService);
    this.unsecuredWebsites = new UnsecuredWebsitesReportComponent(cipherService, organizationService, modalService, passwordRepromptService, i18nService, syncService);
    this.inactiveTwoFactor = new InactiveTwoFactorReportComponent(cipherService, organizationService, modalService, logService, passwordRepromptService, i18nService, syncService);
    this.configuredTwoFactor = new ConfiguredTwoFactorReportComponent(auditService, stateService, apiService);
  }

  async ngOnInit() {
    await this.syncService.fullSync(false);
    await this.getCiphersSize();
    if (this.ciphersSize > 0) {
      await Promise.all([ this.loadExposedPasswords(), this.loadReusedPasswords(), this.loadWeakPasswords(), this.loadUnsecuredWebsites(), this.loadInactiveTwoFactor() ]);
    }
    await this.loadConfiguredTwoFactor();
      this.executionDate = new Date();

      const profile = await this.apiService.getProfile();
      this.userEmail = profile.email;
    this.pageLoaded = true;
  }

  async getCiphersSize() {
    const ciphers = await this.cipherService.getAllDecrypted();
    this.ciphersSize = ciphers.length;
  }

  async loadExposedPasswords() {
    await this.exposedPasswords.load();
    this.exposedPasswordsCiphers = this.exposedPasswords.ciphers;
    this.exposedPasswordsLoaded = true;
  }

  async loadReusedPasswords() {
    await this.reusedPasswords.load();
    this.reusedPasswordsCiphers = this.reusedPasswords.ciphers;
    this.reusedPasswordsLoaded = true;
  }

  async loadWeakPasswords() {
    await this.weakPasswords.load();
    this.weakPasswordsCiphers = this.weakPasswords.ciphers;
    this.weakPasswordsLoaded = true;
  }

  async loadUnsecuredWebsites() {
    await this.unsecuredWebsites.load();
    this.unsecuredWebsitesCiphers = this.unsecuredWebsites.ciphers;
    this.unsecuredWebsitesLoaded = true;
  }

  async loadInactiveTwoFactor() {
    await this.inactiveTwoFactor.load();
    this.inactiveTwoFactorCiphers = this.inactiveTwoFactor.ciphers;
    this.inactiveTwoFactorLoaded = true;
  }

  async loadConfiguredTwoFactor() {
    await this.configuredTwoFactor.load();
    this.highlightedItemsTotal = this.configuredTwoFactor.configuredProvidersTotal;
    this.configuredTwoFactorLoaded = true;
  }

  async downloadAssessment() {
    this.captureService.getImage(this.screen.nativeElement, true).toPromise().then(pngImage=>{
      var data = pngImage.replace(/^data:image\/\w+;base64,/, "");
      var buffer = Buffer.from(data, 'base64');
      var fileName = 'security_assessment_' + this.executionDate.getTime().toString() + '.png';
      this.fileDownloadService.download({
        fileName: fileName,
        blobData: buffer,
        blobOptions: { type: "image/png" },
      });
    });
  }
}
