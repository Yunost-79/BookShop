import puppeteer from 'puppeteer';
import chalk from 'chalk';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import fs, { writeFile } from 'node:fs';

import { arrayFromLength } from './helpers/common.ts';
import { getPageContent } from './helpers/puppeteer.ts';

dotenv.config();

const MAIN_PAGE_URL: string = process.env.MAIN_SITE_PAGE_URL!;
const BOOK_PAGE_URL: string = process.env.BOOK_SITE_PAGE_URL!;

const PAGE_NUMBER: number = 3;

const main = async () => {
  try {
    const linksToBookPage: string[] = [];

    for (const num of arrayFromLength(PAGE_NUMBER)) {
      const url = `${MAIN_PAGE_URL}${num}`;

      const pageContent = await getPageContent(url);

      const $ = cheerio.load(pageContent);

      const previewData = () => {
        const data: any[] = [];

        // data.push();
        $('.book-preview').each((index, el) => {
          const url = $(el).find('.image-wrap a').attr('href');
          const title = $(el).find('.title').text();
          const author = $(el).find('.author a').text();
          const price = $(el).find('.price-rrp').text().replace('£', '');

          if (el) {
            data.push({
              bookUrl: `${BOOK_PAGE_URL}${url}`,
              title,
              author,
              price: price ? price : null,
            });
          }
        });
        return data;
      };

      previewData();
      console.log(previewData(), previewData().length);

      //   const getLinksToPage = () => {
      //     const links: string[] = [];
      //     $('.image-wrap')
      //       .children('a')
      //       .each((index, elem) => {
      //         const url: string | undefined = $(elem).attr('href');

      //         if (elem) {
      //           links.push(`${BOOK_PAGE_URL}${url}`);
      //         }
      //       });

      //     return links;
      //   };

      //   const links: string[] = getLinksToPage();
      //   linksToBookPage.push(...links);
    }

    // console.log(linksToBookPage, linksToBookPage.length);
  } catch (e) {
    console.log(chalk.red('Error \n'));
    console.log(e);
  }
};

main();
