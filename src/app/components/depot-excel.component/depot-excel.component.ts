import { Component, output } from '@angular/core';

@Component({
  selector: 'app-depot-excel',
  standalone: true,
  templateUrl: './depot-excel.component.html',
  styleUrl: './depot-excel.component.css'
})
export class DepotExcelComponent {
  // Output émis lorsqu'un fichier valide est réceptionné
  readonly surFichierRecu = output<File>();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.traiterFichier(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.traiterFichier(input.files[0]);
    }
  }

  private traiterFichier(file: File): void {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') {
      this.surFichierRecu.emit(file);
    } else {
      alert('Veuillez sélectionner un fichier Excel valide (.xlsx ou .xls)');
    }
  }
}