import { Component } from '@angular/core';
import { Header } from "./shared/components/header/header";
import { Footer } from "./shared/components/footer/footer";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
