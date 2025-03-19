import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import { OrganizationFilterComponent as BaseOrganizationFilterComponent } from "@bitwarden/angular/vault/vault-filter/components/organization-filter.component";

@Component({
  selector: "app-organization-list",
  templateUrl: "organization-list.component.html",
})
export class OrganizationListComponent extends BaseOrganizationFilterComponent {
  displayText = "allVaults";
  @Input() loading = true;

  constructor(
    private router: Router
  ) { super() }

  navigateOrg(id: string): void {
    this.router.navigate(["/organizations", id]);
  }
}
