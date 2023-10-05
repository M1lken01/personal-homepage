const searchBar = document.getElementById('search');

const links = {
  github: 'https://github.com/M1lken01',
};

function isAddress(input) {
  if (input.includes(' ')) return false;

  try {
    const url = new URL(input);
    return true; // Parses as a URL, likely an address.
  } catch (error) {
    // URL parsing failed, continue with other checks.
  }

  return false;
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

function init() {
  const link = parseUrlParams(window.location.href).link;
  if (link) redirectTo(links[link]);
  searchBar.value = '';
  searchBar.addEventListener('keydown', function (event) {
    const query = searchBar.value;
    if (event.key === 'Enter') redirectTo(isAddress(query) ? query : makeSearch(query));
  });
}

window.addEventListener('load', init);
