import { inject, Injectable } from "@angular/core";
import { Todo } from "../model/todo.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, concat, lastValueFrom, map, Observable, of, retry, throwError } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TodosService {
    private apiUrl: string = environment.apiUrl;
    private http = inject(HttpClient)

    getTodos(params?: any): Observable<Todo[]> {
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

        return this.http.get<Array<Todo>>(this.apiUrl + "todo", queryParams).pipe(
            catchError(err => of(null)),
            map(data => {
                let todos = new Array<Todo>();
                data?.forEach(elem => todos.push(new Todo(elem)));
                return todos;
            })
        );
    }

    addTodo(todo:Partial<Todo>): Observable<Todo> {
        return this.http.post(this.apiUrl + "todo", {title: todo.title, isComplete: todo.completed}).pipe(
            catchError(err => of(null)),
            map(data => {
                return new Todo(data);
            })
        );
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