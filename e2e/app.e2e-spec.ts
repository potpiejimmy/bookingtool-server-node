import { BookingtoolServerNodePage } from './app.po';

describe('bookingtool-server-node App', () => {
  let page: BookingtoolServerNodePage;

  beforeEach(() => {
    page = new BookingtoolServerNodePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
