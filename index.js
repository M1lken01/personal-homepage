const searchBar = document.getElementById('search');

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

function init() {
  const redirect = parseUrlParams(window.location.href).r;
  if (redirect) redirectTo(links[redirect]);
  searchBar.value = '';
  searchBar.addEventListener('keydown', function (event) {
    const query = searchBar.value;
    if (event.key === 'Enter') redirectTo(isAddress(query) ? makeAddress(query) : makeSearch(query));
  });
  updateTime();
}

window.addEventListener('load', init);

const circle = document.querySelector('#circle');

/*window.addEventListener('mousemove', (e) => {
  circle.style.left = e.clientX + 'px';
  circle.style.top = e.clientY + 'px';
});*/
