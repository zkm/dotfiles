import { Connection } from 'vscode-languageserver';
export interface LSOptions {
    /**
     * If you have a connection already that the ls should use, pass it in.
     * Else the connection will be created from `process`.
     */
    connection?: Connection;
}
export interface LSSettings {
}
