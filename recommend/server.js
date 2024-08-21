const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Define weather-based recommendations
const recommendations = {
  hot: ['Iced Lemonade', 'Caesar Salad', 'Ice Cream'],
  cold: ['Tomato Soup', 'Hot Chocolate', 'Mac and Cheese'],
  rainy: ['Spicy Ramen', 'Hot Brownie', 'Chili'],
  cloudy: ['Grilled Sandwich', 'Latte', 'Pasta'],
};

// Function to fetch real-time weather data
const getWeatherData = async (city) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Function to make a recommendation based on the weather
const makeWeatherBasedRecommendation = async (city) => {
  const weatherData = await getWeatherData(city);

  if (weatherData) {
    const temp = weatherData.main.temp;
    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    if (temp > 30) {
      return recommendations.hot;
    } else if (temp < 15) {
      return recommendations.cold;
    } else if (weatherCondition.includes('rain')) {
      return recommendations.rainy;
    } else {
      return recommendations.cloudy;
    }
  } else {
    // Fallback if weather data is unavailable
    return recommendations.cloudy;
  }
};

// API Endpoint to get recommendations
app.get('/api/recommendations/:city', async (req, res) => {
  const { city } = req.params;
  const recommendedItems = await makeWeatherBasedRecommendation(city);

  res.json({
    city,
    recommendations: recommendedItems,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
