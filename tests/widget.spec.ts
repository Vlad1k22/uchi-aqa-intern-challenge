import { test, expect } from '@playwright/test';
import { WidgetPage } from './widget.page';

test.describe('Uchi.ru support widget', () => {
  let widget: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widget = new WidgetPage(page);
    await widget.goto();
  });

  test('opens', async () => {
    await widget.open();
    await expect(widget.body).toBeVisible();
    await expect(widget.popularArticles.first()).toBeVisible();
  });

  test('has correct title', async () => {
    await widget.open();
    await widget.openFirstPopularArticle();
    await widget.writeToUs();
    await expect(widget.title).toHaveText('Связь с поддержкой');
  });

  test('opens the selected popular article', async () => {
    await widget.open();
    const articleTitle = await widget.openFirstPopularArticle();
    await expect(widget.popularArticles).toHaveCount(0);
    await expect(widget.body.getByText(articleTitle, { exact: true })).toBeVisible();
    await expect(widget.writeToUsButton).toBeVisible();
  });
});
