import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Підключаємо stealth плагін для приховування автоматизації
puppeteer.use(StealthPlugin());

const normalizePlate = (plate) => {
  const map = {
    A: 'А', B: 'В', C: 'С', E: 'Е', H: 'Н', I: 'І', K: 'К', M: 'М', O: 'О', P: 'Р', T: 'Т', X: 'Х',
  };
  return plate
    .toUpperCase()
    .replace(/\s/g, '')
    .split('')
    .map((char) => map[char] || char)
    .join('');
};

// Експортуємо правильну назву, яку шукає роутер
export const getInsuranceOffers = async (data) => {
  let plate = typeof data === 'object' ? data.plateNumber || data.plate : data;
  plate = normalizePlate(plate);

  let browser; // Оголошуємо тут, щоб змінна була доступна в блоці catch

  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1400,900',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`🚀 Перехід на сторінку автоцивілки...`);
    await page.goto('https://polis.ua/osago', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    try {
      const closePopupBtn = await page.waitForSelector('.LocalePopupModule_btns__VXjlD button', { timeout: 4000 });
      if (closePopupBtn) {
        await closePopupBtn.click();
        await new Promise(r => setTimeout(r, 500));
        console.log('✨ Попап мови закрито');
      }
    } catch (e) {}

    console.log(`🔍 Шукаємо поле вводу для номера: ${plate}`);
    const inputSelector = 'input[placeholder*="1234"], input[name="plate"], input[type="text"]';
    await page.waitForSelector(inputSelector, { visible: true, timeout: 15000 });
    
    await page.focus(inputSelector);
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    await page.type(inputSelector, plate, { delay: 120 });
    console.log('⌨️ Номер успішно введено в поле калькулятора');

    await new Promise(r => setTimeout(r, 800));

    const submitButtonSelector = 'button[type="submit"], button.Button_orange';
    await page.waitForSelector(submitButtonSelector, { visible: true });
    
    console.log('⚡ Натискаємо кнопку отримання результатів...');
    await page.click(submitButtonSelector);

    console.log('⏳ Очікуємо відповіді від страхових (проходження reCAPTCHA)...');
    await page.waitForFunction(
      () => {
        const hasCards = document.querySelectorAll('[class*="Card"], [class*="Offer"], .insurance-card').length > 3;
        const loadedPrices = document.body.innerText.includes('грн');
        return hasCards || loadedPrices;
      },
      { timeout: 50000 }
    );

    await new Promise(r => setTimeout(r, 3000));

    const result = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('[class*="OfferRow"], [class*="CompanyCard"], .card'));
      
      const packages = items.map((item, index) => {
        const img = item.querySelector('img');
        const textContent = item.innerText || '';
        
        const priceMatch = textContent.replace(/\s/g, '').match(/(\d+)\s?грн/);
        const price = priceMatch ? Number(priceMatch[1]) : 0;

        const franchiseMatch = textContent.match(/(?:франшиза|франшиза:)\s*(\d+)/i);
        const franchise = franchiseMatch ? franchiseMatch[1] : '0';

        return {
          id: index + 1,
          name: img?.alt || 'Страхова компанія',
          logo: img?.src || '',
          price: price,
          franchise: franchise
        };
      }).filter(p => p.price > 100);

      return { packages };
    });

    console.log(`✅ Успішно зібрано пропозицій: ${result.packages.length}`);
    await browser.close();
    return { success: true, ...result };

  } catch (error) {
    console.error('❌ Помилка роботи парсера:', error.message);
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          await pages[0].screenshot({ path: 'polis_scraping_error.png', fullPage: true });
        }
      } catch (sErr) {}
      await browser.close();
    }
    return { success: false, message: error.message, packages: [] };
  }
};

// Додаємо експорт цієї функції, яку вимагає твій routes/insurance.js
export const createPolisContract = async (contractData) => {
  console.log('📝 Запит на створення контракту отримано:', contractData);
  // Тут буде твоя логіка відправки контракту, наразі повертаємо успішну заглушку
  return { success: true, result: "success", message: "Контракт ініційовано" };
};