import { Component } from "@angular/core";

import { PolicyType } from "@bitwarden/common/admin-console/enums";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";

import { BasePolicy, BasePolicyComponent } from "./base-policy.component";

export class Skip2faForSsoPolicy extends BasePolicy {
  name = "skip2faForSsoPolicyTitle";
  description = "skip2faForSsoPolicyDesc";
  type = PolicyType.Skip2faForSso;
  component = Skip2faForSsoPolicyComponent;

  display(organization: Organization) {
    return organization.skip2faForSso;
  }
}

@Component({
  selector: "policy-skip-2fs-for-sso",
  templateUrl: "skip-2fa-for-sso.component.html",
})
export class Skip2faForSsoPolicyComponent extends BasePolicyComponent {}
