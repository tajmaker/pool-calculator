// --- AUTOCOMPLETE POSTCODE/SUBURB ---
let postcodeData = [];
fetch('australian-postcodes.json')
  .then(r => r.json())
  .then(data => {
    postcodeData = data
      .filter((item, i) => i > 0 && item.postcode && item.suburb && item.postcode !== 'Postcode' && item.suburb !== 'Suburb')
      .map(item => ({ postcode: item.postcode, suburb: item.suburb }));
  });

// --- РЕНДЕР СТЕППЕРА ---
function renderStepper() {
  const bar = document.getElementById('stepperBar');
  if (!bar) {
    console.error('Stepper bar element not found');
    return;
  }
  
  bar.innerHTML = '';
  
  // Исключаем шаги 7, 8 и 9 из проверки allValid, так как они имеют специальную логику
  const stepValidities = Array.from({length: 10}, (_,i) => {
    if (i === 7 || i === 8 || i === 9) return true; // Эти шаги всегда считаются валидными для allValid
    return isStepValid(i);
  });
  const allValid = stepValidities.every(Boolean);
  

  

  
  steps.forEach((step, idx) => {
    let state = 'future';
    let needsAttention = false;
    
    // --- Особая логика для шага 7 (Included) ---
    if (idx === 7) {
      // INCLUDED активен если достигнут (информационный шаг)
      const hasReachedIncluded = stepIndex >= 7 || (typeof step7Activated !== 'undefined' && step7Activated);
      
      if (stepIndex === 7) {
        state = 'active';
      } else if (stepIndex > 7 || hasReachedIncluded) {
        state = 'completed';
      } else {
        state = 'future';
      }
      
      const stepDiv = document.createElement('div');
      stepDiv.className = `stepper-step ${state}`;
      stepDiv.setAttribute('data-step', idx);
      // INCLUDED кликабелен если достигнут
      let shouldBeFocusable = hasReachedIncluded;
      stepDiv.tabIndex = shouldBeFocusable ? 0 : -1;
      stepDiv.setAttribute('role', 'button');
      
      if (hasReachedIncluded) {
        stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
        };
      } else {
        stepDiv.onclick = () => {
          stepDiv.classList.add('shake');
          setTimeout(() => stepDiv.classList.remove('shake'), 400);
        };
      }
      stepDiv.innerHTML = `
        <div class="stepper-circle">${idx+1}</div>
        <div class="stepper-label">${step.label.toUpperCase()}</div>
      `;
      bar.appendChild(stepDiv);
      return; // <--- ВАЖНО! Прерываем дальнейшую обработку для шага 7
    }
    
    // --- Особая логика для шага 8 (Planning) ---
    if (idx === 8) {
      // PLANNING активен если достигнут ИЛИ если есть сделанный выбор
      const hasPlanningSelection = selectedPlanning && selectedPlanning.length > 0;
      const hasReachedPlanning = stepIndex >= 8;
      
      if (stepIndex === 8) {
        state = 'active';
      } else if (stepIndex > 8 || hasPlanningSelection) {
        state = 'completed';
      } else {
        state = 'future';
      }
      
      const stepDiv = document.createElement('div');
      stepDiv.className = `stepper-step ${state}`;
      stepDiv.setAttribute('data-step', idx);
      // PLANNING кликабелен если достигнут ИЛИ если есть выбор
      let shouldBeFocusable = hasReachedPlanning || hasPlanningSelection;
      stepDiv.tabIndex = shouldBeFocusable ? 0 : -1;
      stepDiv.setAttribute('role', 'button');
      
      if (hasReachedPlanning || hasPlanningSelection) {
        stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
        };
      } else {
        stepDiv.onclick = () => {
          stepDiv.classList.add('shake');
          setTimeout(() => stepDiv.classList.remove('shake'), 400);
        };
      }
      stepDiv.innerHTML = `
        <div class="stepper-circle">${idx+1}</div>
        <div class="stepper-label">${step.label.toUpperCase()}</div>
      `;
      bar.appendChild(stepDiv);
      return; // <--- ВАЖНО! Прерываем дальнейшую обработку для шага 8
    }
    
    // --- Особая логика для шага 9 (Review) ---
    if (idx === 9) {
      // REVIEW активен если достигнут (информационный шаг)
      const hasReachedReview = stepIndex >= 9 || (typeof step9Activated !== 'undefined' && step9Activated);
      
      if (stepIndex === 9) {
        state = 'active';
      } else if (stepIndex > 9 || hasReachedReview) {
        state = 'completed';
      } else {
        state = 'future';
      }
      
      const stepDiv = document.createElement('div');
      stepDiv.className = `stepper-step ${state}`;
      stepDiv.setAttribute('data-step', idx);
      // REVIEW кликабелен если достигнут
      let shouldBeFocusable = hasReachedReview;
      stepDiv.tabIndex = shouldBeFocusable ? 0 : -1;
      stepDiv.setAttribute('role', 'button');
      
      if (hasReachedReview) {
        stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
        };
      } else {
        stepDiv.onclick = () => {
          stepDiv.classList.add('shake');
          setTimeout(() => stepDiv.classList.remove('shake'), 400);
        };
      }
      stepDiv.innerHTML = `
        <div class="stepper-circle">${idx+1}</div>
        <div class="stepper-label">${step.label.toUpperCase()}</div>
      `;
      bar.appendChild(stepDiv);
      return; // <--- ВАЖНО! Прерываем дальнейшую обработку для шага 9
    }
    // --- Особая логика для шага 2 (DESIGN) - ПРИОРИТЕТ 3 ---
    else if (idx === 1 && needsDesignRechoose) {
      needsAttention = true;
      state = (idx === stepIndex) ? 'active' : 'attention';
    }
    // --- Особая логика для шага 4 (FINISHES) - ПРИОРИТЕТ 4 ---
    else if (idx === 3 && needsFinishesRechoose) {
      needsAttention = true;
      state = (idx === stepIndex) ? 'active' : 'attention';
    }
    // --- Обычная логика для всех остальных шагов - ПРИОРИТЕТ 4 ---
    else if (idx !== 7 && idx !== 8 && idx !== 9) {
      if (idx < stepIndex) {
        state = 'completed';
      } else if (idx === stepIndex) {
        state = 'active';
      } else if (isStepValid(idx)) {
        state = 'completed';
      } else {
        state = 'future';
      }
    }
    
    const stepDiv = document.createElement('div');
    stepDiv.className = `stepper-step ${state}` + (needsAttention ? ' needs-attention' : '');
    stepDiv.setAttribute('data-step', idx);
    
    // Логика tabIndex для всех шагов
    let shouldBeFocusable = false;
    if (idx === 7 || idx === 8) {
      // Шаги 7 и 8 обрабатываются в специальной логике
      shouldBeFocusable = state === 'active' || state === 'completed';
    } else {
      shouldBeFocusable = needsAttention || isStepValid(idx) || state === 'active';
    }
    stepDiv.tabIndex = shouldBeFocusable ? 0 : -1;
    
    
    stepDiv.setAttribute('role', 'button');
    // --- Клик по шагу с attention ---
    if (needsAttention) {
      stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
      };
      if (idx === 1) {
        stepDiv.title = 'Please reselect design for your new pool material';
      } else if (idx === 3) {
        stepDiv.title = 'Please reselect finishes for your new pool material';
      }
    } else if (idx === 7 || idx === 8) {
      // Шаги 7 и 8 кликабельны если они active или completed
      if (state === 'active' || state === 'completed') {
        stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
        };
      } else {
        stepDiv.onclick = () => {
          stepDiv.classList.add('shake');
          setTimeout(() => stepDiv.classList.remove('shake'), 400);
        };
      }
    } else if (isStepValid(idx)) {
      stepDiv.onclick = () => {
        stepIndex = idx;
        renderStep();
      };
    } else {
      stepDiv.onclick = () => {
        stepDiv.classList.add('shake');
        setTimeout(() => stepDiv.classList.remove('shake'), 400);
      };
    }
    stepDiv.innerHTML = `
      <div class="stepper-circle">${idx+1}${needsAttention ? '<span class=\'step-attention\'>!</span>' : ''}</div>
      <div class="stepper-label">${step.label.toUpperCase()}</div>
    `;
    bar.appendChild(stepDiv);
    

    });
  
  // Линии создаются автоматически между шагами
}

