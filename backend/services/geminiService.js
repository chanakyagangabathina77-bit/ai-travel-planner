const axios = require("axios");

const GENERATE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

const formatPrompt = (destination, durationDays, budgetTier, interests) => {
  return `Generate a JSON travel itinerary for a ${durationDays}-day trip to ${destination}.
Budget preference: ${budgetTier}.
Interests: ${interests.join(", ")}.

Return only valid JSON with these top-level keys: itinerary, estimatedBudget, hotels, packingList.

Example itinerary item:
{
  "dayNumber": 1,
  "activities": [
    {
      "title": "Visit Senso-ji Temple",
      "description": "Explore the historic temple and nearby markets.",
      "estimatedCostUSD": 20,
      "timeOfDay": "Morning"
    }
  ]
}

Hotel example:
{
  "name": "Hotel Sakura Tokyo",
  "tier": "Budget Friendly",
  "estimatedCostNightUSD": 85,
  "rating": "4.2/5"
}

Budget example:
{
  "flights": 400,
  "accommodation": 300,
  "food": 150,
  "activities": 100,
  "transport": 80,
  "total": 1030
}

Packing list example:
[
  { "item": "Passport", "category": "Documents", "isPacked": false },
  { "item": "Rain jacket", "category": "Clothing", "isPacked": false }
]

Use destination-specific suggestions and budget profile to estimate realistic costs. Output only JSON.`;
};

const generateItinerary = async (
  destination,
  durationDays,
  budgetTier,
  interests
) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const response = await axios.post(
    `${GENERATE_URL}?key=${apiKey}`,
    {
      prompt: {
        messages: [
          {
            role: "system",
            content:
              "You are a travel itinerary generator. Respond with valid JSON only.",
          },
          {
            role: "user",
            content: formatPrompt(
              destination,
              durationDays,
              budgetTier,
              interests
            ),
          },
        ],
      },
      temperature: 0.4,
      maxOutputTokens: 900,
      candidateCount: 1,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const candidate = response.data?.candidates?.[0];
  const content = candidate?.content?.[0]?.text || candidate?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error("Invalid AI response from Gemini");
  }

  return content;
};

module.exports = {
  generateItinerary,
};

// Fallback generator used when external API fails
const fallbackGenerator = (destination, durationDays, budgetTier, interests) => {
  const itinerary = [];
  for (let i = 1; i <= durationDays; i++) {
    itinerary.push({
      dayNumber: i,
      activities: [
        { title: `Explore ${destination} - day ${i} highlights`, description: `Self-guided exploration in ${destination}`, estimatedCostUSD: 20, timeOfDay: 'Any' },
      ],
    });
  }

  const estimatedBudget = {
    flights: 400,
    accommodation: 100 * durationDays,
    food: 40 * durationDays,
    activities: 50 * durationDays,
    transport: 20 * durationDays,
    total: 400 + 100 * durationDays + 40 * durationDays + 50 * durationDays + 20 * durationDays,
  };

  const hotels = [
    { name: `${destination} Friendly Hotel`, tier: budgetTier, estimatedCostNightUSD: 100, rating: '4.0/5' },
  ];

  const packingList = [
    { item: 'Passport', category: 'Documents', isPacked: false },
    { item: 'Comfortable shoes', category: 'Clothing', isPacked: false },
  ];

  return JSON.stringify({ itinerary, estimatedBudget, hotels, packingList });
};

// Export a wrapper that attempts real call then falls back
const generateItineraryWithFallback = async (destination, durationDays, budgetTier, interests) => {
  try {
    return await generateItinerary(destination, durationDays, budgetTier, interests);
  } catch (err) {
    console.error('Gemini API failed, using fallback generator:', err.message || err);
    return fallbackGenerator(destination, durationDays, budgetTier, interests);
  }
};

module.exports = {
  generateItinerary: generateItineraryWithFallback,
};