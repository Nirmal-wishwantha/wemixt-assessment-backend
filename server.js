const app = require('./app');

const port = 3000;
const host = 'localhost';

const server = app.listen(port, host, () => {
    console.log(`Server is running http://${host}:${server.address().port}`);
});
