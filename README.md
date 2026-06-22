# AI Travel Planner

An AI-assisted trip planning app that generates structured travel itineraries, budgets, hotels, and packing suggestions from a simple set of user inputs. The project combines authenticated user accounts, a MongoDB-backed trip store, and a Gemini-powered backend service to produce and manage plans.

## Project Overview

The app helps a user:

1. Create an account or log in.
2. Generate a trip by entering a destination, duration, budget tier, and interests.
3. Review the generated itinerary, budget breakdown, hotel suggestions, and packing checklist.
4. Edit the trip with custom actions like adding activities, removing activities, and regenerating a specific day.
5. Return later to manage the saved trip from a dashboard.

The goal is not to replace human trip planning, but to compress the first draft from hours into minutes.

## Tech Stack

- Frontend: Next.js 16 with React 19 and Tailwind CSS 4
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT-based auth with bcrypt password hashing
- AI integration: Google Gemini via `@google/genai` and `axios`
- HTTP client: Axios

### Why this stack

- Next.js keeps the UI and routing simple while supporting modern app routing.
- Express provides a lightweight API layer with minimal overhead.
- MongoDB is a good fit for flexible trip documents because itinerary and packing data are nested and dynamic.
- JWT auth works well for a small assessment app because it is easy to reason about and easy to protect route-by-route.
- Gemini is used to generate the structured trip plan that powers the core experience.

## Setup Instructions

### Local setup

#### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the API:

```bash
npm run dev
```

#### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Deployed setup

If deployed, set the same backend environment variables in your hosting platform and point `NEXT_PUBLIC_API_URL` to the deployed backend API URL.

Typical deployment flow:

- Deploy backend on a Node-friendly platform
- Deploy frontend on Vercel or similar
- Update the frontend API base URL to the deployed backend
- Verify auth, trip creation, and trip detail editing end-to-end

## High-Level Architecture

The app is split into two main parts:

### Frontend

- `frontend/app/page.js`: landing page
- `frontend/app/login/page.js`: login flow
- `frontend/app/register/page.js`: registration flow
- `frontend/app/dashboard/page.js`: saved trip overview
- `frontend/app/create-trip/page.js`: trip generation form
- `frontend/app/trip/[id]/page.js`: trip detail and editing screen

The frontend stores the JWT in `localStorage` and sends it through Axios interceptors in `frontend/services/api.js`.

### Backend

- `backend/server.js`: Express bootstrap, middleware, and route registration
- `backend/routes/authRoutes.js`: register and login endpoints
- `backend/routes/tripRoutes.js`: trip CRUD and editing endpoints
- `backend/controllers/authController.js`: account creation and sign-in
- `backend/controllers/tripController.js`: trip creation, retrieval, deletion, and trip edits
- `backend/services/geminiService.js`: AI itinerary generation and fallback generator
- `backend/models/Trip.js`: MongoDB trip schema

### Data flow

1. User signs up or logs in.
2. Frontend stores the JWT.
3. Authenticated requests call protected trip endpoints.
4. Trip creation sends destination, duration, budget tier, and interests to the backend.
5. Backend calls Gemini and stores the generated result in MongoDB.
6. Dashboard and trip detail pages read and edit the saved trip.

## Authentication and Authorization

Authentication is handled with JWTs:

- On register or login, the backend returns a signed token.
- The frontend stores the token in `localStorage`.
- Axios attaches the token as a Bearer token on API requests.
- The `protect` middleware verifies the token before allowing access to trip routes.

Authorization is enforced by user ownership:

- Trips are saved with a `userId`.
- All trip fetch, update, delete, and regeneration actions query by both trip ID and `userId`.
- That means one user cannot access another user’s trips even if they guess an ID.

## AI Agent Design and Purpose

The AI component is intentionally focused:

- Input: destination, duration, budget tier, interests
- Output: structured JSON containing itinerary, estimated budget, hotel suggestions, and packing list

The AI does not generate a free-form paragraph. Instead, it produces a usable data object that the app can render directly. That makes the output easier to store, edit, and explain.

### Why this design

- Structured output reduces parsing ambiguity.
- The backend can persist the result in MongoDB.
- The UI can support later edits without regenerating everything.
- If Gemini fails, the app falls back to a deterministic generator so the flow still works.

### AI purpose

The AI is not just a chatbot. It acts like a trip-planning assistant that produces a usable first draft with practical details a traveler can act on.

## Creative / Custom Feature

The strongest custom feature is the editable trip experience:

- Add your own activity to a day
- Remove an existing activity
- Regenerate an individual day with an instruction prompt
- View a budget snapshot and packing checklist alongside the itinerary

There is also a budget optimization endpoint that returns a heuristic lower-cost version of the current trip budget. It is intentionally lightweight and explainable rather than pretending to be smarter than it is.

## Key Design Decisions and Trade-Offs

- I used a split frontend/backend architecture because it makes the AI service and the authenticated API easier to reason about.
- I used JWT in local storage because it is simple for a demo-style assessment app, though it is not the most secure option for a production app compared with HTTP-only cookies.
- I stored generated trips in MongoDB so users can return later and continue editing their plans.
- I made the AI output JSON instead of plain text so the UI can present the plan as real app data instead of a static response.
- I added a fallback itinerary generator so a temporary Gemini failure does not completely break the submission flow.
- I kept the custom editing features lightweight so the app stays easy to understand during a short walkthrough video.

## Known Limitations

- The regenerated day logic is currently heuristic and not a full second AI call.
- The trip planner assumes the AI returns valid JSON and performs only basic cleanup before parsing.
- Authentication is client-token based rather than cookie-based.
- There is no payment flow, trip sharing, or real-time collaboration.
- The app depends on external services for MongoDB and Gemini during normal operation.

## Walkthrough Video

Video link: `ADD_YOUR_LINK_HERE`

### Suggested 3–4 minute walkthrough flow

1. Landing page and overall app flow
2. Register/login flow and auth protection
3. Create-trip form and AI generation
4. Trip detail page with editing, regenerate, and budget/packing views
5. Custom feature callout and design decisions

## Scripts

- `npm run dev` in `frontend/`
- `npm run dev` in `backend/`
- `npm run build` in `frontend/`
- `npm run lint` in `frontend/`

