import puppeteer from 'puppeteer';

export const fillInsuranceOrder = async (orderData) => {
  const browser = await puppeteer.launch({
    headless: false, // Для тестів краще бачити, що він робить
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Знову заходимо і шукаємо авто, щоб дійти до списку цін
    await page.goto('https://avtocivilka-insurance.eua.in.ua/', { waitUntil: 'networkidle2' });
    await page.type('#autoNumberSearch', orderData.plateNumber);
    await page.click('#btnCalculateNumber');

    // 2. Чекаємо на список і клікаємо кнопку "Купити" у потрібній компанії
    // Допустимо, ми передаємо index (наприклад, 0 для першої компанії в списку)
    const buttonSelector = `tr.Table__row:nth-child(${orderData.offerIndex + 1}) button`;
    await page.waitForSelector(buttonSelector);
    await page.click(buttonSelector);

    // 3. Обробка модального вікна (якщо воно з'являється)
    // Зазвичай там кнопка "Продовжити" або подібна
    await new Promise(r => setTimeout(r, 1000)); 
    const modalButton = '.Modal__footer button, .btn-continue'; // селектор залежить від конкретної компанії
    if (await page.$(modalButton)) {
        await page.click(modalButton);
    }

    // 4. ОЧІКУЄМО СТОРІНКУ ОФОРМЛЕННЯ (ту, що ти кинув у HTML)
    await page.waitForSelector('#customerLastName', { timeout: 20000 });

    // 5. ЗАПОВНЕННЯ ОСОБИСТИХ ДАНИХ
    await page.type('#customerLastName', orderData.lastName);
    await page.type('#customerFirstName', orderData.firstName);
    await page.type('#customerMiddleName', orderData.middleName);
    await page.type('#customerCode', orderData.ipn); // ІПН
    await page.type('#customerBirthday', orderData.birthday); // дд.мм.рррр
    await page.type('#customerPhone', orderData.phone); // +380...
    await page.type('#customerEmail', orderData.email);

    // 6. ВИБІР ТИПУ ДОКУМЕНТА (складна частина, бо це кастомний Select)
    await page.click('#customerDocumentType'); // Відкриваємо випадаючий список
    const docTypeMap = {
      'passport': 'PASSPORT',
      'id': 'ID_PASSPORT',
      'driver': 'DRIVING_LICENSE'
    };
    const docValue = docTypeMap[orderData.docType];
    await page.click(`input[value="${docValue}"]`); // Клікаємо по потрібному документу

    // 7. ДАНІ ДОКУМЕНТА
    await page.type('#customerDocumentSeries', orderData.docSeries);
    await page.type('#customerDocumentNumber', orderData.docNumber);
    await page.type('#customerDocumentIssuedBy', orderData.docIssuedBy);
    await page.type('#customerDocumentDate', orderData.docDate);

    // 8. АДРЕСА
    await page.type('#place', orderData.city); 
    // Тут уважно: сайт може вибити підказку, можливо треба буде додати паузу
    await page.type('#addressStreet', orderData.street);
    await page.type('#addressHouseNumber', orderData.house);
    await page.type('#addressApartmentNumber', orderData.flat);

    console.log('✅ Форма заповнена, чекаю на фінальну перевірку користувачем');
    
    // 9. КНОПКА "ОФОРМИТИ" (зазвичай внизу)
    // await page.click('.Contract__submit button'); 

    // browser.close(); // Поки не закривай, щоб перевірити результат
    return { success: true };

  } catch (error) {
    console.error('❌ Помилка при заповненні:', error);
    // await browser.close();
    return { success: false, error: error.message };
  }
};