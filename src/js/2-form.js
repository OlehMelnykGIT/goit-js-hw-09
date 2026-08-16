const STORAGE_KEY = 'feedback-form-state';
const form = document.querySelector('.feedback-form');
let saveTimeoutId = null;

export const formData = {
  email: '',
  message: '',
};

const savedData = localStorage.getItem(STORAGE_KEY);

if (savedData) {
  try {
    const parsedData = JSON.parse(savedData);

    formData.email = parsedData.email || '';
    formData.message = parsedData.message || '';
    form.elements.email.value = formData.email;
    form.elements.message.value = formData.message;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

form.addEventListener('input', (event) => {
  const { name, value } = event.target;

  if (!(name in formData)) {
    return;
  }

  formData[name] = value.trim();

  clearTimeout(saveTimeoutId);
  saveTimeoutId = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, 300);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!formData.email || !formData.message) {
    alert('Fill please all fields');
    return;
  }

  console.log(formData);
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  formData.email = '';
  formData.message = '';
});
