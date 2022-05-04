import './style.css'

let number = { value: 0}, statusCode = null ;
const URL =
  "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300";

const resetAll = () => {
  number.value = 0;
  statusCode = null;
  document.getElementById("guess").value = "";
  document.getElementsByClassName("message")[0].innerHTML = "";
  document.getElementsByClassName("btn-new-match")[0].classList.add("hide");
  document.getElementById('btn-send').disabled = false;
  const digitalNumber = document.getElementsByClassName("digital-number")[0];
  const guessHtml = document.createElement("div");
  const oldGuess = document.querySelectorAll(".digit");

  oldGuess.forEach((element) => {
    digitalNumber.removeChild(element);
  });

  guessHtml.classList.add("digit");
  guessHtml.innerHTML = `
      <svg class="num-0" width="80" height="135" viewBox="0 0 260 480">
        <use xlink:href="#seg-h" class="segment a" x="30" y="0"></use>
        <use xlink:href="#seg-v" class="segment b" x="220" y="30"></use>
        <use xlink:href="#seg-v" class="segment c" x="220" y="250"></use>
        <use xlink:href="#seg-h" class="segment d" x="30" y="440"></use>
        <use xlink:href="#seg-v" class="segment e" x="0" y="250"></use>
        <use xlink:href="#seg-v" class="segment f" x="0" y="30"></use>
        <use xlink:href="#seg-h" class="segment g" x="30" y="220"></use>
      </svg>
    `;

  digitalNumber.appendChild(guessHtml);
};

const fetchValue = async () => {
  resetAll();
  const response = await fetch(URL);

  number = await response.json();
  if (number.StatusCode) {
    statusCode = number.StatusCode;
  }
};

fetchValue()

const handleSend = () => {
  const guess = statusCode ? String(statusCode) : document.getElementById("guess").value;
  const message = document.getElementsByClassName("message");
  const btnNewMatch = document.getElementsByClassName("btn-new-match");
  document.getElementById("guess").value = "";

  btnNewMatch[0].classList.add("hide");

  if (!guess) {
    message[0].classList.remove('success')
    message[0].classList.remove('error')
    message[0].innerHTML = "Digite o palpite";
    return;
  }

  const digitalNumber = document.getElementsByClassName("digital-number")[0];
  const oldGuess = document.querySelectorAll(".digit");
  const digits = guess.split("");

  oldGuess.forEach((element) => {
    digitalNumber.removeChild(element);
  });
  
  
  digits.map((digit) => {
    let classSegColor = `num-${digit}`;
    
    if (Number(guess) === number.value) {
      classSegColor = `num-success-${digit}`;
    }
    
    if (statusCode) {
      classSegColor = `num-error-${digit}`;
    }
    
    const guessHtml = document.createElement("div");
    guessHtml.classList.add("digit");
    guessHtml.innerHTML = `
      <svg class="${classSegColor}" width="80" height="135" viewBox="0 0 260 480">
        <use xlink:href="#seg-h" class="segment a" x="30" y="0"></use>
        <use xlink:href="#seg-v" class="segment b" x="220" y="30"></use>
        <use xlink:href="#seg-v" class="segment c" x="220" y="250"></use>
        <use xlink:href="#seg-h" class="segment d" x="30" y="440"></use>
        <use xlink:href="#seg-v" class="segment e" x="0" y="250"></use>
        <use xlink:href="#seg-v" class="segment f" x="0" y="30"></use>
        <use xlink:href="#seg-h" class="segment g" x="30" y="220"></use>
      </svg>
    `;

    digitalNumber.appendChild(guessHtml);
  });

  if (statusCode) {
    message[0].classList.add("error");
    message[0].innerHTML = "ERRO";
    btnNewMatch[0].classList.remove("hide");
    document.getElementById('btn-send').disabled = true;
    return;
  }

  if (Number(guess) === number.value) {
    message[0].classList.add("success");
    message[0].innerHTML = "Você acertou!!!!";
    btnNewMatch[0].classList.remove("hide");
    document.getElementById('btn-send').disabled = true;
    return;
  }

  if (number.value < Number(guess)) {
    message[0].classList.remove("success");
    message[0].innerHTML = "É menor";
    return;
  }

  message[0].classList.remove("success");
  message[0].innerHTML = "É maior";
};

document.getElementById('btn-send').addEventListener('click', handleSend)
document.getElementById('btn-new-match').addEventListener('click', fetchValue)