// --- РЕНДЕР КАРТОЧЕК ---
const grid = document.getElementById('designGrid');
const concreteForm = document.getElementById('concreteForm');

function updateNextBtn() {
  if (stepIndex === 9) return; // На шаге 10 нет NEXT
  const nextBtn = document.getElementById('nextBtn');
  if (!nextBtn) return;
  if (stepIndex === 0) {
    nextBtn.disabled = !selectedMaterial;
  } else if (stepIndex === 1) {
    if (selectedMaterial === 'concrete') {
      nextBtn.disabled = !selectedShape;
    } else {
      // Для fibreglass карточка считается выбранной только если выбран дизайн И размер
      const model = fibreglassModels.find(m => m.id === selectedDesign);
      const hasValidSize = model && model.hasMultipleSizes && model.sizes.length > 1 
        ? selectedSize && model.sizes.find(s => s.id === selectedSize)
        : selectedSize;
      nextBtn.disabled = !(selectedDesign && hasValidSize);
    }
  } else if (stepIndex === 2) {
    nextBtn.disabled = !selectedEquipment;
  } else if (stepIndex === 3) {
    if (selectedMaterial === 'fibreglass') {
      nextBtn.disabled = !selectedCoping;
    } else if (selectedMaterial === 'concrete') {
      nextBtn.disabled = !(selectedCoping && selectedInternal);
    }
  } else if (stepIndex === 4) {
    nextBtn.disabled = !selectedHardscape;
  } else if (stepIndex === 5) {
    nextBtn.disabled = !selectedCover;
  } else if (stepIndex === 6) {
    nextBtn.disabled = !selectedAmenities.length;
  } else if (stepIndex === 7) {
    nextBtn.disabled = false;
  } else if (stepIndex === 8) {
    nextBtn.disabled = !selectedPlanning.length;
  } else {
    nextBtn.disabled = false;
  }
}

// --- NEXT/PREV ---
let needsDesignRechoose = false;
let needsFinishesRechoose = false;

document.getElementById('prevBtn').onclick = function() {
  if (stepIndex === 0) { stepIndex = -1; renderStep(); }
  else if (stepIndex === 1.5) { stepIndex = 1; renderStep(); }
  else if (stepIndex === 1) {
    // При возврате на шаг назад сбрасываем форму, если был concrete
    if (selectedMaterial === 'concrete') selectedShape = null;
    // Сбрасываем выбранный размер при возврате к выбору материала
    selectedSize = null;
    stepIndex = 0; renderStep();
  }
  else if (stepIndex === 2) { stepIndex = 1; renderStep(); }
  else if (stepIndex === 3) { stepIndex = 2; renderStep(); }
  else if (stepIndex === 4) { stepIndex = 3; renderStep(); }
  else if (stepIndex === 5) { stepIndex = 4; renderStep(); }
  else if (stepIndex === 6) { stepIndex = 5; renderStep(); }
  else if (stepIndex === 7) { stepIndex = 6; renderStep(); }
  else if (stepIndex === 8) { stepIndex = 7; renderStep(); }
};

// === LEARN MORE MODAL LOGIC (универсально для всех карточек) ===
// --- Модальное окно и overlay ---
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
let lastFocusedBtn = null;

function openLearnMore(title, desc, imgUrl) {
  modalTitle.textContent = title || 'Learn More';
  modalDesc.textContent = desc || 'Demo info about this option/card. (TODO: Inject real content here)';
  // Показываем изображение, если есть
  const modalImg = document.getElementById('modalImg');
  if (imgUrl) {
    modalImg.innerHTML = `<img src="${imgUrl}" alt="${title}" style="max-width:100%;max-height:220px;display:block;margin:0 auto 18px auto;border-radius:12px;box-shadow:0 2px 12px #0797ee22;">`;
    modalImg.style.display = '';
  } else {
    modalImg.innerHTML = '';
    modalImg.style.display = 'none';
  }
  modalOverlay.style.display = 'flex';
  setTimeout(() => modalOverlay.classList.add('active'), 10);
  // Trap focus
  const focusable = modalOverlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
  document.body.style.overflow = 'hidden';
  lastFocusedBtn = document.activeElement;
}

function closeLearnMore() {
  modalOverlay.classList.remove('active');
  setTimeout(() => { modalOverlay.style.display = 'none'; document.body.style.overflow = ''; }, 300);
  if (lastFocusedBtn) lastFocusedBtn.focus();
}

modalCloseBtn.onclick = closeLearnMore;
modalCloseBtn2.onclick = closeLearnMore;
modalOverlay.onclick = function(e) {
  if (e.target === modalOverlay) closeLearnMore();
};

document.addEventListener('keydown', function(e) {
  if (modalOverlay.style.display === 'flex') {
    if (e.key === 'Escape') closeLearnMore();
    // Trap focus
    const focusable = modalOverlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    if (e.key === 'Tab') {
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length-1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    }
  }
});

// Делаем функцию глобальной для вызова из HTML:
window.openLearnMore = openLearnMore;

// === END LEARN MORE MODAL LOGIC ===

// Проверка валидности шага (все предыдущие шаги заполнены)
function isStepValid(idx) {
  if (idx === 0) return !!selectedMaterial;
  if (idx === 1) {
    if (selectedMaterial === 'concrete') return !!selectedShape;
    else {
      // Для fibreglass карточка считается выбранной только если выбран дизайн И размер
      const model = fibreglassModels.find(m => m.id === selectedDesign);
      const hasValidSize = model && model.hasMultipleSizes && model.sizes.length > 1 
        ? selectedSize && model.sizes.find(s => s.id === selectedSize)
        : selectedSize;
      return !!selectedDesign && hasValidSize;
    }
  }
  if (idx === 2) return !!selectedEquipment;
  if (idx === 3) {
    if (selectedMaterial === 'fibreglass') return !!selectedCoping;
    if (selectedMaterial === 'concrete') return !!selectedCoping && !!selectedInternal;
    return false;
  }
  if (idx === 4) return !!selectedHardscape;
  if (idx === 5) return !!selectedCover;
  if (idx === 6) return !!selectedAmenities && selectedAmenities.length > 0;
  if (idx === 7) return stepIndex >= 7 || (typeof step7Activated !== 'undefined' && step7Activated); // INCLUDED валиден после достижения (информационный шаг)
  if (idx === 8) {
    // PLANNING валиден если достигнут ИЛИ если есть сделанный выбор
    return stepIndex >= 8 || (selectedPlanning && selectedPlanning.length > 0);
  }
  if (idx === 9) return stepIndex >= 9 || (typeof step9Activated !== 'undefined' && step9Activated); // REVIEW валиден после достижения (информационный шаг)
  return false;
}

