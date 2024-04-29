import { Component } from "@angular/core";

import { PolicyType } from "@bitwarden/common/admin-console/enums";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { PlanType } from "@bitwarden/common/billing/enums";

import { BasePolicy, BasePolicyComponent } from "./base-policy.component";

export class DisableSendPolicy extends BasePolicy {
  name = "disableSend";
  description = "disableSendPolicyDesc";
  type = PolicyType.DisableSend;
  component = DisableSendPolicyComponent;

  display(organization: Organization) {
    return organization.planType === PlanType.BravuraEnterprise;
  }
}

@Component({
  selector: "policy-disable-send",
  templateUrl: "disable-send.component.html",
})
export class DisableSendPolicyComponent extends BasePolicyComponent {}
