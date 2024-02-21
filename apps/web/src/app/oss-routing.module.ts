import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";

import {
  AuthGuard,
  lockGuard,
  redirectGuard,
  tdeDecryptionRequiredGuard,
  UnauthGuard,
} from "@bitwarden/angular/auth/guards";

import { flagEnabled, Flags } from "../utils/flags";

import { AcceptFamilySponsorshipComponent } from "./admin-console/organizations/sponsorships/accept-family-sponsorship.component";
import { FamiliesForEnterpriseSetupComponent } from "./admin-console/organizations/sponsorships/families-for-enterprise-setup.component";
import { CreateOrganizationComponent } from "./admin-console/settings/create-organization.component";
import { SponsoredFamiliesComponent } from "./admin-console/settings/sponsored-families.component";
import { AcceptOrganizationComponent } from "./auth/accept-organization.component";
import { deepLinkGuard } from "./auth/guards/deep-link.guard";
import { HintComponent } from "./auth/hint.component";
import { LockComponent } from "./auth/lock.component";
import { LoginDecryptionOptionsComponent } from "./auth/login/login-decryption-options/login-decryption-options.component";
import { LoginViaAuthRequestComponent } from "./auth/login/login-via-auth-request.component";
import { LoginViaWebAuthnComponent } from "./auth/login/login-via-webauthn/login-via-webauthn.component";
import { LoginComponent } from "./auth/login/login.component";
import { RecoverDeleteComponent } from "./auth/recover-delete.component";
import { RecoverTwoFactorComponent } from "./auth/recover-two-factor.component";
import { RegisterComponent } from "./auth/register.component";
import { RemovePasswordComponent } from "./auth/remove-password.component";
import { SetPasswordComponent } from "./auth/set-password.component";
import { AccountComponent } from "./auth/settings/account/account.component";
import { EmergencyAccessComponent } from "./auth/settings/emergency-access/emergency-access.component";
import { EmergencyAccessViewComponent } from "./auth/settings/emergency-access/view/emergency-access-view.component";
import { SecurityRoutingModule } from "./auth/settings/security/security-routing.module";
import { SsoComponent } from "./auth/sso.component";
import { TrialInitiationComponent } from "./auth/trial-initiation/trial-initiation.component";
import { TwoFactorComponent } from "./auth/two-factor.component";
import { UpdatePasswordComponent } from "./auth/update-password.component";
import { UpdateTempPasswordComponent } from "./auth/update-temp-password.component";
import { VerifyEmailTokenComponent } from "./auth/verify-email-token.component";
import { VerifyRecoverDeleteComponent } from "./auth/verify-recover-delete.component";
import { FrontendLayoutComponent } from "./layouts/frontend-layout.component";
import { UserLayoutComponent } from "./layouts/user-layout.component";
import { DomainRulesComponent } from "./settings/domain-rules.component";
import { PreferencesComponent } from "./settings/preferences.component";
import { SettingsComponent } from "./settings/settings.component";
import { GeneratorComponent } from "./tools/generator.component";
import { ReportsModule } from "./tools/reports";
import { AccessComponent } from "./tools/send/access.component";
import { SendComponent } from "./tools/send/send.component";
import { ToolsComponent } from "./tools/tools.component";
import { VaultModule } from "./vault/individual-vault/vault.module";

import { BreachReportComponent } from "./tools/reports/pages/breach-report.component";
import { ExposedPasswordsReportComponent } from "./tools/reports/pages/exposed-passwords-report.component";
import { InactiveTwoFactorReportComponent } from "./tools/reports/pages/inactive-two-factor-report.component";
import { ReportListComponent } from "./tools/reports/shared/report-list/report-list.component";
import { ReportsLayoutComponent } from "./tools/reports/reports-layout.component";
import { ReusedPasswordsReportComponent } from "./tools/reports/pages/reused-passwords-report.component";
import { UnsecuredWebsitesReportComponent } from "./tools/reports/pages/unsecured-websites-report.component";
import { WeakPasswordsReportComponent } from "./tools/reports/pages/weak-passwords-report.component";
import { SecurityAssessmentReportComponent } from "./tools/reports/pages/security-assessment-report.component";
import { ConfiguredTwoFactorReportComponent } from "./tools/reports/pages/configured-two-factor-report.component";

