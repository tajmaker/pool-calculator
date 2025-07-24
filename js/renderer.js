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
  bar.innerHTML = '';
  const allValid = Array.from({length: 9}, (_,i)=>isStepValid(i)).every(Boolean);
  steps.forEach((step, idx) => {
    let state = 'future';
    if (idx < stepIndex) state = 'completed';
    if (idx === stepIndex) state = 'active';
    // --- Особая логика для шага 4 (FINISHES) ---
    let needsAttention = false;
    if (idx === 3 && needsFinishesRechoose) {
      needsAttention = true;
      state = (idx === stepIndex) ? 'active' : 'attention';
    }
    // --- Особая логика для шага 10 (итог) ---
    let isStep10Valid = true;
    if (idx === 9) {
      isStep10Valid = allValid;
      if (!isStep10Valid) state = 'future';
    }
    // --- Обычная логика валидности ---
    if (!needsAttention && idx !== 9 && isStepValid(idx)) state = (idx === stepIndex) ? 'active' : 'completed';
    const stepDiv = document.createElement('div');
    stepDiv.className = `stepper-step ${state}` + (needsAttention ? ' needs-attention' : '');
    stepDiv.tabIndex = (needsAttention || (isStepValid(idx) && (idx !== 9 || isStep10Valid)) || state === 'active') ? 0 : -1;
    stepDiv.setAttribute('role', 'button');
    // --- Клик по шагу 4 (attention) ---
    if (needsAttention) {
      stepDiv.onclick = () => {
          stepIndex = idx;
          renderStep();
      };
      stepDiv.title = 'Please reselect finishes for your new pool material';
    } else if (idx === 9 && isStep10Valid) {
      stepDiv.onclick = () => {
        stepIndex = idx;
        renderStep();
      };
    } else if (isStepValid(idx) && (idx !== 9)) {
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
      nextBtn.disabled = !(selectedDesign && selectedSize);
    }
  } else if (stepIndex === 2) {
    nextBtn.disabled = !selectedEquipment;
  } else if (stepIndex === 3) {
    if (selectedMaterial === 'fibreglass') {
      nextBtn.disabled = !(selectedCoping && selectedInternal);
    } else if (selectedMaterial === 'concrete') {
      nextBtn.disabled = !selectedInternal;
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
let needsFinishesRechoose = false;
document.getElementById('nextBtn').onclick = function() {
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
    if (selectedMaterial === 'fibreglass' && selectedCoping && selectedInternal) {
    stepIndex = 4; renderStep();
    } else if (selectedMaterial === 'concrete' && selectedInternal) {
      stepIndex = 4; renderStep();
    }
  } else if (stepIndex === 4 && selectedHardscape) {
    stepIndex = 5; renderStep();
  } else if (stepIndex === 5 && selectedCover) {
    stepIndex = 6; renderStep();
  } else if (stepIndex === 6 && selectedAmenities.length) {
    stepIndex = 7; renderStep();
  } else if (stepIndex === 7) {
    stepIndex = 8; renderStep();
  } else if (stepIndex === 8 && selectedPlanning.length) {
    stepIndex = 9; renderStep();
  }
};

document.getElementById('prevBtn').onclick = function() {
  if (stepIndex === 1.5) { stepIndex = 1; renderStep(); }
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
    else return !!selectedDesign && !!selectedSize;
  }
  if (idx === 2) return !!selectedEquipment;
  if (idx === 3) {
    if (selectedMaterial === 'fibreglass') return !!selectedCoping && !!selectedInternal;
    if (selectedMaterial === 'concrete') return !!selectedInternal;
    return false;
  }
  if (idx === 4) return !!selectedHardscape;
  if (idx === 5) return !!selectedCover;
  if (idx === 6) return !!selectedAmenities && selectedAmenities.length > 0;
  if (idx === 7) return true; // always open
  if (idx === 8) return !!selectedPlanning && selectedPlanning.length > 0;
  if (idx === 9) return true;
  return false;
}

// --- ИНИЦИАЛИЗАЦИЯ ---
// Вызов рендера степпера теперь через renderStepper() внутри renderStep()
function renderStep() {
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
    mainTitle = "WHAT'S INCLUDED";
    subtitle = 'All services and materials included in your pool package. Get in touch for detailed information.';
  } else if (stepIndex === 8) {
    mainTitle = "PLANNING";
    subtitle = 'Things to consider for your project. Multiple options can be selected.';
  } else if (stepIndex === 9) {
    mainTitle = "REVIEW";
    subtitle = 'Your pool package breakdown and total cost estimate.';
    grid.style.display = 'none';
    concreteForm.style.display = 'none';
    const reviewLayoutHtml = `
      <div class="review-layout">
        <div class="review-form-col">
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
        <div class="review-summary-col">
          <div id="reviewSummaryBlock">
            <div class='review-summary-placeholder'>Review summary will be here</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('reviewStepLayout').innerHTML = reviewLayoutHtml;
    renderReviewSummary();
    document.getElementById('reviewStepLayout').style.display = '';
    document.querySelector('.main-title').textContent = mainTitle;
    document.querySelector('.subtitle').textContent = subtitle;
    renderReviewButtons();
    setupPostcodeAutocomplete(); // <--- добавлено
    return;
  }
  document.querySelector('.main-title').textContent = mainTitle;
  document.querySelector('.subtitle').textContent = subtitle;
  renderReviewButtons();
  
  if (stepIndex === 0) {
    // Step 1: Material
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = materialOptions.map(d => `
      <div class="design-card${selectedMaterial === d.id ? ' selected' : ''}" tabindex="0" data-id="${d.id}">
        <div class="card-content">
        ${d.badge ? `<div class="badge">${d.badge}</div>` : ''}
        <img src="${d.img}" alt="${d.title}" class="design-img" />
        <div class="card-title">${d.title}</div>
        <div class="card-desc">${d.desc}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${d.title.replace(/'/g, "&#39;")}', 'Demo info about ${d.title}. (TODO: Inject real content here)', '${d.img || ''}')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    // При изменении материала сбрасываем только зависимые шаги
    function resetDependentStepsOnMaterialChange(newMaterial) {
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
      concreteForm.style.display = '';
      // --- UI: Concrete pool shapes ---
      let shapeHtml = concreteShapes.map(s => `
        <div class="design-card${selectedShape === s.id ? ' selected' : ''}" tabindex="0" data-id="${s.id}">
          <div class="card-content">
          <img src="${s.img}" alt="${s.title}" class="design-img" />
          <div class="card-title">${s.title}</div>
          <div class="card-desc">${s.desc}</div>
          </div>
          <!-- LEARN MORE BUTTON (универсально) -->
          <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${s.title.replace(/'/g, "&#39;")}', 'Demo info about ${s.title}. (TODO: Inject real content here)', '${s.img || ''}')">Learn More</button>
          <!-- END LEARN MORE BUTTON -->
        </div>
      `).join('');
      // --- После выбора формы показываем размеры и визуализацию ---
      let paramsAndVisual = '';
      if (selectedShape) {
        // --- Блок выбора размеров ---
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
        let calcHtml = `<div style="margin:18px 0 0 0;text-align:center;color:#1786f9;font-size:1.1em;">Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b></div>`;
        paramsAndVisual = `
          <div style="min-height:140px;display:flex;flex-direction:column;justify-content:center;max-width:420px;margin:0 auto;">
            <div class="concrete-params-block">
          ${sliders}
            </div>
            ${visualPreview}
          ${calcHtml}
        </div>
      `;
      }
      concreteForm.innerHTML = `
        <div class="design-grid">${shapeHtml}</div>
        ${paramsAndVisual}
      `;
      // --- События выбора формы ---
      document.querySelectorAll('#concreteForm .design-card').forEach(card => {
        card.onclick = () => { selectedShape = card.dataset.id; renderStep(); updateNextBtn(); };
        card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { selectedShape = card.dataset.id; renderStep(); updateNextBtn(); } };
      });
      // --- События для input/range ---
      if (selectedShape) {
        let paramFields = [
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
            document.querySelector('.concrete-params-block').nextElementSibling.nextElementSibling.innerHTML = `Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b>`;
            renderConcreteWOWSVGs(selectedShape, concreteDims.length, concreteDims.width, concreteDims.depth);
          };
          num.oninput = e => {
            slider.value = num.value;
            concreteDims[p.key] = parseFloat(num.value) || '';
            let perim = 2 * (Number(concreteDims.length) + Number(concreteDims.width));
            let vol = (Number(concreteDims.length) * Number(concreteDims.width) * Number(concreteDims.depth)).toFixed(2);
            document.querySelector('.concrete-params-block').nextElementSibling.nextElementSibling.innerHTML = `Perimeter: <b>${perim} m</b> &nbsp; | &nbsp; Volume: <b>${vol} m³</b>`;
            renderConcreteWOWSVGs(selectedShape, concreteDims.length, concreteDims.width, concreteDims.depth);
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
        // --- WOW SVG рендеринг ---
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
          // Показываем выбранный размер или первый доступный
          const currentSize = selectedDesign === m.id && selectedSize
            ? m.sizes.find(s => s.id === selectedSize) || m.sizes[0]
            : m.sizes[0];
          sizeDisplay = `<div class="pool-size">${currentSize.size}</div>`;
          // Кастомный dropdown будет внедрён на следующем шаге
          sizeSelector = `
            <div class="custom-size-selector" data-model-id="${m.id}">
              <button class="custom-size-select-btn" type="button">
                ${currentSize.size} <span class="dropdown-arrow">▼</span>
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
        
        return `
          <div class="design-card${selectedDesign === m.id ? ' selected' : ''}" tabindex="0" data-id="${m.id}">
            <div class="card-content">
            <img src="${m.img}" alt="${m.title}" class="design-img" />
            <div class="card-title">${m.title}</div>
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
              // Если размер ещё не выбран — выбираем первый
              if (!selectedSize || !model.sizes.find(s => s.id === selectedSize)) {
                selectedSize = model.sizes[0].id;
              }
            } else {
              selectedSize = model.sizes[0].id;
            }
          }
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
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = equipmentOptions.map(opt => `
      <div class="design-card${selectedEquipment === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
        ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
        <img src="${opt.img}" alt="${opt.title}" class="design-img" />
        <div class="card-title">${opt.title}</div>
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
    grid.style.display = '';
    concreteForm.style.display = 'none';
    // --- STEP 4: Finishes (Coping + Internal) ---
    if (selectedMaterial === 'fibreglass') {
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
                    <div class="card-title">${opt.title}</div>
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
                    <div class="card-title">${opt.title}</div>
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
    } else if (selectedMaterial === 'concrete') {
      grid.innerHTML = `
        <div class="finishes-container">
          <!-- Internal Finish GROUP ONLY -->
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
                    <div class="card-title">${opt.title}</div>
                    <div class="card-desc">${opt.desc}</div>
                  </div>
                  <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)', '${opt.img || ''}')">Learn More</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
    // --- Обработчики выбора для finishes ---
    document.querySelectorAll('.design-card[data-group="coping"]').forEach(card => {
      card.onclick = () => {
        selectedCoping = card.dataset.id;
          renderStep();
          updateNextBtn();
        };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectedCoping = card.dataset.id;
          renderStep();
          updateNextBtn();
        }
      };
    });
    document.querySelectorAll('.design-card[data-group="internal"]').forEach(card => {
      card.onclick = () => {
        selectedInternal = card.dataset.id;
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectedInternal = card.dataset.id;
          renderStep();
          updateNextBtn();
        }
      };
    });
    updateNextBtn();
  } else if (stepIndex === 4) {
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = hardscapeOptions.map(opt => `
      <div class="design-card${selectedHardscape === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <div class="card-title">${opt.title}</div>
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
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = coverOptions.map(opt => `
      <div class="design-card${selectedCover === opt.id ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <div class="card-title">${opt.title}</div>
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
          <div class="card-title">${opt.title}</div>
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
    mainTitle = "WHAT'S INCLUDED";
    subtitle = 'All services and materials included in your pool package. Get in touch for detailed information.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = includedOptions.map(opt => `
      <div class="design-card whats-included" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <div class="badge">Included</div>
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <div class="card-title">${opt.title}</div>
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
    mainTitle = "PLANNING";
    subtitle = 'Things to consider for your project. Multiple options can be selected.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    grid.innerHTML = planningOptions.map(opt => `
      <div class="design-card${selectedPlanning.includes(opt.id) ? ' selected' : ''}" tabindex="0" data-id="${opt.id}">
        <div class="card-content">
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <div class="card-title">${opt.title}</div>
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
  } else if (stepIndex === 9) {
    mainTitle = "REVIEW";
    subtitle = 'Your pool package breakdown and total cost estimate.';
    // Скрываем старый grid, показываем новый layout
    grid.style.display = 'none';
    concreteForm.style.display = 'none';
    const reviewLayoutHtml = `
      <div class="review-layout">
        <div class="review-form-col">
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
        <div class="review-summary-col">
          <div id="reviewSummaryBlock">
            <div class='review-summary-placeholder'>Review summary will be here</div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('reviewStepLayout').innerHTML = reviewLayoutHtml;
    renderReviewSummary();
    document.getElementById('reviewStepLayout').style.display = '';
    // === Явно обновляем DOM ===
    document.querySelector('.main-title').textContent = mainTitle;
    document.querySelector('.subtitle').textContent = subtitle;
    // Кнопка сброса
    document.getElementById('prevBtn').style.display = '';
    document.getElementById('prevBtn').textContent = 'New Calculation';
    document.getElementById('prevBtn').onclick = resetCalculator;
    updateNextBtn();
    setupPostcodeAutocomplete();
    return;
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
        if (selectedMaterial === 'concrete') selectedShape = null;
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
    nextBar.innerHTML = `
      <button class="next-btn" id="prevBtn" style="background:#dde2d2;color:#222;margin-right:12px;${stepIndex === 0 ? 'display:none;' : ''}">BACK</button>
      <button class="next-btn" id="nextBtn">NEXT</button>
    `;
    document.getElementById('prevBtn').onclick = function() {
      if (stepIndex === 1.5) { stepIndex = 1; renderStep(); }
      else if (stepIndex === 1) {
        if (selectedMaterial === 'concrete') selectedShape = null;
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
    document.getElementById('nextBtn').onclick = nextBtnHandler;
    updateNextBtn();
  }
}

// --- Исправленный updateNextBtn ---
function nextBtnHandler() {
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
    if (selectedMaterial === 'fibreglass' && selectedCoping && selectedInternal) {
      stepIndex = 4; renderStep();
    } else if (selectedMaterial === 'concrete' && selectedInternal) {
      stepIndex = 4; renderStep();
    }
  } else if (stepIndex === 4 && selectedHardscape) {
    stepIndex = 5; renderStep();
  } else if (stepIndex === 5 && selectedCover) {
    stepIndex = 6; renderStep();
  } else if (stepIndex === 6 && selectedAmenities.length) {
    stepIndex = 7; renderStep();
  } else if (stepIndex === 7) {
    stepIndex = 8; renderStep();
  } else if (stepIndex === 8 && selectedPlanning.length) {
    stepIndex = 9; renderStep();
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