// --- ИНИЦИАЛИЗАЦИЯ ---
// Вызов рендера степпера теперь через renderStepper() внутри renderStep()
function renderStep() {
  // Убираем класс step-10-layout если не на шаге 10
  if (stepIndex !== 9) {
    document.body.classList.remove('step-10-layout');
  }
  
  // Сбрасываем скролл в начало страницы только при переходе на новый шаг
  // НЕ при выборе карточек на текущем шаге
  if (window.lastStepIndex !== stepIndex) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.lastStepIndex = stepIndex;
  }
  
  renderStepper();
  
  let mainTitle = 'SELECT POOL MATERIAL';
  let subtitle = 'Choose the type of pool shell that best fits your needs. Only one option can be selected.';
  if (stepIndex === 1) {
    mainTitle = 'SELECT POOL DESIGN';
    subtitle = (selectedMaterial === 'concrete')
      ? 'Choose the shape and set the dimensions for your concrete pool.'
      : 'Choose your preferred pool model. Only one option can be selected.';
  } else if (stepIndex === 2) {
    mainTitle = 'SELECT EQUIPMENT PACKAGE';
    subtitle = 'Choose the equipment package for your pool. Only one option can be selected.';
  } else if (stepIndex === 3) {
    mainTitle = 'SELECT FINISHES';
    subtitle = 'Choose coping material and internal finish. Only one option in each group.';
  } else if (stepIndex === 4) {
    mainTitle = 'SELECT HARDSCAPE';
    subtitle = 'Choose the hardscape material around your pool. Only one option can be selected.';
  } else if (stepIndex === 5) {
    mainTitle = 'SELECT POOL COVER';
    subtitle = 'Choose a cover for your pool. Only one option can be selected.';
  } else if (stepIndex === 6) {
    mainTitle = 'SELECT AMENITIES';
    subtitle = 'Choose additional features for your pool. Multiple options can be selected.';
  } else if (stepIndex === 7) {
    // Инициализируем дефолтные выборы для included
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    mainTitle = "WHAT'S INCLUDED";
    subtitle = 'All services and materials included in your pool package. Get in touch for detailed information.';
  } else if (stepIndex === 8) {
    // Инициализируем дефолтные выборы для planning
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    mainTitle = "PLANNING";
    subtitle = 'Things to consider for your project. Multiple options can be selected.';
  } else if (stepIndex === 9) {
    mainTitle = "REVIEW";
    subtitle = 'Your pool package breakdown and total cost estimate.';
    grid.style.display = 'none';
    grid.innerHTML = ''; // Очищаем содержимое grid
    concreteForm.style.display = 'none';
    concreteForm.innerHTML = ''; // Очищаем содержимое concreteForm
    
    // Скрываем основные заголовки на шаге 10
    const mainTitleEl = document.querySelector('.main-title');
    const subtitleEl = document.querySelector('.subtitle');
    if (mainTitleEl) mainTitleEl.style.display = 'none';
    if (subtitleEl) subtitleEl.style.display = 'none';
    
    // Создаем новый компонент для шага 10
    const step10Html = `
      <div class="step-10-container">
        <div class="step-10-sticky-header">
          <h2 class="step-10-title">${mainTitle}</h2>
          <div class="step-10-subtitle">${subtitle}</div>
        </div>
        <div class="step-10-content">
          <div class="step-10-form-section">
            <form id="captureForm" autocomplete="off">
              <h2 class="form-title">Request a Quote</h2>
              <div class="form-group">
                <label for="reviewName">Name</label>
                <input type="text" id="reviewName" name="name" required autocomplete="name" />
              </div>
              <div class="form-group">
                <label for="reviewPhone">Phone Number</label>
                <input type="tel" id="reviewPhone" name="phone" required autocomplete="tel" />
              </div>
              <div class="form-group">
                <label for="reviewEmail">Email</label>
                <input type="email" id="reviewEmail" name="email" required autocomplete="email" />
              </div>
              <div class="form-group">
                <label for="reviewPostcode">Postcode / Suburb</label>
                <input type="text" id="reviewPostcode" name="postcode" required placeholder="Start typing postcode or suburb..." autocomplete="off" />
                <div id="postcodeSuggestions" class="autocomplete-suggestions"></div>
              </div>
              <button type="submit" class="submit-btn">Send Request</button>
            </form>
          </div>
          <div class="step-10-summary-section">
            <div class="step-10-summary-container">
              <div id="reviewSummaryBlock">
                <div class='review-summary-placeholder'>Review summary will be here</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('reviewStepLayout').innerHTML = step10Html;
    renderReviewSummary();
    document.getElementById('reviewStepLayout').style.display = '';
    renderReviewButtons();
    setupPostcodeAutocomplete();
    
    // Добавляем класс для отключения скролла страницы
    document.body.classList.add('step-10-active');
    
    // Настраиваем глобальный скролл для блока "Your Selections"
    setupStep10GlobalScroll();
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', handleStep10Resize);
    
    return;
  }
  // Показываем основные заголовки на всех шагах кроме 10
  const mainTitleEl = document.querySelector('.main-title');
  const subtitleEl = document.querySelector('.subtitle');
  if (mainTitleEl) {
    mainTitleEl.style.display = '';
    mainTitleEl.textContent = mainTitle;
  }
  if (subtitleEl) {
    subtitleEl.style.display = '';
    subtitleEl.textContent = subtitle;
  }
  renderReviewButtons();
  
  // Скрываем review layout на всех шагах кроме 10
  if (stepIndex !== 9) {
    document.getElementById('reviewStepLayout').style.display = 'none';
    document.getElementById('reviewStepLayout').innerHTML = ''; // Очищаем содержимое review layout
    // Убираем классы для восстановления скролла страницы
    document.body.classList.remove('step-10-active');
    document.body.classList.remove('step-10-mobile');
    
    // Очищаем обработчики скролла
    cleanupStep10Scroll();
    
    // Убираем обработчик изменения размера окна
    window.removeEventListener('resize', handleStep10Resize);
  }
  
  if (stepIndex === 0) {
    // Step 1: Material
    grid.style.display = '';
    grid.innerHTML = ''; // Очищаем grid перед заполнением новым контентом
    concreteForm.style.display = 'none';
    concreteForm.innerHTML = ''; // Очищаем concreteForm
    grid.innerHTML = materialOptions.map(d => `
      <div class="design-card${selectedMaterial === d.id ? ' selected' : ''}" tabindex="0" data-id="${d.id}">
        <div class="card-content">
        ${d.badge ? `<div class="badge">${d.badge}</div>` : ''}
        <img src="${d.img}" alt="${d.title}" class="design-img" />
        <h3 class="card-title">${d.title}</h3>
        <div class="card-desc">${d.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${d.title.replace(/'/g, "&#39;")}', 'Demo info about ${d.title}. (TODO: Inject real content here)', '${d.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    // При изменении материала сбрасываем только зависимые шаги
    function resetDependentStepsOnMaterialChange(newMaterial) {
      // Проверяем, нужно ли перевыбирать design
      const hasDesignSelection = selectedShape || selectedDesign;
      if (hasDesignSelection) {
        needsDesignRechoose = true;
      }
      
      // Проверяем, нужно ли перевыбирать finishes
      const hasFinishesSelection = selectedCoping || selectedInternal;
      if (hasFinishesSelection) {
        needsFinishesRechoose = true;
      }
      
      selectedCoping = null;
      selectedInternal = null;
      selectedShape = null;
      selectedDesign = null;
      selectedSize = null;
      // Можно добавить другие сбросы, если потребуется
    }

    // Модифицируем обработчик выбора материала (шаг 1)
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => {
        const prevMaterial = selectedMaterial;
        selectedMaterial = card.dataset.id;
        if (selectedMaterial !== prevMaterial) {
          resetDependentStepsOnMaterialChange(selectedMaterial);
        }
        if (selectedMaterial !== 'concrete') selectedShape = null;
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          const prevMaterial = selectedMaterial;
          selectedMaterial = card.dataset.id;
          if (selectedMaterial !== prevMaterial) {
            resetDependentStepsOnMaterialChange(selectedMaterial);
          }
          if (selectedMaterial !== 'concrete') selectedShape = null;
          renderStep();
          updateNextBtn();
        }
        };
      });
    updateNextBtn();
  } else if (stepIndex === 1) {
    // Step 2: Design
    if (selectedMaterial === 'concrete') {
      grid.style.display = 'none';
      grid.innerHTML = ''; // Очищаем grid
      concreteForm.style.display = '';
      concreteForm.innerHTML = ''; // Очищаем concreteForm перед заполнением
      // --- UI: Concrete pool shapes ---
      let shapeHtml = concreteShapes.map(s => `
        <div class="design-card${selectedShape === s.id ? ' selected' : ''}" tabindex="0" data-id="${s.id}">
          <div class="card-content">
          <img src="${s.img}" alt="${s.title}" class="design-img" />
          <h3 class="card-title">${s.title}</h3>
          <div class="card-desc">${s.desc}</div>
          </div>
          <!-- LEARN MORE BUTTON (универсально) -->
          <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${s.title.replace(/'/g, "&#39;")}', 'Demo info about ${s.title}. (TODO: Inject real content here)', '${s.img || ''}')">Learn More</button>
          <!-- END LEARN MORE BUTTON -->
        </div>
      `).join('');
      // --- Всегда показываем размеры и визуализацию ---
      let paramFields = [
        { key: 'length', label: 'Length', min: 2, max: 50, step: 0.1, value: concreteDims.length },
        { key: 'width', label: 'Width', min: 2, max: 20, step: 0.1, value: concreteDims.width },
        { key: 'depth', label: 'Depth', min: 1, max: 3, step: 0.1, value: concreteDims.depth }
      ];
      let sliders = paramFields.map(p => `
        <div class="concrete-param-row">
          <label class="concrete-label">${p.label}:</label>
          <input type="number" class="concrete-num" id="num-${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}" autocomplete="off"> m
          <input type="range" class="concrete-slider" id="slider-${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}">
        </div>
      `).join('');
      // --- WOW SVG визуализация ---
      let visualPreview = `
        <div class="visual-preview-container">
          <div class="svg-label">Top view</div>
          <div id="svg-top-view"></div>
          <div class="svg-label">Side view (depth)</div>
          <div id="svg-side-view"></div>
        </div>
      `;
      let perim = 2 * (Number(concreteDims.length) + Number(concreteDims.width));
      let vol = (Number(concreteDims.length) * Number(concreteDims.width) * Number(concreteDims.depth)).toFixed(2);
      let calcHtml = `<div style="margin:30px 0 0 0;text-align:center;color:#1786f9;font-size:1.3em;font-weight:600;">Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b></div>`;
      let paramsAndVisual = `
        <div style="min-height:140px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:30px;max-width:800px;margin:0 auto;">
          ${calcHtml}
          <div style="display:flex;flex-direction:row;justify-content:center;align-items:stretch;gap:40px;width:100%;">
            <div class="concrete-params-block" style="flex:1;max-width:320px;min-height:260px;">
          ${sliders}
            </div>
            <div style="flex:1.5;max-width:480px;min-height:260px;">
              ${visualPreview}
            </div>
          </div>
        </div>
      `;
      concreteForm.innerHTML = `
        <div class="design-grid">${shapeHtml}</div>
        ${paramsAndVisual}
      `;
      // --- События выбора формы ---
      document.querySelectorAll('#concreteForm .design-card').forEach(card => {
        card.onclick = () => { 
          selectedShape = card.dataset.id; 
          needsDesignRechoose = false; // Сбрасываем флаг перевыбора design
          renderStep(); 
          updateNextBtn(); 
          // Показываем информационную плашку
          showCustomSizeInfo();
        };
        card.onkeydown = e => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            selectedShape = card.dataset.id; 
            needsDesignRechoose = false; // Сбрасываем флаг перевыбора design
            renderStep(); 
            updateNextBtn(); 
            // Показываем информационную плашку
            showCustomSizeInfo();
          } 
        };
      });
      // --- События для input/range (всегда активны) ---
      let eventParamFields = [
        { key: 'length', min: 2, max: 50, step: 0.1 },
        { key: 'width', min: 2, max: 20, step: 0.1 },
        { key: 'depth', min: 1, max: 3, step: 0.1 }
      ];
      paramFields.forEach(p => {
        const num = document.getElementById(`num-${p.key}`);
        const slider = document.getElementById(`slider-${p.key}`);
        slider.oninput = e => {
          let v = parseFloat(e.target.value);
          if (isNaN(v)) v = p.min;
          num.value = v;
          concreteDims[p.key] = v;
          let perim = 2 * (Number(concreteDims.length) + Number(concreteDims.width));
          let vol = (Number(concreteDims.length) * Number(concreteDims.width) * Number(concreteDims.depth)).toFixed(2);
          document.querySelector('.concrete-params-block').parentElement.parentElement.firstElementChild.innerHTML = `Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b>`;
          if (selectedShape) {
            renderConcreteWOWSVGs(selectedShape, concreteDims.length, concreteDims.width, concreteDims.depth);
          }
        };
        num.oninput = e => {
          slider.value = num.value;
          concreteDims[p.key] = parseFloat(num.value) || '';
          let perim = 2 * (Number(concreteDims.length) + Number(concreteDims.width));
          let vol = (Number(concreteDims.length) * Number(concreteDims.width) * Number(concreteDims.depth)).toFixed(2);
          document.querySelector('.concrete-params-block').parentElement.parentElement.firstElementChild.innerHTML = `Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b>`;
          if (selectedShape) {
            renderConcreteWOWSVGs(selectedShape, concreteDims.length, concreteDims.width, concreteDims.depth);
          }
        };
        num.onblur = e => {
          let v = parseFloat(num.value);
          if (isNaN(v)) v = p.min;
          if (v < p.min) v = p.min;
          if (v > p.max) v = p.max;
          num.value = v;
          slider.value = v;
          concreteDims[p.key] = v;
          renderStep();
        };
        num.onkeydown = e => { if (e.key === 'Enter') num.blur(); };
      });
      // --- WOW SVG рендеринг (если выбрана форма) ---
      if (selectedShape) {
        renderConcreteWOWSVGs(selectedShape, concreteDims.length, concreteDims.width, concreteDims.depth);
      }
      // Всегда обновляем состояние NEXT после рендера блока выбора формы
      updateNextBtn();
    } else {
      grid.style.display = '';
      concreteForm.style.display = 'none';
      let models = selectedMaterial === 'fibreglass' ? fibreglassModels : [
        { id: "vinyl-std", title: "Vinyl Standard", desc: "Standard vinyl pool", img: "images/placeholder.jfif", link: { label: "Learn more", url: "#" }, size: null }
      ];
      grid.innerHTML = models.map(m => {
        let sizeDisplay = '';
        let sizeSelector = '';
        
        if (m.hasMultipleSizes && m.sizes.length > 1) {
          // Для нескольких размеров показываем дропдаун с текстом "Select your size"
          const currentSize = selectedDesign === m.id && selectedSize
            ? m.sizes.find(s => s.id === selectedSize)
            : null;
          
          if (currentSize) {
            sizeDisplay = `<div class="pool-size">${currentSize.size}</div>`;
          } else {
            sizeDisplay = `<div class="pool-size" style="color: #6a7a8a; font-style: italic;">Select your size</div>`;
          }
          
          sizeSelector = `
            <div class="custom-size-selector" data-model-id="${m.id}">
              <button class="custom-size-select-btn" type="button">
                ${currentSize ? currentSize.size : 'Select your size'} <span class="dropdown-arrow">▼</span>
              </button>
              <ul class="custom-size-options">
                ${m.sizes.map(s => `
                  <li class="custom-size-option${selectedSize === s.id ? ' selected' : ''}" data-size-id="${s.id}">${s.size}</li>
                `).join('')}
              </ul>
            </div>
          `;
        } else {
          // Один размер — просто показываем, селектор не нужен
          sizeDisplay = `<div class="pool-size">${m.sizes[0].size}</div>`;
          sizeSelector = '';
        }
        
        // Определяем, должна ли карточка быть выбрана
        const isCardSelected = selectedDesign === m.id;
        const hasValidSize = m.hasMultipleSizes && m.sizes.length > 1 
          ? selectedSize && m.sizes.find(s => s.id === selectedSize)
          : selectedSize;
        const shouldShowSelected = isCardSelected && hasValidSize;
        
        return `
          <div class="design-card${shouldShowSelected ? ' selected' : ''}" tabindex="0" data-id="${m.id}">
            <div class="card-content">
            <img src="${m.img}" alt="${m.title}" class="design-img" />
            <h3 class="card-title">${m.title}</h3>
            <div class="card-desc">${m.desc}</div>
            ${sizeDisplay}
            ${sizeSelector}
            </div>
            <!-- LEARN MORE BUTTON (универсально) -->
            <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${m.title.replace(/'/g, "&#39;")}', 'Demo info about ${m.title}. (TODO: Inject real content here)', '${m.img || ''}')">Learn More</button>
            <!-- END LEARN MORE BUTTON -->
          </div>
        `;
      }).join('');
      
      // Обработчики для карточек
      document.querySelectorAll('.design-card').forEach(card => {
        card.onclick = (e) => {
          // Не реагируем на клик по селектору или его выпадающему меню
          if (
            e.target.closest('.custom-size-selector') ||
            e.target.classList.contains('custom-size-options') ||
            e.target.classList.contains('custom-size-option')
          ) {
            return;
          }
          selectedDesign = card.dataset.id;
          const model = fibreglassModels.find(m => m.id === selectedDesign);
          if (model) {
            if (model.hasMultipleSizes && model.sizes.length > 1) {
              // Для нескольких размеров не выбираем размер автоматически
              // Пользователь должен выбрать размер вручную
            } else {
              selectedSize = model.sizes[0].id;
            }
          }
          needsDesignRechoose = false; // Сбрасываем флаг перевыбора design
          renderStep();
          updateNextBtn();
        };
        card.onkeydown = e => {
          if (e.key === 'Enter' || e.key === ' ') {
            selectedDesign = card.dataset.id;
            const model = fibreglassModels.find(m => m.id === selectedDesign);
            if (model) {
              if (model.hasMultipleSizes && model.sizes.length > 1) {
                if (!selectedSize || !model.sizes.find(s => s.id === selectedSize)) {
                  selectedSize = model.sizes[0].id;
                }
              } else {
                selectedSize = model.sizes[0].id;
              }
            }
            needsDesignRechoose = false; // Сбрасываем флаг перевыбора design
            renderStep();
            updateNextBtn();
          }
        };
      });
      // Обработчики для кастомного селектора (UI)
      document.querySelectorAll('.custom-size-select-btn').forEach(btn => {
        btn.onclick = function(e) {
          e.stopPropagation();
          const selector = btn.closest('.custom-size-selector');
          // Закрыть все остальные селекторы
          document.querySelectorAll('.custom-size-selector.open').forEach(sel => {
            if (sel !== selector) sel.classList.remove('open');
          });
          selector.classList.toggle('open');
        };
      });
      document.querySelectorAll('.custom-size-option').forEach(opt => {
        opt.onclick = function(e) {
          e.stopPropagation();
          const modelId = opt.closest('.custom-size-selector').dataset.modelId;
          selectedDesign = modelId;
          selectedSize = opt.dataset.sizeId;
          needsDesignRechoose = false; // Сбрасываем флаг перевыбора design
          renderStep();
          updateNextBtn();
        };
      });
      // Закрытие селектора при клике вне
      document.addEventListener('click', function(e) {
        // Если клик внутри любого .custom-size-selector — не закрываем
        if (e.target.closest('.custom-size-selector')) return;
        document.querySelectorAll('.custom-size-selector.open').forEach(sel => {
          sel.classList.remove('open');
        });
      });
      updateNextBtn();
    }
  } else if (stepIndex === 2) {
    // Инициализируем дефолтные выборы для equipment
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = equipmentOptions.map(opt => `
      <div class="design-card${selectedEquipment === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
        ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
        <img src="${opt.img}" alt="${opt.title}" class="design-img" />
        <h3 class="card-title">${opt.title}</h3>
        <div class="card-desc">${opt.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => { selectedEquipment = card.dataset.id; renderStep(); updateNextBtn(); };
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { selectedEquipment = card.dataset.id; renderStep(); updateNextBtn(); } };
    });
    updateNextBtn();
  } else if (stepIndex === 3) {
    // Инициализируем дефолтные выборы для finishes
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    grid.style.display = '';
    grid.innerHTML = ''; // Очищаем grid перед заполнением новым контентом
    concreteForm.style.display = 'none';
    concreteForm.innerHTML = ''; // Очищаем concreteForm
    // --- STEP 4: Finishes (Coping + Internal) ---
    if (selectedMaterial === 'fibreglass') {
      grid.innerHTML = `
        <div class="finishes-container">
          <!-- Coping Material GROUP ONLY -->
          <div class="finish-group">
            <div class="finish-title">Coping Material</div>
            <div class="design-grid">
              ${finishesOptions.filter(opt => opt.group === 'coping').map(opt => `
                <div class="design-card${selectedCoping === opt.id ? ' selected' : ''}"
                     tabindex="0" role="button" aria-checked="${selectedCoping === opt.id}"
                     data-id="${opt.id}" data-group="coping">
                  <div class="card-content">
                    ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
                    <img src="${opt.img}" alt="${opt.title}" class="design-img" />
                    <h3 class="card-title">${opt.title}</h3>
                    <div class="card-desc">${opt.desc}</div>
                  </div>
                  <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
                </div>
              `).join('')}
            </div>
          </div>
          <!-- Coping Material GROUP END -->
        </div>
      `;
    } else if (selectedMaterial === 'concrete') {
      grid.innerHTML = `
        <div class="finishes-container">
          <!-- Coping Material GROUP START -->
          <div class="finish-group">
            <div class="finish-title">Coping Material</div>
            <div class="design-grid">
              ${finishesOptions.filter(opt => opt.group === 'coping').map(opt => `
                <div class="design-card${selectedCoping === opt.id ? ' selected' : ''}"
                     tabindex="0" role="button" aria-checked="${selectedCoping === opt.id}"
                     data-id="${opt.id}" data-group="coping">
                  <div class="card-content">
                    ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
                    <img src="${opt.img}" alt="${opt.title}" class="design-img" />
                    <h3 class="card-title">${opt.title}</h3>
                    <div class="card-desc">${opt.desc}</div>
                  </div>
                  <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
                </div>
              `).join('')}
            </div>
          </div>
          <!-- Coping Material GROUP END -->
          <!-- Internal Finish GROUP START -->
          <div class="finish-group">
            <div class="finish-title">Internal Finish</div>
            <div class="design-grid">
              ${finishesOptions.filter(opt => opt.group === 'internal').map(opt => `
                <div class="design-card${selectedInternal === opt.id ? ' selected' : ''}"
                     tabindex="0" role="button" aria-checked="${selectedInternal === opt.id}"
                     data-id="${opt.id}" data-group="internal">
                  <div class="card-content">
                    ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
                    <img src="${opt.img}" alt="${opt.title}" class="design-img" />
                    <h3 class="card-title">${opt.title}</h3>
                    <div class="card-desc">${opt.desc}</div>
                  </div>
                  <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
                </div>
              `).join('')}
            </div>
          </div>
          <!-- Internal Finish GROUP END -->
        </div>
      `;
    }
    // --- Обработчики выбора для finishes ---
    document.querySelectorAll('.design-card[data-group="coping"]').forEach(card => {
      card.onclick = () => {
        selectedCoping = card.dataset.id;
        // Сбрасываем флаг перевыбора при выборе coping
        needsFinishesRechoose = false;
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectedCoping = card.dataset.id;
          // Сбрасываем флаг перевыбора при выборе coping
          needsFinishesRechoose = false;
          renderStep();
          updateNextBtn();
        }
      };
    });
    document.querySelectorAll('.design-card[data-group="internal"]').forEach(card => {
      card.onclick = () => {
        selectedInternal = card.dataset.id;
        // Сбрасываем флаг перевыбора при выборе internal finish
        needsFinishesRechoose = false;
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectedInternal = card.dataset.id;
          // Сбрасываем флаг перевыбора при выборе internal finish
          needsFinishesRechoose = false;
          renderStep();
          updateNextBtn();
        }
      };
    });
    updateNextBtn();
  } else if (stepIndex === 4) {
    // Инициализируем дефолтные выборы для hardscape
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = hardscapeOptions.map(opt => `
      <div class="design-card${selectedHardscape === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <h3 class="card-title">${opt.title}</h3>
          <div class="card-desc">${opt.desc}</div>
        </div>
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => { selectedHardscape = card.dataset.id; renderStep(); updateNextBtn(); };
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { selectedHardscape = card.dataset.id; renderStep(); updateNextBtn(); } };
    });
    updateNextBtn();
  } else if (stepIndex === 5) {
    // Инициализируем дефолтные выборы для cover
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = coverOptions.map(opt => `
      <div class="design-card${selectedCover === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <h3 class="card-title">${opt.title}</h3>
          <div class="card-desc">${opt.desc}</div>
        </div>
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => { selectedCover = card.dataset.id; renderStep(); updateNextBtn(); };
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { selectedCover = card.dataset.id; renderStep(); updateNextBtn(); } };
    });
    updateNextBtn();
  } else if (stepIndex === 6) {
    mainTitle = 'SELECT AMENITIES';
    subtitle = 'Choose additional features for your pool. Multiple options can be selected.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = amenitiesOptions.map(opt => `
      <div class="design-card${selectedAmenities.includes(opt.id) ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <h3 class="card-title">${opt.title}</h3>
          <div class="card-desc">${opt.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => {
        if (selectedAmenities.includes(card.dataset.id)) {
          selectedAmenities = selectedAmenities.filter(id => id !== card.dataset.id);
        } else {
          selectedAmenities.push(card.dataset.id);
        }
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') {
        if (selectedAmenities.includes(card.dataset.id)) {
          selectedAmenities = selectedAmenities.filter(id => id !== card.dataset.id);
        } else {
          selectedAmenities.push(card.dataset.id);
        }
        renderStep();
        updateNextBtn();
      } };
    });
    updateNextBtn();
  } else if (stepIndex === 7) {
    // Инициализируем дефолтные выборы для included
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    mainTitle = "WHAT'S INCLUDED";
    subtitle = 'All services and materials included in your pool package. Get in touch for detailed information.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = includedOptions.map(opt => `
      <div class="design-card whats-included" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <div class="badge">Included</div>
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <h3 class="card-title">${opt.title}</h3>
          <div class="card-desc">${opt.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    // Карточки не кликабельны, только для информации
    document.querySelectorAll('.design-card.whats-included').forEach(card => {
      card.style.cursor = 'default';
      card.onclick = null;
      card.onkeydown = null;
    });
    updateNextBtn();
  } else if (stepIndex === 8) {
    // Инициализируем дефолтные выборы для planning
    if (typeof initializeDefaultSelections === 'function') {
      initializeDefaultSelections();
    }
    mainTitle = "PLANNING";
    subtitle = 'Things to consider for your project. Multiple options can be selected.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = planningOptions.map(opt => `
      <div class="design-card${selectedPlanning.includes(opt.id) ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <h3 class="card-title">${opt.title}</h3>
          <div class="card-desc">${opt.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => {
        if (selectedPlanning.includes(card.dataset.id)) {
          selectedPlanning = selectedPlanning.filter(id => id !== card.dataset.id);
        } else {
          selectedPlanning.push(card.dataset.id);
        }
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') {
        if (selectedPlanning.includes(card.dataset.id)) {
          selectedPlanning = selectedPlanning.filter(id => id !== card.dataset.id);
        } else {
          selectedPlanning.push(card.dataset.id);
        }
        renderStep();
        updateNextBtn();
      } };
    });
    updateNextBtn();
  }
  
  // === В рендере breakdown ===
  // Найти место, где stepIndex === 9 (ESTIMATED COST) и заменить prevBtn на New Calculation
  if (stepIndex === 9) {
    document.getElementById('prevBtn').style.display = '';
    document.getElementById('prevBtn').textContent = 'New Calculation';
    document.getElementById('prevBtn').onclick = resetCalculator;
  } else {
    document.getElementById('prevBtn').textContent = 'BACK';
    document.getElementById('prevBtn').onclick = function() {
      if (stepIndex === 1.5) { stepIndex = 1; renderStep(); }
      else if (stepIndex === 1) {
        // НЕ сбрасываем selectedShape при переходе назад - выбор должен сохраняться
        stepIndex = 0; renderStep();
      }
      else if (stepIndex === 2) { stepIndex = 1; renderStep(); }
      else if (stepIndex === 3) { stepIndex = 2; renderStep(); }
      else if (stepIndex === 4) { stepIndex = 3; renderStep(); }
      else if (stepIndex === 5) { stepIndex = 4; renderStep(); }
      else if (stepIndex === 6) { stepIndex = 5; renderStep(); }
      else if (stepIndex === 7) { stepIndex = 6; renderStep(); }
      else if (stepIndex === 8) { stepIndex = 7; renderStep(); }
    };
  }
} 

