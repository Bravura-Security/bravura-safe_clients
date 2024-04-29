import { Component } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";

import { PolicyType } from "@bitwarden/common/admin-console/enums";
import { Organization } from "@bitwarden/common/admin-console/models/domain/organization";
import { PlanType } from "@bitwarden/common/billing/enums";

import { BasePolicy, BasePolicyComponent } from "./base-policy.component";

export class SendOptionsPolicy extends BasePolicy {
  name = "sendOptions";
  description = "sendOptionsPolicyDesc";
  type = PolicyType.SendOptions;
  component = SendOptionsPolicyComponent;

  display(organization: Organization) {
    return organization.planType === PlanType.BravuraEnterprise;
  }
}

@Component({
  selector: "policy-send-options",
  templateUrl: "send-options.component.html",
})
export class SendOptionsPolicyComponent extends BasePolicyComponent {
  data = this.formBuilder.group({
    disableHideEmail: false,
  });

  constructor(private formBuilder: UntypedFormBuilder) {
    super();
  }
}
