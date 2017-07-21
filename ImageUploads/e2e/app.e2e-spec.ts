import { ImageUploadsPage } from './app.po';

describe('image-uploads App', () => {
  let page: ImageUploadsPage;

  beforeEach(() => {
    page = new ImageUploadsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
