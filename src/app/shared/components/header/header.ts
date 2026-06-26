import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NotificationsService } from '../../../core/services/notifications.service';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ClickOutsideDirective, MatBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  authService = inject(AuthService);
  notificationsService = inject(NotificationsService);
  router = inject(Router);

  isDropdownOpen = signal(false);

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.isDropdownOpen.set(false);
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  showFirstLetterCurrentUser = computed(() => {
    const name = this.authService.currentUser()?.name;

    return name ? name[0].toUpperCase() : '';
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();

      if (user?.roles.includes('host')) {
        this.notificationsService.loadNotifications().subscribe();
      }
    });
  }
}
