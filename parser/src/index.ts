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

const PAGE_NUMBER: number = 2;

const main = async () => {
  try {
    const linksToBookPage: string[] = [];

    for (const num of arrayFromLength(PAGE_NUMBER)) {
      const url = `${MAIN_PAGE_URL}${num}`;

      const pageContent = await getPageContent(url);

      const $ = cheerio.load(pageContent);

      const getLinksToPage = () => {
        const links: string[] = [];
        $('.image-wrap')
          .children('a')
          .each((index, elem) => {
            const url: string | undefined = $(elem).attr('href');
            if (url) {
              links.push(`${BOOK_PAGE_URL}${url}`);
            }
          });

        return links;
      };

      const links: string[] = getLinksToPage();
      linksToBookPage.push(...links);
    }

    console.log(linksToBookPage, linksToBookPage.length);
  } catch (e) {
    console.log(chalk.red('Error \n'));
    console.log(e);
  }
};

main();
