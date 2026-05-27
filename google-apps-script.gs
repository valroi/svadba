/**
 * Свадебный сайт Валера & Алина — приём анкет в Google Sheets
 *
 * ════════════════════════════════════════════════════════════
 * КАК НАСТРОИТЬ (5 минут):
 * ════════════════════════════════════════════════════════════
 *
 * 1. Открой таблицу:
 *    https://docs.google.com/spreadsheets/d/1BTDktf-rC8N-8UCWjvQym2F66I_YerbTwmheBUIbwsA/edit
 *
 * 2. Меню «Расширения» → «Apps Script»
 *
 * 3. Удали весь код в редакторе и вставь содержимое этого файла
 *
 * 4. Проверь, что переменная SHEET_NAME ниже = 'состав участников'
 *    (это имя листа в твоей таблице)
 *
 * 5. Жми «Развернуть» (Deploy) → «Новое развертывание»
 *     - Тип:        Веб-приложение
 *     - Описание:   Wedding RSVP
 *     - Выполнять от имени: «Я» (твой аккаунт)
 *     - Кто имеет доступ: «Все» (Anyone)
 *    Нажми «Развернуть».
 *
 * 6. Google попросит авторизацию → разреши доступ к таблицам.
 *
 * 7. Скопируй ВЕБ-АДРЕС (URL) из появившегося окна.
 *    Он выглядит примерно так:
 *    https://script.google.com/macros/s/AKfycby....../exec
 *
 * 8. Пришли мне этот URL — я подставлю его в сайт.
 *
 * ════════════════════════════════════════════════════════════
 */

const SHEET_NAME = 'состав участников';   // имя листа в таблице

function doPost(e) {
  try {
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    let sheet    = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Если лист пустой — пишем заголовки
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата заявки',
        'Имя',
        'Придёт',
        'Со спутниками',
        'Аллергия',
        'Алкоголь',
        'Пожелание',
        'User-Agent'
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);
    const date = new Date(data.ts || new Date());

    sheet.appendRow([
      Utilities.formatDate(date, 'Europe/Moscow', 'dd.MM.yyyy HH:mm'),
      data.name      || '',
      data.attend === 'yes' ? 'Да' : 'Нет',
      data.companion || '',
      data.allergy   || '',
      data.alcohol   || '',
      data.wishes    || '',
      data.ua        || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Wedding RSVP endpoint is alive')
    .setMimeType(ContentService.MimeType.TEXT);
}
