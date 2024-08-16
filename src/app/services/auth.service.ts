import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

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

  isAuthenticated(): boolean {
    if (localStorage.getItem("access_token")) {
      if (!this.jwtHelper.isTokenExpired()) {
        return true;
      }
    }

    return false;
  }
}
