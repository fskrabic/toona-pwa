import { Component, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../services/settings.service';
import { ActivationEnd, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AppUpdateService } from 'src/app/services/app-update.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public activeRoute: string;
  public hasFlashIcon: boolean;
  public isDark = this.themeService.isDark;
  @ViewChild('settingsIcon', { static: false }) settingsIcon: MatIcon;
  private router$: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar,
    private settingsService: SettingsService,
    private themeService: ThemeService,
    private router: Router,
    public appUpdateService: AppUpdateService
  ) {
    this.router$ = this.router.events.subscribe((val) => {
      if (val instanceof ActivationEnd) {
        this.activeRoute = this.router.url;
        if (
          this.activeRoute === '/metronome' ||
          this.activeRoute === '/tuner'
        ) {
          this.hasFlashIcon = true;
        } else {
          this.hasFlashIcon = false;
        }
      }
    });
  }

  toggleDarkTheme() {
    this.themeService.toggleDarkTheme();
    this.isDark = !this.isDark;
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

  ngOnDestroy() {
    this.router$.unsubscribe();
  }
}
