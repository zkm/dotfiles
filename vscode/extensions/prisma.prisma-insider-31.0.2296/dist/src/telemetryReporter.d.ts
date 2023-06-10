export default class TelemetryReporter {
    private extensionId;
    private extensionVersion;
    private userOptIn;
    private readonly configListener;
    private static TELEMETRY_CONFIG_ID;
    private static TELEMETRY_CONFIG_ENABLED_ID;
    constructor(extensionId: string, extensionVersion: string);
    sendTelemetryEvent(): Promise<void>;
    private updateUserOptIn;
    dispose(): void;
}
