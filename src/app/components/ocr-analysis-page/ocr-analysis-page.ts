import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
import { OcrModalComponent } from '../ocr-modal/ocr-modal';

@Component({
  selector: 'app-ocr-analysis-page',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, OcrModalComponent],
  templateUrl: './ocr-analysis-page.html',
  styleUrl: './ocr-analysis-page.css'
})
export class OcrAnalysisPageComponent {
  private router = inject(Router);

  handleFile(file: File): void {
    console.log('Fichier sélectionné:', file.name);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}