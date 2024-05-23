const socket = io();

const error = document.getElementById("container-message")
const formMessage = document.getElementById("form-message")
const user = document.getElementById("")

formMessage.addEventListener("submit", (e) => {

    e.preventDefault()

    const message = document.getElementById("message").value

    socket.emit('newMessage', { message })

    document.getElementById("message").value = ""

})

socket.on('updateMessages', (messages) => {

    const containerMessages = document.getElementById("container-messages")

    containerMessages.innerHTML = '';

    messages.forEach((message) => {

        containerMessages.innerHTML += `
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 10px;">
            <div class="message">
                <p>${message}</p>
            </div>
            <img src="{{this.user.image.image}}" alt="image-user" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px; margin-left: 5px;">
        </div>
        `
    })

})

setTimeout(() => {
    if (error) {
        error.style.display = 'none'
    }
}, 4000);