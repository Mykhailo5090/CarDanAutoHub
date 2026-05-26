import puppeteer from 'puppeteer';

export const getInsuranceOffers = async (data) => {
    const plate = typeof data === 'object' ? data.plateNumber || data.plate : data;
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  
    const page = await browser.newPage();
  
    try {
      await page.goto('https://avtocivilka-insurance.eua.in.ua/', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });
  
      await page.waitForSelector('#autoNumberSearch');
      await page.type('#autoNumberSearch', plate, { delay: 50 });
      await page.click('#btnCalculateNumber');
  
      // Чекаємо на появу результатів
      await page.waitForSelector('.Listing__selected', { timeout: 30000 });
      
      // 1. ДІСТАЄМО НАЗВУ ТА РІК АВТО
      const carDetails = await page.evaluate(() => {
        const infoText = document.querySelector('.Listing__selected span')?.innerText || '';
        // infoText зазвичай: "Київ, автомобіль, 2015, MERCEDES-BENZ..."
        
        const parts = infoText.split(',').map(p => p.trim());
        const brandModel = parts[parts.length - 1] || "Невідоме авто";
        
        // Шукаємо рік (4 цифри підряд, що схожі на рік)
        const yearMatch = infoText.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? yearMatch[0] : '';
        
        return { brand: brandModel, year: year };
      });
  
      // Пауза, щоб Vue довантажив ціни в таблицю
      await new Promise(r => setTimeout(r, 2500));
  
      // 2. ПАРСИМО ПРОПОЗИЦІЇ (З ВИПРАВЛЕНОЮ ЦІНОЮ)
      const offers = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('tr.Table__row'));
  
        return rows.map((row, index) => {
          const logoImg = row.querySelector('.Table__cell_logo img');
          const logoUrl = logoImg?.src || '';
          
          // Логіка визначення назви компанії
          let companyName = 'Страхова компанія';
          if (logoUrl.includes('id=73')) companyName = 'BBS (ARX)';
          else if (logoUrl.includes('id=38')) companyName = 'INGO';
          else if (logoUrl.includes('id=456')) companyName = 'VUSO';
          else if (logoUrl.includes('id=116')) companyName = 'Оранта';
          else if (logoUrl.includes('id=32')) companyName = 'Інтер-Поліс';
  
          // --- ВИПРАВЛЕННЯ ЦІНИ ---
          const priceCell = row.querySelector('.Table__cell_price');
          if (!priceCell) return null;
  
          // Створюємо копію елемента ціни, щоб не псувати оригінал на сторінці
          const tempDiv = priceCell.cloneNode(true);
          
          // Видаляємо блок зі знижкою та блок з оплатою частинами
          tempDiv.querySelector('.Table__discount')?.remove();
          tempDiv.querySelector('.pay-part_container')?.remove();
          
          // Тепер у tempDiv залишився тільки текст основної ціни
          const rawPriceText = tempDiv.innerText;
          const cleanPrice = rawPriceText.replace(/\D/g, ''); // Залишаємо лише цифри ціни
  
          // Франшиза
          const franchise = row.querySelector('.Table__cell_franchise span')?.innerText || '0';
  
          return {
            id: index + 1,
            name: companyName,
            price: parseInt(cleanPrice, 10),
            logo: logoUrl,
            franchise: franchise
          };
        }).filter(pkg => pkg && pkg.price > 0);
      });
  
      await browser.close();
  
      return {
        success: true,
        car: {
          brand: carDetails.brand,
          year: carDetails.year, // Передаємо рік
          model: '' 
        },
        packages: offers,
      };
  
    } catch (error) {
      console.error('❌ Помилка:', error);
      await browser.close();
      return { success: false, packages: [] };
    }
  };

export const createPolisContract = async () => {
  return {
    result: 'success',
    mainCode: 'OK',
  };
};