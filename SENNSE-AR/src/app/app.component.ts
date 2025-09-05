import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,

} from '@angular/core';

import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'SENNSE-AR';
}
