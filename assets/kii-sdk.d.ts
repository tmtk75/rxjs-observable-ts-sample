declare module "kii-sdk" {

  export class Kii {
    static initializeWithSite(app_id: string, app_key: string, endpoint_url: string): void;
    static serverCodeEntry(name: string): KiiServerCodeEntry;
  }

  class KiiServerCodeExecResult {
    getReturnedValue(): {returnedValue: any};
  }

  export class KiiServerCodeEntry {
    execute(arg: Object): Promise<[string /*entry*/, Object /*args*/, KiiServerCodeExecResult]>;
  }

  export class KiiGroup {
    static groupWithID(id: string): KiiGroup;
    static registerGroupWithID(id: string, name: string, members: Array<KiiUser>): Promise<KiiGroup>;
    refresh(): Promise<KiiGroup>;
    getName(): string;
    listTopics(): Promise<[Array<KiiTopic>, string /*paginationKey*/]>;
    topicWithName(name: string): KiiTopic;
    save(): Promise<KiiGroup>;
    addUser(u: KiiUser): void;
    getMemberList(): Promise<[KiiGroup, Array<KiiUser>]>;
  }

  export class KiiUser {
    static userWithUsername(username: string, password: string): KiiUser;
    static userWithURI(uri: string): KiiUser;
    static authenticateWithToken(token: string): Promise<KiiUser>;
    static getCurrentUser(): KiiUser;
    static findUserByUsername(username: string): Promise<KiiUser>;
    static authenticate(username: string, password: string): Promise<KiiUser>;
    register(): Promise<KiiUser>;
    refresh(): Promise<KiiUser>;
    get(name: string): any;
    getUUID(): string;
    getAccessToken(): string;
    getUsername(): string;
    pushInstallation(): KiiPushInstallation;
    pushSubscription(): KiiPushSubscription;
    memberOfGroups(): Promise<[KiiUser, Array<KiiGroup>]>;
  }

  export class KiiTopic {
    save(): Promise<KiiTopic>;
    sendMessage(msg: KiiPushMessage): Promise<KiiTopic>;
    getName(): string;
  }

  export class KiiPushInstallation {
    installMqtt(dev: boolean): Promise<{installationID: string}>;
    getMqttEndpoint(instID: string): Promise<KiiMqttEndpoint>;
  }

  export class KiiPushSubscription {
    isSubscribed(t: KiiTopic): Promise<[KiiPushSubscription, KiiTopic, boolean]>;
    subscribe(t: KiiTopic): Promise<[KiiPushSubscription, KiiTopic]>
  }

  export class KiiPushMessage {
    readonly senderURI: string;
    readonly value: string;
  }

  export class KiiPushMessageBuilder {
    constructor(a: any);
    build(): KiiPushMessage;
  }

  export interface KiiMqttEndpoint {
    readonly host: string;
    readonly portWS: number;
    readonly username: string;
    readonly password: string;
    readonly mqttTopic: string;
  }

}

