import { inject, Injectable } from "@angular/core";
import { Todo } from "../model/todo.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { lastValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TodosService {
    private apiUrl: string = environment.apiUrl;
    private http = inject(HttpClient)

    async getTodos(params?: any) {
        let queryParams = {}

        if(params) {
            queryParams = new HttpParams()
                .set("Title", params.title || "")
                .set("IsComplete", params.isComplete || false)
                .set("SortBy", params.sortBy || "")
                .set("IsDescending", params.isDescending || true)
                .set("PageNumber", params.pageNumber || 1)
                .set("PageSize", params.pageSize || 5)
        }

        const response = await lastValueFrom(this.http.get<Todo[]>(this.apiUrl + "todo", queryParams))

        const todos = response.map(todo => new Todo(todo));

        return todos;
    }

    async addTodo(todo:Partial<Todo>) {
        await sleep(1000);
        return  {
            id: Math.random().toString(36).substring(2, 9),
            ...todo
        } as Todo;
    }

    async deleteTodo(id:string) {
        await sleep(500);
    }

    async updateTodo(id:string, completed: boolean) {
        await sleep(500);
    }
}

async function sleep(ms: number) {
    return new Promise(resolve => 
        setTimeout(resolve, ms));
}