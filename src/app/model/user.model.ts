export class User {
    userName: string;
    email: string;

    constructor(obj?: any) {
        this.userName = obj && obj.userName || "";
        this.email = obj && obj.email || "";
    }
}