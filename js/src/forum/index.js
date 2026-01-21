import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import Button from 'flarum/common/components/Button';

app.initializers.add('speech-to-text', () => {
  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    items.add(
      'speechToText',
      Button.component({
        className: 'Button TextEditor-speech',
        icon: 'fas fa-microphone',
        onclick: () => {
          // Check for browser support
          if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser. Try Chrome.');
            return;
          }

          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();

          recognition.lang = 'bn-BD'; // Bengali (Bangladesh)
          recognition.interimResults = true; // Show partial results
          recognition.maxAlternatives = 1;

          recognition.onresult = (event) => {
            // Get the transcript
            const transcript = Array.from(event.results)
              .map((result) => result[0].transcript)
              .join('');

            // Insert into the composer at cursor
            this.attrs.composer.editor.insertAtCursor(transcript + ' '); // Add space for separation
          };

          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            alert('Error: ' + event.error);
          };

          recognition.onend = () => {
            console.log('Speech recognition ended.');
          };

          // Start listening
          recognition.start();
        },
      })
    );
  });
});