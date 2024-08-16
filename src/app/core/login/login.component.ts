import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule, 
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  hide = signal(true);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })

  usernameErrorMessage = signal('');
  passwordErrorMessage = signal('');

  showHidePasswordClick(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  
  constructor() {
    merge(this.loginForm.statusChanges, this.loginForm.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  onSubmit() {
    if(this.loginForm.valid) {
      let username = this.loginForm.get("username")?.value;
      let password = this.loginForm.get("password")?.value;

      this.authService.login(username!, password!).pipe(
        catchError(error => {
          throw error
        })
      ).subscribe({
        next: (data: any) => {
          localStorage.setItem("access_token", data.token)
          this.router.navigate(['todos']);
        },
        error: err => window.alert(err.error)
      });
    }
  }

  updateErrorMessage() {
    if (this.loginForm.get("username")?.hasError('required')) {
      this.usernameErrorMessage.set('Username is required');
    } else {
      this.usernameErrorMessage.set('');
    }

    if (this.loginForm.get("password")?.hasError('required')) {
      this.passwordErrorMessage.set('Password is required');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  logout() {
    this.authService.logout();
  }

}