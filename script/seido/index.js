'use strict';

import musicService from './Music-group.js';


function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

(async () => {

  const service = new musicService('https://seido-webservice-307d89e1f16a.azurewebsites.net/api');

  try {

    let data = await service.readInfoAsync();
    let count_albums = data.db.nrSeededAlbums + data.db.nrUnseededAlbums;
    let count_artists = data.db.nrSeededArtists + data.db.nrUnseededArtists;
    let count_groups = data.db.nrSeededMusicGroups + data.db.nrUnseededMusicGroups;

    //   //Fill in the WebApi info with correct values from the WebApi
    document.querySelector("#total-albums").innerText = `${count_albums} albums`;
    document.querySelector("#total-artists").innerText = `${count_artists} artists`;
    document.querySelector("#total-groups").innerText = `${count_groups} grupper`;



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