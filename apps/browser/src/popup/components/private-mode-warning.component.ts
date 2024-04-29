import { Component, OnInit } from "@angular/core";

import BrowserPopupUtils from "../../platform/popup/browser-popup-utils";

@Component({
  selector: "app-private-mode-warning",
  templateUrl: "private-mode-warning.component.html",
})
export class PrivateModeWarningComponent implements OnInit {
  showWarning = false;

  ngOnInit() {
    const isChrome = navigator.userAgent.match(/chrome|chromium|crios/i);
    this.showWarning = BrowserPopupUtils.inPrivateMode();
  }
}
