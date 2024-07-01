// import { useAllAlbums } from '../hooks/useAllAlbums.js';
// import getAllAlbums from '../hooks/getAllAlbums.js';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// COMPONENTS:
import Nav from '../components/Nav';
import Album from '../components/Album';

const Home = () => {
  // let albums = useAllAlbums(undefined, undefined);
  const [ albums, setAlbums ] = useState();

  const [ logStatus, setLogStatus ] = useState({ status: 'OK' });

  const setLog = async (log) => {
    try {
      const response = await fetch('http://localhost:3000/setLog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...log})
      });
      const res = await response.json();

      if (res.status === 'OK') setLogStatus({ status: res.status });
      else throw new Error('Log couldn\'t be set.');
    } catch (error) {
      console.error(error);
      setLogStatus({ status: 'KO', error });
    }
  }

  useEffect(() => {
    if (logStatus.status === 'KO') {
      toast.error(logStatus.error.toString(), {
        // duration: 10000
        cancel: {
          label: 'Close',
        },
      })
    }
  }, [ logStatus ]);

  const getAllAlbums = async (page, limitRows) => {
    try {
      const response = await fetch('http://localhost:3000/getAllAlbums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ page, limitRows })
      });
      const res = await response.json();
    
      if (res.status === 'OK') setAlbums(res.result);
      else throw new Error('No se han podido obtener los albumes');
    } catch (e) {
      console.error(e);
      setAlbums([]);
    }
  }

  useEffect(() => {
    getAllAlbums();
  }, []);

  return (
    <main className="min-h-screen w-screen bg-slate-900 relative flex flex-col">
      <Nav />
      <section id='all-albums-listed' className='w-full pt-20 gap-5'>
        { Array.isArray(albums)
            && albums.length > 0
            && albums.map(album => (
              <Album key={ album.mbid } id={ album.mbid } name={ album.name } image={ album.image[3]['#text'] ?? album.image[2]['#text'] ?? album.image[1]['#text'] ?? album.image[0]['#text'] } artist={ album.artist.name } />
            ))
        }
      </section>
    </main>
  );
}

export default Home;