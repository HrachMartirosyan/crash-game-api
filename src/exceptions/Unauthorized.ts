export class Unauthorized extends Error {
    public status: number = 401;
    public message: string;

    constructor(message: string) {
        super(message);
        this.message = message;
    }
}
