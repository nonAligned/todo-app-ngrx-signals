import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { TodosComponent } from './todo/todos/todos.component';
import { authGuard } from './shared/auth.guard';
import { RegisterComponent } from './core/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'todos', component: TodosComponent, canActivate: [authGuard] },
    { path: "", redirectTo: "todos", pathMatch: "full"}
];
