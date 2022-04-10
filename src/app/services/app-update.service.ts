import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

public updatesAvailable: BehaviorSubject<boolean> = new BehaviorSubject(false);

constructor(private readonly updates: SwUpdate) {
  this.updates.versionUpdates.subscribe(event => {
    this.updatesAvailable.next(true);
  });
}

doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}