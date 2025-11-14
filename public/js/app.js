// DOM Elements
const form = document.getElementById('analyzeForm');
const imageInput = document.getElementById('imageInput');
const promptInput = document.getElementById('promptInput');
const fileName = document.getElementById('fileName');
const imagePreview = document.getElementById('imagePreview');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const resultContent = document.getElementById('resultContent');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let selectedFile = null;

// Event Listeners
imageInput.addEventListener('change', handleFileSelect);
promptInput.addEventListener('input', handlePromptInput);
form.addEventListener('submit', handleSubmit);
newAnalysisBtn.addEventListener('click', resetForm);
retryBtn.addEventListener('click', resetForm);

/**
 * Handle file selection and preview
 */
function handleFileSelect(event) {
  const file = event.target.files[0];

  if (!file) {
    selectedFile = null;
    fileName.textContent = '';
    imagePreview.innerHTML = '';
    return;
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    showError('Tipo de archivo no válido. Por favor selecciona una imagen JPEG, PNG, WebP o GIF.');
    imageInput.value = '';
    return;
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showError('El archivo es demasiado grande. El tamaño máximo es 5MB.');
    imageInput.value = '';
    return;
  }

  selectedFile = file;
  fileName.textContent = file.name;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

/**
 * Handle prompt input character count
 */
function handlePromptInput(event) {
  const count = event.target.value.length;
  charCount.textContent = count;

  if (count > 2000) {
    charCount.style.color = 'var(--error-color)';
  } else {
    charCount.style.color = 'var(--text-secondary)';
  }
}

/**
 * Handle form submission
 */
async function handleSubmit(event) {
  event.preventDefault();

  if (!selectedFile) {
    showError('Por favor selecciona una imagen primero.');
    return;
  }

  // Hide previous results/errors
  hideAll();

  // Show loading
  loading.classList.remove('hidden');
  submitBtn.disabled = true;

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('image', selectedFile);

    const prompt = promptInput.value.trim();
    if (prompt) {
      formData.append('prompt', prompt);
    }

    // Send request
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al analizar la imagen');
    }

    // Show result
    showResult(data.result);
  } catch (err) {
    showError(err.message || 'Error al conectar con el servidor');
  } finally {
    loading.classList.add('hidden');
    submitBtn.disabled = false;
  }
}

/**
 * Show analysis result
 */
function showResult(text) {
  hideAll();
  resultContent.textContent = text;
  result.classList.remove('hidden');
}

/**
 * Show error message
 */
function showError(message) {
  hideAll();
  errorMessage.textContent = message;
  error.classList.remove('hidden');
}

/**
 * Hide all result/error sections
 */
function hideAll() {
  result.classList.add('hidden');
  error.classList.add('hidden');
  loading.classList.add('hidden');
}

/**
 * Reset form to initial state
 */
function resetForm() {
  form.reset();
  selectedFile = null;
  fileName.textContent = '';
  imagePreview.innerHTML = '';
  charCount.textContent = '0';
  hideAll();
}

/**
 * Initialize app
 */
function init() {
  console.log('🤖 Gemini Image Analyzer initialized');

  // Check API health on startup
  fetch('/api/health')
    .then(res => res.json())
    .then(data => {
      if (!data.success || data.services?.gemini !== 'connected') {
        console.warn('⚠️ Gemini API may not be properly configured');
      } else {
        console.log('✅ Gemini API connected');
      }
    })
    .catch(err => {
      console.error('❌ Failed to check API health:', err);
    });
}

// Run initialization
init();
