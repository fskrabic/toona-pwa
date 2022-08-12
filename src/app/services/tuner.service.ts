import { Injectable, OnDestroy } from '@angular/core';
import { pitchDetection } from 'ml5';
import { Subject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TunerService implements OnDestroy {
  public audioContext: AudioContext = new AudioContext();
  private pitch: any;
  public pitchSubject: Subject<number> = new Subject();
  public pitchSubscription: Subscription;
  public isSetup = false;
  public stream: MediaStream;

  constructor() {}

  setup = async () => {
    this.isSetup = true;
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.startPitch(this.stream, this.audioContext);
    document.addEventListener('visibilitychange', this.checkTabFocused);
  };
  public startPitch = (stream: MediaStream, audioContext: AudioContext) => {
    this.pitch = pitchDetection(
      '../../model',
      audioContext,
      stream,
      this.modelLoaded
    );
  };
  public modelLoaded = () => {
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    const src = interval(500);
    if (!this.pitchSubscription) {
      this.pitchSubscription = src.subscribe(this.getPitch);
    }
  };

  public getPitch = () => {
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    if (this.pitch.frequency) {
      this.pitchSubject.next(this.pitch.frequency);
    }
  };

  ngOnDestroy(): void {
    this.pitchSubscription.unsubscribe();
  }

  checkTabFocused = () => {
    if (document.visibilityState === 'visible') {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    } else {
      if (this.audioContext.state === 'running') {
        this.audioContext.suspend();
      }
    }
  };
}
