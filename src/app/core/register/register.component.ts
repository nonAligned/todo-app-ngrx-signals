import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/), Validators.minLength(8)]]
  });

  usernameErrorMessage = signal("");
  emailErrorMessage = signal("");
  passwordErrorMessage = signal("");
  hide = signal(true);

  constructor() {
    merge(this.registerForm.statusChanges, this.registerForm.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  showHidePasswordClick(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    let newUser;

    if (this.registerForm.valid) {
      newUser = new User(this.registerForm.value);

      this.authService.register(newUser).pipe(
        catchError(error => {
          throw error
        })
      ).subscribe({
        next: (data: any) => {
          localStorage.setItem("access_token", data.token);
          this.router.navigate(['todos']);
        },
        error: err => err.error.forEach((error: any) => window.alert(error.description))
      });
    }
  }

  updateErrorMessage() {
    if (this.registerForm.get("username")?.errors) {
      if (this.registerForm.get("username")?.hasError('required')) {
        this.usernameErrorMessage.set('Username is required');
      }
      if (this.registerForm.get("username")?.hasError('minlength')) {
        this.usernameErrorMessage.set('Username must be minimum 3 characters long');
      }
      if (this.registerForm.get("username")?.hasError('maxlength')) {
        this.usernameErrorMessage.set('Username must be maximum 50 characters long');
      }
    } else {
      this.usernameErrorMessage.set('');
    }

    if (this.registerForm.get("email")?.errors) {
      if (this.registerForm.get("email")?.hasError('required')) {
        this.emailErrorMessage.set('Email is required');
      }
      if (this.registerForm.get("email")?.hasError('email')) {
        this.emailErrorMessage.set('Not a valid email');
      }
    } else {
      this.emailErrorMessage.set('');
    }

    if (this.registerForm.get("password")?.errors) {
      if (this.registerForm.get("password")?.hasError('required')) {
        this.passwordErrorMessage.set('Password is required');
      }
      if (this.registerForm.get("password")?.hasError('pattern')) {
        this.passwordErrorMessage.set('Password must contain: uppercase letter, non-alphanumeric and number');
      }
      if (this.registerForm.get("password")?.hasError('minlength')) {
        this.passwordErrorMessage.set('Password must be minimum 8 characters long');
      }
    } else {
      this.passwordErrorMessage.set('');
    }
  }

}
