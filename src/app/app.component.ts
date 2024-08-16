import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.checkAuth();
  }

  ngOnChanges() {
    this.checkAuth();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  checkAuth(): boolean {
    return this.authService.isAuthenticated();
  }

}
