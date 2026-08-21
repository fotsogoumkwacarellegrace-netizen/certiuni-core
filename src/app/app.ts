import { Component } from '@angular/core';
import { OcrAnalysisPageComponent } from './components/ocr-analysis-page/ocr-analysis-page';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OcrAnalysisPageComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'certiuni-app';
}