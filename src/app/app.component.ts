import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Gauge } from 'gaugeJS';
import {
  debounceTime,
  filter,
  first,
  map,
  skipWhile,
  take,
} from 'rxjs/operators';

import { TunerService } from '../tuner-service/tuner.service';
export interface Note {
  note: string;
  freq: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  // public frequency: number;
  // @ViewChild('foo', { static: false }) el: ElementRef<HTMLCanvasElement>;
  // public gauge: any;
  // public opts: any;
  // public selectedString;
  // public notes: Note[] = [
  //   {
  //     note: 'E',
  //     freq: 82.41,
  //   },
  //   {
  //     note: 'A',
  //     freq: 110,
  //   },
  //   {
  //     note: 'D',
  //     freq: 146.83,
  //   },
  //   {
  //     note: 'G',
  //     freq: 196,
  //   },
  //   {
  //     note: 'B',
  //     freq: 246.94,
  //   },
  //   {
  //     note: 'e',
  //     freq: 329.63,
  //   },
  // ];
  // public closestNote: Note = { note: undefined, freq: undefined };

  constructor(
    private tunerService: TunerService,
    private cdr: ChangeDetectorRef
  ) {}

//   public selectString(string: string) {
//     this.selectedString = true;
//     this.closestNote = this.notes.find((notes) => notes.note === string);
//   }

//   public inRange(x, min, max) {
//     return (x - min) * (x - max) <= 0;
//   }

//   public findClosest(input, goal) {
//     return input.reduce((prev, curr) =>
//       Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
//     );
//   }
//   public setGaugeOptions() {
//     this.opts = {
//       angle: 0, // The span of the gauge arc
//       lineWidth: 0.2, // The line thickness
//       radiusScale: 0.5, // Relative radius
//       pointer: {
//         length: 0.6, // // Relative to gauge radius
//         strokeWidth: 0.035, // The thickness
//         color: '#000000', // Fill color
//       },
//       limitMax: true, // If false, max value increases automatically if value > maxValue
//       limitMin: true, // If true, the min value of the gauge will be fixed
//       percentColors: [
//         [0, '#ec1313'],
//         [0.48, '#58e91a'],
//         [0.49, '#58e91a'],
//         [0.5, '#58e91a'],
//         [0.51, '#58e91a'],
//         [1.0, '#ec1313'],
//       ],
//       colorStart: '#6FADCF', // Colors
//       colorStop: '#8FC0DA', // just experiment with them
//       strokeColor: '#E0E0E0', // to see which ones work best for you
//       generateGradient: true,
//       renderTicks: {
//         divisions: 5,
//         divWidth: 1.1,
//         divLength: 0.7,
//         divColor: '#333333',
//         subDivisions: 7,
//         subLength: 0.5,
//         subWidth: 0.4,
//         subColor: '#666666',
//       },
//       highDpiSupport: true, // High resolution support
//     };
//   }

//  public askForMic() {
//   let ac = new AudioContext();
//   ac.resume();
//   const stream = navigator.mediaDevices.getUserMedia({
//     audio: true,
//     video: false,
//   });
//   ac.resume();
//  }

  ngOnInit() {
  //  this.setGaugeOptions();
    // this.tunerService.setup();
    // this.tunerService.pitchSubject
    //   .pipe(
    //     filter((value) => value < 670),
    //     map((value) => Math.round(value * 100 + Number.EPSILON) / 100)
    //   )
    //   .subscribe((value) => {
    //     this.frequency = value;

    //     if (!this.selectedString) {
    //       this.closestNote.freq = this.findClosest(
    //         this.notes.map((notes) => notes.freq),
    //         this.frequency
    //       );
    //       this.closestNote.note = this.notes.find(
    //         (note) => note.freq === this.closestNote.freq
    //       ).note;
    //       console.log(this.closestNote);
    //     }

        // this.gauge.set(this.frequency);
        // this.gauge.maxValue = this.closestNote.freq * 2; // set max gauge value
        // this.gauge.minValue = 0; // Prefer setter over gauge.minValue = 0
        // this.gauge.animationSpeed = 20; // set animation speed (32 is default value)
        // this.gauge.options.staticZones = [
        //   {
        //     strokeStyle: '#eeeeee',
        //     min: 0,
        //     max: this.gauge.maxValue / 2 - this.gauge.maxValue * 0.014,
        //   },
        //   {
        //     strokeStyle: '#30B32D',
        //     min: this.gauge.maxValue / 2 - this.gauge.maxValue * 0.014,
        //     max: this.gauge.maxValue / 2 + this.gauge.maxValue * 0.014,
        //   }, // Green
        //   {
        //     strokeStyle: '#eeeeee',
        //     min: this.gauge.maxValue / 2 + this.gauge.maxValue * 0.014,
        //     max: this.gauge.maxValue,
        //   },
        // ];
   //   });
  }
  ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     var target = this.el.nativeElement as HTMLCanvasElement;
  //     this.gauge = new Gauge(target).setOptions(this.opts);
  //     this.gauge.set(this.gauge.maxValue / 2);
  //   }, 600);
  // }
}

// let recordDiff = Infinity;
// for (let i = 0; i < this.notes.length; i++) {
//   let diff = this.frequency - this.notes[i].freq;
//   if (Math.abs(diff) < Math.abs(recordDiff)) {
//     this.closestNote = this.notes[i];
//     recordDiff = diff;
//   }
// }
// if (
//   value > this.closestNote.freq + 40 ||
//   value < this.closestNote.freq - 40
// ) {
//   this.resetClosestNote();
// }

// public resetClosestNote() {
//   //   setInterval(() => {
//   let recordDiff = Infinity;
//   for (let i = 0; i < this.notes.length; i++) {
//     let diff = this.frequency - this.notes[i].freq;
//     if (Math.abs(diff) < Math.abs(recordDiff)) {
//       this.closestNote = this.notes[i];
//       recordDiff = diff;
//     }
//   }
//   // }, 2000);
 }
