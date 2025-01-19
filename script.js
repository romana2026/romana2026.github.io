const urlParams = new URLSearchParams(window.location.search);
const macAddress = urlParams.get('mac');

if (macAddress) {
 fetch(`https://openai-server-4d3w.onrender.com/?mac=${macAddress}`)
  .then(response => {
   if (!response.ok) { throw new Error('Network response was not ok'); }   // Обработка ошибок сети
    return response.json();                                                // Преобразуем ответ в JSON
  })
  .then(data => {
   if (data.status === 'success') { console.log('Access granted:', data.message); }  // перенаправление
   else { console.log('Access denied:', data.message); }
  })
  .catch(error => { console.error('Error:', error.message); });
} 
else { console.error('MAC address not found in URL'); }

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
            textToTalk.onend = function(event) {
                sendButton.innerText = 'Doriți să mai spuneți ceva? Apăsați aici - și vorbiți';
            };
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
            if (inp.value) {
                sendButton.innerText = 'O clipă...';
                let message = {
                    "role": "user",
                    "content": inp.value
                }
                conversation.push(message);

                // Transmitere la server
                axios.post('https://openai-server-4d3w.onrender.com/api/chat', { messages: conversation })
                    .then(response => {
                        let aiResponse = response.data.choices[0].message.content;
                        outp.value = aiResponse;

                        let gptMessage = {
                            "role": "assistant",
                            "content": aiResponse
                        }
                        conversation.push(gptMessage);
                        talk(aiResponse);
                    })
                    .catch(error => {
                        // console.error("Error API:", error.response ? error.response.data : error.message);
                        console.error("Error request:", error.message);
                        sendButton.innerText = 'Error. Try again.';

                    });
            }
        }