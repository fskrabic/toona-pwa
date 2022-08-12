import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Options } from '@angular-slider/ngx-slider';
import { of, Subscription } from 'rxjs';
import { concatMap, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { TunerService } from '../../services/tuner.service';
import {
  Instrument,
  SettingsService,
  Tuning,
} from '../../services/settings.service';
import { FormControl } from '@angular/forms';
import { ChromaticNotes } from 'src/app/services/note.consts';
import { guitarStandard } from 'src/app/services/tuning.consts';

export interface Note {
  note: string;
  freq: number;
}
@Component({
  selector: 'app-tuner',
  templateUrl: './tuner.component.html',
  styleUrls: ['./tuner.component.scss'],
})
export class TunerComponent implements OnInit, OnDestroy, AfterViewInit {
  public frequency: number;
  public selectedInstrument: Instrument;
  public selectedTuning: any;
  public tuning = guitarStandard;
  @ViewChild('noteDisplay', { static: false })
  noteDisplay: ElementRef<HTMLHeadingElement>;

  public closestNote: Note = {
    note: 'E2',
    freq: 82.41,
  };

  public tuningControl = new FormControl();
  public guitarTunings;
  public bassTunings;
  public chromaticNotes: Note[];

  public pitchSubscription: Subscription;
  public instrumentSubscription: Subscription;
  public tuningSubscription: Subscription;

  public options: Options = {
    showTicks: true,
    showTicksValues: false,
    readOnly: true,
    floor: parseFloat((this.closestNote.freq - 5).toFixed(2)),
    ceil: parseFloat((this.closestNote.freq + 5).toFixed(2)),
    step: 0.02,
    ticksArray: [this.closestNote.freq],
  };

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private themeColor: string;

  private analyzerFreq: AnalyserNode;
  private audioContext: AudioContext;

  constructor(
    public tunerService: TunerService,
    public settingsService: SettingsService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  private themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mut) => {
      if ((mut.target as HTMLElement).classList.contains('dark-theme')) {
        this.themeColor = '#ff8f00';
        this.ctx.fillStyle = '#ff8f00';
      } else {
        this.themeColor = '#1565c0';
        this.ctx.fillStyle = '#1565c0';
      }
      return;
    });
  });

  private sidenavObserver = new MutationObserver((mutations) => {
    mutations.forEach((mut) => {
      const slider = document
        .querySelector('.custom-slider')
        .querySelector('ngx-slider');
      if ((mut.target as HTMLElement).classList.contains('mat-drawer-opened')) {
        (slider as HTMLElement).style.width = '66vw';
      } else {
        (slider as HTMLElement).style.width = '75vw';
      }
      return;
    });
  });

  private containerResizeObserver = new ResizeObserver((res) => {
    res.forEach((re) => {
      this.canvas.height = re.contentRect.height / 2;
      this.canvas.width = re.contentRect.width * 0.95;
      this.canvas.style.bottom = '0px';
      this.ctx.fillStyle = this.themeColor;
    });
    return;
  });

  public selectString(note: Note) {
    this.settingsService.setAutoDetection(false);
    this.closestNote = this.selectedTuning.notes.find(
      (notes: Note) => notes.note === note.note
    );
    this.frequency = this.closestNote.freq;
    this.setOptions();
  }

  private setOptions() {
    if (this.settingsService.isChromatic$.value) {
      this.options = {
        showTicks: true,
        showTicksValues: false,
        readOnly: true,
        floor: parseFloat((this.closestNote.freq - 5).toFixed(2)),
        ceil: parseFloat((this.closestNote.freq + 5).toFixed(2)),
        step: 0.02,
        ticksArray: [this.closestNote.freq],
      };
    } else {
      this.options = {
        showTicks: true,
        showTicksValues: false,
        readOnly: true,
        floor: parseFloat((this.closestNote.freq - 5).toFixed(2)),
        ceil: parseFloat((this.closestNote.freq + 5).toFixed(2)),
        step: 0.02,
        ticksArray: [this.closestNote.freq],
      };
    }
  }

  public inRange(x: number, min: number, max: number) {
    return (x - min) * (x - max) <= 0;
  }

  public findClosest(input: Array<number>, goal: number) {
    return input.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );
  }

  private initCanvas() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  private async getAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    this.analyzerFreq = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyzerFreq);
    this.analyzerFreq.fftSize = 2 ** 10;
    const frequencyData = new Uint8Array(this.analyzerFreq.frequencyBinCount);
   
    this.drawFrequencyData(frequencyData);
  }

  private drawFrequencyData(data: Uint8Array) {
    this.analyzerFreq.getByteFrequencyData(data);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const barWidth = (this.canvas.width / 512) * 8;
    let spacing = 0;
    if (!this.themeColor) {
      if (document.body.classList.contains('dark-theme')) {
        this.themeColor = '#ff8f00';
      } else {
        this.themeColor = '#1565c0';
      }
    }
    data.forEach((amount) => {
      const percent = amount / 255;
      const barHeight = (this.canvas.height * percent) / 2;
      this.ctx.fillStyle = this.themeColor;
      this.ctx.fillRect(
        spacing,
        parseInt((this.canvas.height - barHeight).toString()),
        barWidth,
        barHeight
      );
      spacing += barWidth + 5;
    });
    requestAnimationFrame(() => {
      this.drawFrequencyData(data);
    });
  }

  private setupAndSubscribeToPitchSubject() {
    if (this.tunerService.isSetup === false) {
      this.tunerService.setup();
    }
    if (!this.pitchSubscription) {
      this.pitchSubscription = this.tunerService.pitchSubject
        .pipe(
          distinctUntilChanged(),
          concatMap((value) => {
            if (
              this.inRange(
                value,
                this.closestNote.freq * 1.95,
                this.closestNote.freq * 2.05
              )
            ) {
              return of(value / 2);
            } else if (
              this.inRange(
                value,
                this.closestNote.freq * 2.95,
                this.closestNote.freq * 3.05
              )
            ) {
              return of(value / 3);
            } else if (
              this.inRange(
                value,
                this.closestNote.freq * 3.95,
                this.closestNote.freq * 4.05
              )
            ) {
              return of(value / 4);
            } else if (
              this.inRange(
                value,
                this.closestNote.freq * 4.95,
                this.closestNote.freq * 5.05
              )
            ) {
              return of(value / 5);
            } else {
              return of(value);
            }
          }),
          switchMap(
            async (value) => (this.frequency = parseFloat(value.toFixed(2)))
          )
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
          } else if (this.settingsService.isChromatic$.value) {
            this.closestNote.freq = this.findClosest(
              this.chromaticNotes.map((notes: Note) => notes.freq),
              this.frequency
            );
            this.closestNote.note = this.chromaticNotes.find(
              (note: Note) => note.freq === this.closestNote.freq
            ).note;
            this.setOptions();
          }

          if (
            this.inRange(
              this.frequency,
              this.closestNote.freq - 0.6,
              this.closestNote.freq + 0.6
            )
          ) {
            this.renderer.addClass(
              this.noteDisplay.nativeElement,
              'correctFreq'
            );
          } else {
            this.renderer.removeClass(
              this.noteDisplay.nativeElement,
              'correctFreq'
            );
          }
        });
    }
  }

  private getChromaticNotes() {
    this.chromaticNotes = ChromaticNotes;
  }

  ngAfterViewInit() {
    const container = document.querySelector('.container');
    const body = document.querySelector('body');
    this.themeObserver.observe(body, { attributes: true });
    this.containerResizeObserver.observe(container);
    this.sidenavObserver.observe(document.querySelector('mat-sidenav'), {
      attributes: true,
    });
  }

  ngOnInit() {
    this.getAudio();
    this.initCanvas();
    this.getChromaticNotes();
    if (!!!this.frequency) {
      this.frequency = this.closestNote.freq;
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
          this.closestNote.note = selected.notes[0].note;
          this.closestNote.freq = selected.notes[0].freq;
        }
      );
    }

    this.setupAndSubscribeToPitchSubject();
  }

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
    this.instrumentSubscription.unsubscribe();
    this.tuningSubscription.unsubscribe();
    this.themeObserver.disconnect();
    this.containerResizeObserver.disconnect();
    this.sidenavObserver.disconnect();
  }
}
