import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { of, Subscription } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  throttleTime,
} from 'rxjs/operators';
import { TunerService } from '../../tuner-service/tuner.service';
import {
  Instrument,
  SettingsService,
  Tuning,
} from '../settings-service/settings.service';
import { ViewEncapsulation } from '@angular/core';
export interface Note {
  note: string;
  freq: number;
}

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
})
export class TunerComponent implements OnInit, OnDestroy {
  public frequency: number;
  public selectedInstrument: Instrument;
  public selectedTuning: any;
  public tuning: any;
  @ViewChild('freqSlider', { static: false })
  freqSlider: ElementRef<HTMLInputElement>;
  @ViewChild('noteDisplay', { static: false })
  noteDisplay: ElementRef<HTMLHeadingElement>;
  public gauge: any;
  public opts: any;
  elem: any;
  public closestNote: Note = {
    note: 'E2',
    freq: 82.41,
  };

  private pitchSubscription: Subscription;
  private instrumentSubscription: Subscription;
  private tuningSubscription: Subscription;

  public options: Options = {
    showTicks: true,
    showTicksValues: false,
    readOnly: true,
    floor: parseFloat((this.closestNote.freq -50).toFixed(2)),
    ceil: parseFloat((this.closestNote.freq + 50).toFixed(2)),
    step: 0.01,
    ticksArray: [
      parseFloat((this.closestNote.freq -50).toFixed(2)),
      0.99 * this.closestNote.freq,
      this.closestNote.freq,
      this.closestNote.freq * 1.01,
      parseFloat((this.closestNote.freq + 50).toFixed(2)),
    ],
  };

  constructor(
    public tunerService: TunerService,
    public settingsService: SettingsService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  public selectString(note: Note) {
    this.settingsService.setAutoDetection(false);
    this.closestNote = this.selectedTuning.notes.find(
      (notes: Note) => notes.note === note.note
    );
    this.setOptions();
  }

  private setOptions() {
    this.options = {
      showTicks: true,
      showTicksValues: false,
      readOnly: true,
      floor: parseFloat((this.closestNote.freq -50).toFixed(2)),
      ceil: parseFloat((this.closestNote.freq + 50).toFixed(2)),
      step: 0.01,
      ticksArray: [
        parseFloat((this.closestNote.freq -50).toFixed(2)),
        0.99 * this.closestNote.freq,
        this.closestNote.freq,
        this.closestNote.freq * 1.01,
        parseFloat((this.closestNote.freq + 50).toFixed(2)),
      ],
    };
  }

  public inRange(x, min, max) {
    return (x - min) * (x - max) <= 0;
  }

  public findClosest(input, goal) {
    return input.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );
  }

  private setupAndSubscribeToPitchSubject() {
    this.tunerService.setup();
    if (!this.pitchSubscription) {
      this.pitchSubscription = this.tunerService.pitchSubject
        .pipe(
          throttleTime(300),
          distinctUntilChanged(),
          filter((value) => value < 30 || value < this.closestNote.freq * 2),
          concatMap((value) => {
            if (this.inRange(value, value * 1.99, value * 2.01)) {
              return of(value / 2);
            } else {
              return of(value);
            }
          }),
          map(( value) => {
            return Math.round(value * 100 + Number.EPSILON) / 100
          }),
          switchMap(async (value) => (this.frequency = parseFloat(value.toFixed(2))))
        )
        .subscribe(() => {
          
          if (this.settingsService.getAutoDetection()) {
            this.closestNote.freq = this.findClosest(
              this.tuning.map((notes: Note) => notes.freq),
              this.frequency
            );
            this.closestNote.note = this.tuning.find(
              (note: Note) => note.freq === this.closestNote.freq
            ).note;
            this.setOptions();
          }
          if (
            this.inRange(
              this.frequency,
              this.closestNote.freq * 0.99,
              this.closestNote.freq * 1.01
            )
          ) {
            this.renderer.setStyle(
              this.noteDisplay.nativeElement,
              'color',
              '#00e676'
            );
          } else {
            this.renderer.removeStyle(this.noteDisplay.nativeElement, 'color');
          }
        });
    }
  }

  ngOnInit() {
    if (!!!this.frequency) {
      this.frequency = this.closestNote.freq
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pitchSubscription.unsubscribe();
        this.instrumentSubscription.unsubscribe();
        this.tuningSubscription.unsubscribe();
      }
    });
    if (this.instrumentSubscription === undefined) {
      this.instrumentSubscription =
        this.settingsService.selectedInstrument$.subscribe((selected) => {
          this.selectedInstrument = selected;
        });
    }
    if (this.tuningSubscription === undefined) {
      this.tuningSubscription = this.settingsService.selectedTuning$.subscribe(
        (selected) => {
          this.selectedTuning = selected;
          this.tuning = this.selectedTuning.notes;
        }
      );
    }

    this.setupAndSubscribeToPitchSubject();
  }

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
    this.instrumentSubscription.unsubscribe();
    this.tuningSubscription.unsubscribe();
  }
}
