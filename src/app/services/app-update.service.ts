import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, timer } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  public updatesAvailable: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public updateDialogDismissed: boolean = false;

  constructor(private readonly updates: SwUpdate) {
    this.updates.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY' && !this.updateDialogDismissed) {
        this.updatesAvailable.next(true);
      }
    });
  }

  public doAppUpdate() {
    this.updates.activateUpdate().then(() => {
      this.updatesAvailable.next(false);
      document.location.reload();
    });
  }

  public addTimeoutForUpdateDialog() {
    this.updateDialogDismissed = true;
    timer(10 * 1000).subscribe(() => {
      this.updateDialogDismissed = false;
    });
  }
}
