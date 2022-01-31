const timeJs = document.getElementById('time');
const dateJs = document.getElementById('date');
const todayDetails = document.getElementById('today-details');
const city = document.getElementById('city');
const latLon = document.getElementById('lat-lon');
const otherDay = document.getElementById('forecast-other-days');
const todayTemp = document.getElementById('today-temp');
const daysOfTheWeek = ['Niedziela','Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
const months = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];

const key = '1291d9ba1ce66ccf4cd462612b49a83a'

setInterval(() => {
    const time = new Date();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const year = time.getFullYear();
    timeJs.innerHTML = hour + ':' + (minutes <10? '0'+minutes:minutes)
    dateJs.innerHTML = daysOfTheWeek[day] + ', ' + date + ' ' + months[month] + ' ' + year

}, 1000);

getDataFromApi()
function getDataFromApi () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        let {latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${key}&lang=pl`).then(res => res.json()).then(data => {
            console.log(data)
            showWeather(data);

        })

    })
}

function showWeather (data){
    let {temp, humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    latLon.innerHTML = data.lat + 'N ' + data.lon + 'E'
    city.innerHTML = data.timezone;
    todayDetails.innerHTML =
   `<div class="details-for-today">
   <div><b>Temperatura Teraz</b></div>
   <div>${temp} &#176;C</div>
   <div><br></div>
    </div> 
   <div class="details-for-today">
        <div><b>Wilgotność</b></div>
        <div>${humidity} %</div>
        <div><br></div>
    </div>
    <div class="details-for-today">
        <div><b>Ciśnienie</b></div>
        <div>${pressure} mbar</div>
        <div><br></div>
    </div>
    <div class="details-for-today">
        <div><b>Wiatr</b></div>
        <div>${wind_speed} km/h</div>
        <div><br></div>
    </div>
    <div class="details-for-today">
        <div><b>Wschód słońca</b></div>
        <div></div>
        <div>${window.moment(sunrise*1000).format('HH:mm')}</div> 
        <div><br></div>
    </div>
    <div class="details-for-today">
        <div> <b>Zachód słońca</b></div>
        <div>${window.moment(sunset*1000).format('HH:mm')}</div>
        <div><br></div>
    </div>
    `;

    let otherDayForecast = ' '
    data.daily.forEach((day, idx) => {
        if (idx == 0){
            todayTemp.innerHTML = `
            <div class="day">Prognoza na dziś</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="today-t">Max ${day.temp.max} 
                &#176;</div>
                <div class="temp.today">Min ${day.temp.min}&#176; C</div>
                <div> <br> ${day.weather[0].description} </div>
            </div>
            `
        }else{
            otherDayForecast += `
            <div class="other-days">
                <div class="day">${window.moment(day.dt*1000).format('dd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Max ${day.temp.max}&#176 C</div>
                <div class="temp">Min ${day.temp.min}&#176  C</div>
            </div>
            `
        }
    })
    otherDay.innerHTML = otherDayForecast;

    
}