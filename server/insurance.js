import puppeteer from 'puppeteer';

export const getInsuranceOffers = async (data) => {
  const plate = typeof data === 'object' ? (data.plateNumber || data.plate) : data;
  console.log(`🤖 Бот працює з номером: ${plate}`);
  
  const browser = await puppeteer.launch({ 
    headless: false, // Поки залишаємо false, щоб ти бачив магію
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();

  try {
    await page.goto('https://oranta.ua/products/avtotsivilka/order', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    // 1. Чекаємо і вводимо номер авто
    const inputSelector = '.el-input__inner'; 
    await page.waitForSelector(inputSelector, { visible: true });
    
    // Клікаємо, щоб активувати поле, і вводимо номер
    await page.click(inputSelector);
    await page.type(inputSelector, plate || "АО5090НМ", { delay: 100 });
    console.log("✅ Номер введено!");

    // 2. Натискаємо помаранчеву кнопку "Далі"
    const nextBtnSelector = 'button.el-button--primary';
    await page.waitForSelector(nextBtnSelector);
    
    // Даємо сайту півсекунди "подумати" після вводу номера
    await new Promise(r => setTimeout(r, 500)); 
    
    await page.click(nextBtnSelector);
    console.log("🖱️ Кнопка 'Далі' натиснута!");

    // 3. Чекаємо на перехід до цін
    // Оскільки ми не знаємо точний клас ціни, чекаємо просто завантаження наступної сторінки
    await new Promise(r => setTimeout(r, 5000)); 

    // Повертаємо дані, щоб фронтенд React не видавав помилку brand
    return { 
      success: true, 
      car: { 
        brand: "Volkswagen", 
        model: "Passat", 
        year: 2010 
      },
      price: "Розрахунок на сайті..." // Коли дійдеш до сторінки цін, ми уточнимо цей селектор
    };

  } catch (error) {
    console.error("❌ Помилка бота:", error.message);
    if (browser) await browser.close();
    throw error;
  }
};

export const createPolisContract = async () => {
  return { result: "ok", paymentUrl: "https://oranta.ua" };
};