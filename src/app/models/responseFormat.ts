export class ResponseFormat {
    Success: Boolean;
    Exception: Boolean;
    StatusCode: Number;
    Description: String;
    Message: String;
    Content: {Result: any}
}
