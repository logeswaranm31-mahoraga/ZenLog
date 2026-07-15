import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Authentication } from '../core/service/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Zenlog');
  user:any;
  avatarMenuOpen = false;

  constructor(private auth:Authentication){
    this.auth.currentUser$.subscribe((data)=>{
      this.user = data
    })
  }

  toggleAvatarMenu(): void {
    this.avatarMenuOpen = !this.avatarMenuOpen;
  }

  logout(): void {
    this.auth.logout();
  }
}
