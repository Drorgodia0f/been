class Country {
  constructor(id, name, element) {
    this.id = id;
    this.name = name;
    this.element = element;
    this.element.__country = this;
    this._visited = false;
  }

  setVisited(visited) {
    this.element.classList.toggle('visited', visited);
  }

  visited() {
    return this.element.classList.contains('visited');
  }
}

function createCountries(svgDocument, mapData) {
  const countries = [];
  for (let entry of mapData.trim().split('\n')) {
    const visited = entry.startsWith('+');
    if (visited)
      entry = entry.substring(1);
    entry = entry.trim();
    const id = entry.substring(0, 2);
    const name = entry.substring(2).trim();
    const element = svgDocument.querySelector('#' + id);
    const country = new Country(id, name, element);
    country.setVisited(visited);
    countries.push(country);
  }
  countries.sort((a, b) => a.name.localeCompare(b.name));
  return countries;
}

window.addEventListener('DOMContentLoaded', async () => {
  // Load all the assets.
  const mapElement = document.querySelector('.worldmap');
  const mapLoaded = new Promise(resolve => mapElement.onload = resolve);
  const mapData = await fetch('./countries.txt').then(response => response.text());
  await mapLoaded;

  // Parse list into countries array.
  const svgDocument = mapElement.contentWindow.document;
  const countries = createCountries(svgDocument, mapData);

  // Add our styles to the nested SVG.
  const linkElm = svgDocument.createElementNS('http://www.w3.org/1999/xhtml', 'link');
  linkElm.setAttribute('href', 'mapstyles.css');
  linkElm.setAttribute('type', 'text/css');
  linkElm.setAttribute('rel', 'stylesheet');
  svgDocument.querySelector('defs').appendChild(linkElm);

  // Add tooltips to countries.
  for (const country of countries) {
    const titleElement = svgDocument.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = country.name;
    country.element.appendChild(titleElement);
  }

  const countriesList = document.querySelector('.countries');
  for (const country of countries) {
    if (!country.visited())
      continue;
    const div = document.createElement('div');
    div.classList.add('country');
    div.textContent = country.name;
    countriesList.appendChild(div);
  }
});

