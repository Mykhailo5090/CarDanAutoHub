import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { parseVehicleModalData } from "./carParser.js";

import { parseInsuranceOffers } from "./offersParser.js";

puppeteer.use(StealthPlugin());

const normalizePlate = (plate) => {
  const map = {
    A: "А",
    B: "В",
    C: "С",
    E: "Е",
    H: "Н",
    I: "І",
    K: "К",
    M: "М",
    O: "О",
    P: "Р",
    T: "Т",
    X: "Х",
  };
  return plate
    .toUpperCase()
    .replace(/\s/g, "")
    .split("")
    .map((char) => map[char] || char)
    .join("");
};

export const getInsuranceOffers = async (data) => {
  let plate = typeof data === "object" ? data.plateNumber || data.plate : data;
  if (!plate) return { success: false, message: "Номер авто не передано" };

  plate = normalizePlate(plate);
  console.log(` start номера: ${plate}`);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true, //  false
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1400,900",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
      defaultViewport: { width: 1400, height: 900 },
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.goto("https://hotline.finance/osago", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    const inputSelector =
      'input[placeholder*="AA"], input[placeholder*="АА"], input[name="plate"]';
    await page.waitForSelector(inputSelector, {
      visible: true,
      timeout: 15000,
    });

    await page.focus(inputSelector);
    await page.click(inputSelector, { clickCount: 3 });
    await page.keyboard.press("Backspace");

    await page.type(inputSelector, plate, { delay: 150 });
    await new Promise((r) => setTimeout(r, 800));

    const submitButtonSelector =
      'form button[type="submit"], button[class*="Button_orange"], button[class*="submit"]';
    await page.waitForSelector(submitButtonSelector, { visible: true });

    await page.click(submitButtonSelector);

    const vehicleInfo = await parseVehicleModalData(page);

    await new Promise((r) => setTimeout(r, 5000));

    const insuranceOffers = await parseInsuranceOffers(page);

    await browser.close();

    return {
      success: true,
      vehicle: vehicleInfo,
      offers: insuranceOffers,
      message: `Успішно знайдено ${insuranceOffers.length} пропозицій для ${vehicleInfo.model || "авто"}`,
    };
  } catch (error) {
    console.error(" Виникла помилка в головному потоці:", error.message);
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          await pages[0].screenshot({
            path: "hotline_error_screenshot.png",
            fullPage: true,
          });
          console.log(" Скріншот ");
        }
      } catch (sErr) {}
      await browser.close();
    }
    return { success: false, message: error.message };
  }
};

export const createPolisContract = async (contractData) => {
  return { success: true, message: " створення контракту" };
};
