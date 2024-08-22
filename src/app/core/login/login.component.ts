import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinner, 
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  private router = inject(Router);
  readonly isDataLoading = signal(false);
  
  loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  })
  
  readonly hide = signal(true);
  readonly usernameErrorMessage = signal('');
  readonly passwordErrorMessage = signal('');

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
      this.isDataLoading.set(true);
      let username = this.loginForm.get("username")?.value;
      let password = this.loginForm.get("password")?.value;

      this.authService.login(username!, password!).pipe(
        catchError(error => {
          throw error
        })
      ).subscribe({
        next: (data: any) => {
          localStorage.setItem("access_token", data.token)
          this.isDataLoading.set(false);
          this.router.navigate(['todos']);
        },
        error: err => {
          this.isDataLoading.set(false);
          window.alert(err.error);
        }
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
}