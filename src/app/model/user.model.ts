export class User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;

    constructor(obj?: any) {
        this.id = obj && obj.id || null;
        this.username = obj && obj.username || "";
        this.email = obj && obj.email || "";
        this.createdAt = obj && obj.createdAt || Date.now();
    }
}