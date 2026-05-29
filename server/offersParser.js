/**
 * Парсер результатів страхування для Hotline.finance
 * @param {import('puppeteer').Page} page 
 * @returns {Promise<Array>} Список знайдених пропозицій
 */
export const parseInsuranceOffers = async (page) => {
    console.log('🔍 Починаємо збір страхових пропозицій...');
  
    try {
      // 1. Очікуємо появи хоча б однієї картки продукту на сторінці
      console.log('⏳ Очікуємо завантаження карток із цінами...');
      await page.waitForSelector('.product-card, [class*="product-card"]', { timeout: 30000 });
      
      // Робимо невеликий скрол і паузу, щоб переконатися, що всі елементи підвантажились
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 1500));
  
      // 2. Збираємо дані з карток
      const offers = await page.evaluate(() => {
        const results = [];
        // Шукаємо всі блоки статей (карток), які мають клас продукту
        const cards = document.querySelectorAll('article.product-card, [class*="product-card"]');
  
        cards.forEach((card) => {
          try {
            // --- Назва компанії ---
            // Спочатку шукаємо картинку-логотип і беремо її alt
            const imgEl = card.querySelector('.product-card-body__picture img, img[alt]');
            let company = '';
            if (imgEl && imgEl.getAttribute('alt')) {
              company = imgEl.getAttribute('alt').trim();
            } else {
              // Якщо картинки немає, шукаємо текстовий блок з назвою
              const titleEl = card.querySelector('.product-card-body__logo-title, .product-card-body__logoTitle');
              company = titleEl ? titleEl.innerText.trim() : 'НЕВІДОМА СК';
            }
  
            // --- Ціна ---
            // Шукаємо блок із ціною за допомогою data-qa атрибуту, який є в коді
            const priceContainer = card.querySelector('[data-qa="productCardPrice"]');
            let price = null;
  
            if (priceContainer) {
              // Витягуємо текст (наприклад "7 539 ₴" або "7&nbsp;539 ₴")
              const priceText = priceContainer.innerText || '';
              // Залишаємо тільки цифри
              const cleanPrice = priceText.replace(/[^\d]/g, '');
              if (cleanPrice) {
                price = parseInt(cleanPrice, 10);
              }
            }
  
            // --- Франшиза ---
            let franchise = 'Не вказано';
            // Шукаємо блоки осередків специфікацій
            const gridCells = card.querySelectorAll('.product-card-body-grid__cell');
            gridCells.forEach((cell) => {
              const labelEl = cell.querySelector('.product-card-body-grid__label');
              if (labelEl && labelEl.innerText.includes('Франшиза')) {
                const valueEl = cell.querySelector('.product-card-body-grid__value');
                if (valueEl) {
                  franchise = valueEl.innerText.replace(/\s+/g, ' ').trim();
                }
              }
            });
  
            // Якщо ціну успішно знайшли, додаємо в масив результатів
            if (price && price > 0) {
              results.push({
                company: company.toUpperCase(),
                price: price,
                franchise: franchise,
                currency: 'UAH'
              });
            }
          } catch (cardError) {
            // Якщо якась одна картка зламається, інші продовжать парситися
            console.error('Помилка парсингу картки:', cardError.message);
          }
        });
  
        return results;
      });
  
      console.log(`✅ Успішно зібрано пропозицій: ${offers.length}`);
      console.table(offers);
  
      return offers;
  
    } catch (err) {
      console.error('❌ Помилка під час виконання парсингу пропозицій:', err.message);
      return [];
    }
  };