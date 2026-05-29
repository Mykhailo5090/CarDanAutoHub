import { chromium } from 'playwright'; 
// Примітка: Нижче реалізація на puppeteer-extra, яка найкраще обходить reCAPTCHA v3
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';


// Підключаємо stealth плагін для приховування автоматизації та проходження рекапчі
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

export const getInsuranceOffersFromPolis = async (data) => {
  let plate = typeof data === 'object' ? data.plateNumber || data.plate : data;
  plate = normalizePlate(plate);

  // Обов'язково запускаємо з плагіном puppeteer-extra
  const browser = await puppeteer.launch({
    headless: false, // На етапі тестів тримаємо false, щоб бачити форму
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1400,900',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    defaultViewport: { width: 1400, height: 900 }
  });

  try {
    const page = await browser.newPage();
    
    // Встановлюємо реалістичний юзер-агент
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`🚀 Перехід на сторінку автоцивілки...`);
    // Оскільки форма калькулятора зазвичай на внутрішній сторінці ОСЦПВ:
    await page.goto('https://polis.ua/osago', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Обробка модального вікна вибору мови (якщо воно перекриває екран, як у твоєму HTML)
    try {
      // Шукаємо кнопку "Так" або "Ні" у попапі мови, щоб закрити його
      const closePopupBtn = await page.waitForSelector('.LocalePopupModule_btns__VXjlD button', { timeout: 4000 });
      if (closePopupBtn) {
        await closePopupBtn.click();
        await new Promise(r => setTimeout(r, 500));
        console.log('✨ Попап мови закрито');
      }
    } catch (e) {
      // Якщо попап не з'явився — йдемо далі
    }

    console.log(`🔍 Шукаємо поле вводу для номера: ${plate}`);

    // Селектори підбираються під конкретну сторінку /osago. 
    // Зазвичай це інпут типу text з плейсхолдером або маскою AA1234AA
    const inputSelector = 'input[placeholder*="1234"], input[name="plate"], input[type="text"]';
    await page.waitForSelector(inputSelector, { visible: true, timeout: 15000 });
    
    await page.focus(inputSelector);
    // Очищаємо поле
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    // Вводимо номер з імітацією затримок реальної людини
    await page.type(inputSelector, plate, { delay: 120 });
    console.log('⌨️ Номер успішно введено в поле калькулятора');

    await new Promise(r => setTimeout(r, 800));

    // Шукаємо кнопку старту розрахунку
    // На Next.js сайтах вони часто помаранчеві (клас Button_orange як у твоєму коді)
    const submitButtonSelector = 'button[type="submit"], button.Button_orange';
    await page.waitForSelector(submitButtonSelector, { visible: true });
    
    console.log('⚡ Натискаємо кнопку отримання результатів...');
    await page.click(submitButtonSelector);

    // Очікування перенаправлення на сторінку видачі результатів (довгий запит через капчу)
    console.log('⏳ Очікуємо відповіді від страхових (проходження reCAPTCHA)...');
    
    // На сторінці результатів Polis.ua зазвичай з'являються картки з логотипами СК та кнопками "Купити"
    await page.waitForFunction(
      () => {
        const hasCards = document.querySelectorAll('[class*="Card"], [class*="Offer"], .insurance-card').length > 3;
        const loadedPrices = document.body.innerText.includes('грн');
        return hasCards || loadedPrices;
      },
      { timeout: 50000 }
    );

    // Коротка пауза для фіксації динамічних цін
    await new Promise(r => setTimeout(r, 3000));

    // Парсинг результуючої сітки пропозицій
    const result = await page.evaluate(() => {
      // Шукаємо блоки карток пропозицій (селектори будуть адаптивні на основі поширених контейнерів)
      const items = Array.from(document.querySelectorAll('[class*="OfferRow"], [class*="CompanyCard"], .card'));
      
      const packages = items.map((item, index) => {
        const img = item.querySelector('img');
        const textContent = item.innerText || '';
        
        // Шукаємо ціну
        const priceMatch = textContent.replace(/\s/g, '').match(/(\d+)\s?грн/);
        const price = priceMatch ? Number(priceMatch[1]) : 0;

        // Шукаємо франшизу
        const franchiseMatch = textContent.match(/(?:франшиза|франшиза:)\s*(\d+)/i);
        const franchise = franchiseMatch ? franchiseMatch[1] : '0';

        return {
          id: index + 1,
          name: img?.alt || 'Страхова компанія',
          logo: img?.src || '',
          price: price,
          franchise: franchise
        };
      }).filter(p => p.price > 100); // Прибираємо пусті або невалідні блоки

      return { packages };
    });

    console.log(`✅ Успішно зібрано пропозицій: ${result.packages.length}`);
    await browser.close();
    return { success: true, ...result };

  } catch (error) {
    console.error('❌ Помилка роботи парсера:', error.message);
    if (browser) {
      // Зберігаємо скріншот для відладки, якщо щось пішло не так
      const pages = await browser.pages();
      if (pages.length > 0) {
        await pages[0].screenshot({ path: 'polis_scraping_error.png', fullPage: true });
      }
      await browser.close();
    }
    return { success: false, message: error.message, packages: [] };
  }
};