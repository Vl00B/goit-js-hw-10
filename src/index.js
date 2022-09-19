import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = countryInput.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(data => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';

      console.log(name);

      if (data.length === 1) {
        countryList.innerHTML = renderList(data);
        countryInfo.insertAdjacentHTML('beforeend', renderInfo(data));
      } else if (data.length >= 10) {
        matchesFailure();
      } else {
        countryList.innerHTML = renderList(data);
      }
    })
    .catch(namingFailure);
}

function renderList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list-item">
              <img class="country-list-flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list-name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return markup;
}

function renderInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info-list">
            <li class="country-info-item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info-item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info-item"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function namingFailure() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function matchesFailure() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
