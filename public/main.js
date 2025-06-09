//client side 

const socket = io("http://localhost:4000", {})

const clientTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

// enter the url 
const messageTone = new Audio('/messagetone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})
socket.on('clients-total', (data) => {
    clientTotal.innerText = `Total Clients: ${data}`;
})

function sendMessage(){
    if (messageInput.value === ''){
        return 
    }
    //send data json object to the server
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('message', data)
    addMessage(true, data)
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessage(false, data)
})

function addMessage(isOwnMessage, data ){
    clearFeedback()
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
          ${data.message}
          <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
      `
   
    messageContainer.innerHTML += element;
    scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0, messageContainer.scrollHeight )
}

// adding event listener for the focus, keypress and blur event 

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  
  messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
      feedback: `✍️ ${nameInput.value} is typing a message`,
    })
  })
  messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
      feedback: '',
    })
  })
  
  socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `
    messageContainer.innerHTML += element
  })

function clearFeedback(){
    document.querySelectorAll('li.message.feedback').forEach((element) => {
        element.parentNode.removeChild(element)
    })
}
