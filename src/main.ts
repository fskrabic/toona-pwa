import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  console.log = () => {
    return null;
  };
  console.warn = () => {
    return null;
  };
  window.console.log = () => {
    return null;
  };
  window.console.warn = () => {
    return null;
  };
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    navigator.serviceWorker.register('/ngsw-worker.js');
  })
  .catch((err) => console.log(err));
