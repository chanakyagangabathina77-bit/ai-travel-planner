# Walkthrough Script

Target length: 3 to 4 minutes.

## 1. Opening, 20 to 30 seconds

- “This is AI Travel Planner, an app that turns a destination, trip length, budget, and interests into a structured itinerary.”
- Show the landing page.
- Mention the visual goal: calm, premium travel-planning UI with a clear path into the product.

## 2. Application flow, 30 to 40 seconds

- Show navigation from landing page to register/login.
- Explain the flow:
  - sign up or log in
  - create a trip
  - view generated itinerary
  - return to the dashboard to manage trips

## 3. Authentication and authorization, 30 to 40 seconds

- Show login or registration.
- Explain that the backend returns a JWT token.
- Mention that the frontend stores the token and sends it on requests.
- Show that protected trip routes require authentication and are tied to the signed-in user.

## 4. AI functionality, 45 to 60 seconds

- Open the create-trip form.
- Explain that the backend calls Gemini with destination, duration, budget tier, and interests.
- Show the generated trip detail page.
- Highlight the itinerary, budget breakdown, hotel suggestions, and packing list.
- Mention the fallback generator as a safety net if AI generation fails.

## 5. Custom feature, 30 to 45 seconds

- Show adding an activity.
- Show removing an activity.
- Show regenerating a day with a short instruction.
- Mention the budget optimization endpoint as an extra heuristic feature.

## 6. Design decisions, 20 to 30 seconds

- Mention the glassy dark theme and readable card-based layout.
- Explain that the UI is designed to make planning feel premium but low-friction.
- Call out that structured AI output makes the app easier to store and edit.

## 7. Closing, 10 to 15 seconds

- “That’s the app. It combines authentication, AI generation, and editable trip management into one workflow.”
- Mention the deployed link if you have one.
- End with the video link in the submission.

