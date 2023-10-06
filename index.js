const searchBar = document.getElementById('search');

const tileCount = 9;

const links = {
  github: 'https://github.com/M1lken01',
};

function isAddress(input) {
  if (input.includes(' ')) return false;

  try {
    return new URL(input);
  } catch (error) {
    try {
      return input.includes('.') ? new URL(`http://${input}`) : false;
    } catch (error) {}
  }

  return false;
}

function makeAddress(input) {
  return input.includes('http://') || input.includes('https://') ? input : `http://${input}`;
}

function makeSearch(input) {
  const searchCfg = {
    url: 'https://duckduckgo.com/',
    param: 'q',
  };
  return `${searchCfg.url}?${searchCfg.param}=${encodeURIComponent(input)}`;
}

function redirectTo(url, target = '_self') {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = target;
  anchor.click();
}

function parseUrlParams(url) {
  const params = {};
  const paramStr = url.split('?')[1];
  if (!paramStr) return params;
  paramStr.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key && value) params[key] = decodeURIComponent(value);
  });
  return params;
}

function updateTime() {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const formattedDate = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  document.getElementById('clock').textContent = formattedTime;
  document.getElementById('date').textContent = formattedDate;

  setInterval(updateTime, 1000);
}

function setTile(idx, url, img) {
  setCookie(`tile_${idx}`, { url, img });
  loadTiles();
}

function setCookie(name, value) {
  document.cookie = `${name}=${JSON.stringify(value)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=Strict`;
}

function loadTiles() {
  const tilesContainer = document.querySelector('.tiles');
  tilesContainer.innerHTML = null;
  const cookies = parseCookies();
  for (let i = 0; i < tileCount; i++) {
    const tileName = `tile_${i}`;
    const raw = cookies[tileName];
    if (!raw) {
      setCookie(tileName, { url: null, img: null });
      continue;
    }
    try {
      const cached = JSON.parse(raw);
      if (cached) tilesContainer.innerHTML += `<div class="tile"><a href="${cached.url}"><img src="${cached.img}" alt="icon" /></a></div>`;
    } catch (e) {
      console.error('Error while loading tiles:' + e);
    }
  }
}

function parseCookies() {
  const cookies = document.cookie.split(';');
  const cookieData = {};
  for (const cookie of cookies) {
    const parts = cookie.trim().split('=');
    cookieData[decodeURIComponent(parts.shift())] = decodeURIComponent(parts.join('='));
  }
  return cookieData;
}

function init() {
  const redirect = parseUrlParams(window.location.href).r;
  if (redirect) redirectTo(links[redirect]);
  searchBar.value = '';
  searchBar.addEventListener('keydown', function (event) {
    const query = searchBar.value;
    if (event.key === 'Enter') redirectTo(isAddress(query) ? makeAddress(query) : makeSearch(query));
  });
  updateTime();
  loadTiles();
  console.info(`// to set a tile use:\nsetTile(idx, url, img});`);
}

window.addEventListener('load', init);

const circle = document.querySelector('#circle');

/*window.addEventListener('mousemove', (e) => {
  circle.style.left = e.clientX + 'px';
  circle.style.top = e.clientY + 'px';
});*/
