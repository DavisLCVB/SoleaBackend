// DOM Elements - Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// DOM Elements - Image Form
const imageForm = document.getElementById('analyzeImageForm');
const imageInput = document.getElementById('imageInput');
const imagePromptInput = document.getElementById('imagePromptInput');
const imageFileName = document.getElementById('imageFileName');
const imagePreview = document.getElementById('imagePreview');
const imageCharCount = document.getElementById('imageCharCount');
const submitImageBtn = document.getElementById('submitImageBtn');

// DOM Elements - Audio Form
const audioForm = document.getElementById('analyzeAudioForm');
const audioInput = document.getElementById('audioInput');
const audioPromptInput = document.getElementById('audioPromptInput');
const audioFileName = document.getElementById('audioFileName');
const audioPreview = document.getElementById('audioPreview');
const audioCharCount = document.getElementById('audioCharCount');
const submitAudioBtn = document.getElementById('submitAudioBtn');

// DOM Elements - Shared
const loading = document.getElementById('loading');
const loadingMessage = document.getElementById('loadingMessage');
const result = document.getElementById('result');
const resultContent = document.getElementById('resultContent');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let selectedImageFile = null;
let selectedAudioFile = null;

// Event Listeners - Tabs
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => handleTabChange(btn));
});

// Event Listeners - Image
imageInput.addEventListener('change', handleImageSelect);
imagePromptInput.addEventListener('input', () => handlePromptInput(imagePromptInput, imageCharCount));
imageForm.addEventListener('submit', handleImageSubmit);

// Event Listeners - Audio
audioInput.addEventListener('change', handleAudioSelect);
audioPromptInput.addEventListener('input', () => handlePromptInput(audioPromptInput, audioCharCount));
audioForm.addEventListener('submit', handleAudioSubmit);

// Event Listeners - Shared
newAnalysisBtn.addEventListener('click', resetForms);
retryBtn.addEventListener('click', resetForms);

/**
 * Handle tab switching
 */
function handleTabChange(clickedBtn) {
  const targetTab = clickedBtn.getAttribute('data-tab');

  // Update tab buttons
  tabBtns.forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  // Update tab content
  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === `${targetTab}Tab`) {
      content.classList.add('active');
    }
  });

  // Hide results/errors when switching tabs
  hideAll();
}

/**
 * Handle image file selection and preview
 */
function handleImageSelect(event) {
  const file = event.target.files[0];

  if (!file) {
    selectedImageFile = null;
    imageFileName.textContent = '';
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

  selectedImageFile = file;
  imageFileName.textContent = file.name;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
}

/**
 * Handle audio file selection and preview
 */
function handleAudioSelect(event) {
  const file = event.target.files[0];

  if (!file) {
    selectedAudioFile = null;
    audioFileName.textContent = '';
    audioPreview.innerHTML = '';
    return;
  }

  // Validate file type
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
  if (!validTypes.includes(file.type)) {
    showError('Tipo de archivo no válido. Por favor selecciona un archivo MP3, WAV, OGG o WebM.');
    audioInput.value = '';
    return;
  }

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    showError('El archivo es demasiado grande. El tamaño máximo es 10MB.');
    audioInput.value = '';
    return;
  }

  selectedAudioFile = file;
  audioFileName.textContent = file.name;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    audioPreview.innerHTML = `<audio controls src="${e.target.result}"></audio>`;
  };
  reader.readAsDataURL(file);
}

/**
 * Handle prompt input character count
 */
function handlePromptInput(input, counter) {
  const count = input.value.length;
  counter.textContent = count;

  if (count > 2000) {
    counter.style.color = 'var(--error-color)';
  } else {
    counter.style.color = 'var(--text-secondary)';
  }
}

/**
 * Handle image form submission
 */
async function handleImageSubmit(event) {
  event.preventDefault();

  if (!selectedImageFile) {
    showError('Por favor selecciona una imagen primero.');
    return;
  }

  // Hide previous results/errors
  hideAll();

  // Show loading
  loadingMessage.textContent = 'Analizando imagen con Gemini AI...';
  loading.classList.remove('hidden');
  submitImageBtn.disabled = true;

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('image', selectedImageFile);

    const prompt = imagePromptInput.value.trim();
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
    submitImageBtn.disabled = false;
  }
}

/**
 * Handle audio form submission
 */
async function handleAudioSubmit(event) {
  event.preventDefault();

  if (!selectedAudioFile) {
    showError('Por favor selecciona un archivo de audio primero.');
    return;
  }

  // Hide previous results/errors
  hideAll();

  // Show loading
  loadingMessage.textContent = 'Analizando audio con Gemini AI...';
  loading.classList.remove('hidden');
  submitAudioBtn.disabled = true;

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('audio', selectedAudioFile);

    const prompt = audioPromptInput.value.trim();
    if (prompt) {
      formData.append('prompt', prompt);
    }

    // Send request
    const response = await fetch('/api/analyze-audio', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Error al analizar el audio');
    }

    // Show result
    showResult(data.result);
  } catch (err) {
    showError(err.message || 'Error al conectar con el servidor');
  } finally {
    loading.classList.add('hidden');
    submitAudioBtn.disabled = false;
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
 * Reset all forms to initial state
 */
function resetForms() {
  // Reset image form
  imageForm.reset();
  selectedImageFile = null;
  imageFileName.textContent = '';
  imagePreview.innerHTML = '';
  imageCharCount.textContent = '0';

  // Reset audio form
  audioForm.reset();
  selectedAudioFile = null;
  audioFileName.textContent = '';
  audioPreview.innerHTML = '';
  audioCharCount.textContent = '0';

  hideAll();
}

/**
 * Initialize app
 */
function init() {
  console.log('🤖 Gemini Multimodal Analyzer initialized');

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
