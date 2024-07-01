import express from 'express';
import cors from 'cors';
// const cors = require('cors');
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import fs from 'node:fs/promises';
import {
  ValidationError,
  UserBadCredentialsError,
  UserDoesNotExistError,
  UserAlreadyExistsError,
} from './errors.js';
import {
  arrayShuffle,
  setLog,
} from './utils.js';
import dataAlbums from './data.js';

const app = express()
app.use(express.json())
app.use(cors());
// app.options('*', cors());
app.use(cookieParser())

//? MongoDB config:
const URI = process.env.MONGO_URI
const DB_NAME = process.env.MONGO_DBNAME

const PORT = process.env.PORT ?? 3000

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  // console.log({ username, password });

  try {
    // Connect to db
    const client = new MongoClient(URI)
    await client.connect()
    console.log('funciona')
    const db = client.db(DB_NAME)
    const collection = db.collection('users')

    let userData = await collection.findOne({ username: { $eq: username } })
    await client.close()
    const hashedPass = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS))
    
    
    if (!userData) throw new UserDoesNotExistError(`User "${username}" does not exist.`, username)
    if (!hashedPass == userData.password) throw new UserBadCredentialsError(`User bad credentials`) // log con detalles error sin detalles 👍

    const token = jwt.sign(
      { id: userData._id, username: userData.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    res
      .cookie('access_token', token, {
        httpOnly: true, // no se puede acceder por js
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1 hora
      })
      .send({ token })
  } catch (e) {
    switch (e.name) {
      case 'UserDoesNotExistError':
        // Aquí enviar log.
        res.status(401).send({ message: 'El usuario introducido no existe. Vuelve a probar con otro o prueba a registrate.' });
        break;

      case 'UserBadCredentialsError':
        // Aquí enviar log con e.username.
        res.status(401).send({ message: 'Las credenciales no coinciden en nuestra base de datos.' });
        break;

      default:
        res.status(401).send({ message: 'Ha ocurrido un error, vuelve a probar dentro de unos minutos...' });
        break;
    }
  }
})

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  // Password validation
  if (typeof password !== 'string')
    throw new ValidationError("Password isn't a string", username)
  if (password.length < 6) throw new ValidationError('Password lenght is lower than 5 characters', username)
  if (password.length > 30) throw new ValidationError('Password length cannot be greater than 30 characters', username)

  // Username validation
  if (typeof username !== 'string') throw new ValidationError("Username isn't a string", username)
  if (username.length < 3) throw new ValidationError("Username lenght can't be lower than 3 characters", username)
  if (username.length > 30) throw new ValidationError('Username length cannot be greater than 30 characters', username)
  
  if (typeof email !== 'string') throw new ValidationError("Email isn't a string", email);
  if (!/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email)) throw new ValidationError("Email isn't valid", email);

  try {
    // Connect to db
    const client = new MongoClient(URI)
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = db.collection('users')

    let userData = await collection.findOne({ username: { $eq: username } })
    if (userData) throw new UserAlreadyExistsError("There's a user with this username already!", username)

    userData = await collection.findOne({ email: { $eq: email } })
    if (userData) throw new UserAlreadyExistsError("There's a user linked to this email already!", username)

    await collection.insertOne({
      username,
      password: bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS)),
      email,
      token: '',
    })

    userData = await collection.findOne({ username: { $eq: username } });

    const token = jwt.sign(
      { id: userData._id, username: userData.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    )

    await collection.updateOne({ username: { $eq: username }}, { $set: { token } });

    client.close()

    res
      .cookie('access_token', token, {
        httpOnly: true, // no se puede acceder por js
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, // 1 hora
      })
      .send({ token })
  } catch (e) {
    switch (e.name) {
      case 'ValidationError':
        // enviar log
        res
          .status(401)
          .send({ message: 'Las credenciales no coinciden en nuestra base de datos.', });
        break;

      default:
        console.error(e);
        break;
    }
  }
})

app.post('/logout', async (req, res) => {
  const { token } = req.body;
  try {
    // Connect to db
    const client = new MongoClient(URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection('users');

    await collection.updateOne({ token: { $eq: token } }, { $set: { token: '' } });
    client.close();

    res
    .clearCookie('access_token')
    .send({ status: 'OK', message: 'Logout successful' });
  } catch (e) {
    console.error(e);
  }
});

app.post('/getAllAlbums', async (req, res) => {
  // const { artist } = req.body;
  const { page, limitRows } = req.body;

  console.log({ page, limitRows })

  const allArtists = ['cher', 'paramore', 'gerard way', 'amy winehouse', 'ariana grande', 'misfits', 'rihanna', 'system of a down', 'platero y tu', 'mecano', 'la oreja de van gogh', 'estopa', 'heroes del silencio', 'marea', 'medina azahara', 'mitski'];
  let albums = dataAlbums;
  // let albums = [];

  // for (const artist of allArtists) {
  //   let result = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${process.env.LASTFM_API_KEY}&format=json`);
  //   result = await result.json();
  //   albums = [].concat(albums, result.topalbums.album);
  // }
  
  albums = arrayShuffle([...albums]);

  if (page !== undefined && limitRows !== undefined) {
    const paginatedAlbums = [];
    for (const album of albums) {
      const newPage = [];
      for (let i = 0; i < 29; i++) {
        newPage.push(album);
      }
      paginatedAlbums.push(newPage);
    }

    if (page > paginatedAlbums.length) res.send({ status: 'OK', result: paginatedAlbums[paginatedAlbums.length] });
    else res.send({ status: 'OK', result: paginatedAlbums[page] });
  } else {
    res.send({ status: 'OK', result: albums });
  }
});

app.post('/setLog', async (req, res) => {
  // let { type, title, message, serverPath, clientPath } = req.body;
  console.log(req.body);

  setLog(req.body, res);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
