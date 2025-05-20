'use strict';
import musicService from './musicService.js';
const musicServiceInstance = new musicService('https://seido-webservice-307d89e1f16a.azurewebsites.net/api');

async function hämtaMusikalbum() {
  try {
    const albumData = await musicServiceInstance.readAlbumsAsync(0, true, null, 100);
    console.log(albumData);
  } catch (error) {
    console.error(error);
  }
}
bringmusicalbum();
