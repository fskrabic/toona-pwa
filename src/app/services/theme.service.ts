declare var setMetaThemeColor: Function;
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = false;

  toggleStatusBarColor(color: string) {
    document.querySelector('meta[name="theme-color"]')
    .setAttribute('content', color)
  }

  removeStyle(key: string) {
    const existingLinkElement = getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }
  
  toggleDarkTheme() {
    if (this.isDark) {
      this.removeStyle('dark-theme');
      document.body.classList.remove('dark-theme');
      this.toggleStatusBarColor('#1565c0')
      this.isDark = false;
    } else {
      const href = 'dark-theme.css';
      getLinkElementForKey('dark-theme').setAttribute('href', href);
      document.body.classList.add('dark-theme');
      this.isDark = true;
      this.toggleStatusBarColor('#303030');
    }
  }

  
} 
function getLinkElementForKey(key: string) {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string) {
  return document.head.querySelector(
    `link[rel="stylesheet"].${getClassNameForKey(key)}`
  );
}

function createLinkElementWithKey(key: string) {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function getClassNameForKey(key: string) {
  return `style-manager-${key}`;
}
