import musicService from './Music-group.js';

const service = new musicService('https://seido-webservice-307d89e1f16a.azurewebsites.net/api');
const groupList = document.getElementById('group-list');
const pagination = document.getElementById('pagination');
let currentPage = 0;

async function renderList(pageNr = 0) {
  groupList.innerHTML = 'Laddar...';
  const data = await service.readMusicGroupsAsync(pageNr, false, null, 10);
  const groups = data?.items || data?.pageItems || data || [];
  groupList.innerHTML = `
    <ul class="list-group">
      ${groups.map(g => `<li class="list-group-item">${g.name}</li>`).join('')}
    </ul>
  `;
  pagination.innerHTML = `
    <button class="btn btn-secondary" ${pageNr === 0 ? 'disabled' : ''} id="prevBtn">&lt; Föregående</button>
    <span class="mx-2">Sida ${pageNr + 1}</span>
    <button class="btn btn-secondary" ${groups.length < 10 ? 'disabled' : ''} id="nextBtn">Nästa &gt;</button>
  `;
  document.getElementById('prevBtn').onclick = () => { currentPage--; renderList(currentPage); };
  document.getElementById('nextBtn').onclick = () => { currentPage++; renderList(currentPage); };
}

renderList(currentPage);