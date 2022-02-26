import { Injectable } from '@angular/core';
import ml5 from 'ml5';
import { Subject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TunerService {
  private audioContext: AudioContext;
  private pitch: any;

  public pitchSubject: Subject<number> = new Subject();

  constructor() {}

  setup = async () => {
    this.audioContext = new AudioContext();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    //this.audioContext.resume();
    this.startPitch(stream, this.audioContext);
    //this.audioContext.resume();
  };

  public startPitch = (stream: MediaStream, audioContext: AudioContext) => {
    this.pitch = ml5.pitchDetection(
      '../../model',
      audioContext,
      stream,
      this.modelLoaded
    );
  };

  public modelLoaded = () => {
    interval(500).subscribe(this.getPitch)
    //setInterval(this.getPitch, 500);
  };

  public getPitch = () => {
    if (this.pitch.frequency) {
      this.pitchSubject.next(this.pitch.frequency);
    }
  };
}
