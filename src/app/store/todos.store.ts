import { Todo } from "../model/todo.model"
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"
import { TodosService } from "../services/todos.service";
import { computed, inject } from "@angular/core";

export type TodosFilter =
    "all" | "pending" | "completed";

type TodosState = {
    todos: Todo[];
    loading: boolean;
    filter: TodosFilter;
}

const initialState: TodosState = {
    todos: [],
    loading: false,
    filter: "all"
}

export const TodosStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods(
        (store, todosService = inject(TodosService)) => ({

            loadAll() {
                patchState(store, {loading: true});

                todosService.getTodos().subscribe(todos => {
                    patchState(store, { todos, loading: false });
                });
            },

            async addTodo(title: string) {
                todosService.addTodo({title, completed: false}).subscribe(todo => {
                    if(todo.id) {
                        patchState(store, (state) => ({
                            todos: [...state.todos, todo]
                        }))
                    } else {
                        window.alert("There was a problem saving your todo in the database");
                    }
                })

            },

            deleteTodo(id: string) {
                todosService.deleteTodo(id).subscribe(success => {
                    if (success === true) {
                        patchState(store, (state) => ({
                            todos: state.todos.filter(todo => todo.id !== id)
                        }))
                    } else {
                        window.alert("There was a problem deleting your todo");
                    }
                })

            },

            updateTodo(id: string, completed: boolean) {
                todosService.updateTodo(id, completed, store.todos().filter(todo => todo.id === id)[0].title).subscribe(todo => {
                    if (todo.id) {
                        patchState(store, (state) => ({
                            todos: state.todos.map(todo => todo.id === id ? {...todo, completed} : todo)
                        }));
                    } else {
                        window.alert("There was a problem updating your todo");
                    }
                });
            },

            updateFilter(filter: TodosFilter) {
                patchState(store, {filter});
            }
            
        })
    ),
    withComputed((state) => ({
        filteredTodos: computed(() => {
            const todos = state.todos();

            switch(state.filter()) {
                case "all":
                    return todos;
                case "pending":
                    return todos.filter(todo => !todo.completed);
                case "completed":
                    return todos.filter(todo => todo.completed);
            }
        })
    }))
);