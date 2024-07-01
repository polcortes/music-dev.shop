import fs from 'node:fs/promises';

export const arrayShuffle = array => array.sort(() => Math.random() - 0.5);

export const setLog = (logData, res) => {
  let { type, title, message, serverPath, clientPath } = logData;

  if (!type) return console.error('cannot set logs without a type');
  title = title ?? 'No title given';
  message = message ?? 'No message given';
  serverPath = serverPath ?? 'unknown';
  clientPath = clientPath ?? 'unknown';

  const text = `[${type.toUpperCase()} - ${new Date().toLocaleTimeString()}] ${title}: ${message} {server: "${serverPath}", client: "${clientPath}"}\n`;
  fs.appendFile(`./logs/${new Date().toLocaleDateString().replaceAll('/', '-')}.log`, text)
    .then(() => {
      console.log('New log setted:', text);
      res.send({ status: 'OK' });
    })
    .catch((error) => {
      res.send({ status: 'KO', error });
    });
}