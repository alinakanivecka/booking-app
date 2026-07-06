import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import {  MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-mobile-user-menu',
  imports: [RouterLink],
  templateUrl: './mobile-user-menu.html',
  styleUrl: './mobile-user-menu.scss',
})
export class MobileUserMenu {
  authService = inject(AuthService);
  dialogRef = inject(MatDialogRef<MobileUserMenu>);

  showFirstLetterCurrentUser = computed(() => {
    const name = this.authService.currentUser()?.name;

    return name ? name[0].toUpperCase() : '';
  });

  logoutClicked() {
    this.dialogRef.close('logout');
  }

  close() {
    this.dialogRef.close();
  }
}