// --- Кнопки BACK и New Calculation на шаге 10 ---
function renderReviewButtons() {
  const nextBar = document.querySelector('.next-bar');
  if (!nextBar) return;
  
  if (stepIndex === 9) {
    // Шаг 10: показываем BACK и New Calculation
    nextBar.innerHTML = `
      <button class="next-btn" id="prevBtn" style="background:#dde2d2;color:#222;margin-right:12px;">BACK</button>
      <button class="next-btn" id="resetBtn" style="background:#e96c2c;color:#fff;">New Calculation</button>
    `;
    document.getElementById('prevBtn').onclick = function() {
      stepIndex = 8;
      renderStep();
    };
    document.getElementById('resetBtn').onclick = resetCalculator;
  } else {
    // Обычные шаги: показываем BACK и NEXT
    nextBar.innerHTML = `
      <button class="next-btn" id="prevBtn" style="background:#dde2d2;color:#222;margin-right:12px;${stepIndex === 0 ? 'display:none;' : ''}">BACK</button>
      <button class="next-btn" id="nextBtn">NEXT</button>
    `;
    
    // Обработчик для кнопки BACK
    document.getElementById('prevBtn').onclick = function() {
      if (stepIndex === 1) {
        // НЕ сбрасываем selectedShape при переходе назад - выбор должен сохраняться
        selectedSize = null;
        stepIndex = 0;
      } else {
        stepIndex = Math.max(0, stepIndex - 1);
      }
      renderStep();
    };
    
    // Обработчик для кнопки NEXT
    document.getElementById('nextBtn').onclick = nextBtnHandler;
    updateNextBtn();
  }
}