const routes: Routes = [
  {
    path: "",
    component: FrontendLayoutComponent,
    data: { doNotSaveUrl: true },
    children: [
      {
        path: "",
        pathMatch: "full",
        children: [], // Children lets us have an empty component.
        canActivate: [redirectGuard()], // Redirects either to vault, login, or lock page.
      },
      { path: "login", component: LoginComponent, canActivate: [UnauthGuard] },
      {
        path: "login-with-device",
        component: LoginViaAuthRequestComponent,
        data: { titleId: "loginWithDevice" },
      },
      {
        path: "login-with-passkey",
        component: LoginViaWebAuthnComponent,
        data: { titleId: "loginWithPasskey" },
      },
      {
        path: "admin-approval-requested",
        component: LoginViaAuthRequestComponent,
        data: { titleId: "adminApprovalRequested" },
      },
      { path: "2fa", component: TwoFactorComponent, canActivate: [UnauthGuard] },
      {
        path: "login-initiated",
        component: LoginDecryptionOptionsComponent,
        canActivate: [tdeDecryptionRequiredGuard()],
      },
      {
        path: "register",
        component: RegisterComponent,
        canActivate: [UnauthGuard],
        data: { titleId: "createAccount" },
      },
      {
        path: "sso",
        component: SsoComponent,
        canActivate: [UnauthGuard],
        data: { titleId: "enterpriseSingleSignOn" },
      },
      {
        path: "set-password",
        component: SetPasswordComponent,
        data: { titleId: "setMasterPassword" },
      },
      {
        path: "hint",
        component: HintComponent,
        canActivate: [UnauthGuard],
        data: { titleId: "passwordHint" },
      },
      {
        path: "lock",
        component: LockComponent,
        canActivate: [deepLinkGuard(), lockGuard()],
      },
      { path: "verify-email", component: VerifyEmailTokenComponent },
      {
        path: "accept-organization",
        component: AcceptOrganizationComponent,
        canActivate: [deepLinkGuard()],
        data: { titleId: "joinOrganization", doNotSaveUrl: false },
      },
      {
        path: "accept-emergency",
        canActivate: [deepLinkGuard()],
        data: { titleId: "acceptEmergency", doNotSaveUrl: false },
        loadComponent: () =>
          import("./auth/emergency-access/accept/accept-emergency.component").then(
            (mod) => mod.AcceptEmergencyComponent,
          ),
      },
      {
        path: "recover-delete",
        component: RecoverDeleteComponent,
        canActivate: [UnauthGuard],
        data: { titleId: "deleteAccount" },
      },
      {
        path: "verify-recover-delete",
        component: VerifyRecoverDeleteComponent,
        canActivate: [UnauthGuard],
        data: { titleId: "deleteAccount" },
      },
      {
        path: "send/:sendId/:key",
        component: AccessComponent,
        data: { title: "Bravura Safe Share" },
      },
      {
        path: "update-temp-password",
        component: UpdateTempPasswordComponent,
        canActivate: [AuthGuard],
        data: { titleId: "updateTempPassword" },
      },
      {
        path: "update-password",
        component: UpdatePasswordComponent,
        canActivate: [AuthGuard],
        data: { titleId: "updatePassword" },
      },
      {
        path: "remove-password",
        component: RemovePasswordComponent,
        canActivate: [AuthGuard],
        data: { titleId: "removeMasterPassword" },
      },
      {
        path: "migrate-legacy-encryption",
        loadComponent: () =>
          import("./auth/migrate-encryption/migrate-legacy-encryption.component").then(
            (mod) => mod.MigrateFromLegacyEncryptionComponent,
          ),
      },
    ],
  },
  {
    path: "",
    component: UserLayoutComponent,
    canActivate: [deepLinkGuard(), AuthGuard],
    children: [
      {
        path: "vault",
        loadChildren: () => VaultModule,
      },
      { path: "sends", component: SendComponent, data: { title: "Send" } },
      {
        path: "create-organization",
        component: CreateOrganizationComponent,
        data: { titleId: "newOrganization" },
      },
      {
        path: "settings",
        component: SettingsComponent,
        children: [
          { path: "", pathMatch: "full", redirectTo: "account" },
          { path: "account", component: AccountComponent, data: { titleId: "myAccount" } },
          {
            path: "preferences",
            component: PreferencesComponent,
            data: { titleId: "preferences" },
          },
          {
            path: "security",
            loadChildren: () => SecurityRoutingModule,
          },
          {
            path: "domain-rules",
            component: DomainRulesComponent,
            data: { titleId: "domainRules" },
          },
          {
            path: "emergency-access",
            children: [
              {
                path: "",
                component: EmergencyAccessComponent,
                data: { titleId: "emergencyAccess" },
              },
              {
                path: ":id",
                component: EmergencyAccessViewComponent,
                data: { titleId: "emergencyAccess" },
              },
            ],
          },
        ],
      },
      {
        path: "tools",
        component: ToolsComponent,
        canActivate: [AuthGuard],
        children: [
          { path: "", pathMatch: "full", redirectTo: "generator" },
          {
            path: "import",
            loadComponent: () =>
              import("./tools/import/import-web.component").then((mod) => mod.ImportWebComponent),
            data: {
              titleId: "importData",
            },
          },
          {
            path: "export",
            loadChildren: () =>
              import("./tools/vault-export/export.module").then((m) => m.ExportModule),
          },
          {
            path: "generator",
            component: GeneratorComponent,
            data: { titleId: "generator" },
          },
        ],
      },
      {
        path: "reports",
        component: ReportsLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          { path: "", pathMatch: "full", redirectTo: "security-assessment-report" },
          {
            path: "security-assessment-report",
            component: SecurityAssessmentReportComponent,
            data: { titleId: "securityAssessmentReport" },
          },
          {
            path: "reused-passwords-report",
            component: ReusedPasswordsReportComponent,
            data: { titleId: "reusedPasswordsReport" },
          },
          {
            path: "unsecured-websites-report",
            component: UnsecuredWebsitesReportComponent,
            data: { titleId: "unsecuredWebsitesReport" },
          },
          {
            path: "weak-passwords-report",
            component: WeakPasswordsReportComponent,
            data: { titleId: "weakPasswordsReport" },
          },
          {
            path: "exposed-passwords-report",
            component: ExposedPasswordsReportComponent,
            data: { titleId: "exposedPasswordsReport" },
          },
          {
            path: "inactive-two-factor-report",
            component: InactiveTwoFactorReportComponent,
            data: { titleId: "inactive2faReport" },
          },
          {
            path: "configured-two-factor-report",
            component: ConfiguredTwoFactorReportComponent,
            data: { titleId: "configured2faReport" },
          },
        ],
      },
      { path: "setup/families-for-enterprise", component: FamiliesForEnterpriseSetupComponent },
    ],
  },
  {
    path: "organizations",
    loadChildren: () =>
      import("./admin-console/organizations/organization.module").then((m) => m.OrganizationModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      paramsInheritanceStrategy: "always",
      // enableTracing: true,
    }),
  ],
  exports: [RouterModule],
})
export class OssRoutingModule {}

export function buildFlaggedRoute(flagName: keyof Flags, route: Route): Route {
  return flagEnabled(flagName)
    ? route
    : {
        path: route.path,
        redirectTo: "/",
      };
}
