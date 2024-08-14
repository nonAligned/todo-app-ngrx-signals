import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { TodosComponent } from './todo/todos/todos.component';
import { authGuard } from './shared/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'todos', component: TodosComponent, canActivate: [authGuard] },
    { path: "", redirectTo: "todos", pathMatch: "full"}
];
