import { Component, signal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recherche-uuid',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recherche-uuid.component.html',
  styleUrl: './recherche-uuid.component.css'
})
export class RechercheUuidComponent {
  readonly uuidInput = signal<string>('');
  readonly surRecherche = output<string>();
  readonly errorMessage = signal<string | null>(null);

  lancerRecherche(): void {
    const uuid = this.uuidInput().trim();

    if (!uuid) {
      this.errorMessage.set('Veuillez entrer un UUID.');
      return;
    }

    if (uuid.length !== 36) {
      this.errorMessage.set('L\'UUID doit contenir exactement 36 caractères.');
      return;
    }

    this.errorMessage.set(null);
    this.surRecherche.emit(uuid);
  }
}