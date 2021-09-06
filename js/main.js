/**
 * -------------------------------------------------------------
 */
const loader = document.querySelector('.loader');

const weatherapiAPIKey = 'b2275dc7728d494b8f424204210309';
const baseUrl = 'https://api.weatherapi.com/v1'
const URIs = ["/current.json", "/forecast.json",]
// const provinces = ["Hanoi", "Lao cai", "Ho chi minh"];
const provinces = [
    { name: "Hà Nội", code: "Hanoi" },
    { name: "Lào Cai", code: "Lao cai" },
    { name: "London", code: "London" },
    { name: "New York", code: "New york" },
    { name: "Paris", code: "Paris" },
    { name: "Hồng Kông", code: "hongkong" },
]

window.onload = function () {

    renderProvinceList(provinces); // load option for select province tag

    useFetch('/forecast.json', { // current weather
        lang: 'vi',
        q: document.querySelector('#province').value,
        days: 1,
    });

    const forcastBtns = document.querySelectorAll('.btn-forcast');
    forcastBtns.forEach(btn => {
        btn.onclick = function (e) {
            useFetch('/forecast.json', { // current weather
                lang: 'vi',
                q: document.querySelector('#province').value,
                days: this.getAttribute('data-forcast'),
            });
        }
    });

    const sel = document.querySelector('#province');
    sel.onchange = function (e) {
        useFetch('/forecast.json', { // current weather
            lang: 'vi',
            q: e.target.value,
            days: 1,
        });
    }

};

function useFetch(uri = "/current.json", options = {
    q: 'Lao cai',
    lang: 'vi',
}) {

    let url = `${baseUrl}${uri}?key=${weatherapiAPIKey}`;
    for (let [key, value] of Object.entries(options)) {
        url += `&${key}=${value}`;
    }

    loader.classList.add('on');

    fetch(url, { mode: 'cors', })
        .then(response => {
            loader.classList.remove('on');
            return response.json()
        })
        .then(data => {
            if (uri == URIs[0]) {
                handleDisplayCurrent(data); // current
            }
            else if (uri == URIs[1]) {
                handleDisplayCurrent(data); // current
                handleDisplayForcast(data) // tomorrow
            }
        })
        .catch(error => {
            console.error(`error: ${error}`);
        })
}


function handleDisplayForcast(locationObj) {
    const forcastArray = locationObj.forecast.forecastday;

    const html = forcastArray.map((forecast, idx) => {
        const { date, day } = forecast;
        const { avghumidity, condition, daily_chance_of_rain, maxtemp_c, mintemp_c, totalprecip_mm } = day;
        const { text: conditionText, icon: conditionIconLink } = condition;

        let [y, m, d] = date.split('-');
        let today = `Ngày ${d >= 10 ? d : d.substr(1)} tháng ${m >= 10 ? m : m.substr(1)}`;
        if (idx == 0) today = 'Hôm nay';

        return (
            `
            <div class="col-12">
                <div class="following-day row py-3">
                    <h2 class="header">${today}</h2>
                    <div class="general col-12 col-lg-6 my-3">
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
        <div class="row py-3">
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
        </div>
      `
    )
}

function renderProvinceList(provinceList) {
    const html = provinceList.map(province => {
        if (province.code == 'Lao cai') {
            return `<option value=${province.code} selected>${province.name}</option>`
        } else {
            return `<option value=${province.code}>${province.name}</option>`
        }
    }).join('')
    document.querySelector('#province').innerHTML += html;
}