import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cartes-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cartes-services.component.html',
  styleUrl: './cartes-services.component.css'
})
export class CartesServicesComponent {
  // Événement émis pour ouvrir la modale QR
  readonly openQrScanner = output<void>();

  // Événement émis lorsqu'un fichier PDF est sélectionné
  readonly pdfSelected = output<File>();

  // Gestion du choix de fichier PDF
  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfSelected.emit(input.files[0]);
    }
  }
}