import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService, Tuning } from '../../services/settings.service';
import { ActivationEnd, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AppUpdateService } from 'src/app/services/app-update.service';
import { MatIcon } from '@angular/material/icon';
import { FormControl } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnDestroy, AfterViewInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  public activeRoute: string;
  public hasFlashIcon: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public isDark = this.themeService.isDark;
  @ViewChild('settingsIcon', { static: false }) settingsIcon: MatIcon;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  private router$: Subscription;

  public tuningControl = new FormControl();
  public guitarTunings: Tuning[];
  public bassTunings: Tuning[];
  public ukueleleTunings: Tuning[];
  public chromaticTuning: Tuning[];
  public allTunings: Array<any>;

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
          this.hasFlashIcon.next(true);
        } else {
          this.hasFlashIcon.next(false);
        }
      }
    });
  }
  ngAfterViewInit(): void {
    if (!this.tuningControl.value) {
      const tuning = { name: 'Standard', noteString: 'E2 A2 D3 G3 B3 E4' };
      this.createAndAppendSpanElements(tuning);
    }
  }

  ngOnInit(): void {
    this.settingsService.isChromatic$.subscribe((val) => {
      this.hasFlashIcon.next(!val);
    });
    this.guitarTunings = this.settingsService.getGuitarTunings();
    this.bassTunings = this.settingsService.getBassTunings();
    this.ukueleleTunings = this.settingsService.getUkuleleTunings();
    this.chromaticTuning = this.settingsService.getChromatic();
    this.allTunings = [
      { instrument: 'Guitar', tunings: this.guitarTunings },
      { instrument: 'Bass', tunings: this.bassTunings },
      { instrument: 'Ukulele', tunings: this.ukueleleTunings },
      { instrument: 'Extras', tunings: this.chromaticTuning },
    ];
  }

  toggleDarkTheme() {
    this.themeService.toggleDarkTheme();
    this.isDark = !this.isDark;
  }

  private findTuning(code: string) {
    return this.allTunings
      .filter((tuning) => tuning.tunings.find((t) => t.code === code))
      .map((el) => {
        return el.tunings.filter((subEl) => subEl.code === code);
      })
      .flat();
  }

  private createAndAppendSpanElements(tuning: any) {
    const placeholder = document.querySelector('span.mat-select-placeholder');
    if (placeholder) {
      placeholder.innerHTML = '';
      const span1 = document.createElement('span');
      span1.className = 'tuningName';
      span1.textContent = tuning.name;
      span1.style.fontSize = '17px';
      const span2 = document.createElement('span');
      span2.className = 'tuningNotes';
      span2.textContent = tuning.noteString;
      span2.style.fontSize = '13px';
      placeholder.append(span1);
      placeholder.append(span2);
      return;
    }
    const matSelectText = document.querySelector('span.mat-select-value-text');
    const matSelectLine = document.querySelector('span.mat-select-min-line');
    matSelectLine
      ? matSelectText.removeChild(matSelectLine)
      : (matSelectText.innerHTML = '');
    const span1 = document.createElement('span');
    span1.className = 'tuningName';
    span1.textContent = tuning.name;
    const span2 = document.createElement('span');
    span2.className = 'tuningNotes';
    span2.textContent = tuning.noteString;
    span1.style.fontSize = '17px';
    span2.style.fontSize = '13px';
    let content = document.querySelector('div.mat-select-trigger');
    if (span2.textContent === '') {
      (content as HTMLElement).style.marginTop = '15px';
    } else {
      (content as HTMLElement).style.marginTop = null;
    }
    matSelectText.append(span1);
    matSelectText.append(span2);
  }

  public tuningSelected(e) {
    let found = this.findTuning(e.value);
    let tuning = { name: found[0].name, noteString: found[0].noteString };
    setTimeout(() => {
      this.createAndAppendSpanElements(tuning);
    });
    if (found[0].code === 'chromatic') {
      this.settingsService.setChromaticTuner(true);
      this.settingsService.setAutoDetection(false);
      this.hasFlashIcon.next(false);
    } else {
      this.hasFlashIcon.next(false);
      this.settingsService.setAutoDetection(true);
      this.settingsService.setChromaticTuner(false);
      this.settingsService.selectedInstrument$.next(found[0].instrument);
      this.settingsService.setTuning(found[0]);
    }
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
