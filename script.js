let token = null;

fetch('https://openai-server-4d3w.onrender.com/check-mac',
 {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mac: new URLSearchParams(window.location.search).get('mac') })
})
  .then(response => response.json())
  .then(data => {
    if (data.success) token = data.token;
    else alert('Sorry...');
  })
  .catch(error => console.error('Error:', error));

let sendButton = window.document.getElementById('sendButton');
let inp = window.document.getElementById('textInput');
let outp = window.document.getElementById('textOutput');
let conversation = [];

let speechRecognizer = new webkitSpeechRecognition();        // recunoaștere voce
let speechSynthesis = window.speechSynthesis;                // sinteză voce

const speech = () => {
 speechRecognizer.lang = 'ro-RO';
 // speechRecognizer.continuous = true;                      
 // speechRecognizer.interimResults = true;                  
 speechRecognizer.start();
 sendButton.innerText = 'Vorbiți...';
}

const talk = (text) => {
 let textToTalk = new SpeechSynthesisUtterance(text);
 textToTalk.onend = function(event) { sendButton.innerText = 'Doriți să mai spuneți ceva? Apăsați aici - și vorbiți'; };
 textToTalk.lang = 'ro-RO';
 textToTalk.rate = 0.5;
 // textToTalk.pitch = 1.0;
 speechSynthesis.speak(textToTalk);
}

speechRecognizer.onresult = (event) => {                    
 inp.value = event.results[0][0].transcript;
 requestFunc();
}

const requestFunc = () => {
 if (inp.value && token) {
  sendButton.innerText = 'O clipă...';
  let message = { "role": "user", "content": inp.value };
  conversation.push(message);
  axios.post('https://openai-server-4d3w.onrender.com/api/chat',
  {
   messages: conversation,
   token: token
  })
  .then(response => {
   let aiResponse = response.data.choices[0].message.content;
   outp.value = aiResponse;
   conversation.push({ "role": "assistant", "content": aiResponse });
   talk(aiResponse);
  })
  .catch(error => {
  console.error("Error request:", error.message);
  sendButton.innerText = 'Error. Try again.';
  });
 }
}
