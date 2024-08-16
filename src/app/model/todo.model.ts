export class Todo {
    id: string;
    title: string;
    completed: boolean;

    constructor(obj?: any) {
        this.id = obj && obj.todoId || null;
        this.title = obj && obj.title || "";
        this.completed = obj && obj.isComplete || false
    }
}