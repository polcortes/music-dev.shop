import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { ValidationError, UserBadCredentialsError, UserDoesNotExistError } from './errors';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//? MongoDB config:
const URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DBNAME;
const getMongoCollection = async (collection) => {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return db.collection(collection);
}

const PORT = process.env.PORT ?? 3000;

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const collection = await getMongoCollection('users');
    let userData = await collection.findOne({ username: { $eq: username } });
    const hashedPass = bcrypt.hashSync(password, process.env.SALT_ROUNDS);
    
    if (!userData) throw new UserDoesNotExistError(`User "${username}" does not exist.`, username);
    if (!hashedPass == userData.password) throw new UserBadCredentialsError(`User bad credentials`); // log con detalles error sin detalles 👍

    const token = jwt.sign(
      { id: userData._id, username: userData.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res
      .cookie('access_token', token, {
        httpOnly: true,     // no se puede acceder por js
        secure: process.env.NODE_ENV === 'prod',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60  // 1 hora
      })
      .send({ token });
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
});

// app.post('/register', (req, res) => {
//   res.send('Register successful');
// });

// app.post('/logout', (res, res) => {
//   res.send('Logout successful');
// });

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));