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
}
