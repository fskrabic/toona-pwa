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
import {
  concatMap,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { TunerService } from '../../services/tuner.service';
import {
  Instrument,
  SettingsService,
  Tuning,
} from '../../services/settings.service';
import * as p5 from 'p5';
import 'p5/lib/addons/p5.sound';

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
  public tuning: any;
  @ViewChild('freqSlider', { static: false })
  freqSlider: ElementRef<HTMLInputElement>;
  @ViewChild('noteDisplay', { static: false })
  noteDisplay: ElementRef<HTMLHeadingElement>;

  public closestNote: Note = {
    note: 'E2',
    freq: 82.41,
  };

  public pitchSubscription: Subscription;
  public instrumentSubscription: Subscription;
  public tuningSubscription: Subscription;

  public fft: any;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  private HEIGHT = 1500;
  private WIDTH = 1500;

  private analyzerTime: AnalyserNode;
  private analyzerFreq: AnalyserNode;
  private audioContext: AudioContext;

  public options: Options = {
    showTicks: true,
    showTicksValues: false,
    readOnly: true,
    floor: parseFloat((this.closestNote.freq - 52).toFixed(2)),
    ceil: parseFloat((this.closestNote.freq + 52).toFixed(2)),
    step: 0.01,
    ticksArray: [this.closestNote.freq],
  };

  constructor(
    public tunerService: TunerService,
    // public canvasService: CanvasService,
    public settingsService: SettingsService,
    private renderer: Renderer2,
    private router: Router
  ) {
    // super();
    // this.startP5JS(document.body)
  }

  public selectString(note: Note) {
    this.settingsService.setAutoDetection(false);
    this.closestNote = this.selectedTuning.notes.find(
      (notes: Note) => notes.note === note.note
    );
    this.frequency = this.closestNote.freq;
    this.setOptions();
  }

  private setOptions() {
    this.options = {
      showTicks: true,
      showTicksValues: false,
      readOnly: true,
      floor: parseFloat((this.closestNote.freq - 52).toFixed(2)),
      ceil: parseFloat((this.closestNote.freq + 52).toFixed(2)),
      step: 0.01,
      ticksArray: [this.closestNote.freq],
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

  public initCanvas() {
     this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    // canvas.width = window.innerHeight;
    // canvas.width = window.innerWidth;
    // canvas.height = this.HEIGHT;
    this.canvas.height = this.canvas.width * 0.65;
    
  }

  async getAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    this.audioContext = new AudioContext();
    this.analyzerTime = this.audioContext.createAnalyser();
    this.analyzerFreq = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(
     stream
    );
    source.connect(this.analyzerTime);
    source.connect(this.analyzerFreq)
    this.analyzerTime.fftSize = 2 ** 8;
    this.analyzerFreq.fftSize = 2 ** 10;
    const timeData = new Uint8Array(this.analyzerTime.frequencyBinCount);
    const frequencyData = new Uint8Array(this.analyzerFreq.frequencyBinCount);
   // this.drawTimeData(timeData);
    this.drawFrequencyData(frequencyData);
  }

  private drawFrequencyData(data: Uint8Array) {
    this.analyzerFreq.getByteFrequencyData(data);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const barWidth = (this.canvas.width / 512) * 5;
    let x = 0;
    data.forEach((amount) => {
      const percent = amount / 255;
      const barHeight = (this.canvas.height * percent )/ 2;
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(
       x+ 10,
        parseInt((this.canvas.height - barHeight).toString()),
        barWidth,
        barHeight
      );
      x+= barWidth+ 5;
    })
    requestAnimationFrame(() => {this.drawFrequencyData(data)})
  }
  
  private drawTimeData(data: Uint8Array) {
    this.analyzerTime.getByteTimeDomainData(data);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "#ffc600";
    this.ctx.beginPath();
    const sliceWidth = this.canvas.width / this.analyzerTime.fftSize ;
    let x = 0;
    data.forEach((data, i) => {
      const v = data / 128;
      const y = (v * this.canvas.height) / 2;
      // draw our lines
      if (i === 0) {
        this.ctx.moveTo(x + 5, y + 5);
      } else {
       this.ctx.lineTo(x + 5 , y+ 5);
      }
      x += sliceWidth;
    });
    this.ctx.stroke();
    // call itself as soon as possible
    requestAnimationFrame(() => this.drawTimeData(data));
  }

  private setupAndSubscribeToPitchSubject() {
    if (this.tunerService.isSetup === false) {
      this.tunerService.setup();
      // this.drawCanvas();
    }
    if (!this.pitchSubscription) {
      this.pitchSubscription = this.tunerService.pitchSubject
        .pipe(
          distinctUntilChanged(),
          filter((value) => value < 30 || value < this.closestNote.freq * 2),
          concatMap((value) => {
            if (this.inRange(value, value * 1.98, value * 2.02)) {
              return of(value / 2);
            } else {
              return of(value);
            }
          }),
          map((value) => {
            return Math.round(value * 100 + Number.EPSILON) / 100;
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
          }
          if (
            this.inRange(
              this.frequency,
              this.closestNote.freq - 0.4,
              this.closestNote.freq + 0.4
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

  ngAfterViewInit() {
    //  this.drawCanvas();
  }

  //  createp5() {
  //    new p5(p => {
  //     p.setup = () =>{

  //       p.createCanvas(400, 800);
  //       p.colorMode( p.HSB);
  //       p.angleMode( p.DEGREES);
  //       p.canvas.style.position = 'fixed'
  //       p.canvas.style.top = '0'
  //       p.canvas.style.left = '100px'
  //        // let x = document.querySelector('.container');
  //        //     (x as HTMLElement).style.background = 'url(' + .canvas.toDataURL() + ')';

  //        this.fft = new p5.FFT(0, 512);
  //        this.fft.setInput(this.tunerService.stream);

  //      };

  //      p.draw = async () => {
  //        p.background(255, 204, 0);

  //         var spectrum = this.fft.analyze();

  //        console.log(spectrum);
  //        p.stroke(255);
  //        p.noStroke();
  //        p.translate( p.width / 2, p.height / 2);
  //        p.beginShape();
  //        for (var i = 0; i < spectrum.length; i++) {
  //          var angle =  p.map(i, 0, spectrum.length, 0, 360);
  //          var amp = spectrum[i];
  //          var r =  p.map(amp, 0, 256, 20, 100);
  //          //fill(i, 255, 255);
  //          var x = r *  p.cos(angle);
  //          var y = r *  p.sin(angle);
  //          p.stroke(i, 255, 255);
  //          p.line(0, 0, x, y);
  //          //vertex(x, y);
  //          //var y = map(amp, 0, 256, height, 0);
  //          //rect(i * w, y, w - 2, height - y);
  //        }
  //        //endShape();
  //      };
  //   })
  // }

  ngOnInit() {
    this.getAudio();
    this.initCanvas();
    // this.canvasService.setup();
    //this.createp5();
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
