import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderComponent } from '../header.component/header.component';
import { RechercheUuidComponent } from '../recherche-uuid.component/recherche-uuid.component';
import { CartesServicesComponent } from '../cartes-services.component/cartes-services.component';
import { DepotExcelComponent } from '../depot-excel.component/depot-excel.component';
import { FooterComponent } from '../footer.component/footer.component';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    HeaderComponent,
    RechercheUuidComponent,
    CartesServicesComponent,
    DepotExcelComponent,
    FooterComponent
  ],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent {
  private router = inject(Router);

  // 1. Gestion de la recherche UUID
  traiterRecherche(uuid: string): void {
    this.router.navigate(['/verify', uuid]);
  }

  // 2. Gestion de l'ouverture du scanner QR
  onOpenQrScannerModal(): void {
    console.log('Ouverture du scanner QR');
    // Logique ou redirection vers votre modale/route scanner
  }

  // 3. Traitement du fichier PDF sélectionné
  onProcessPdf(file: File): void {
    console.log('Fichier PDF sélectionné :', file.name);
    // Logique d'analyse du fichier PDF
  }

  
}