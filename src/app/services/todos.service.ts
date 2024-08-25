import { inject, Injectable } from "@angular/core";
import { Todo } from "../model/todo.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { catchError, map, Observable, of } from "rxjs";
import { getErrorMessage } from "../shared/error-handler";

@Injectable({
    providedIn: "root"
})
export class TodosService {
    private apiUrl: string = environment.apiUrl;
    private http = inject(HttpClient)

    getTodos(params?: any): Observable<Todo[]> {
        let queryParams = {}


        if(params) {
            queryParams = new HttpParams({fromObject: params});
        }

        return this.http.get<Array<Todo>>(this.apiUrl + "todo", {params: queryParams}).pipe(
            catchError(err => {
                window.alert(getErrorMessage(err));
                return of(null)
            }),
            map(data => {
                let todos = new Array<Todo>();
                if (data) {
                    data?.forEach(elem => todos.push(new Todo(elem)));
                }
                return todos;
            })
        );
    }

    addTodo(todo:Partial<Todo>): Observable<Todo> {
        return this.http.post(this.apiUrl + "todo", {title: todo.title, isComplete: todo.completed}).pipe(
            catchError(err => {
                window.alert(getErrorMessage(err));
                return of(null)
            }),
            map(data => {
                return new Todo(data);
            })
        );
    }

    deleteTodo(id:string): Observable<boolean> {
        return this.http.delete(this.apiUrl + "todo/" + id).pipe(
            catchError(err => {
                window.alert(getErrorMessage(err));
                return of(false)
            }),
            map(data => {
                if (data === false) {
                    return false;
                }
                return true;
            })
        );
    }

    updateTodo(id:string, completed: boolean, title: string): Observable<Todo> {
        return this.http.put(this.apiUrl + "todo/" + id, {title: title, isComplete: completed}).pipe(
            catchError(err => {
                window.alert(getErrorMessage(err));
                return of(null)
            }),
            map(data => {
                return new Todo(data);
            })
        );
    }
}