// --- Исправленный updateNextBtn ---
function nextBtnHandler() {
  if (needsDesignRechoose) {
    alert('Please reselect design for your new pool material.');
    return;
  }
  if (needsFinishesRechoose) {
    alert('Please reselect finishes for your new pool material.');
    return;
  }
  if (stepIndex === 0 && selectedMaterial) { stepIndex = 1; renderStep(); }
  else if (stepIndex === 1) {
    if (selectedMaterial === 'concrete' && selectedShape) { stepIndex = 2; renderStep(); }
    else if (selectedMaterial !== 'concrete' && selectedDesign) { stepIndex = 2; renderStep(); }
  } else if (stepIndex === 2 && selectedEquipment) {
    stepIndex = 3; renderStep();
  } else if (stepIndex === 3) {
    if (selectedMaterial === 'fibreglass' && selectedCoping) {
      stepIndex = 4; renderStep();
    } else if (selectedMaterial === 'concrete' && selectedCoping && selectedInternal) {
      stepIndex = 4; renderStep();
    }
  } else if (stepIndex === 4 && selectedHardscape) {
    stepIndex = 5; renderStep();
  } else if (stepIndex === 5 && selectedCover) {
    stepIndex = 6; renderStep();
  } else if (stepIndex === 6 && selectedAmenities.length) {
    stepIndex = 7; 
    if (typeof activateStep7 === 'function') {
      activateStep7(); // Активируем шаг INCLUDED
    }
    renderStep();
  } else if (stepIndex === 7) {
    stepIndex = 8; renderStep();
  } else if (stepIndex === 8 && selectedPlanning.length) {
    stepIndex = 9; 
    if (typeof activateStep9 === 'function') {
      activateStep9(); // Активируем шаг REVIEW
    }
    renderStep();
  }
}

