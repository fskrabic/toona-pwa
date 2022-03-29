import { Injectable, OnDestroy } from '@angular/core';
import ml5 from 'ml5';
import { Subject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TunerService implements OnDestroy {
  private audioContext: AudioContext;
  private pitch: any;

  public pitchSubject: Subject<number> = new Subject();

  private pitchSubscription: Subscription;

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
    const src = interval(300);
    if (!this.pitchSubscription) {
      this.pitchSubscription = src.subscribe(this.getPitch);
    }
    //setInterval(this.getPitch, 500);
  };

  public getPitch = () => {
    if (this.pitch.frequency) {
      this.pitchSubject.next(this.pitch.frequency);
    }
  };

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
  }
}
