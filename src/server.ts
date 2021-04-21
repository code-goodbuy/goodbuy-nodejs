import App from './app'

const app = new App();

app.listen();

module.exports = app.app; // needed to access the app
