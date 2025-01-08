let sendButton = window.document.getElementById('sendButton');

let inp = window.document.getElementById('textInput');

let outp = window.document.getElementById('textOutput');

let conversation = [];

let speechRecognizer = new webkitSpeechRecognition();    // recunoaștere vocală

let speechSynthesis = window.speechSynthesis;            // sinteză vocală

const speech = () => {
speechRecognizer.lang = 'ro-RO';
// speechRecognizer.continuous = true;
// speechRecognizer.interimResults = true;
speechRecognizer.start();
sendButton.innerText = 'Vorbiți...';
}

const talk = (text) => {
let textToTalk = new SpeechSynthesisUtterance(text);
textToTalk.onend = function(event) {
 sendButton.innerText = 'Doriți să mai spuneți ceva? Apasați aici - și vorbiți';
};
textToTalk.lang = 'ro-RO';
textToTalk.rate = 0.5;
textToTalk.pitch = 0.1;
speechSynthesis.speak(textToTalk);
}

let request = axios.create({                             // integrare Chat GPT
headers: {
Authorization: `Bearer ${ak}`
}
})

speechRecognizer.onresult = (event) => {                 // Procesor de Eveniment
inp.value = event.results[0][0].transcript;
requestFunc();
}

const requestFunc = () => {
if (inp.value) {
sendButton.innerText = 'O clipă...';
let message = {
"role": "user",
"content": `${inp.value}`
}
conversation.push(message);
let params = {
"model": "gpt-3.5-turbo",
"messages": conversation
};
request.post('https://api.openai.com/v1/chat/completions', params)
.then(response => {
outp.value = response.data.choices[0].message.content;
let gptMessage = {
"role": "assistant",
"content": `${outp.value}`
}
conversation.push(gptMessage);
talk(outp.value);
})
}
}
