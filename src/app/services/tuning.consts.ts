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

export const guitarStandard: Note[] = [
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

export const guitarDropD: Note[] = [
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

export const guitarDropA: Note[] = [
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
export const guitarOpenA: Note[] = [
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
export const guitarOpenB: Note[] = [
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

export const guitarOpenC: Note[] = [
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

export const guitarOpenD: Note[] = [
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

export const guitarOpenE: Note[] = [
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
export const guitarOpenF: Note[] = [
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

export const guitarOpenG: Note[] = [
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
export const guitarCeltic: Note[] = [
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
];
export const guitarHalfStepDown: Note[] = [
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
];
export const bassStandard: Note[] = [
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

export const bassHalfStepDown: Note[] = [
  {
    note: 'D#1',
    freq: 38.89,
  },
  {
    note: 'G#1',
    freq: 51.91,
  },
  {
    note: 'C#2',
    freq: 69.3,
  },
  {
    note: 'F#2',
    freq: 92.5,
  },
];

export const bassWholeStepDown: Note[] = [
  {
    note: 'D1',
    freq: 36.71,
  },
  {
    note: 'G1',
    freq: 49,
  },
  {
    note: 'C2',
    freq: 65.41,
  },
  {
    note: 'F2',
    freq: 87.31,
  },
];

export const bassDropD: Note[] = [
  {
    note: 'D1',
    freq: 36.71,
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

export const bassPiccolo: Note[] = [
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
];

export const bassCStandard: Note[] = [
  {
    note: 'C1',
    freq: 32.7,
  },
  {
    note: 'F1',
    freq: 43.65,
  },
  {
    note: 'A#1',
    freq: 58.27,
  },
  {
    note: 'D#2',
    freq: 77.78,
  },
];
export const bassDropC: Note[] = [
  {
    note: 'B0',
    freq: 30.87,
  },
  {
    note: 'F#1',
    freq: 46.25,
  },
  {
    note: 'B1',
    freq: 61.74,
  },
  {
    note: 'E2',
    freq: 82.41,
  },
];

export const ukuleleStandard: Note[] = [
  {
    note: 'G4',
    freq: 392,
  },
  {
    note: 'C4',
    freq: 261.63,
  },
  {
    note: 'E4',
    freq: 329.63,
  },
  {
    note: 'A4',
    freq: 440,
  },
];
export const ukuleleLowG: Note[] = [
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
  {
    note: 'A4',
    freq: 440,
  },
];
export const ukuleleC: Note[] = [
  {
    note: 'A4',
    freq: 440,
  },
  {
    note: 'D4',
    freq: 293.66,
  },
  {
    note: 'F#4',
    freq: 369.99,
  },
  {
    note: 'B4',
    freq: 493.88,
  },
];

export const ukuleleSlackKey: Note[] = [
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
  {
    note: 'G4',
    freq: 392,
  },
];
export const ukuleleBaritone: Note[] = [
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
];
