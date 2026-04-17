export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  country: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  icon: string;
  condition: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const isApiKeySet = () => {
  return !!API_KEY && API_KEY !== 'your_api_key_here';
};

const formatWeatherData = (data: any): WeatherData => {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
};

export const fetchWeatherByCity = async (city: string): Promise<{current: WeatherData, forecast: ForecastData[]}> => {
  if (!isApiKeySet()) throw new Error("API key is not configured.");
  
  // Fetch current
  const weatherRes = await fetch(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`);
  if (!weatherRes.ok) {
    const errorData = await weatherRes.json().catch(() => ({}));
    if (weatherRes.status === 401) throw new Error("API Key is invalid or still activating. Please allow up to 60 minutes for new keys.");
    if (weatherRes.status === 404) throw new Error("City not found");
    throw new Error(errorData.message || "Failed to fetch weather data");
  }
  const weatherData = await weatherRes.json();
  const current = formatWeatherData(weatherData);

  // Fetch forecast
  const forecastRes = await fetch(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
  if (!forecastRes.ok) throw new Error("Failed to fetch forecast data");
  const forecastRaw = await forecastRes.json();

  const forecast = extractDailyForecast(forecastRaw.list);

  return { current, forecast };
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<{current: WeatherData, forecast: ForecastData[]}> => {
  if (!isApiKeySet()) throw new Error("API key is not configured.");

  const weatherRes = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  if (!weatherRes.ok) {
    const errorData = await weatherRes.json().catch(() => ({}));
    if (weatherRes.status === 401) throw new Error("API Key is invalid or still activating. Please allow up to 60 minutes for new keys.");
    throw new Error(errorData.message || "Failed to fetch weather data by location");
  }
  const weatherData = await weatherRes.json();
  const current = formatWeatherData(weatherData);

  const forecastRes = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
  if (!forecastRes.ok) throw new Error("Failed to fetch forecast data");
  const forecastRaw = await forecastRes.json();
  
  const forecast = extractDailyForecast(forecastRaw.list);
  
  return { current, forecast };
};

// OpenWeather 5-day forecast returns data every 3 hours. We extract one reading per day (around 12:00 PM).
const extractDailyForecast = (list: any[]): ForecastData[] => {
  const dailyData: Record<string, ForecastData> = {};

  list.forEach((item) => {
    const dateStr = item.dt_txt.split(' ')[0];
    const timeStr = item.dt_txt.split(' ')[1];
    
    // Prioritize 12:00 PM forecast or take the first available for that day
    if (!dailyData[dateStr] || timeStr === '12:00:00') {
      dailyData[dateStr] = {
        date: dateStr,
        temperature: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        condition: item.weather[0].main,
      };
    }
  });

  // Convert to array and take up to 5 days, ignoring today if it gets mixed in at the start
  const dates = Object.keys(dailyData).sort();
  const result = dates.slice(0, 6).map(date => dailyData[date]);
  
  // We want exactly 5 days. Sometimes it gives 6 depending on time of day.
  return result.length > 5 ? result.slice(1, 6) : result;
};
