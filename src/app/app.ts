import { Component, inject, OnInit } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.restoreSession();
  }
}
