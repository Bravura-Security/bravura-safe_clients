import { Component } from "@angular/core";

import { PolicyType } from "@bitwarden/common/admin-console/enums";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { PlanType } from "@bitwarden/common/billing/enums";

import { BasePolicy, BasePolicyComponent } from "./base-policy.component";

export class PersonalOwnershipPolicy extends BasePolicy {
  name = "personalOwnership";
  description = "personalOwnershipPolicyDesc";
  type = PolicyType.PersonalOwnership;
  component = PersonalOwnershipPolicyComponent;

  display(organization: Organization) {
    return organization.planType === PlanType.BravuraEnterprise;
  }
}

@Component({
  selector: "policy-personal-ownership",
  templateUrl: "personal-ownership.component.html",
})
export class PersonalOwnershipPolicyComponent extends BasePolicyComponent {}
