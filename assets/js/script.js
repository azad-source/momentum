const img_folder = "assets/images/";
var editableText = '';

// DOM Elements
const time = document.querySelector('.time'),
    date = document.querySelector('.date'),
    greeting = document.querySelector('.greeting'),
    name = document.querySelector('.name'),
    focus = document.querySelector('.focus'),
    btnBgPrev = document.querySelector('.btn-prev'),
    btnBgNext = document.querySelector('.btn-next'),
    btnСitation = document.querySelector('.btn-citation'),
    citationText = document.querySelector('.citation-text'),
    citationAuthor = document.querySelector('.citation-author'),
    bgIndex = document.querySelector('input[name="bg_index"]'),
    citationIndex = document.querySelector('input[name="citation_index"]'),
    weatherWrap = document.querySelector('.weather-wrapper'),
    weatherIcon = document.querySelector('.weather-icon'),
    weatherTemp = document.querySelector('.weather-temperature'),
    weatherCity = document.querySelector('.weather-city'),
    weatherDesc = document.querySelector('.weather-description'),
    weatherHumi = document.querySelector('.weather-humidity'),
    weatherWind = document.querySelector('.weather-wind'),
    onInputHide = document.querySelectorAll('.oninputhide');

// Options
const showAmPm = true;

// Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        options = { weekday: 'long', month: 'long', day: 'numeric' },
        dateString = today.toLocaleDateString('ru-RU', options);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // Output Time
    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
    date.innerHTML = `${dateString}`;
    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet(sign = null) {

    let today = new Date(),
        hour = today.getHours();
    let randomValue = getRandomInt(1, 20);
    if (sign) {
        index = sign + parseInt(bgIndex.value);
        if (index >= 21 && sign == 1) index = 1;
        if (index <= 1 && sign == -1) index = 20;
    } else {
        index = randomValue;
    }

    bgIndex.value = index;

    if (hour >= 0 && hour < 6) {
        // Night
        preloadImage(img_folder + "night_" + index + ".jpg");
        greeting.textContent = 'Доброй ночи, ';
        document.body.style.color = 'white';
    } else if (hour >= 6 && hour < 12) {
        // Morning
        preloadImage(img_folder + "morning_" + index + ".jpg");
        greeting.textContent = 'Доброе утро, ';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon
        preloadImage(img_folder + "day_" + index + ".jpg");
        greeting.textContent = 'Добрый день, ';
    } else if (hour >= 18 && hour < 24) {
        // Evening
        preloadImage(img_folder + "evening_" + index + ".jpg");
        greeting.textContent = 'Добрый вечер, ';
        document.body.style.color = 'white';
    }
}

// Get Name
function getName() {
    if (localStorage.getItem('name') === null || localStorage.getItem('name') == '') {
        name.textContent = '[Введите имя]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

// Set Name
function setName(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    } else {
        localStorage.setItem('name', e.target.innerText);
    }
}

// Get Focus
function getFocus() {
    if (localStorage.getItem('focus') === null || localStorage.getItem('focus') == '') {
        focus.textContent = '[Введите задачу]';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

// Set Focus
function setFocus(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    } else {
        localStorage.setItem('focus', e.target.innerText);
    }
}

// Get City
function getCity() {
    if (localStorage.getItem('city') === null || localStorage.getItem('city') == '') {
        weatherCity.textContent = 'Самара';
        getWeather()
            .then(removeCityError)
            .catch(addCityError);
    } else {
        weatherCity.textContent = localStorage.getItem('city');
        getWeather(localStorage.getItem('city'))
            .then(removeCityError)
            .catch(addCityError);
    }
}

// Set City
function setCity(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('city', e.target.innerText);
            getWeather(e.target.innerText)
                .then(removeCityError)
                .catch(addCityError);
            weatherCity.blur();
        }
    } else {
        localStorage.setItem('city', e.target.innerText);
        if (weatherCity.innerText == '') {
            if (!weatherCity.classList.contains('weather-city-empty')) weatherCity.classList.add('weather-city-empty');
            weatherWrap.classList.remove('weather-city-error');
        } else {
            weatherCity.classList.remove('weather-city-empty');
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function changeCitation(index = null) {
    let randomValue = getRandomInt(1, data.length);
    citationText.textContent = '“' + data[randomValue].citation + '”';
    citationAuthor.textContent = data[randomValue].author;
}

async function getWeather(city = "Самара") {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=7939cb42624cda47d0faac85bb835419&units=metric&lang=ru`;
    const res = await fetch(url);
    const data = await res.json();
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    weatherTemp.textContent = `${parseInt(data.main.temp)}°C`;
    weatherDesc.textContent = data.weather[0].description;
    weatherCity.textContent = data.name;
    weatherHumi.textContent = `${parseInt(data.main.humidity)}%`;
    weatherWind.textContent = `${parseInt(data.wind.speed)}м/с`;
}

function preloadImage(url) {
    let img = new Image();
    img.src = url;

    img.onload = function() {
        document.body.style.backgroundImage = "url('" + url + "')";
    }
}

function addCityError() {
    if (!weatherWrap.classList.contains('weather-city-error') && weatherCity.innerText != '') {
        weatherWrap.classList.add('weather-city-error');
        weatherCity.classList.remove('weather-city-empty');
    } else if (weatherCity.innerText == '') {
        if (!weatherCity.classList.contains('weather-city-empty')) weatherCity.classList.add('weather-city-empty');
        weatherWrap.classList.remove('weather-city-error');
    }
}

function removeCityError() {
    weatherWrap.classList.remove('weather-city-error');
    weatherCity.classList.remove('weather-city-empty');
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
weatherCity.addEventListener('keypress', setCity);
weatherCity.addEventListener('blur', setCity);

btnBgPrev.addEventListener('click', function() { setBgGreet(-1) });
btnBgNext.addEventListener('click', function() { setBgGreet(1) });
btnСitation.addEventListener('click', changeCitation);

onInputHide.forEach(element => {
    element.addEventListener('click', function(e) {
        editableText = e.target.innerText;
        e.target.innerText = '';
    });
});

onInputHide.forEach(element => {
    element.addEventListener('blur', function(e) {
        if (e.target.innerText == '') {
            e.target.innerText = editableText;
        }
    });
});

// Run
showTime();
setBgGreet();
getName();
getFocus();
changeCitation();
getCity();

setInterval(() => { setBgGreet(+1) }, 3600 * 1000);