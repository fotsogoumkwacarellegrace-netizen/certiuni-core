import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Candidate } from '../../models/candidate.model';
import { CandidateDrawerComponent } from '../candidate-drawer/candidate-drawer';


@Component({
  selector: 'app-bulk-dashboard',
  standalone: true,
  imports: [CommonModule, CandidateDrawerComponent],
  templateUrl: './bulk-dashboard.html',
  styleUrl: './bulk-dashboard.css'
})
export class BulkDashboardComponent {
  selectedCandidate = signal<Candidate | null>(null);

  candidates = signal<Candidate[]>([
    {
      id: 'CD-8882',
      name: 'Marie Ngo',
      status: 'Verified',
      program: 'Master Ingénierie Info.',
      average: 15.2,
      courses: [
        { title: 'Architecture des Logiciels', semester: 'Semestre 1', grade: 16.5, credits: 6 },
        { title: 'Sécurité des Systèmes', semester: 'Semestre 1', grade: 14.0, credits: 4 },
        { title: 'Algorithmique Avancée', semester: 'Semestre 1', grade: 17.5, credits: 6 },
        { title: 'Bases de Données Réparties', semester: 'Semestre 2', grade: 11.0, credits: 4 },
        { title: 'Gestion de Projet IT', semester: 'Semestre 2', grade: 15.0, credits: 4 }
      ]
    },
    { id: 'CD-8883', name: 'Jean Paul Mbonge', status: 'Pending' },
    { id: 'CD-8884', name: 'Amina Sori', status: 'Failed' }
  ]);

  openNotes(candidate: Candidate): void {
    this.selectedCandidate.set(candidate);
  }

  closeDrawer(): void {
    this.selectedCandidate.set(null);
  }
}