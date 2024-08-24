import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatSidenavModule, MatIconModule],
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
