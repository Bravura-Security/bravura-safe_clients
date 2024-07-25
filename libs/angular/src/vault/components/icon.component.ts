import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from "rxjs";

import { DomainSettingsService } from "@bitwarden/common/autofill/services/domain-settings.service";
import { EnvironmentService } from "@bitwarden/common/platform/abstractions/environment.service";
import { buildCipherIcon } from "@bitwarden/common/vault/icon/build-cipher-icon";
import { CipherView } from "@bitwarden/common/vault/models/view/cipher.view";
const IconMap: any = {
  "fa-globe": String.fromCharCode(0xf0ac),
  "fa-sticky-note-o": String.fromCharCode(0xf24a),
  "fa-id-card-o": String.fromCharCode(0xf2c3),
  "fa-credit-card": String.fromCharCode(0xf09d),
  "fa-android": String.fromCharCode(0xf17b),
  "fa-apple": String.fromCharCode(0xf179),
};

@Component({
  selector: "app-vault-icon",
  templateUrl: "icon.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent implements OnInit {
  @Input()
  set cipher(value: CipherView) {
    this.cipher$.next(value);
  }

  protected data$: Observable<{
    imageEnabled: boolean;
    image?: string;
  fallbackImage: string;
    icon?: string;
  }>;

  private cipher$ = new BehaviorSubject<CipherView>(undefined);

  constructor(
    private environmentService: EnvironmentService,
    private domainSettingsService: DomainSettingsService,
  ) {}

  async ngOnInit() {
    this.data$ = combineLatest([
      this.environmentService.environment$.pipe(map((e) => e.getIconsUrl())),
      this.domainSettingsService.showFavicons$.pipe(distinctUntilChanged()),
      this.cipher$.pipe(filter((c) => c !== undefined)),
    ]).pipe(
      map(([iconsUrl, showFavicon, cipher]) => buildCipherIcon(iconsUrl, cipher, showFavicon)),
    );
    }
  }
