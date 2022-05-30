import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Note } from '../components/tuner/tuner.component';

export interface Instrument {
  code: string;
  name: string;
  numberOfStrings: number;
}
export interface Tuning {
  instrument: string;
  code: string;
  name: string;
  notes: Note[];
  noteString: string;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor() {}

  private autoDetectionMode: boolean = true;

  public showTapTempo$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public selectedInstrument$: BehaviorSubject<Instrument> = new BehaviorSubject(
    { code: 'guitar', name: 'Guitar', numberOfStrings: 6 }
  );
  public selectedTuning$: BehaviorSubject<Tuning> = new BehaviorSubject({
    instrument: 'guitar',
    code: 'guitar-standard',
    noteString: 'E2 A2 D3 G3 B3 E4',
    name: 'Standard',
    notes: [
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
    ],
  });

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
      freq: 73.42,
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
  public guitarDropA: Note[] = [
    {
      note: 'A1',
      freq: 55,
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

  public guitarOpenA: Note[] = [
    {
      note: 'E2',
      freq: 82.41,
    },
    {
      note: 'A2',
      freq: 110,
    },
    {
      note: 'C#3',
      freq: 138.59,
    },
    {
      note: 'E3',
      freq: 164.81,
    },
    {
      note: 'A3',
      freq: 220,
    },
    {
      note: 'E4',
      freq: 329.63,
    },
  ];

  public guitarOpenB: Note[] = [
    {
      note: 'B1',
      freq: 61.74,
    },
    {
      note: 'F#2',
      freq: 92.5,
    },
    {
      note: 'B2',
      freq: 123.47,
    },
    {
      note: 'F#3',
      freq: 185,
    },
    {
      note: 'B3',
      freq: 246.94,
    },
    {
      note: 'D#4',
      freq: 311.13,
    },
  ];

  public guitarOpenC: Note[] = [
    {
      note: 'C2',
      freq: 65.41,
    },
    {
      note: 'G2',
      freq: 98,
    },
    {
      note: 'C3',
      freq: 130.81,
    },
    {
      note: 'G3',
      freq: 196,
    },
    {
      note: 'C4',
      freq: 261.63,
    },
    {
      note: 'E4',
      freq: 329.63,
    },
  ];

  public guitarOpenD: Note[] = [
    {
      note: 'D2',
      freq: 73.42,
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
      note: 'F#3',
      freq: 185,
    },
    {
      note: 'A3',
      freq: 220,
    },
    {
      note: 'D4',
      freq: 293.66,
    },
  ];
  public guitarOpenE: Note[] = [
    {
      note: 'E2',
      freq: 82.41,
    },
    {
      note: 'B2',
      freq: 123.47,
    },
    {
      note: 'E3',
      freq: 164.81,
    },
    {
      note: 'G#3',
      freq: 207.65,
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
  public guitarOpenF: Note[] = [
    {
      note: 'C2',
      freq: 65.41,
    },
    {
      note: 'F2',
      freq: 87.31,
    },
    {
      note: 'C3',
      freq: 130.81,
    },
    {
      note: 'F3',
      freq: 174.61,
    },
    {
      note: 'A3',
      freq: 220,
    },
    {
      note: 'F4',
      freq: 349.23,
    },
  ];

  public guitarOpenG: Note[] = [
    {
      note: 'D2',
      freq: 73.42,
    },
    {
      note: 'G2',
      freq: 98,
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
      note: 'D4',
      freq: 293.66,
    },
  ];

  public guitarCeltic: Note[] = [
    {
      note: 'D2',
      freq: 73.42,
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
      note: 'A3',
      freq: 220,
    },
    {
      note: 'D4',
      freq: 293.66,
    },
  ]

  public guitarHalfStepDown: Note[] = [
    {
      note: 'D#2',
      freq: 77.78,
    },
    {
      note: 'G#2',
      freq: 103.83,
    },
    {
      note: 'C#3',
      freq: 138.59,
    },
    {
      note: 'F#3',
      freq: 185,
    },
    {
      note: 'A#3',
      freq: 233.08,
    },
    {
      note: 'D#4',
      freq: 311.13,
    },
  ]

  public bassStandard: Note[] = [
    {
      note: 'E1',
      freq: 41.203,
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

  public instruments: Instrument[] = [
    { code: 'guitar', name: 'Guitar', numberOfStrings: 6 },
    { code: 'bass', name: 'Bass', numberOfStrings: 4 },
    { code: '7stringguitar', name: '7 String Guitar', numberOfStrings: 7 },
  ];
  private guitarTunings: Tuning[] = [
    {
      instrument: 'guitar',
      code: 'guitar-standard',
      name: 'Standard',
      notes: this.guitarStandard,
      noteString: this.getNotes(this.guitarStandard),
    },
    {
      instrument: 'guitar',
      code: 'guitar-half-step-down',
      name: 'Half-step down',
      notes: this.guitarHalfStepDown,
      noteString: this.getNotes(this.guitarHalfStepDown),
    },
    {
      instrument: 'guitar',
      code: 'guitar-drop-d',
      name: 'Drop D',
      notes: this.guitarDropD,
      noteString: this.getNotes(this.guitarDropD),
    },
    {
      instrument: 'guitar',
      code: 'guitar-drop-a',
      name: 'Drop A',
      notes: this.guitarDropA,
      noteString: this.getNotes(this.guitarDropA),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-a',
      name: 'Open A',
      notes: this.guitarOpenA,
      noteString: this.getNotes(this.guitarOpenA),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-b',
      name: 'Open B',
      notes: this.guitarOpenB,
      noteString: this.getNotes(this.guitarOpenB),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-c',
      name: 'Open C',
      notes: this.guitarOpenC,
      noteString: this.getNotes(this.guitarOpenC),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-d',
      name: 'Open D',
      notes: this.guitarOpenD,
      noteString: this.getNotes(this.guitarOpenD),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-e',
      name: 'Open E',
      notes: this.guitarOpenE,
      noteString: this.getNotes(this.guitarOpenE),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-f',
      name: 'Open F',
      notes: this.guitarOpenF,
      noteString: this.getNotes(this.guitarOpenF),
    },
    {
      instrument: 'guitar',
      code: 'guitar-open-g',
      name: 'Open G',
      notes: this.guitarOpenG,
      noteString: this.getNotes(this.guitarOpenG),
    },
    {
      instrument: 'guitar',
      code: 'guitar-celtic',
      name: 'Celtic',
      notes: this.guitarCeltic,
      noteString: this.getNotes(this.guitarCeltic),
    },
  ];
  private bassTunings: Tuning[] = [
    {
      instrument: 'bass',
      code: 'bass-standard',
      name: 'Standard',
      notes: this.bassStandard,
      noteString: this.getNotes(this.bassStandard),
    },
  ];

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

  public setTuning(tuning: Tuning) {
    this.selectedTuning$.next(tuning);
  }
  public setAutoDetection(value: boolean) {
    this.autoDetectionMode = value;
  }
  private getNotes(notes: Note[]) {
    let noteString: string = '';
    notes.forEach((note) => {
      noteString += ' ' + note.note;
    });
    return noteString.trimStart();
  }
}
