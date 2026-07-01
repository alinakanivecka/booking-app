import { Component, inject, OnInit } from '@angular/core';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent, MatSidenavContainer, MatSidenavModule } from "@angular/material/sidenav";
import { Notifications } from "./features/host/pages/notifications/notifications";

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer, MatSidenavModule, Notifications],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authService = inject(AuthService);

  ngOnInit() {
    this.authService.restoreSession();
  }
}
