import { OnInit, Component, ViewChild, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { AppUpdateService } from './services/app-update.service';
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
  constructor(
    public appUpdateService: AppUpdateService,
    public dialog: MatDialog
  ) {}

  @ViewChild('dialog', { static: true }) updateDialog: TemplateRef<any>;

  ngOnInit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = '30vw';
    dialogConfig.width = '30vh';
    dialogConfig.position = {
      top: '50%',
      left: '50%',
    };
    this.appUpdateService.updatesAvailable.subscribe((val) => {
      if (val) {
        this.dialog.open(this.updateDialog, dialogConfig);
      }
    });
  }
}
