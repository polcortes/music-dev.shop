# music-dev.shop
***🚧 --- STILL WORKING ON IT --- 🚧***

Music-dev is an online shop prototype made with MERN (MongoDB, Express, React and NodeJS). The principal objectives are:
- Learn how to create an API with NodeJS using Express 
- Learn how to fetch the data from React at the client and render it all.
- Implement good practices (logging, error handling...).

## How to install:
First you must clone the git repository and install dependencies from root:
```bash
git clone https://github.com/polcortes/music-dev.shop.git
cd ./music-dev.shop
npm install
```

Then, thanks to npm-run-all package, you'll install dependencies from backend and frontend with the following command:
```bash
npm run install
```

Now you'll need to fill all .env variables from "./api/.env". There's a .env.example file. Then you'll be able to start the project.

To start the project you can run from root the following and it will start development servers for api and client at the same time.
```bash
npm run dev
```