import { Todo } from "../model/todo.model"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"
import { TodosService } from "../services/todos.service";
import { computed, inject } from "@angular/core";
import { of, switchMap } from "rxjs";
import { PageEvent } from "@angular/material/paginator";

export type TodosParams = {
    SortBy?: string;
    IsDescending?: boolean;
}

type TodosState = {
    todos: Todo[];
    numOfTodos: number;
    loading: boolean;
    filter: string;
    page: number;
    pageSize: number;
    params: TodosParams;
}

const initialState: TodosState = {
    todos: [],
    numOfTodos: 0,
    loading: false,
    filter: "all",
    page: 1,
    pageSize: 5,
    params: {
        SortBy: "CreatedAt",
        IsDescending: true
    }
}

export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store, todosService = inject(TodosService)) => ({

            loadAll() {
                patchState(store, {loading: true});

                todosService.getTodos(store.params()).subscribe(todos => {
                    patchState(store, { todos, loading: false });
                });
            },

            addTodo(title: string) {
                todosService.addTodo({title, completed: false}).pipe(
                    switchMap(todo => {
                        if (todo.id) {
                            return todosService.getTodos(store.params());
                        } else {
                            return of(null);
                        }
                    })
                ).subscribe({
                    next: (data => {
                        if (data) {
                            patchState(store, {todos: data})
                        } else {
                            window.alert("There was a problem saving your todo in the database");
                        }
                    })
                })
            },

            deleteTodo(id: string) {
                const sub = todosService.deleteTodo(id).pipe(
                    switchMap(success => {
                        if (success) {
                            return todosService.getTodos(store.params());
                        } else {
                            return of(null);
                        }
                    })
                ).subscribe({
                    next: (data => {
                        if (data) {
                            patchState(store, {todos: data})
                        } else {
                            window.alert("There was a problem deleting your todo");
                        }
                    })
                })
            },

            updateTodo(id: string, completed: boolean, title: string) {
                todosService.updateTodo(id, completed, title).pipe(
                    switchMap(todo => {
                        if (todo.id) {
                            return todosService.getTodos(store.params());
                        } else {
                            return of(null);
                        }
                    })
                ).subscribe({
                    next: (data => {
                        if (data) {
                            patchState(store, {todos: data})
                        } else {
                            window.alert("There was a problem updating your todo");
                        }
                    })
                })
            },

            updateFilter(newFilter: string) {
                patchState(store, {filter: newFilter});
            },

            updatePage(newPage: PageEvent) {
                patchState(store, {page: newPage.pageIndex+1, pageSize: newPage.pageSize});
            },

            updateSort(isDescending: boolean) {
                let newParams = store.params();
                newParams.IsDescending = isDescending;

                patchState(store, {params: newParams});

                todosService.getTodos(store.params()).subscribe(todos => {
                    patchState(store, { todos });
                });
            }
            
        })
    ), withComputed(
        (state) => ({
            filteredTodos: computed(() => {
                const todos = state.todos();
                const skipNumber = (state.page() - 1) * state.pageSize();

                switch(state.filter()) {
                    case "all":
                        return todos.slice(skipNumber, skipNumber + state.pageSize());
                    case "pending":
                        return todos.filter(todo => !todo.completed).slice(skipNumber, skipNumber + state.pageSize());
                    case "completed":
                        return todos.filter(todo => todo.completed).slice(skipNumber, skipNumber + state.pageSize());
                    default:
                        return todos.slice(skipNumber, skipNumber + state.pageSize());
                }
            }),

            todosLength: computed(() => {
                const todos = state.todos();

                switch(state.filter()) {
                    case "all":
                        return todos.length;
                    case "pending":
                        return todos.filter(todo => !todo.completed).length;
                    case "completed":
                        return todos.filter(todo => todo.completed).length;
                    default:
                        return todos.length;
                }
            })
        }
    ))
);