// fetch('https://covid-19-data.p.rapidapi.com/country?name=vietnam', {
//     'method': 'get',
//     'headers': {
//         'x-rapidapi-host': "covid-19-data.p.rapidapi.com",
//         'x-rapidapi-key': "86f4804a4amsh8398cf31d4016b4p1b41c7jsn442e426c0897"
//     }
// })
//     .then(response => {
//         return response.json();
//     })
//     .then(data => {
//         console.log(data);
//         handleDataDisplay(data);
//     })
//     .catch(e => {
//         console.log(`error: ${e}`);
//     })

function handleDataDisplay(jsonData) {
    if (Array.isArray(jsonData)) {
        const allRow = jsonData.map(country => {
            let deathPercent = ((country.deaths / country.confirmed) * 100).toFixed(2);
            let recoveryPercent = ((country.recovered / country.confirmed) * 100).toFixed(2);
            return (
                `<tr>
                    <td>${country.confirmed}</td>
                    <td>${country.deaths} (${deathPercent}%)</td>
                    <td>${country.recovered} (${recoveryPercent}%)</td>
                </tr>`
            )
        }).join('');

        document.querySelector('#covid-table tbody').innerHTML = allRow;
    }
    else {
        console.log('not an array');
    }
}
/**
 * -------------------------------------------------------------
 */
const weatherapiAPIKey = 'b2275dc7728d494b8f424204210309';
const baseUrl = 'http://api.weatherapi.com/v1'
const URIs = ["/current.json", "/forecast.json",]

// fetch(`${baseUrl}?key=${weatherapiAPIKey}&q=Hanoi&lang=vi`, {
//     method: 'GET',
// })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data)
//     })
const provinces = ["Hanoi", "Lao cai", "Ho chi minh"];


window.onload = function () {
    useFetch('/forecast.json', { // current weather
        lang: 'vi',
        q: 'Hanoi',
        days: 1,
    });

    const forcastBtns = document.querySelectorAll('.btn-forcast');
    forcastBtns.forEach(btn => {
        btn.onclick = function (e) {
            useFetch('/forecast.json', { // current weather
                lang: 'vi',
                q: 'Hanoi',
                days: this.getAttribute('data-forcast'),
            });
        }
    })
};

function useFetch(uri = "/current.json", options = {
    q: 'Lao cai',
    lang: 'vi',
}) {

    let url = `${baseUrl}${uri}?key=${weatherapiAPIKey}`;
    for (let [key, value] of Object.entries(options)) {
        url += `&${key}=${value}`;
    }

    fetch(url, { mode: 'cors', })
        .then(response => response.json())
        .then(data => {
            if (uri == URIs[0]) {
                handleDisplayCurrent(data); // current
            }
            else if (uri == URIs[1]) {
                handleDisplayCurrent(data); // current
                handleDisplayTomorrow(data) // tomorrow
            }
        })
        .catch(error => {
            console.error(`error: ${error}`);
        })
}


function handleDisplayTomorrow(locationObj) {
    const forcastArray = locationObj.forecast.forecastday;

    const html = forcastArray.map(forecast => {
        const { date, day } = forecast;
        const { avghumidity, condition, daily_chance_of_rain, maxtemp_c, mintemp_c, totalprecip_mm } = day;
        const { text: conditionText, icon: conditionIconLink } = condition;

        return (
            `
            <div class="tomorrow row px-5 py-2">
                <h2 class="header">Ngày mai</h2>
                <p class="date">${date}</p>
                <div class="general col-12 col-lg-6">
                    <div class="temperature">
                    <div class="img-parent"><img src=${conditionIconLink} alt=""></div>
                    <div class="degree">
                        <div class="from-degree ">${mintemp_c}</div>
                        <span style="padding: 0 4px;"> - </span>
                        <div class="to-degree degree-indicator">${maxtemp_c}</div>
                    </div>
                    </div>
                </div>
                <div class="detail col-12 col-lg-6">
                    <div class="text">${conditionText}</div>
                    <div class="huminity">Khả năng có mưa: <span>${daily_chance_of_rain}</span></div>
                    <div class="huminity">Độ ẩm trung bình: <span>${avghumidity}</span></div>
                    <div class="precip">Lượng mưa tổng: <span>${totalprecip_mm}</span></div>
                </div>
            </div>
            `
        )
    }).join('');

    document.querySelector('.forcast-area').innerHTML = html;

}

function handleDisplayCurrent(locationObj) {
    const currentObj = locationObj.current;
    const { condition, feelslike_c, humidity, precip_mm, temp_c, vis_km, wind_kph, last_updated } = currentObj;
    const { text: conditionText, icon: conditionIconLink } = condition;
    const updated_time = last_updated.substr(last_updated.lastIndexOf(':') - 2).trim();

    document.querySelector('.current-area').innerHTML = (
        `
        <h2 class="header">Thời tiết hiện tại</h2>
        <div class="general col-12 col-lg-6">
          <div class="time">${updated_time}</div>
          <div class="temperature pt-4">
            <div class="img-parent"><img src=${conditionIconLink} alt=""></div>
            <div class="degree">
            <div class="text">${conditionText}</div>
            <div class="real degree-indicator">${temp_c}</div>
            <div class="feel-like degree-indicator">${feelslike_c}</div>
            </div>
          </div>
        </div>
        <div class="detail col-12 col-lg-6">
          <div class="wind">Tốc độ gió: <span>${wind_kph}</span></div>
          <div class="huminity">Độ ẩm: <span>${humidity}</span></div>
          <div class="precip">Lượng mưa: <span>${precip_mm}</span></div>
          <div class="visual">Tầm nhìn xa: <span>${vis_km}</span></div>
        </div>
      `
    )
}