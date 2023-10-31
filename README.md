# Toona

<img style="display:flex;justify-content:center" src="https://i.ibb.co/CKHhjs0/Maskable-icon-x512.png" alt="Maskable-icon-x512" border="0" />

PWA instrument tuner and metronome developed using Angular 13 and ml5.js.
It's rushed and hacky but sometimes it also works. Sometimes.

https://www.youtube.com/watch?v=SJUhlRoBL8M


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
