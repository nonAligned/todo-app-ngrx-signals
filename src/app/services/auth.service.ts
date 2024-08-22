import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/user.model';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private http = inject(HttpClient);
  private jwtHelper = inject(JwtHelperService);

  login(username: string, password: string) {
    return this.http.post(this.apiUrl + "account/login", {username, password});
  }

  logout() {
    localStorage.removeItem("access_token");
  }

  register(newUser: User) {
    return this.http.post(this.apiUrl + "account/register", newUser);
  }

  emailExists(email: string) {
    let queryParams = {
      params: new HttpParams()
        .set("email", email || "")
    };

    return this.http.get<boolean>(this.apiUrl + "account/check-email", queryParams);
  }

  usernameExists(username: string) {
    let queryParams = {
      params: new HttpParams()
        .set("username", username || "")
    };

    return this.http.get<boolean>(this.apiUrl + "account/check-username", queryParams);
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem("access_token")) {
      if (!this.jwtHelper.isTokenExpired()) {
        return true;
      }
    }

    return false;
  }
}
