import { View } from "../../../../models/view/view";
import { DeepJsonify } from "../../../../types/deep-jsonify";
import { SendFile } from "../domain/send-file";

export class SendFileView implements View {
  id: string = null;
  size: string = null;
  sizeName: string = null;
  fileName: string = null;
  validated: boolean = false;

  constructor(f?: SendFile) {
    if (!f) {
      return;
    }

    this.id = f.id;
    this.size = f.size;
    this.sizeName = f.sizeName;
    this.validated = f.validated;
  }

  get fileSize(): number {
    try {
      if (this.size != null) {
        return parseInt(this.size, null);
      }
    } catch {
      // Invalid file size.
    }
    return 0;
  }

  static fromJSON(json: DeepJsonify<SendFileView>) {
    if (json == null) {
      return null;
    }

    return Object.assign(new SendFileView(), json);
  }
}
