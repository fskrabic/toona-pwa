import { OnInit, Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public appUpdateService: AppUpdateService,
    public dialog: MatDialog
  ) {}

  @ViewChild('dialog', { static: true }) updateDialog: TemplateRef<any>;

  ngOnInit() {
    this.appUpdateService.updatesAvailable.subscribe((available) => {
      if (available) {
        this.dialog.open(this.updateDialog);
      }
    });
  }
}
