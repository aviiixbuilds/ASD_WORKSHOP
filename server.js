/**
 * HTTP Server Entry Point
 */

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Product API server is running on http://localhost:${PORT}`);
});
