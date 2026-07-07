import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { NotificationsService } from '../../../core/services/notifications.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { MobileUserMenu } from '../mobile-dialogs/mobile-user-menu/mobile-user-menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ClickOutsideDirective, MatBadgeModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private dialog = inject(MatDialog);
  private breakpointObserver = inject(BreakpointObserver);
  authService = inject(AuthService);
  notificationsService = inject(NotificationsService);
  router = inject(Router);

  isMobile = signal(false);

  isDropdownOpen = signal(false);

  drawer = input<MatDrawer>();

  toggleDrawer() {
    this.drawer()?.toggle();
  }

  toggleDropdown() {
    if (this.isMobile()) {
      this.openMobileUserMenu();
      return;
    }

    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  openMobileUserMenu() {
    const dialogRef = this.dialog.open(MobileUserMenu, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'mobile-user-menu-dialog',
      data: {
        user: this.authService.currentUser(),
      },
    });

    dialogRef.afterClosed().subscribe((action) => {
      if (action === 'logout') {
        this.logout();
      }
    });
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
        this.notificationsService.loadNotifications().subscribe({
          error: () => {
            this.notificationsService.clearNotifications();
          },
        });
      }
    });

    this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }
}
