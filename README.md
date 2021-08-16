# courier
### Installing Node

(https://nodejs.org/).


### NPM

```bash
$ npm install -g npm
```

### Expo

Install expo-cli globally by running in Terminal:

```bash
$ npm install --global expo-cli
```
### Installing Project Modules

Install the project dependencies by running in Terminal within the api folder as well as the courier folder:

```bash
$ npm install
```

### Set up Environment Variables

Make a .env in your api directory called .env with the following variables:

```json
DB_URI=mongodb+srv://admin:admin@cluster0.cyg3q.mongodb.net/courier?retryWrites=true&w=majority
DB_NAME=courier
JWT_SECRET=asdfghjkjhgfdsdfghjklkjhgfd
```

### Running the project locally

Run the api locally by running in Terminal within the api folder:

```bash
$ npm start
```
Run the client locally by running in Terminal within the courier folder:

```bash
$ expo start
```





