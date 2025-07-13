const letters = [
  "💌 Hey Tumi, jani na keno, kintu tomar voice amar heart e ekta special vibration toiri kore...",
  "Tumi jodi ekta golapi ful hote, ami tokhon pura bagan hoey jaitam just to have you close 🌸",
  "Jokhon tomar naam dekhi incoming message e, amar cheek e automatic smile chole ashe 😳",
  "Tumi jokhon online asho, amar mon bole — 'dekho dekho amar manush ashche' ❤️",
  "Ami nijeo bujhi na keno eto boro ekta pagol hoye jacchi tomar jonno...!"
];

module.exports = {
  config: {
    name: "loveletter",
    aliases: ["ll"],
    version: "1.0",
    author: "Azad Vai",
    role: 0,
    cooldown: 10,
    shortDescription: "Send romantic letter",
    longDescription: "Sends Banglish style funny love letter",
    category: "fun",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    message.reply(letter);
  }
};
