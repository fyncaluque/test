import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CapturaCamaraComponent } from './captura-camara/captura-camara.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CapturaCamaraComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'test';
  photoPreviewUrl: string | null = null;

  onPhotoCaptured(event: { dataUrl: string; blobUrl: string }) {
        console.log('Base64:', event.dataUrl);
        console.log('URL del blob:', event.blobUrl);

        this.photoPreviewUrl = event.blobUrl;
    }
}
}
