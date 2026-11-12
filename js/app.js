document.addEventListener('DOMContentLoaded', () => {
  
  // --- ФИЧА 1: Копирование телефона ---
// --- ФИЧА 1: Надежное копирование телефона (работает и локально, и на хостинге) ---
  window.copyPhone = function(btn) {
    const phoneNumber = '+7 (800) 555-35-35';
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        showSuccessState(btn);
      }).catch(() => {
        fallbackCopy(phoneNumber, btn);
      });
    } else {
      fallbackCopy(phoneNumber, btn);
    }
  };

  function fallbackCopy(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Избегаем прокрутки страницы
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showSuccessState(btn);
    } catch (err) {
      console.error('Не удалось скопировать текст', err);
    }
    document.body.removeChild(textArea);
  }

  function showSuccessState(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Готово!';
    btn.classList.replace('btn-outline-secondary', 'btn-success');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.replace('btn-success', 'btn-outline-secondary');
    }, 2000);
  }
  // --- ФИЧА 2: Темная / Светлая тема ---
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Проверяем сохраненную тему при загрузке
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-bs-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? 'Светлая тема' : 'Темная тема';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.textContent = newTheme === 'dark' ? 'Светлая тема' : 'Темная тема';
    });
  }

  // --- ФИЧА 3: Калькулятор на главной (index.html) ---
  const calcForm = document.getElementById('expressCalcForm');
  const calcResult = document.getElementById('calcResult');

  const universitiesDB = [
    { name: 'МГТУ им. Баумана', minScore: 265, dir: 'engineering' },
    { name: 'НИУ ВШЭ', minScore: 280, dir: 'economics' },
    { name: 'МГУ им. Ломоносова', minScore: 275, dir: 'economics' },
    { name: 'МФТИ', minScore: 290, dir: 'it' },
    { name: 'СПбПУ (Политех)', minScore: 250, dir: 'engineering' },
    { name: 'Университет ИТМО', minScore: 270, dir: 'it' }
  ];

  if (calcForm && calcResult) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const score = parseInt(document.getElementById('egeScoreInput').value, 10);
      const direction = document.getElementById('directionSelect').value;

      const matched = universitiesDB.filter(u => score >= u.minScore && (u.dir === direction || score >= u.minScore + 10));

      calcResult.classList.remove('d-none');
      if (matched.length > 0) {
        const listHtml = matched.map(u => `<li><strong>${u.name}</strong> (проходной от ${u.minScore})</li>`).join('');
        calcResult.innerHTML = `
          <div class="alert alert-success small mb-0">
            <div class="fw-bold mb-1">Вы проходите на бюджет (${matched.length}):</div>
            <ul class="mb-2 ps-3">${listHtml}</ul>
            <a href="catalog.html" class="btn btn-sm btn-success w-100">Перейти в каталог</a>
          </div>`;
      } else {
        calcResult.innerHTML = `
          <div class="alert alert-warning small mb-0">
            С суммой <strong>${score}</strong> баллов на выбранное направление высокий конкурс. 
            <a href="order.html" class="alert-link">Запишитесь на разбор</a> — подберем целевое или смежные программы!
          </div>`;
      }
    });
  }

  // --- ФИЧА 4: Живая фильтрация каталога (catalog.html) ---
 // --- ФИЧА 5: Исправленная и надежная фильтрация каталога вузов ---
  const applyFilterBtn = document.getElementById('applyFilterBtn');
  const filterDir = document.getElementById('filter-dir');
  const filterScore = document.getElementById('filter-score');
  const checkHostel = document.getElementById('check-hostel');
  const checkMilitary = document.getElementById('check-military');
  const uniCards = document.querySelectorAll('.uni-card');

  function applyFilters() {
    if (!uniCards.length) return;
    
    const selectedDir = filterDir ? filterDir.value.trim() : 'all';
    const maxScore = filterScore && filterScore.value !== '' ? parseInt(filterScore.value, 10) : 310;
    const needHostel = checkHostel ? checkHostel.checked : false;
    const needMilitary = checkMilitary ? checkMilitary.checked : false;

    uniCards.forEach(card => {
      const cardDir = (card.dataset.direction || '').trim();
      const cardScore = parseInt(card.dataset.score || '0', 10);
      const cardHostel = card.dataset.hostel === 'true';
      const cardMilitary = card.dataset.military === 'true';

      // Проверка условий
      const matchDir = (selectedDir === 'all') || (cardDir.toLowerCase() === selectedDir.toLowerCase());
      const matchScore = cardScore <= maxScore;
      const matchHostel = !needHostel || cardHostel;
      const matchMilitary = !needMilitary || cardMilitary;

      // Показываем или скрываем карточку
      if (matchDir && matchScore && matchHostel && matchMilitary) {
        card.classList.remove('d-none');
      } else {
        card.classList.add('d-none');
      }
    });
  }

  if (applyFilterBtn) {
    applyFilterBtn.addEventListener('click', applyFilters);
  }

  // Также добавим сброс фильтров (чтобы при нажатии "Сбросить" возвращались все карточки)
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      setTimeout(() => {
        uniCards.forEach(card => card.classList.remove('d-none'));
      }, 10);
    });
  }
});