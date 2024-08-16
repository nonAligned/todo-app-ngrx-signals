import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { TodosComponent } from './todo/todos/todos.component';
import { authGuard } from './shared/auth.guard';
import { RegisterComponent } from './core/register/register.component';
import { logGuard } from './shared/log.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [logGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [logGuard] },
    { path: 'todos', component: TodosComponent, canActivate: [authGuard] },
    { path: "", redirectTo: "todos", pathMatch: "full"}
];
