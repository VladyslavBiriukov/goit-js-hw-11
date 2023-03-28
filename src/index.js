import './sass/index.scss';
import NewsApiService from './js/API-server';
import { lightbox } from './js/lightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DOMElements = {
  searchForm: document.querySelector('.search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let shownImagesCount = 0;
const newsApiService = new NewsApiService();

DOMElements.searchForm.addEventListener('submit', onSearch);
DOMElements.loadMoreBtn.addEventListener('click', onLoadMore);

const options = {
  rootMargin: '50px',
  root: null,
  threshold: 0.3,
};
const observer = new IntersectionObserver(onLoadMore, options);


function onLoadMore() {
  newsApiService.incrementPage();
  fetchGallery();
}

async function fetchGallery() {
  DOMElements.loadMoreBtn.classList.add('is-hidden');

  const response = await newsApiService.fetchGallery();
  const { hits, total } = response;
  shownImagesCount += hits.length;

  if (!hits.length) {
    Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    DOMElements.loadMoreBtn.classList.add('is-hidden');
    return [];
  }

  onRenderGallery(hits);
  shownImagesCount += hits.length;

  if (shownImagesCount < total) {
    Notify.success(`Hooray! We found ${total} images !!!`);
    DOMElements.loadMoreBtn.classList.remove('is-hidden');
  }

  if (shownImagesCount >= total) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  return hits; 
}

async function onSearch(e) {
  e.preventDefault();

  DOMElements.galleryContainer.innerHTML = '';
  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  newsApiService.resetPage();

  if (newsApiService.query === '') {
    Notify.warning('Please, fill the main field');
    return;
  }

  shownImagesCount = 0;
  const hits = await fetchGallery(); 
  onRenderGallery(hits);
}

function onRenderGallery(images) {
  const galleryMarkup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a href="${largeImageURL}">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
    </div>`;
      }
    )
    .join('');
  DOMElements.galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);
  lightbox.refresh();
}


