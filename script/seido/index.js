'use strict';

import musicService from './Music-group.js';


function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

(async () => {

  const service = 'https://seido-webservice-307d89e1f16a.azurewebsites.net/api';

  try {
 
    const stats = await service.readInfoAsync();
    if (stats && stats.db) {
      document.querySelector('#count-groups')?.innerText = `${stats.db.nrSeededMusicGroups + stats.db.nrUnseededMusicGroups} grupper`;
      document.querySelector('#count-albums')?.innerText = `${stats.db.nrSeededAlbums + stats.db.nrUnseededAlbums} album`;
      document.querySelector('#count-artists')?.innerText = `${stats.db.nrSeededArtists + stats.db.nrUnseededArtists} artister`;
    }


    let artistPage = 0;
    const artistListElem = document.querySelector('#artistList');
    const artistData = await service.readArtistsAsync(artistPage);
    if (artistListElem && artistData && artistData.pageItems) {
      renderArtists(artistData, artistListElem);
    }


    const albumListElem = document.querySelector('#albums');
    const albumsData = await service.readAlbumsAsync(0, true, null, 10);
    if (albumListElem && albumsData && albumsData.pageItems) {
      albumListElem.innerHTML = '';
      for (const album of albumsData.pageItems) {
        const li = document.createElement('li');
        li.textContent = `${album.name} (${album.releaseYear || 'okänt år'})`;
        albumListElem.appendChild(li);
      }
    }

   
    if (albumsData && albumsData.pageItems && albumsData.pageItems.length > 0) {
      const firstAlbum = await service.readAlbumAsync(albumsData.pageItems[0].albumId, false);
      const albumDetailElem = document.querySelector('#albumDetail');
      if (albumDetailElem && firstAlbum) {
        albumDetailElem.innerText = `${firstAlbum.name} är skapat av ${firstAlbum.musicGroup?.name || 'okänd grupp'}.`;
      }
    }

  } catch (error) {
    console.error('Fel vid hämtning av data:', error);
    const errorElem = document.querySelector('#error-message');
    if (errorElem) {
      errorElem.innerText = 'Något gick fel vid hämtning av musikdata.';
    }
  }
})();




function renderArtists(data, container) {
  container.innerHTML = '';
  for (const artist of data.pageItems) {
    const li = document.createElement('li');
    li.textContent = `${artist.firstName} ${artist.lastName}`;
    container.appendChild(li);
  }
}