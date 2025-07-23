// --- РЕНДЕР СТЕППЕРА ---
function renderStepper() {
  const bar = document.getElementById('stepperBar');
  bar.innerHTML = '';
  steps.forEach((step, idx) => {
    let state = 'future';
    if (idx < stepIndex) state = 'completed';
    if (idx === stepIndex) state = 'active';
    const stepDiv = document.createElement('div');
    stepDiv.className = `stepper-step ${state}`;
    stepDiv.tabIndex = (state === 'completed' || state === 'active') ? 0 : -1;
    stepDiv.setAttribute('role', 'button');
    if (state === 'completed' || state === 'active') {
      stepDiv.onclick = () => {
        if (idx <= stepIndex) {
          stepIndex = idx;
          renderStep();
        }
      };
    }
    stepDiv.innerHTML = `
      <div class="stepper-circle">${idx+1}</div>
      <div class="stepper-label">${step.label.toUpperCase()}</div>
    `;
    bar.appendChild(stepDiv);
  });
}

// --- РЕНДЕР КАРТОЧЕК ---
const grid = document.getElementById('designGrid');
const concreteForm = document.getElementById('concreteForm');

function updateNextBtn() {
  if (stepIndex === 0) {
    document.getElementById('nextBtn').disabled = !selectedMaterial;
  } else if (stepIndex === 1) {
    if (selectedMaterial === 'concrete') {
      document.getElementById('nextBtn').disabled = !selectedShape;
    } else {
      // Для fibreglass нужно выбрать и модель, и размер
      document.getElementById('nextBtn').disabled = !(selectedDesign && selectedSize);
    }
  } else if (stepIndex === 1.5) {
    document.getElementById('nextBtn').disabled = false;
  } else if (stepIndex === 2) {
    document.getElementById('nextBtn').disabled = !selectedEquipment;
  } else if (stepIndex === 3) {
    document.getElementById('nextBtn').disabled = !(selectedCoping && selectedInternal);
  } else if (stepIndex === 4) {
    document.getElementById('nextBtn').disabled = !selectedHardscape;
  } else if (stepIndex === 5) {
    document.getElementById('nextBtn').disabled = !selectedCover;
  } else if (stepIndex === 6) {
    document.getElementById('nextBtn').disabled = !selectedAmenities.length;
  } else if (stepIndex === 7) {
    document.getElementById('nextBtn').disabled = false;
  } else if (stepIndex === 8) {
    document.getElementById('nextBtn').disabled = !selectedPlanning.length;
  } else if (stepIndex === 9) {
    document.getElementById('nextBtn').style.display = 'none';
  } else {
    // Для всех последующих шагов (если появятся) — NEXT всегда дизабл, если нет выбора (можно расширить по мере добавления шагов)
    document.getElementById('nextBtn').disabled = false;
  }
}

