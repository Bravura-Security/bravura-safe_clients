import { BaseResponse } from "../../../../models/response/base.response";

export class SendFileApi extends BaseResponse {
  id: string;
  fileName: string;
  size: string;
  sizeName: string;
  validated: boolean;

  constructor(data: any = null) {
    super(data);
    if (data == null) {
      return;
    }
    this.id = this.getResponseProperty("Id");
    this.fileName = this.getResponseProperty("FileName");
    this.size = this.getResponseProperty("Size");
    this.sizeName = this.getResponseProperty("SizeName");
    this.validated = this.getResponseProperty("Validated") ?? false;
  }
}
