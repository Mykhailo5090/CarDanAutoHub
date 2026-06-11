/**
 *
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export const parseVehicleModalData = async (page) => {
  const firstModalContent =
    '.ui-modal__content, [class*="transportModalContent"]';
  const firstContinueBtn = 'button[data-qa="searchByNumberBuyButton"]';

  const secondModalSelector =
    '[class*="additionalModal"], [class*="policy-term-modal"]';
  const secondContinueBtn = 'button[data-qa="temporaryPeriodrBuyButton"]';

  try {
    await page.waitForSelector(firstModalContent, {
      visible: true,
      timeout: 12000,
    });

    await new Promise((r) => setTimeout(r, 500));

    //  дані про машину
    const carDetails = await page.evaluate(() => {
      const titleBlock = document.querySelector(
        '[class*="transportModalContent"] [class*="__title"]',
      );
      let vehicleType = "";
      let vehicleModel = "";

      if (titleBlock) {
        const spans = titleBlock.querySelectorAll("span");
        if (spans.length >= 1) vehicleType = spans[0].innerText.trim();
        if (spans.length >= 2) vehicleModel = spans[1].innerText.trim();
      }

      const cityElement = document.querySelector('[class*="cityName"]');
      const registrationPlace = cityElement ? cityElement.innerText.trim() : "";

      const numberElement = document.querySelector(
        '[class*="stateNumber"] strong',
      );
      const plateNumber = numberElement ? numberElement.innerText.trim() : "";

      return {
        success: true,
        type: vehicleType,
        model: vehicleModel,
        region: registrationPlace,
        plate: plateNumber,
      };
    });

    console.log(` court ТЗ: ${carDetails.model}`);

    await page.waitForSelector(firstContinueBtn, { visible: true });
    await page.click(firstContinueBtn);

    await page.waitForSelector(secondContinueBtn, {
      visible: true,
      timeout: 5000,
    });

    await new Promise((r) => setTimeout(r, 500));

    await page.click(secondContinueBtn);

    return carDetails;
  } catch (err) {
    console.error(" Помилка модальних ", err.message);
    return {
      success: false,
      error: "-------",
      details: err.message,
    };
  }
};
