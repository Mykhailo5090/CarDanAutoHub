/**
 *
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Array>}
 */
export const parseInsuranceOffers = async (page) => {
  try {
    const cardSelector = "article.product-card";
    await page.waitForSelector(cardSelector, { timeout: 30000 });

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.85));
      await new Promise((r) => setTimeout(r, 800));
    }

    const offers = await page.evaluate((cardSel) => {
      const results = [];
      const cards = document.querySelectorAll(cardSel);
      const seenUrls = new Set();

      cards.forEach((card) => {
        try {
          if (card.parentElement.closest("article.product-card")) {
            return;
          }

          const linkEl = card.querySelector(".product-card-body__title a");
          const url = linkEl ? linkEl.href : null;

          if (!url || seenUrls.has(url)) return;

          const imgEl = card.querySelector(
            ".product-card-body__logo-wrapper img",
          );
          let company = "НЕВІДОМА СК";
          let logoUrl = "";

          if (imgEl) {
            company = imgEl.getAttribute("alt")
              ? imgEl.getAttribute("alt").trim()
              : "НЕВІДОМА СК";
            const rawLogo =
              imgEl.getAttribute("src") || imgEl.getAttribute("srcset") || "";

            if (rawLogo && !rawLogo.startsWith("data:")) {
              logoUrl = rawLogo.startsWith("http")
                ? rawLogo
                : `https://hotline.finance${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;
            }
          } else {
            const titleEl = card.querySelector(
              ".product-card-body__logo-title p, .product-card-body__logoTitle",
            );
            company = titleEl ? titleEl.innerText.trim() : "НЕВІДОМА СК";
          }

          let price = "0";
          let franchise = "Не вказано";

          const gridCells = card.querySelectorAll(
            ".product-card-body-grid__cell",
          );
          gridCells.forEach((cell) => {
            const labelText =
              cell
                .querySelector(".product-card-body-grid__label")
                ?.textContent?.trim() || "";
            const valueSpan = cell.querySelector(
              ".product-card-body-grid__value span",
            );
            const valueText = valueSpan ? valueSpan.textContent.trim() : "";

            if (labelText.includes("Ціна")) {
              price = valueText.replace(/\D/g, "") || "0";
            } else if (labelText.includes("Франшиза")) {
              franchise = valueText || "0 ₴";
            }
          });

          const advantagesText = Array.from(
            card.querySelectorAll(".product-card-body__advantages li"),
          ).map((li) => li.textContent?.trim() || "");

          const directSettlement = advantagesText.some((text) =>
            text.includes("Пряме врегулювання"),
          );
          const assistance = advantagesText.some(
            (text) =>
              text.includes("Асистанс") || text.includes("Підтримка 24/7"),
          );

          const isPremium =
            card.classList.contains("premium") ||
            !!card.querySelector(".premium\\:flex");

          seenUrls.add(url);

          results.push({
            name: company,
            company: company,
            logo: logoUrl,
            franchise,
            price,
            currency: "UAH",
            isPremium,
            features: { directSettlement, assistance },
            url,
          });
        } catch (cardError) {
          console.error("Помилка парсингу окремої картки:", cardError);
        }
      });

      return results;
    }, cardSelector);

    return offers;
  } catch (error) {
    console.error(" Помилка", error);
    return [];
  }
};
