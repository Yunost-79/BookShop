import puppeteer, { Browser, Page, PuppeteerLifeCycleEvent } from 'puppeteer';
import chalk from 'chalk';
import { Cluster } from 'puppeteer-cluster';

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
  waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
  timeout: 3000000,
};

const acceptAllCookies = async (page: Page) => {
  try {
    const isElemPresent = await page.evaluate(() => {
      return !!document.querySelector('#onetrust-banner-sdk');
    });

    if (isElemPresent) {
      await page.waitForSelector('#onetrust-consent-sdk');
      if (!page.isClosed()) {
        await page.click('#onetrust-reject-all-handler');
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
    // const cluster = await Cluster.launch({
    //   concurrency: Cluster.CONCURRENCY_CONTEXT,
    //   maxConcurrency: 10,
    // });

    // await cluster.task(async ({page, data: url})=>{
    //     await page.goto(url)
    // })

    // ===============================================================
    browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    const page = await browser.newPage();
    await page.goto(url, PAGE_PUPPETEER_OPTS);
    await acceptAllCookies(page);
    const content = await page.content();
    // await browser.close();

    return content;
  } catch (e) {
    if (browser) {
      await browser.close();
    }
    throw e;
  }
};

export { getPageContent };
