import images from './images-data.js';

const gallery = document.querySelector('.gallery');
let currentImageIndex = 0;
let previouslyFocusedElement = null;

const galleryMarkup = images
  .map(
    ({ preview, original, description }, index) =>
      `<li class="gallery-item">
        <a class="gallery-link" href="${original}" data-index="${index}">
          <img class="gallery-image" src="${preview}" alt="${description}" />
        </a>
      </li>`
  )
  .join('');

gallery.insertAdjacentHTML('beforeend', galleryMarkup);

const modal = createGalleryModal();
document.body.append(modal.element);

gallery.addEventListener('click', handleGalleryClick);
modal.element.addEventListener('click', handleModalClick);

function createGalleryModal() {
  const element = document.createElement('div');
  element.className = 'gallery-modal';
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'true');
  element.setAttribute('aria-label', 'Gallery image preview');
  element.setAttribute('hidden', '');

  element.innerHTML = `
    <p class="gallery-modal__counter" aria-live="polite"></p>
    <button class="gallery-modal__button gallery-modal__button--close" type="button" aria-label="Close modal">×</button>
    <button class="gallery-modal__button gallery-modal__button--prev" type="button" aria-label="Previous image">‹</button>
    <div class="gallery-modal__content">
      <img class="gallery-modal__image" src="" alt="" />
    </div>
    <button class="gallery-modal__button gallery-modal__button--next" type="button" aria-label="Next image">›</button>
  `;

  return {
    element,
    counter: element.querySelector('.gallery-modal__counter'),
    image: element.querySelector('.gallery-modal__image'),
    content: element.querySelector('.gallery-modal__content'),
    closeButton: element.querySelector('.gallery-modal__button--close'),
    prevButton: element.querySelector('.gallery-modal__button--prev'),
    nextButton: element.querySelector('.gallery-modal__button--next'),
  };
}

function handleGalleryClick(event) {
  const link = event.target.closest('.gallery-link');

  if (!link) {
    return;
  }

  event.preventDefault();
  openModal(Number(link.dataset.index), link);
}

function handleModalClick(event) {
  if (event.target === modal.element || event.target === modal.closeButton) {
    closeModal();
    return;
  }

  if (event.target === modal.prevButton) {
    showPreviousImage();
    return;
  }

  if (event.target === modal.nextButton) {
    showNextImage();
  }
}

function openModal(index, triggerElement) {
  currentImageIndex = index;
  previouslyFocusedElement = triggerElement;
  updateModalImage();

  modal.element.hidden = false;
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', handleDocumentKeydown);
  modal.closeButton.focus();
}

function closeModal() {
  modal.element.hidden = true;
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleDocumentKeydown);

  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
  }
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  updateModalImage();
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  updateModalImage();
}

function updateModalImage() {
  const { original, description } = images[currentImageIndex];

  modal.image.src = original;
  modal.image.alt = description;
  modal.counter.textContent = `${currentImageIndex + 1}/${images.length}`;
}

function handleDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
    return;
  }

  if (event.key === 'ArrowLeft') {
    showPreviousImage();
    return;
  }

  if (event.key === 'ArrowRight') {
    showNextImage();
    return;
  }

  if (event.key === 'Tab') {
    keepFocusInsideModal(event);
  }
}

function keepFocusInsideModal(event) {
  const focusableElements = [modal.closeButton, modal.prevButton, modal.nextButton].filter(
    (element) => !element.disabled
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

export default modal;
