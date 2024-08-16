import { inject, Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, map, of } from "rxjs";

@Injectable({providedIn: "root"})
export class UniqueUsernameValidator implements AsyncValidator {
    authService = inject(AuthService);

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.authService.usernameExists(control.value).pipe(
            map((isTaken) => (isTaken ? { usernameNotUnique: true} : null)),
            catchError(() => of(null))
        );
    }
}