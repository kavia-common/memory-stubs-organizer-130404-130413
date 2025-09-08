# Ticket Scrapbook Frontend

This React app implements a lightweight ticket stub organizer with:
- User authentication (mock, localStorage-based)
- Upload/display ticket stub images
- Add/edit event details (name, date, location, type)
- Attach notes or memories
- Grid and Scrapbook views
- Search/filter (by text, year, type)
- Detailed stub view with edit/delete

Tech notes:
- No external router or UI framework used; a small hash-based router powers navigation.
- State persists to localStorage via useLocalStorage hook.
- Theme and design use the palette: primary #5636d3, secondary #f6f7fb, accent #ffbf47.

To run:
- npm install
- npm start
