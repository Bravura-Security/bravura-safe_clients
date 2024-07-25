import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  IHubProtocol,
} from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { firstValueFrom } from "rxjs";

import { LoginStrategyServiceAbstraction } from "../../../../auth/src/common/abstractions/login-strategy.service";
import {
  AuthRequestPushNotification,
  NotificationResponse,
} from "../../models/response/notification.response";
import { EnvironmentService } from "../../platform/abstractions/environment.service";
import { LogService } from "../../platform/abstractions/log.service";
import { AnonymousHubService as AnonymousHubServiceAbstraction } from "../abstractions/anonymous-hub.service";

export class AnonymousHubService implements AnonymousHubServiceAbstraction {
  private anonHubConnection: HubConnection;
  private url: string;
  private logHeartbeat = true;

  constructor(
    private environmentService: EnvironmentService,
    private loginStrategyService: LoginStrategyServiceAbstraction,
    private logService: LogService,
  ) {}

  async createHubConnection(token: string) {
    this.url = (await firstValueFrom(this.environmentService.environment$)).getNotificationsUrl();

    this.anonHubConnection = new HubConnectionBuilder()
      .withUrl(this.url + "/anonymous-hub?Token=" + token, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      //.withAutomaticReconnect()
      .withHubProtocol(new MessagePackHubProtocol() as IHubProtocol)
      .build();

    this.anonHubConnection.on("AuthRequestResponseRecieved", (data: any) => {
      // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.ProcessNotification(new NotificationResponse(data));
    });

    // eslint-disable-next-line
    this.anonHubConnection.on("Heartbeat", (data: any) => {
      if (this.logHeartbeat) {
        const currentTime = new Date();
        console.log('Anon Heartbeat!', currentTime);
      }
    });

    this.anonHubConnection.on("error", (error) => {
      //const currentTime = new Date();
      console.log('Anon Connection generated error !!!', error);
    });

    await this.anonHubConnection.start().catch((error) => this.logService.error(error));
  }

  stopHubConnection() {
    if (this.anonHubConnection) {
      // FIXME: Verify that this floating promise is intentional. If it is, add an explanatory comment and ensure there is proper error handling.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.anonHubConnection.stop();
    }
  }

  private async ProcessNotification(notification: NotificationResponse) {
    await this.loginStrategyService.sendAuthRequestPushNotification(
      notification.payload as AuthRequestPushNotification,
    );
  }
}
