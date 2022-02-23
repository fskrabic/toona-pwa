import { ChangeDetectorRef, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../settings-service/settings.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private settingsService: SettingsService
  ) {}

  public width: number;

  openSnackbar() {
    this.settingsService.setAutoDetection(!this.settingsService.getAutoDetection());
    let message = this.settingsService.getAutoDetection() ? 'enabled.' : 'disabled.';
    this.snackbar.open("Automatic string detection " + message, 'Dismiss', {duration: 3000});
  }

  setWidth(widthNumber: number) {
    this.width = widthNumber;
    this.cdr.detectChanges();
  }
}
