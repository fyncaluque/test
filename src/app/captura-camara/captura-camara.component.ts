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
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  imageDataUrl: string | null = null;
  private stream: MediaStream | null = null;


  async ngAfterViewInit() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Error al acceder a la cámara', err);
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

    this.imageDataUrl = canvas.toDataURL('image/png');
  }

  uploadPhoto() {
    if (!this.imageDataUrl) return;

    const blob = this.dataURLtoBlob(this.imageDataUrl);
    const formData = new FormData();
    formData.append('photo', blob, 'captured.png');

    // this.http.post('/api/upload', formData).subscribe({
    //   next: res => console.log('Imagen enviada', res),
    //   error: err => console.error('Error al enviar la imagen', err)
    // });
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const [header, base64] = dataURL.split(',');
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new Blob([array], { type: 'image/png' });
  }

  ngOnDestroy() {
    this.stream?.getTracks().forEach(track => track.stop());
  }
}
