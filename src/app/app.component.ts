import { OnInit, Component } from '@angular/core';
export interface Note {
  note: string;
  freq: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

}
