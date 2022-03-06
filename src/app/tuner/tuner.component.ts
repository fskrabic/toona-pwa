import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Gauge } from 'gaugeJS';
import { filter, map, throttleTime } from 'rxjs/operators';
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
})
export class TunerComponent implements OnInit, AfterViewInit, OnDestroy {
  public frequency: number;
  public selectedInstrument: Instrument;
  public selectedTuning: any;
  public tuning: any;
  @ViewChild('foo', { static: true }) el: ElementRef<Gauge>;
  @ViewChild('test', { static: false }) test: ElementRef<HTMLDivElement>;
  public gauge: any;
  public opts: any;
  elem: any;
  public closestNote: Note = {
    note: 'E2',
    freq: 82.41,
  };

  constructor(
    private tunerService: TunerService,
    public settingsService: SettingsService,
    private renderer: Renderer2
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

  public setGaugeOptions() {
    this.opts = {
      angle: 0, // The span of the gauge arc
      lineWidth: 0.2, // The line thickness
      radiusScale: 0.5, // Relative radius
      pointer: {
        length: 0.6, // // Relative to gauge radius
        strokeWidth: 0.035, // The thickness
        color: '#000000', // Fill color
      },
      limitMax: true, // If false, max value increases automatically if value > maxValue
      limitMin: true, // If true, the min value of the gauge will be fixed
      percentColors: [
        [0, '#ec1313'],
        [0.48, '#58e91a'],
        [0.49, '#58e91a'],
        [0.5, '#58e91a'],
        [0.51, '#58e91a'],
        [1.0, '#ec1313'],
      ],
      colorStart: '#6FADCF', // Colors
      colorStop: '#8FC0DA', // just experiment with them
      strokeColor: '#E0E0E0', // to see which ones work best for you
      generateGradient: true,
      renderTicks: {
        divisions: 5,
        divWidth: 1.1,
        divLength: 0.7,
        divColor: '#333333',
        subDivisions: 7,
        subLength: 0.5,
        subWidth: 0.4,
        subColor: '#666666',
      },
      highDpiSupport: true, // High resolution support
    };
  }

  public askForMic() {
    let ac = new AudioContext();
    ac.resume();
    const stream = navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(() => {
        ac.resume();
      });
  }

  ngOnInit() {
    this.askForMic();
    this.settingsService.selectedInstrument$.subscribe((selected) => {
      this.selectedInstrument = selected;
    });
    this.settingsService.selectedTuning$.subscribe((selected) => {
      this.selectedTuning = selected;
      this.tuning = this.selectedTuning.notes;
    });
    // this.setGaugeOptions();
    this.tunerService.setup();
    this.tunerService.pitchSubject
      .pipe(
        throttleTime(500),
        filter((value) => (value < 30 || value < this.closestNote.freq * 2.2 )),
        map((value) => Math.round(value * 100 + Number.EPSILON) / 100)
      )
      .subscribe((value) => {
        this.frequency = value;
        console.log(this.frequency);
        if (this.settingsService.getAutoDetection()) {
          this.closestNote.freq = this.findClosest(
            this.tuning.map((notes) => notes.freq),
            this.frequency
          );
          this.closestNote.note = this.tuning.find(
            (note: Note) => note.freq === this.closestNote.freq
          ).note;
        }

        //   this.gauge.set(this.frequency);
        //   this.gauge.maxValue = this.closestNote.freq * 2; // set max gauge value
        //   this.gauge.minValue = 0; // Prefer setter over gauge.minValue = 0
        //   this.gauge.animationSpeed = 20; // set animation speed (32 is default value)
        //   this.gauge.options.staticZones = [
        //     {
        //       strokeStyle: '#eeeeee',
        //       min: 0,
        //       max: this.gauge.maxValue / 2 - this.gauge.maxValue * 0.014,
        //     },
        //     {
        //       strokeStyle: '#30B32D',
        //       min: this.gauge.maxValue / 2 - this.gauge.maxValue * 0.014,
        //       max: this.gauge.maxValue / 2 + this.gauge.maxValue * 0.014,
        //     }, // Green
        //     {
        //       strokeStyle: '#eeeeee',
        //       min: this.gauge.maxValue / 2 + this.gauge.maxValue * 0.014,
        //       max: this.gauge.maxValue,
        //     },
        //   ];
      });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // let target = this.el.nativeElement as HTMLCanvasElement;
      // this.gauge = new Gauge(target).setOptions(this.opts);
      // this.gauge.set(this.gauge.maxValue / 2);
    }, 300);
  }

  ngOnDestroy(): void {
    // this.tunerService.pitchSubject.unsubscribe();
  }
}
