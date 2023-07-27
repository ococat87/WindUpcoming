const API_SECRET_KEY = 'b7c0ed28f67257a0052a3c4451594824';

function fetchWeatherData(cityName) {
  const base = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_SECRET_KEY}&units=metric`;

  return fetch(base)
    .then((response) => response.json())
    .then((data) => {
      data.main.temp = (data.main.temp * 9/5) + 32;
      return data;
    })
    .catch((error) => {
      console.error('Error fetching weather data:', error);
    });
}

function displayWeatherData(data) {
    const cityNameElement = document.getElementById('cityName');
    const weatherDescElement = document.getElementById('weatherDesc');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');
  
    if (data) {
      cityNameElement.textContent = data.name;
      weatherDescElement.textContent = data.weather[0].description;
      temperatureElement.textContent = `Temperature: ${data.main.temp.toFixed(1)} °F`; 
      humidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    } else {

      cityNameElement.textContent = 'City not found';
      weatherDescElement.textContent = '';
      temperatureElement.textContent = '';
      humidityElement.textContent = '';
    }
}

function fetchForecastData(cityName) {
  const base = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_SECRET_KEY}&units=metric`;

  return fetch(base)
  .then((response) => response.json())
  .then((data) => {
    // Convert Celsius to Fahrenheit for each forecast item
    data.list.forEach((forecast) => {
      forecast.main.temp = (forecast.main.temp * 9/5) + 32;
    });
    return data;
  })
  .catch((error) => {
    console.error('Error fetching forecast data:', error);
  });;
}

function displayForecastData(data) {
  const forecastList = document.getElementById('forecast');
  const forecastMessage = forecastList.querySelector('.forecast-message');

  if (data && data.list && data.list.length > 0) {
    forecastList.innerHTML = '';

    for (let i = 0; i < 5; i++) {
      const forecast = data.list[i];
      const forecastDay = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
      const forecastDesc = forecast.weather[0].description;
      const forecastTemp = forecast.main.temp.toFixed(1);

      const listItem = document.createElement('li');
      listItem.innerHTML = `<span class="forecast-day">${forecastDay}</span><br><span class="forecast-desc">${forecastDesc}</span><br><span class="forecast-temp">${forecastTemp} °F</span>`;
      forecastList.appendChild(listItem);
    }

    const forecastItems = forecastList.querySelectorAll('li');
    forecastItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('show');
      }, index * 100); 
    });
  } else {
    forecastList.innerHTML = '<li>No forecast data available</li>';
    forecastMessage.style.display = 'block';
  }
}

function setupFormSubmission() {
  const myForm = document.getElementById('myForm');
  const searchInput = document.getElementById('search');

  if (myForm && searchInput) {
    myForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const searchValue = searchInput.value;
      console.log('Search value:', searchValue);

      fetchWeatherData(searchValue)
        .then((data) => {
          displayWeatherData(data);
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
          displayWeatherData(null);
        });

      fetchForecastData(searchValue)
        .then((data) => {
          displayForecastData(data);
        })
        .catch((error) => {
          console.error('Error fetching forecast data:', error);
          displayForecastData(null);
        });
    });
  } else {
    console.error('Form or input element not found in the DOM.');
  }

  const cityList = document.querySelectorAll('.city');
  if (cityList) {
    cityList.forEach((cityItem) => {
      cityItem.addEventListener('click', function (event) {
        const cityName = event.target.textContent.trim();
        console.log('Clicked on city:', cityName);

        fetchWeatherData(cityName)
          .then((data) => {
            displayWeatherData(data);
          })
          .catch((error) => {
            console.error('Error fetching weather data:', error);
            displayWeatherData(null);
          });

        fetchForecastData(cityName)
          .then((data) => {
            displayForecastData(data);
          })
          .catch((error) => {
            console.error('Error fetching forecast data:', error);
            displayForecastData(null);
          });
      });
    });
  }
}

   
  