// Вызов renderReviewButtons() в конце renderStep
renderReviewButtons();

function renderReviewSummary() {
  const block = document.getElementById('reviewSummaryBlock');
  if (!block) return;
  let html = `<div class='review-summary-title'>Your Selections</div>`;
  // 1. Design
  let designItems = [];
  if (selectedMaterial === 'fibreglass' && selectedDesign && selectedSize) {
    const model = fibreglassModels.find(m => m.id === selectedDesign);
    const size = model && model.sizes.find(s => s.id === selectedSize);
    if (model && size) {
      designItems.push(`Fibreglass ${model.title} ${size.length}x${size.width}x${size.depth}`);
    }
  } else if (selectedMaterial === 'concrete' && selectedShape) {
    const shape = concreteShapes.find(s => s.id === selectedShape);
    if (shape) {
      designItems.push(`Concrete ${shape.title} ${concreteDims.length}x${concreteDims.width}x${concreteDims.depth}`);
    }
  }
  html += `<div class='review-group'><div class='review-group-title'>Design</div><div class='review-group-list'>${designItems.length ? designItems.map(i=>`<div class='review-item'>${i}</div>`).join('') : `<div class='review-item empty'>-</div>`}</div></div>`;
  // 2. Pumpside
  let pumpItems = [];
  if (selectedEquipment) {
    const eq = equipmentOptions.find(e => e.id === selectedEquipment);
    if (eq) pumpItems.push(eq.title);
  }
  html += `<div class='review-group'><div class='review-group-title'>Pumpside</div><div class='review-group-list'>${pumpItems.length ? pumpItems.map(i=>`<div class='review-item'>${i}</div>`).join('') : `<div class='review-item empty'>-</div>`}</div></div>`;
  // 3. Finish & Hardscope
  let finishItems = [];
  if (selectedCoping) {
    const c = finishesOptions.find(f => f.id === selectedCoping);
    if (c) finishItems.push(c.title + ' (Coping)');
  }
  if (selectedInternal) {
    const i = finishesOptions.find(f => f.id === selectedInternal);
    if (i) finishItems.push(i.title + ' (Internal)');
  }
  if (selectedHardscape) {
    const h = hardscapeOptions.find(h => h.id === selectedHardscape);
    if (h) finishItems.push(h.title);
  }
  html += `<div class='review-group'><div class='review-group-title'>Finish & Hardscope</div><div class='review-group-list'>${finishItems.length ? finishItems.map(i=>`<div class='review-item'>${i}</div>`).join('') : `<div class='review-item empty'>-</div>`}</div></div>`;
  // 4. Cover & Amenities
  let coverItems = [];
  if (selectedCover) {
    const c = coverOptions.find(c => c.id === selectedCover);
    if (c) coverItems.push(c.title);
  }
  if (selectedAmenities && selectedAmenities.length) {
    coverItems = coverItems.concat(selectedAmenities.map(id => {
      const a = amenitiesOptions.find(a => a.id === id);
      return a ? a.title : '';
    }).filter(Boolean));
  }
  html += `<div class='review-group'><div class='review-group-title'>Cover & Amenities</div><div class='review-group-list'>${coverItems.length ? coverItems.map(i=>`<div class='review-item'>${i}</div>`).join('') : `<div class='review-item empty'>-</div>`}</div></div>`;
  // 5. Things to consider
  let planningItems = [];
  if (selectedPlanning && selectedPlanning.length) {
    planningItems = selectedPlanning.map(id => {
      const p = planningOptions.find(p => p.id === id);
      return p ? p.title : '';
    }).filter(Boolean);
  }
  html += `<div class='review-group'><div class='review-group-title'>Things to consider</div><div class='review-group-list'>${planningItems.length ? planningItems.map(i=>`<div class='review-item'>${i}</div>`).join('') : `<div class='review-item empty'>-</div>`}</div></div>`;
  // 6. Delivery (placeholder)
  html += `<div class='review-group'><div class='review-group-title'>Delivery</div><div class='review-group-list'><div class='review-item'>Depends on your location</div></div></div>`;
  block.innerHTML = html;
}