// --- NEXT/PREV ---
document.getElementById('nextBtn').onclick = function() {
  if (stepIndex === 0 && selectedMaterial) { stepIndex = 1; renderStep(); }
  else if (stepIndex === 1) {
    if (selectedMaterial === 'concrete' && selectedShape) { stepIndex = 1.5; renderStep(); }
    else if (selectedMaterial !== 'concrete' && selectedDesign) { stepIndex = 2; renderStep(); }
  } else if (stepIndex === 1.5) {
    stepIndex = 2; renderStep();
  } else if (stepIndex === 2 && selectedEquipment) {
    stepIndex = 3; renderStep();
  } else if (stepIndex === 3 && selectedCoping && selectedInternal) {
    stepIndex = 4; renderStep();
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

function openLearnMore(title, desc) {
  modalTitle.textContent = title || 'Learn More';
  modalDesc.textContent = desc || 'Demo info about this option/card. (TODO: Inject real content here)';
  modalOverlay.style.display = 'flex';
  setTimeout(() => modalOverlay.classList.add('active'), 10);
  // Trap focus
  const focusable = modalOverlay.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();
  document.body.style.overflow = 'hidden';
  // Save last focused
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

// --- ИНИЦИАЛИЗАЦИЯ ---
// Вызов рендера степпера теперь через renderStepper() внутри renderStep()
function renderStep() {
  renderStepper();
  document.getElementById('prevBtn').style.display = stepIndex > 0 ? '' : 'none';
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
    mainTitle = "ESTIMATED COST";
    subtitle = 'Your pool package breakdown and total cost estimate.';
  }
  
  // === Явно обновляем DOM ===
  document.querySelector('.main-title').textContent = mainTitle;
  document.querySelector('.subtitle').textContent = subtitle;
  
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${d.title.replace(/'/g, "&#39;")}', 'Demo info about ${d.title}. (TODO: Inject real content here)')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    document.querySelectorAll('.design-card').forEach(card => {
      card.onclick = () => {
        selectedMaterial = card.dataset.id;
        // Если выбран не concrete, сбрасываем форму
        if (selectedMaterial !== 'concrete') selectedShape = null;
        renderStep();
        updateNextBtn();
      };
      card.onkeydown = e => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectedMaterial = card.dataset.id;
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
          <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${s.title.replace(/'/g, "&#39;")}', 'Demo info about ${s.title}. (TODO: Inject real content here)')">Learn More</button>
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
            <input type="number" class="concrete-num" id="num-${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}" autocomplete="off"> м
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
        
        if (m.hasMultipleSizes) {
          // Показываем выбранный размер или первый доступный
          const currentSize = selectedSize && m.sizes.find(s => s.id === selectedSize) ? 
            m.sizes.find(s => s.id === selectedSize) : m.sizes[0];
          
          sizeDisplay = `<div class="pool-size">${currentSize.size}</div>`;
          
          // Создаем селектор размеров
          sizeSelector = `
            <div class="size-selector">
              <select class="size-select" data-model-id="${m.id}">
                ${m.sizes.map(s => `
                  <option value="${s.id}" ${selectedSize === s.id ? 'selected' : ''}>
                    ${s.size}
                  </option>
                `).join('')}
              </select>
            </div>
          `;
        } else {
          // Один размер - добавляем пустой селектор для выравнивания высоты
          sizeDisplay = `<div class="pool-size">${m.sizes[0].size}</div>`;
          sizeSelector = `<div class="size-selector"></div>`;
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
            <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${m.title.replace(/'/g, "&#39;")}', 'Demo info about ${m.title}. (TODO: Inject real content here)')">Learn More</button>
            <!-- END LEARN MORE BUTTON -->
          </div>
        `;
      }).join('');
      
      // Обработчики для карточек
      document.querySelectorAll('.design-card').forEach(card => {
        card.onclick = (e) => { 
          // Проверяем, не кликнули ли мы на селектор или его элементы
          if (e.target.closest('.size-selector') || e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
            return; // Не обрабатываем клик по карточке, если кликнули на селектор
          }
          
          selectedDesign = card.dataset.id; 
          // Если у модели один размер, автоматически выбираем его
          const model = fibreglassModels.find(m => m.id === selectedDesign);
          if (model && !model.hasMultipleSizes) {
            selectedSize = model.sizes[0].id;
          }
          renderStep(); 
          updateNextBtn(); 
        };
        card.onkeydown = e => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            selectedDesign = card.dataset.id; 
            const model = fibreglassModels.find(m => m.id === selectedDesign);
            if (model && !model.hasMultipleSizes) {
              selectedSize = model.sizes[0].id;
            }
            renderStep(); 
            updateNextBtn(); 
          } 
        };
      });
      
      // Обработчики для селекторов размеров
      document.querySelectorAll('.size-select').forEach(select => {
        select.onchange = (e) => {
          e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
          selectedSize = e.target.value;
          // Если карточка не выбрана, выбираем её
          if (!selectedDesign) {
            selectedDesign = e.target.dataset.modelId;
          }
          renderStep();
          updateNextBtn();
        };
        
        select.onclick = (e) => {
          e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
        };
        
        select.onmousedown = (e) => {
          e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
        };
        
        select.onfocus = (e) => {
          e.stopPropagation(); // Предотвращаем срабатывание клика по карточке
        };
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
    grid.innerHTML = finishesOptions.map(opt => `
      <div class="design-card${(opt.group === 'coping' && selectedCoping === opt.id) || (opt.group === 'internal' && selectedInternal === opt.id) ? ' selected' : ''}"
           tabindex="0" role="button" aria-checked="${(opt.group === 'coping' && selectedCoping === opt.id) || (opt.group === 'internal' && selectedInternal === opt.id)}"
           data-id="${opt.id}" data-group="${opt.group}">
        <div class="card-content">
          ${opt.badge ? `<div class="badge">${opt.badge}</div>` : ''}
          <img src="${opt.img}" alt="${opt.title}" class="design-img" />
          <div class="card-title">${opt.title}</div>
          <div class="card-desc">${opt.desc}</div>
          <div class="finish-group-indicator">${opt.group === 'coping' ? 'Coping Material' : 'Internal Finish'}</div>
        </div>
        <!-- LEARN MORE BUTTON (универсально) -->
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
        <!-- END LEARN MORE BUTTON -->
      </div>
    `).join('');
    
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
        <button class="learnmore-btn" type="button" tabindex="0" onclick="openLearnMore('${opt.title.replace(/'/g, "&#39;")}', 'Demo info about ${opt.title}. (TODO: Inject real content here)')">Learn More</button>
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
  } else if (stepIndex === 7) {
    stepIndex = 6; renderStep();
  } else if (stepIndex === 8 && selectedPlanning.length) {
    stepIndex = 9; renderStep();
  } else if (stepIndex === 9) {
    mainTitle = "ESTIMATED COST";
    subtitle = 'Your pool package breakdown and total cost estimate.';
    grid.style.display = '';
    concreteForm.style.display = 'none';
    
    const { total, breakdown } = calculateTotalCost();
    const breakdownKeys = Object.keys(breakdown);
    grid.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; width: 100%;">
        <div style="background: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 2px solid #e8f1fb;">
          <h3 style="margin: 0 0 20px 0; color: #0797ee; font-size: 1.3em; text-align: center;">Cost Breakdown</h3>
          ${breakdownKeys.map(key => {
            const item = breakdown[key];
            const isIncluded = item.included;
            return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e8f1fb;">
              <div>
                <div style="font-weight: 600; color: #2a3a4a; margin-bottom: 4px;">${item.title}</div>
                <div style="font-size: 0.9em; color: #6a7a8a;">${item.description}</div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 700; color: #0797ee; font-size: 1.2em;">$${item.cost.toLocaleString()}</span>
                ${isIncluded ? '<span style="background:#e8f1fb;color:#0797ee;font-size:12px;padding:2px 8px;border-radius:6px;font-weight:600;">Included</span>' : ''}
                ${!isIncluded && item.removable ? `<button onclick="window.removeBreakdownOption('${key}','${item.id}')" style="background:none;border:none;color:#e96c2c;font-size:1.2em;cursor:pointer;" title="Remove">&#10006;</button>` : ''}
              </div>
            </div>`;
          }).join('')}
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-top: 2px solid #0797ee; margin-top: 12px;">
            <div style="font-weight: 700; color: #2a3a4a; font-size: 1.3em;">Total Estimated Cost</div>
            <div style="font-weight: 700; color: #0797ee; font-size: 1.5em;">$${total.toLocaleString()}</div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button onclick="getConsultation()" style="background: #0797ee; color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 1.1em; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px #0797ee33;" onmouseover="this.style.background='#1786f9'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#0797ee'; this.style.transform='translateY(0)'">Get Consultation</button>
          <button onclick="addToCart()" style="background: #e96c2c; color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 1.1em; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 16px #e96c2c33;" onmouseover="this.style.background='#ff7f3f'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#e96c2c'; this.style.transform='translateY(0)'">Add to Cart</button>
        </div>
      </div>
    `;
    
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