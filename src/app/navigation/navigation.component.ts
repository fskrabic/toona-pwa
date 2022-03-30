import { ChangeDetectorRef, Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../settings-service/settings.service';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';

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

  public width: number;
  public activeRoute: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof ActivationEnd) {
        this.activeRoute = this.router.url;
      }
    });
  }

  openSnackbar() {
    if (this.activeRoute === '/metronome') {
      this.settingsService.showTapTempo$.next(
        !this.settingsService.showTapTempo$.getValue()
      );
    } else {
      this.settingsService.setAutoDetection(
        !this.settingsService.getAutoDetection()
      );
      let message = this.settingsService.getAutoDetection()
        ? 'enabled.'
        : 'disabled.';
      this.snackbar.open('Automatic string detection ' + message, 'Dismiss', {
        duration: 3000,
      });
    }
  }
}
