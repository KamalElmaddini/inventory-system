// Vercel Serverless Function Bridge
// This file runs in Vercel's /api environment and bridges requests to the Express app.

const app = require('../backend/src/app');

// Important: Vercel serverless functions need the app to be exported, not listening.
// We remove the app.listen() call in the imported app if structurally possible, 
// or simply assume app.js exports the express instance.
module.exports = app;
