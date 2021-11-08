import { Logger } from "./Logger";

export class ConsoleLogger implements Logger {

    public info(...messages: any[]): void {
        console.log(...messages);
    }

    public error(...messages: any[]): void {
        console.error(...messages);
    }
}