import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export interface Note {
  note: string;
  freq: number;
}

@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TunerComponent implements OnInit, OnDestroy {
  public frequency: number;
  public selectedInstrument: Instrument;
  public selectedTuning: any;
  public tuning: any;
  @ViewChild('test', { static: false }) test: ElementRef<HTMLDivElement>;
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

  constructor(
    private tunerService: TunerService,
    public settingsService: SettingsService,
    private cdr: ChangeDetectorRef
  ) {}

  public selectString(note: Note) {
    this.settingsService.setAutoDetection(false);
    this.closestNote = this.selectedTuning.notes.find(
      (notes: Note) => notes.note === note.note
    );
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
    this.pitchSubscription = this.tunerService.pitchSubject
      .pipe(
        throttleTime(300),
        distinctUntilChanged(),
        filter((value) => value < 30 || value < this.closestNote.freq * 2.3),
        concatMap((value) => {
          if (this.inRange(value, value * 1.98, value * 2.02)) {
            return of(value / 2);
          } else {
            return of(value);
          }
        }),
        map((value) => Math.round(value * 100 + Number.EPSILON) / 100),
        switchMap(async (value) => (this.frequency = value))
      )
      .subscribe(() => {
        this.cdr.detectChanges();
        if (this.settingsService.getAutoDetection()) {
          this.closestNote.freq = this.findClosest(
            this.tuning.map((notes: Note) => notes.freq),
            this.frequency
          );
          this.closestNote.note = this.tuning.find(
            (note: Note) => note.freq === this.closestNote.freq
          ).note;
        }
      });
  }

  ngOnInit() {
    this.instrumentSubscription =
      this.settingsService.selectedInstrument$.subscribe((selected) => {
        this.selectedInstrument = selected;
      });
    this.tuningSubscription = this.settingsService.selectedTuning$.subscribe(
      (selected) => {
        this.selectedTuning = selected;
        this.tuning = this.selectedTuning.notes;
      }
    );
    this.setupAndSubscribeToPitchSubject();
  }

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
    this.instrumentSubscription.unsubscribe();
    this.tuningSubscription.unsubscribe();
  }
}
