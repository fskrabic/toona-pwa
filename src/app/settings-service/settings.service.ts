import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Note } from '../tuner/tuner.component';


export interface Instrument {
  code: string,
  name: string,
  numberOfStrings: number
}
export interface Tuning {
  code: string,
  name: string,
  notes: Note[],
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  private autoDetectionMode: boolean = true;

  public selectedInstrument$: BehaviorSubject<Instrument> = new BehaviorSubject( {code: 'guitar' , name: 'Guitar', numberOfStrings: 6 });
  public selectedTuning$: BehaviorSubject<Tuning> = new BehaviorSubject({code: 'guitar-standard', name: 'Standard', notes:  [
    {
      note: 'E2',
      freq: 82.41,
    },
    {
      note: 'A2',
      freq: 110,
    },
    {
      note: 'D3',
      freq: 146.83,
    },
    {
      note: 'G3',
      freq: 196,
    },
    {
      note: 'B3',
      freq: 246.94,
    },
    {
      note: 'E4',
      freq: 329.63,
    },
  ] },);

  public guitarStandard: Note[] = [
    {
      note: 'E2',
      freq: 82.41,
    },
    {
      note: 'A2',
      freq: 110,
    },
    {
      note: 'D3',
      freq: 146.83,
    },
    {
      note: 'G3',
      freq: 196,
    },
    {
      note: 'B3',
      freq: 246.94,
    },
    {
      note: 'E4',
      freq: 329.63,
    },
  ];
  public guitarDropD: Note[] = [
    {
      note: 'D2',
      freq: 73.42 ,
    },
    {
      note: 'A2',
      freq: 110,
    },
    {
      note: 'D3',
      freq: 146.83,
    },
    {
      note: 'G3',
      freq: 196,
    },
    {
      note: 'B4',
      freq: 246.94,
    },
    {
      note: 'E4',
      freq: 329.63,
    },
  ];
  public bassStandard: Note[] = [
    {
      note: 'E1',
      freq: 41.203 ,
    },
    {
      note: 'A1',
      freq: 55,
    },
    {
      note: 'D2',
      freq: 73.416,
    },
    {
      note: 'G2',
      freq: 97.99,
    },
  ];

  private instruments: Instrument[] = [
    {code: 'guitar' , name: 'Guitar', numberOfStrings: 6 },
    {code: 'bass' , name: 'Bass', numberOfStrings: 4 },
    {code: '7stringguitar' , name: '7 String Guitar', numberOfStrings: 7 },
  ];
  private guitarTunings: Tuning[] = [
    {code: 'guitar-standard', name: 'Standard', notes:  this.guitarStandard },
    {code: 'guitar-drop-d', name: 'Drop D', notes: this.guitarDropD},
  ]
  private bassTunings: Tuning[] = [
    {code: 'bass-standard', name: 'Standard', notes: this.bassStandard},
  ]




  public getInstruments() {
    return this.instruments;
  }
  public getGuitarTunings() {
    return this.guitarTunings;
  }
  public getBassTunings() {
    return this.bassTunings;
  }
  public getAutoDetection() {
    return this.autoDetectionMode;
  }
  public setAutoDetection(value: boolean){
    this.autoDetectionMode = value;
  }
}
