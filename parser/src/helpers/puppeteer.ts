import puppeteer, { Browser, Page, PuppeteerLifeCycleEvent } from 'puppeteer';
import chalk from 'chalk';

interface I_PAGE_PUPPETEER_OPTS {
  waitUntil: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[] | undefined;
  timeout: number;
}

interface I_LAUNCH_PUPPETEER_OPTS {
  headless: boolean;
  args: string[];
}

const LAUNCH_PUPPETEER_OPTS: I_LAUNCH_PUPPETEER_OPTS = {
  headless: false,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080',
  ],
};

const PAGE_PUPPETEER_OPTS: I_PAGE_PUPPETEER_OPTS = {
  waitUntil: 'networkidle2',
  timeout: 5000000,
};

const acceptAllCookies = async (page: Page) => {
  try {
    const isElemPresent = await page.evaluate(() => {
      return !!document.querySelector('#onetrust-banner-sdk');
    });

    if (isElemPresent) {
      await page.waitForSelector('#onetrust-banner-sdk', { timeout: 60000 });
      if (!page.isClosed()) {
        await page.click('#onetrust-accept-btn-handler');
        return true;
      } else {
        throw new Error(chalk.red('Page is closed'));
      }
    } else {
      console.log(chalk.red('Cookie banner not found'));
      return false;
    }
  } catch (e) {
    throw e;
  }
};

const getPageContent = async (url: string) => {
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTS);
    await acceptAllCookies(page);
    const content = await page.content();
    await browser.close();

    return content;
  } catch (e) {
    if (browser) {
      await browser.close();
    }
    throw e;
  }
};

export { getPageContent };
