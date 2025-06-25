import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-captura-camara',
  imports: [CommonModule, MatCardModule],
  templateUrl: './captura-camara.component.html',
  styleUrls: ['./captura-camara.component.css'],
})
export class CapturaCamaraComponent {
   /** Variables para la cámara */
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  capturedImageUrl: string | null = null;
  showModal = false;

  ngAfterViewInit() {}
  /**
   * @method openCameraModal
   * @description Abre el modal de la cámara
   */
  async openCameraModal() {
    this.showModal = true;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.video) {
        this.video.nativeElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('No se pudo acceder a la cámara', error);
    }
  }

  capturePhoto() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    const blob = this.dataURLtoBlob(imageDataUrl);
    this.capturedImageUrl = URL.createObjectURL(blob);

    this.closeCameraModal(); // cerrar modal después de capturar
  }

  /**
   * @method closeCameraModal
   * @description Cierra el modal de la cámara
   */
  closeCameraModal() {
    this.showModal = false;
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = null;
  }

  /**
   * @method dataURLtoBlob
   * @description Convierte la URL de la imagen a un blob
   * @param dataURL
   * @returns Blob
   */
  private dataURLtoBlob(dataURL: string): Blob {
    const [header, base64] = dataURL.split(',');
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: 'image/png' });
  }

  /**
   * @method ngOnDestroy
   * @description Detiene el stream de la cámara
   */
  ngOnDestroy() {
    this.stream?.getTracks().forEach(track => track.stop());
  }
}
