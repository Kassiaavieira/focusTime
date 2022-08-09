const cards = document.getElementsByClassName("card");
const volumes = document.querySelectorAll('input[type="range"]');
const audios = {
  forestCard: new Audio("./audios/forest.wav"),
  rainCard: new Audio("./audios/rain.wav"),
  coffeeShopCard: new Audio("./audios/coffeeShop.wav"),
  fireplaceCard: new Audio("./audios/fireplace.wav")
}
/*const images = {
chuvaimage: new Image("./images/chuva.jpg"),
coffeimage: new Image("./images/coffe.jpg"),
fogueiraimage: new Image("./images/fogueira.jpg"),
natureimage: new Image("./images/nature.jpg")
}*/

let timer = createTimer(25 * 60);
let audioObj = {};
let theme = themeHandler('dark');

document.getElementById("themeChanger").onclick = function () {
  let newTheme = theme.getTheme() == 'dark' ? 'light' : 'dark';
  theme.setTheme(newTheme);
}

function themeHandler(defaultTheme) {
  let theme = localStorage.getItem('theme') || defaultTheme;
  if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark');

  setTheme(theme);

  function getTheme() {
    return theme;
  }

  function setTheme(themeName) {
    var root = document.querySelector(':root');
    root.style.setProperty('--primary-color', `var(--${themeName}-primary-color`);
    root.style.setProperty('--secondary-color', `var(--${themeName}-secondary-color`);
    root.style.setProperty('--tertiary-color', `var(--${themeName}-tertiary-color`);
    root.style.setProperty('--quartenary-color', `var(--${themeName}-quartenary-color`);

    if (themeName == 'light' || themeName == 'dark' && !document.getElementById(`light-mode`).classList.contains('hide')) {
      document.getElementById(`dark-mode`).classList.toggle('hide');
      document.getElementById(`light-mode`).classList.toggle('hide');
    }

    theme = themeName;
    localStorage.setItem('theme', themeName);
  }

  return {
    getTheme,
    setTheme
  }
}

function createTimer(timeInSeconds) {
  let time = {
    allTime: timeInSeconds,
    getHour: `${Math.floor(timeInSeconds / 60)}`,
    getSeconds: `${timeInSeconds % 60}`.padStart(2, '0')
  };
  let timerElement = document.getElementById("timer");
  let timer;

  function getTime() {
    return time;
  }

  function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
      if ((timer - 1) <= 0) return setTimer(0), stopTimer();
      setTimer(time.allTime - 1);
    }, 1000)
  }

  function stopTimer() {
    if (!timer) return;
    clearInterval(timer);
    timer = undefined;
  }

  function setTimer(timeInSeconds) {
    time = {
      allTime: timeInSeconds,
      getHour: `${Math.floor(timeInSeconds / 60)}`,
      getSeconds: `${timeInSeconds % 60}`.padStart(2, '0')
    };

    timerElement.innerHTML = `${time.getHour}:${time.getSeconds}`;
  }

  function addMinute() {
    if ((time.allTime + 60) >= (120 * 60)) return setTimer(120 * 60);
    setTimer(time.allTime + 60)
  }

  function removeMinute() {
    if ((time.allTime - 60) <= 0) return setTimer(0), stopTimer();
    setTimer(time.allTime - 60)

  }

  return {
    getTime,
    startTimer,
    stopTimer,
    addMinute,
    removeMinute
  }
}

function playAudio(name) {
  if (audioObj.player) audioObj.player.pause();
  const player = audios[name];
  const volume = document.getElementById(name.replace('Card', 'Volume')).value / 100;

  player.volume = volume;
  player.loop = true;
  player.play();

  return {
    name,
    player
  };
}


for (let i = 0; i < cards.length; i++) {
  const card = cards.item(i);
  card.onclick = function () {
    if (audioObj.name) document.getElementById(audioObj.name).classList.remove("active");
    card.classList.add("active");
    audioObj = playAudio(card.id);
  }
}

for (let i = 0; i < volumes.length; i++) {
  const volume = volumes.item(i);
  volume.oninput = function (e) {
    audios[volume.id.replace('Volume', 'Card')].volume = e.target.value / 100
  }
}