import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Signal pour l'ouverture/fermeture du menu mobile
  isMobileMenuOpen = signal<boolean>(false);

  // Signal pour le choix de la langue
  currentLang = signal<'FR' | 'EN'>('FR');

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  setLanguage(lang: 'FR' | 'EN'): void {
    this.currentLang.set(lang);
  }

  
}