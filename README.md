# Toona

PWA instrument tuner developed with Angular and ml5.js.

# Installation and running the application

Follow these steps to run this app:

1) Clone the repository 
2) Run 'npm install'
2) Run 'npm run build'
3) Run 'npm start'

# Possible errors

If you get an 'FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory' error while
building or running the app, enter this command (without quotations) in the terminal:
'set NODE_OPTIONS=--max-old-space-size=16384'
and build&run the app again.
