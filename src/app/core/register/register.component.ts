import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { catchError, merge } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user.model';
import { Router, RouterLink } from '@angular/router';
import { UniqueUsernameValidator } from '../../shared/uniqueUsername.validator';
import { UniqueEmailValidator } from '../../shared/uniqueEmail.validator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { getErrorMessage } from '../../shared/error-handler';

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private usernameValidator = inject(UniqueUsernameValidator);
  private emailValidator = inject(UniqueEmailValidator);

  registerForm = new FormGroup({
    username: new FormControl("", {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      asyncValidators: [this.usernameValidator.validate.bind(this.usernameValidator)],
      updateOn: "blur"
    }),
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.emailValidator.validate.bind(this.emailValidator)],
      updateOn: "blur"
    }),
    password: new FormControl("", {
      validators: [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*\W).+$/), Validators.minLength(8)]
    })
  })

  usernameErrorMessage = signal("");
  emailErrorMessage = signal("");
  passwordErrorMessage = signal("");
  hide = signal(true);
  readonly isDataLoading = signal(false);

  constructor() {
    merge(
      this.registerForm.get('username')?.statusChanges!,
      this.registerForm.get('email')?.statusChanges!,
      this.registerForm.get('password')?.statusChanges!,
      this.registerForm.get('username')?.valueChanges!,
      this.registerForm.get('email')?.valueChanges!,
      this.registerForm.get('password')?.valueChanges!)
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
      this.isDataLoading.set(true);
      newUser = new User(this.registerForm.value);

      this.authService.register(newUser).pipe(
        catchError(error => {
          throw error
        })
      ).subscribe({
        next: (data: any) => {
          this.isDataLoading.set(false);
          localStorage.setItem("access_token", data.token);
          this.router.navigate(['todos']);
        },
        error: err => {
          this.isDataLoading.set(false);
          window.alert(getErrorMessage(err));
        }
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
      if (this.registerForm.get("username")?.hasError('usernameNotUnique')) {
        this.usernameErrorMessage.set('Username already exists');
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
      if (this.registerForm.get("email")?.hasError('emailNotUnique')) {
        this.emailErrorMessage.set('Email already registered');
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
