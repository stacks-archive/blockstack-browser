import {browser, by, By, element, protractor, until} from 'protractor';
import { SampleAccount } from '../../src/utils/sample-account';
import {Utils} from '../../src/utils/Utils';

module.exports = function RecoverAccount() {

    this.Then(/^enter blockstack secret recovery key$/, async () => {
        await Utils.sendKeys(element(By.css('textarea[name="recoveryKey"]')),  SampleAccount.SECRET_RECOVERY_KEY);
        await Utils.click(element(By.css('button[type="submit"]')));
    });

    this.Then(/^create blockstack password$/, async () => {
        await Utils.sendKeys(element(By.css('input[name="password"]')), SampleAccount.PASSWORD);
        await Utils.sendKeys(element(By.css('input[name="passwordConfirm"]')), SampleAccount.PASSWORD);
        await Utils.click(element(By.css('button[type="submit"]')));
    });

    this.Then(/^enter blockstack browser email$/, async () => {
        await Utils.sendKeys(element(By.css('input[name="email"]')), SampleAccount.EMAIL);
        await Utils.click(element(By.css('button[type="submit"]')));
    });

};
