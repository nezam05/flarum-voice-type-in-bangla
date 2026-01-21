import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import Button from 'flarum/common/components/Button';
import Tooltip from 'flarum/common/components/Tooltip';

app.initializers.add('speech-to-text', () => {
  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    let isListening = false;
    let recognition = null;
    let previousTranscript = '';

    const startRecognition = () => {
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in this browser. Try Chrome.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();

      recognition.lang = 'bn-BD';
      recognition.interimResults = true;
      recognition.continuous = true; // Keep listening until stopped

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        // Calculate delta (new text added since last insert)
        const delta = currentTranscript.substring(previousTranscript.length);

        // Insert only the new delta
        if (delta) {
          this.attrs.composer.editor.insertAtCursor(delta);
          previousTranscript = currentTranscript;
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Error: ' + event.error);
        stopRecognition();
      };

      recognition.onend = () => {
        isListening = false;
        console.log('Speech recognition ended.');
        m.redraw(); // Update button icon
      };

      recognition.start();
      isListening = true;
      m.redraw(); // Update button icon
    };

    const stopRecognition = () => {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
      previousTranscript = ''; // Reset for next session
      isListening = false;
      m.redraw();
    };

    items.add(
      'speechToText',
      <Tooltip text={isListening ? 'Stop voice typing' : 'Start voice typing in Bengali'}>
        {Button.component({
          className: 'Button TextEditor-speech',
          icon: isListening ? 'fas fa-microphone-slash' : 'fas fa-microphone',
          onclick: () => {
            if (isListening) {
              stopRecognition();
            } else {
              startRecognition();
            }
          },
        })}
      </Tooltip>
    );
  });
});