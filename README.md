# Trade Boutique

Trade Boutique is an intuitive and easy to use virtual stock trading platform.

## Features
- Developed with the MEAN Stack
- Designed to scale easily
- Deployed via Heroku
- Real-time price updates
- Six international stock markets
- Financial data available for every company
- Up-to-date financial news

## How it works
- Information is sent to the client via a REST API using data retrieved from the database
- The database is populated by calls made to several financial news and financial data APIs
- Stock prices are updated in real-time, when the markets are opened, with the help of a Cron Job
- If a symbol that is not in the database is requested, the app will connect to the external APIs and try to get financial data, news and the price for that symbol
- Since the external APIs used are free (therefore not 100% reliable), back-up APIs have also been added.

## Getting Started

##### set NODE_ENV=development as an environment variable
The platform uses Auth0.com to manage user Sign Up and Log In as well as a financial news API. You will need to set up accounts with these providers and export all the API Keys from a ".config" file located in your root folder.
Alternatively, you could set the API Keys as environment variables on a Linux system.
#### https://auth0.com/
Create a free account and store the Client Secret and Client ID as "AUTH_CLIENT_SECRET" and "AUTH_CLIENT_ID".
You will also need to set the Domain and Client ID in Angular, in [app.config.js](client/app/app.config.js)
#### https://newsriver.io/
Create a free account and store the Authorization code in a variable named "RIVER_NEWS_AUTHORIZATION". This service is used as a back-up in case http://finance.yahoo.com/ is not working.

## Built With

* [Node.js](https://nodejs.org/en/) - Server-side language
* [Express.js](https://expressjs.com/) - Framework for Node

* [MongoDB](https://www.mongodb.com/) - Database
* [Mongoose](http://mongoosejs.com/) - Object modeling for MongoDB

* [Angular](https://angularjs.org/) - Front-end framework
* [Angular Material](https://material.angularjs.org/latest/) - UI Component Framework

* [NPM](https://www.npmjs.com/) - Back-end package manager
* [Bower](https://bower.io/) - Front-end package manager

## Contributing

If you wish to contribute, please let me know and I will send you a TODO list of features that I want to implement in the near future.

## Authors

* **Daniel Nitu** - *Initial work*

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
