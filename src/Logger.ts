type Message = string | object | any;
type ErrorMessage = Error | Message;

export interface Logger {
    info(...messages: Message[]): void;
    error(...messages: ErrorMessage[]): void;
}