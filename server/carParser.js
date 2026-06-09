/**
 * 
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Object>}
 */
export const parseVehicleModalData = async (page) => {
    // console.log(' Очікуємо появу модального вікна з даними авто...');
    
    // Селектори для першої модалки (дані ТЗ)
    const firstModalContent = '.ui-modal__content, [class*="transportModalContent"]';
    const firstContinueBtn = 'button[data-qa="searchByNumberBuyButton"]';
    
    // Селектор для другої модалки (термін оформлення)
    const secondModalSelector = '[class*="additionalModal"], [class*="policy-term-modal"]';
    const secondContinueBtn = 'button[data-qa="temporaryPeriodrBuyButton"]';
    
    try {
      // ----------------------------------------------------
      // КРОК 1: ОБРОБКА ПЕРШОЇ МОДАЛКИ (ДАНІ МВС)
      // ----------------------------------------------------
      await page.waitForSelector(firstModalContent, { visible: true, timeout: 12000 });
      // console.log(' Перше модальне вікно ');
  
      await new Promise(r => setTimeout(r, 500));
  
      // Витягуємо дані про машину
      const carDetails = await page.evaluate(() => {
        const titleBlock = document.querySelector('[class*="transportModalContent"] [class*="__title"]');
        let vehicleType = '';
        let vehicleModel = '';
        
        if (titleBlock) {
          const spans = titleBlock.querySelectorAll('span');
          if (spans.length >= 1) vehicleType = spans[0].innerText.trim();
          if (spans.length >= 2) vehicleModel = spans[1].innerText.trim();
        }
  
        const cityElement = document.querySelector('[class*="cityName"]');
        const registrationPlace = cityElement ? cityElement.innerText.trim() : '';
  
        const numberElement = document.querySelector('[class*="stateNumber"] strong');
        const plateNumber = numberElement ? numberElement.innerText.trim() : '';
  
        return {
          success: true,
          type: vehicleType,
          model: vehicleModel,
          region: registrationPlace,
          plate: plateNumber
        };
      });
  
      console.log(` court ТЗ: ${carDetails.model}`);
  

      // console.log('кнопка на першій модалці');
      await page.waitForSelector(firstContinueBtn, { visible: true });
      await page.click(firstContinueBtn);
      
      // ----------------------------------------------------
      // КРОК 2: ОБРОБКА ДРУГОЇ МОДАЛКИ (ТЕРМІН ОФОРМЛЕННЯ)
      // ----------------------------------------------------
    
      
      // Чекаємо, поки з'явиться кнопка або сама форма другої модалки
      await page.waitForSelector(secondContinueBtn, { visible: true, timeout: 5000 });
      // console.log('Друга модалка з\'явилася.');
  
      // Невеликий таймаут, щоб інтерфейс не "зажував" клік
      await new Promise(r => setTimeout(r, 500));
  

      await page.click(secondContinueBtn);
  
      // console.log('підтверджено');
      return carDetails;
  
    } catch (err) {
      console.error(' Помилка модальних ', err.message);
      return { 
        success: false, 
        error: "-------",
        details: err.message 
      };
    }
  };