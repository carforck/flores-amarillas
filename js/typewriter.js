const typewriterElement = document.getElementById("typewriter");

const messages = [
  "✨ Eres la razón de mis sonrisas ✨",
  "💖 Mi mundo es más bonito contigo 💖",
  "🌹 Siempre serás mi mejor regalo 🌹"
];

let messageIndex = 0;
let charIndex = 0;
let currentMessage = "";
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  currentMessage = messages[messageIndex];

  if (!isDeleting) {
    // Escribir
    typewriterElement.textContent = currentMessage.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentMessage.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000); // Espera antes de borrar
      return;
    }
  } else {
    // Borrar
    typewriterElement.textContent = currentMessage.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % messages.length; // siguiente frase
    }
  }

  setTimeout(typeEffect, isDeleting ? typingSpeed / 2 : typingSpeed);
}

typeEffect();
