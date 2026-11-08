const form = document.querySelector("#service-form");

const showProgram = document.querySelector("#show-program");
const program = document.querySelector("#program");

const dataError = document.querySelector("#data-error");
const choiceError = document.querySelector("#choice-error");

const result = document.querySelector("#result");
const reportJson = document.querySelector("#report-json");

form.hidden = false;
let data = null;

/**
 * Исходный JSON
 */
const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

/**
 * Используем filter для отбора услуг и map для создания нового массива объектов.
 * Внутри map извлекаем title и price одноуровневой деструктуризацией и очищаем title методом trim().
 * Сумму цен посчитываем через reduce. Исходные услуги не меняются.
 * filter – отбор,
 * map – преобразование,
 * reduce – сбор одного результата
 */
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
  // Словарь выбора статусов
  const checkedStates = {
    guide: guideChecked,
    audio: audioChecked,
    catalog: catalogChecked,
  };
  // Фильтруем выбор
  const selectedItems = services.filter((service) => checkedStates[service.id]);
  // Нормализуем данные
  const items = selectedItems.map(({ title, price }) => ({
    title: title.trim(),
    price,
  }));
  // Делаем подсчёт (складываем items)
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return {
    count: items.length,
    total: total,
    items: items,
  };
}

try {
  data = JSON.parse(sourceJson);
  // Заполнение данных карточки события из sourceJson
  document.querySelector("#event-title").textContent = data.event.title;
  document.querySelector("#event-date").textContent = data.event.date;
  document.querySelector("#event-place").textContent = data.event.place;
  document.querySelector("#event-description").textContent =
    data.event.description;

  data = JSON.parse(sourceJson);
  // Динамическое заполнение текстов лейблов из полученных данных 
  data.services.forEach((service) => {
    const label = document.querySelector("#label-" + service.id);
    if (label) {
      label.textContent = service.title + " (" + service.price + " руб.)";
    }
  });

  console.log("data:", data);

  showProgram.addEventListener("click", handleShowProgram);
  form.addEventListener("submit", handleFormSubmit);
} catch (error) {
  console.log("data-error:", error.message);
  // Обработка поврежденного исходного JSON
  dataError.textContent = "Ошибка данных.";
  dataError.hidden = false;
  // При ошибке данных форма должна оставаться скрытой
  form.hidden = true;
}

function handleShowProgram() {
  // Проверяем, что данные успешно распарсились, прежде чем их использовать
  if (data && data.event) {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
  }
}

// Обработчик отправки формы расчета
function handleFormSubmit(event) {
  event.preventDefault(); // Отмена перезагрузки страницы (чтобы не пропадали чекбоксы после submit)

  if (!data || !data.services) return;

  const isGuideChecked = document.querySelector("#guide").checked;
  const isAudioChecked = document.querySelector("#audio").checked;
  const isCatalogChecked = document.querySelector("#catalog").checked;

  console.log("checked:", isGuideChecked, isAudioChecked, isCatalogChecked);

  // Валидация: должен быть выбран хотя бы один чекбокс
  if (!isGuideChecked && !isAudioChecked && !isCatalogChecked) {
    choiceError.textContent = "Выберите хотя бы одну услугу.";
    choiceError.hidden = false;
    result.hidden = true;
    reportJson.hidden = true;
    return;
  }

  // Если выбор корректный — скрываем ошибку
  choiceError.hidden = true;
  // Расчет отчета
  const report = buildReport(
    data.services,
    isGuideChecked,
    isAudioChecked,
    isCatalogChecked,
  );
  // Формирование innerHTML для блока результатов. Тут let так как изменяем строку на лету
  let resultHtml =
    "Выбрано услуг: " + report.count + "<br>Итого: " + report.total + " руб.";
  report.items.forEach((item) => {
    resultHtml += "<br>" + item.title;
  });
  result.innerHTML = resultHtml;
  result.hidden = false;
  // Сериализация и валидация
  const jsonString = JSON.stringify(report);
  console.log("report:", report);
  try {
    JSON.parse(jsonString);
    reportJson.textContent = jsonString;
    reportJson.hidden = false;
  } catch (e) {
    choiceError.textContent = "Ошибка генерации JSON отчёта.";
    choiceError.hidden = false;
  }
}
