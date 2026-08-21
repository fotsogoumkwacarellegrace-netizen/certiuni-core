import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ocr-modal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ocr-modal.html',
  styleUrl: './ocr-modal.css'
})
export class OcrModalComponent {
  fileSelected = output<File>();
  cancel = output<void>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files?.[0]) {
      this.fileSelected.emit(event.dataTransfer.files[0]);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}