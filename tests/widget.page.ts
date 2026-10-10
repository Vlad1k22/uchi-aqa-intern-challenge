import { expect, type Locator, type Page } from '@playwright/test';

export class WidgetPage {
  readonly openButton: Locator;
  readonly body: Locator;
  readonly title: Locator;
  readonly popularArticles: Locator;
  readonly writeToUsButton: Locator;

  constructor(private readonly page: Page) {
    this.openButton = page.getByTestId('openWidget');
    // The container has no role or test id. Keep its CSS dependency here,
    // without including the generated CSS-module hash.
    this.body = page.locator('[class^="widgetWrapper"] > [class^="widget__"]');
    this.title = this.body.getByRole('heading', { level: 5 });
    this.popularArticles = this.body.locator(
      '[class^="popularTitle__"] + ul[class^="articles__"] > li',
    );
    this.writeToUsButton = this.body.getByRole('button', {
      name: 'Написать нам',
      exact: true,
    });
  }

  async goto(): Promise<void> {
    const cookieButton = this.page.locator(
      '._UCHI_COOKIE__wrap:not(._UCHI_COOKIE__wrap--fake) ._UCHI_COOKIE__button',
    );

    // Handle a late cookie notice without requiring it to be present.
    await this.page.addLocatorHandler(cookieButton, async () => {
      await cookieButton.click();
    });

    const response = await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response, 'The main page must return an HTTP response').not.toBeNull();
    expect(response!.ok(), `Main page returned HTTP ${response!.status()}`).toBe(true);
  }

  async open(): Promise<void> {
    await this.openButton.click();
  }

  async openFirstPopularArticle(): Promise<string> {
    const article = this.popularArticles.first();
    // Locator.all() takes an immediate snapshot and may return an empty list
    // before the widget finishes loading its articles.
    await expect(article).toBeVisible();
    const articleTitle = (await article.innerText()).trim();
    expect(articleTitle, 'A popular article must have a title').not.toBe('');
    await article.click();
    return articleTitle;
  }

  async writeToUs(): Promise<void> {
    await this.writeToUsButton.click();
  }
}

