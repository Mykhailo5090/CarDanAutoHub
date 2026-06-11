import puppeteer from "puppeteer";

export const fillInsuranceOrder = async (orderData) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://avtocivilka-insurance.eua.in.ua/", {
      waitUntil: "networkidle2",
    });
    await page.type("#autoNumberSearch", orderData.plateNumber);
    await page.click("#btnCalculateNumber");

    const buttonSelector = `tr.Table__row:nth-child(${orderData.offerIndex + 1}) button`;
    await page.waitForSelector(buttonSelector);
    await page.click(buttonSelector);

    await new Promise((r) => setTimeout(r, 1000));
    const modalButton = ".Modal__footer button, .btn-continue";
    if (await page.$(modalButton)) {
      await page.click(modalButton);
    }

    await page.waitForSelector("#customerLastName", { timeout: 20000 });

    await page.type("#customerLastName", orderData.lastName);
    await page.type("#customerFirstName", orderData.firstName);
    await page.type("#customerMiddleName", orderData.middleName);
    await page.type("#customerCode", orderData.ipn); // ІПН
    await page.type("#customerBirthday", orderData.birthday); // дд.мм.рррр
    await page.type("#customerPhone", orderData.phone); // +380...
    await page.type("#customerEmail", orderData.email);

    await page.click("#customerDocumentType");
    const docTypeMap = {
      passport: "PASSPORT",
      id: "ID_PASSPORT",
      driver: "DRIVING_LICENSE",
    };
    const docValue = docTypeMap[orderData.docType];
    await page.click(`input[value="${docValue}"]`);

    await page.type("#customerDocumentSeries", orderData.docSeries);
    await page.type("#customerDocumentNumber", orderData.docNumber);
    await page.type("#customerDocumentIssuedBy", orderData.docIssuedBy);
    await page.type("#customerDocumentDate", orderData.docDate);

    await page.type("#place", orderData.city);

    await page.type("#addressStreet", orderData.street);
    await page.type("#addressHouseNumber", orderData.house);
    await page.type("#addressApartmentNumber", orderData.flat);

    console.log(" Форма заповнена, чекаю на фінальну перевірку користувачем");

    return { success: true };
  } catch (error) {
    console.error(" Помилка при заповненні:", error);

    return { success: false, error: error.message };
  }
};