// --- AUTOCOMPLETE POSTCODE/SUBURB ---
function setupPostcodeAutocomplete() {
  const input = document.getElementById('reviewPostcode');
  const sugg = document.getElementById('postcodeSuggestions');
  if (!input || !sugg) return;
  let filtered = [];
  let selectedIdx = -1;
  let lastValue = '';

  function renderSuggestions(val) {
    if (!val) {
      sugg.innerHTML = '';
      sugg.classList.remove('active');
      filtered = [];
      selectedIdx = -1;
      return;
    }
    if (/^\d+$/.test(val)) {
      filtered = postcodeData.filter(item => item.postcode.startsWith(val));
    } else {
      filtered = postcodeData.filter(item => item.suburb.toLowerCase().startsWith(val));
    }
    if (!filtered.length) {
      sugg.innerHTML = '';
      sugg.classList.remove('active');
      selectedIdx = -1;
      return;
    }
    sugg.innerHTML = filtered.slice(0, 10).map((item, idx) => {
      // Подсветка совпадения
      let label = /^\d+$/.test(val)
        ? `<b>${item.postcode.substr(0, val.length)}</b>${item.postcode.substr(val.length)} — ${item.suburb}`
        : `${item.postcode} — <b>${item.suburb.substr(0, val.length)}</b>${item.suburb.substr(val.length)}`;
      return `<div class='sugg-item${idx === selectedIdx ? ' active' : ''}' data-postcode='${item.postcode}' data-suburb='${item.suburb}'>${label}</div>`;
    }).join('');
    sugg.classList.add('active');
    Array.from(sugg.children).forEach((div, idx) => {
      div.onclick = function() {
        input.value = `${div.dataset.postcode} — ${div.dataset.suburb}`;
        sugg.innerHTML = '';
        sugg.classList.remove('active');
        selectedIdx = -1;
      };
    });
  }

  input.oninput = function(e) {
    lastValue = input.value.trim();
    renderSuggestions(lastValue.toLowerCase());
  };
  input.onfocus = function() {
    renderSuggestions(input.value.trim().toLowerCase());
  };
  input.onblur = function() {
    setTimeout(() => {
      sugg.innerHTML = '';
      sugg.classList.remove('active');
      selectedIdx = -1;
    }, 150);
  };
  input.onkeydown = function(e) {
    if (!filtered.length) return;
    if (e.key === 'ArrowDown') {
      selectedIdx = (selectedIdx + 1) % filtered.length;
      renderSuggestions(input.value.trim().toLowerCase());
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      selectedIdx = (selectedIdx - 1 + filtered.length) % filtered.length;
      renderSuggestions(input.value.trim().toLowerCase());
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (selectedIdx >= 0 && filtered[selectedIdx]) {
        input.value = `${filtered[selectedIdx].postcode} — ${filtered[selectedIdx].suburb}`;
        sugg.innerHTML = '';
        sugg.classList.remove('active');
        selectedIdx = -1;
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      sugg.innerHTML = '';
      sugg.classList.remove('active');
      selectedIdx = -1;
    }
  };

  // Валидация при отправке формы
  const form = document.getElementById('captureForm');
  if (form) {
    form.onsubmit = function(ev) {
      const val = input.value.trim();
      let valid = false;
      if (/^\d+\s*—\s*.+$/.test(val)) {
        const [pc, sub] = val.split('—').map(s => s.trim());
        valid = postcodeData.some(item => item.postcode === pc && item.suburb.toLowerCase() === sub.toLowerCase());
      }
      if (!valid) {
        input.classList.add('input-error');
        input.focus();
        renderSuggestions(val.toLowerCase());
        ev.preventDefault();
        return false;
      } else {
        input.classList.remove('input-error');
      }
    };
  }
}

// Функция для глобального скролла в шаге 10 (только desktop и планшет)
function setupStep10GlobalScroll() {
  const summarySection = document.querySelector('.step-10-summary-section');
  if (!summarySection) return;
  
  // Обработчик глобального скролла
  function handleGlobalScroll(e) {
    e.preventDefault();
    const delta = e.deltaY || e.detail || e.wheelDelta;
    
    if (summarySection) {
      const currentScrollTop = summarySection.scrollTop;
      const maxScrollTop = summarySection.scrollHeight - summarySection.clientHeight;
      
      // Плавный скролл с ограничениями
      if ((delta > 0 && currentScrollTop < maxScrollTop) || 
          (delta < 0 && currentScrollTop > 0)) {
        summarySection.scrollTop += delta * 0.3; // Уменьшаем скорость для плавности
      }
      
      // Проверка границ
      if (summarySection.scrollTop < 0) {
        summarySection.scrollTop = 0;
      } else if (summarySection.scrollTop > maxScrollTop) {
        summarySection.scrollTop = maxScrollTop;
      }
    }
  }
  
  // Добавляем обработчики только на десктопе и планшете
  if (window.innerWidth > 768) {
    // Очищаем предыдущие обработчики
    if (window.step10ScrollHandler) {
      document.removeEventListener('wheel', window.step10ScrollHandler);
      document.removeEventListener('DOMMouseScroll', window.step10ScrollHandler);
    }
    
    document.addEventListener('wheel', handleGlobalScroll, { passive: false });
    document.addEventListener('DOMMouseScroll', handleGlobalScroll, { passive: false });
    
    window.step10ScrollHandler = handleGlobalScroll;
  }
}

// Функция для очистки обработчиков скролла при выходе из шага 10
function cleanupStep10Scroll() {
  if (window.step10ScrollHandler) {
    document.removeEventListener('wheel', window.step10ScrollHandler);
    document.removeEventListener('DOMMouseScroll', window.step10ScrollHandler);
    window.step10ScrollHandler = null;
  }
}

// Функция для обработки изменения размера окна в шаге 10
function handleStep10Resize() {
  if (stepIndex === 9) {
    setupStep10GlobalScroll();
  }
}

// --- Информационная плашка для кастомных размеров ---
function showCustomSizeInfo() {
  // Удаляем существующую плашку, если есть
  const existingInfo = document.getElementById('custom-size-info');
  if (existingInfo) {
    existingInfo.remove();
  }
  
  // Создаем плашку
  const infoBox = document.createElement('div');
  infoBox.id = 'custom-size-info';
  infoBox.innerHTML = `
    <div class="info-content">
      <div class="info-text">Customize your pool dimensions below</div>
      <div class="info-arrow">↓</div>
    </div>
  `;
  
  // Добавляем в body
  document.body.appendChild(infoBox);
  
  // Показываем с анимацией
  setTimeout(() => {
    infoBox.classList.add('show');
  }, 100);
  
  // Скрываем через 8 секунд
  setTimeout(() => {
    infoBox.classList.add('hide');
    setTimeout(() => {
      if (infoBox.parentNode) {
        infoBox.remove();
      }
    }, 500);
  }, 8000);
}

