import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// Імпортуємо парсер модальних вікон (дані авто + термін)
import { parseVehicleModalData } from './carParser.js';
// Імпортуємо наш новий парсер результатів та цін
import { parseInsuranceOffers } from './offersParser.js';

puppeteer.use(StealthPlugin());

// Функція для нормалізації літер номера (переведення на укр розкладку)
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

export const getInsuranceOffers = async (data) => {
  let plate = typeof data === 'object' ? data.plateNumber || data.plate : data;
  if (!plate) return { success: false, message: "Номер авто не передано" };
  
  plate = normalizePlate(plate);
  console.log(`🚗 Початок пошуку для номера: ${plate}`);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false, // Тримаємо false, щоб бачити весь процес на власні очі
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
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`🌐 Переходимо на сторінку ОСЦПВ...`);
    await page.goto('https://hotline.finance/osago', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const inputSelector = 'input[placeholder*="AA"], input[placeholder*="АА"], input[name="plate"]';
    await page.waitForSelector(inputSelector, { visible: true, timeout: 15000 });
    
    await page.focus(inputSelector);
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    
    await page.type(inputSelector, plate, { delay: 150 });
    await new Promise(r => setTimeout(r, 800));

    const submitButtonSelector = 'form button[type="submit"], button[class*="Button_orange"], button[class*="submit"]';
    await page.waitForSelector(submitButtonSelector, { visible: true });
    
    console.log('⚡ Натискаємо кнопку розрахунку...');
    await page.click(submitButtonSelector);

    // ========================================================
    // КРОК 1: Проходимо обидві модалки та збираємо інфо про ТЗ
    // ========================================================
    const vehicleInfo = await parseVehicleModalData(page);
    // ========================================================
    console.log('⏳ Чекаємо 5 секунд, поки завантажаться картки з цінами...');
    await new Promise(r => setTimeout(r, 5000));

    // ========================================================
    // КРОК 2: Збираємо ціни та пропозиції страхових компаній
    // ========================================================
    const insuranceOffers = await parseInsuranceOffers(page);
    // ========================================================

    // Закриваємо браузер після виконання всіх етапів
    await browser.close();
    
    // Повертаємо чистий результат на твій сайт або в Postman
    return { 
      success: true, 
      vehicle: vehicleInfo, 
      offers: insuranceOffers,
      message: `Успішно знайдено ${insuranceOffers.length} пропозицій для ${vehicleInfo.model || 'авто'}` 
    };

  } catch (error) {
    console.error('❌ Виникла помилка в головному потоці:', error.message);
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          await pages[0].screenshot({ path: 'hotline_error_screenshot.png', fullPage: true });
          console.log('📸 Скріншот помилки збережено в корінь проекту.');
        }
      } catch (sErr) {}
      await browser.close();
    }
    return { success: false, message: error.message };
  }
};

export const createPolisContract = async (contractData) => {
  return { success: true, message: "Заглушка створення контракту" };
};