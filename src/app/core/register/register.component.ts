import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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
  fb = inject(FormBuilder);
  authService = inject(AuthService);

  registerForm = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/), Validators.minLength(8)]]
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
        this.passwordErrorMessage.set('Password must contain: uppercase letter and number');
      }
      if (this.registerForm.get("password")?.hasError('minlength')) {
        this.passwordErrorMessage.set('Password must be minimum 8 characters long');
      }
    } else {
      this.passwordErrorMessage.set('');
    }
  }

}
