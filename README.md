# colour-gallery

A simple gallery of named colours that anyone can view and add to.

## Todos

Static frontend
- [x] View static gallery of colours

Backend
- [x] Add colours with POST /colours
- [ ] Get colours with GET /colours 
  - [ ] seems to be buggy -- doesn't respond with the list

Frontend <-> backend
- [ ] Clicking Add button opens a modal to choose the colour and its name
- [ ] The modal has a form you can submit, which hits POST /colours
  - [ ] The page refreshes after you add a colour
- [ ] The page loads with actual colours from the db (GET /colours)
