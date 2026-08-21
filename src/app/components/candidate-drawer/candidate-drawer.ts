import { Component, input, output } from '@angular/core';
import { Candidate } from '../../models/candidate.model';

@Component({
  selector: 'app-candidate-drawer',
  standalone: true,
  templateUrl: './candidate-drawer.html',
  styleUrl: './candidate-drawer.css'
})
export class CandidateDrawerComponent {
  candidate = input<Candidate | null>(null);
  close = output<void>();

  onClose(): void {
    this.close.emit();
  }

  exportPdf(): void {
    window.print();
  }
}