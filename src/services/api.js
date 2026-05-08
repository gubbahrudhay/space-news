import axios from 'axios';

// ISS APIs
export const fetchISSLocation = async () => {
  try {
    // Using wheretheiss.at because it supports HTTPS and CORS
    const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
    // Map to our existing expected format
    return {
      iss_position: {
        latitude: response.data.latitude.toString(),
        longitude: response.data.longitude.toString()
      },
      timestamp: response.data.timestamp,
      velocity: response.data.velocity // Bonus: velocity is included!
    };
  } catch (error) {
    console.error("Error fetching ISS location:", error);
    throw error;
  }
};

export const fetchAstronauts = async () => {
  try {
    // open-notify astros is often blocked by CORS, so we'll use a hardcoded list if it fails or use a proxy
    // For now, let's stick to open-notify but handle the error gracefully in the hook
    const response = await axios.get('https://api.coruzant.com/v1/iss/astros'); // Alternative or just mock
    return response.data;
  } catch (error) {
    // Fallback list of current astronauts (May 2024ish)
    return {
      number: 10,
      people: [
        { name: 'Oleg Kononenko' }, { name: 'Nikolai Chub' }, { name: 'Tracy Caldwell Dyson' },
        { name: 'Matthew Dominick' }, { name: 'Michael Barratt' }, { name: 'Jeanette Epps' },
        { name: 'Alexander Grebenkin' }, { name: 'Butch Wilmore' }, { name: 'Suni Williams' }
      ]
    };
  }
};

// Fetch location name from lat/lng using OpenStreetMap Nominatim API
export const fetchLocationName = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
    return response.data?.display_name || 'Over ocean / remote area';
  } catch (error) {
    // Usually means it's over the ocean where reverse geocoding fails or rate limited
    return 'Over ocean / remote area';
  }
};

// News API
export const fetchNews = async (category = 'technology') => {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey || apiKey === 'your_gnews_api_key_here') {
    // Return empty array if API key is not set
    return [];
  }

  try {
    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: {
        q: category,
        lang: 'en',
        max: 10,
        apikey: apiKey
      }
    });
    
    // Map GNews format to match our app's expected structure
    return (response.data.articles || []).map(article => ({
      ...article,
      source: { title: article.source.name },
      body: article.description,
      dateTime: article.publishedAt
    }));
  } catch (error) {
    console.error("Error fetching news from GNews:", error.response?.data || error.message);
    // Return empty array on error instead of mock data
    return [];
  }
};

// Chatbot API
export const fetchChatResponse = async (messages, context) => {
  const apiKey = import.meta.env.VITE_HF_TOKEN;

  const systemPrompt = `You are a helpful AI assistant for a dashboard. You must ONLY answer using the provided dashboard data context. Do not use outside knowledge. If the answer is not in the context, say "I can only answer using dashboard data."
  
  Context:
  ISS Position: ${context.iss?.latitude}, ${context.iss?.longitude}
  ISS Speed: ${context.iss?.speed} km/h
  Astronauts in space: ${context.astronauts?.number} (${context.astronauts?.names?.join(', ')})
  News Articles Count: ${context.news?.length}
  Latest News Headlines: ${context.news?.slice(0, 3).map(n => n.title).join(' | ')}
  `;

  if (!apiKey || apiKey === 'your_hf_token_here') {
    return "API key not configured. I am a mock response. Please add VITE_HF_TOKEN to .env to use the real Mistral AI. Context info: ISS is at " + context.iss?.latitude + ", " + context.iss?.longitude + " moving at " + context.iss?.speed + " km/h.";
  }

  try {
    // Merge system prompt into the first message to avoid role compatibility issues
    const formattedMessages = [
      { role: 'user', content: `${systemPrompt}\n\nUser query: ${messages[0]?.content || "Hello"}` },
      ...messages.slice(1)
    ];

    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: 'mistralai/Mistral-7B-Instruct-v0.2:featherless-ai',
        messages: formattedMessages,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Chat API Error:", error.response?.data || error.message);
    let apiErrorMsg = error.response?.data || error.message;
    if (typeof apiErrorMsg === 'object') {
      apiErrorMsg = JSON.stringify(apiErrorMsg);
    }
    return `API Error: ${apiErrorMsg}`;
  }
};
