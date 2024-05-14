const message = document.getElementById("message")
const error = document.getElementById("container-message")

setTimeout(() => {
    if(message) {
        message.style.display = 'none'
    }
    if(error) {
        error.style.display = 'none'
    }
}, 4000);
