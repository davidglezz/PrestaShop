require('module-alias/register');
const BOBasePage = require('@pages/BO/BObasePage');

class Translations extends BOBasePage {
  constructor() {
    super();

    this.pageTitle = 'Translations • ';
    this.validationMessage = 'Translations successfully updated';
    this.validationResetMessage = 'Translations successfully reset';

    // Selectors
    // Modify translation form
    this.typeOfTranslationSelect = '#form_translation_type';
    this.selectYourThemeSelect = '#form_theme';
    this.selectYourLanguageSelect = '#form_language';
    this.modifyTranslationsButton = 'form[action*=\'translations/modify\'] button';
    this.searchInput = '#search input';
    this.searchButton = '#search button';
    this.translationTextarea = 'textarea.form-control';
    this.saveTranslationButton = '#app button[type=\'submit\']';
    this.resetTranslationButton = '#app  button[class*=\'btn-outline-secondary\']';
    this.growlMessage = '#growls-default div.growl-message';
    // Export language form
    this.exportLanguageForm = 'form[action*=\'translations/export\']';
    this.exportLanguageSelect = '#form_iso_code';
    this.exportLanguageThemeSelect = '#form_theme_name';
    this.exportLanguageButton = `${this.exportLanguageForm} .card-footer button`;
  }

  /*
  Methods
   */

  /**
   * Modify translation
   * @param page
   * @param translation
   * @param theme
   * @param language
   * @returns {Promise<void>}
   */
  async modifyTranslation(page, translation, theme, language) {
    await this.selectByVisibleText(page, this.typeOfTranslationSelect, translation);
    await this.selectByVisibleText(page, this.selectYourThemeSelect, theme);
    await this.selectByVisibleText(page, this.selectYourLanguageSelect, language);
    await this.clickAndWaitForNavigation(page, this.modifyTranslationsButton);
  }

  /**
   * Search translation
   * @param page
   * @param expression
   * @returns {Promise<void>}
   */
  async searchTranslation(page, expression) {
    await this.setValue(page, this.searchInput, expression);
    await page.click(this.searchButton);
    await page.waitForSelector(this.translationTextarea);
    await page.waitForTimeout(2000);
  }

  /**
   * Translate an expression
   * @param page
   * @param translation
   * @returns {Promise<string>}
   */
  async translateExpression(page, translation) {
    await this.setValue(page, this.translationTextarea, translation);
    await page.click(this.saveTranslationButton);
    return this.getTextContent(page, this.growlMessage);
  }

  /**
   * Reset translation
   * @param page
   * @returns {Promise<string>}
   */
  async resetTranslation(page) {
    await this.waitForSelectorAndClick(page, this.resetTranslationButton);
    await page.click(this.saveTranslationButton);
    return this.getTextContent(page, this.growlMessage);
  }

  /**
   * Export language
   * @param page
   * @param language
   * @param theme
   * @return {Promise<*>}
   */
  async exportLanguage(page, language, theme) {
    await this.selectByVisibleText(page, this.exportLanguageSelect, language);
    await this.selectByVisibleText(page, this.exportLanguageThemeSelect, theme);

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click(this.exportLanguageButton),
    ]);

    return download.path();
  }
}
module.exports = new Translations();
