const cheerio = require('cheerio');

const defaultUrl = "https://compragamer.com";

exports.getGcItemsFromSearchPage = page => {
  const loadedPage = cheerio.load(page);
  const items = loadedPage("div.products__wrap");
  let auxItems = [];
  items.each((_, elem) => {
    const item = {};
    const titleContainer = loadedPage(elem).find('h4 > a');
    const buttonContainer = loadedPage(elem).find('.products-btns__btn.products-btns__add');
    item.url = defaultUrl + titleContainer.attr('href');
    item.name = titleContainer.text().replace(/\s\s+/g, ' ');
    item.stock = !(buttonContainer.text() === 'SIN STOCK')
    auxItems=[...auxItems, item];
  });
  return auxItems;
}

exports.itemsToString = items => {
  return items.reduce((acum, item) => {
    return acum + `${item.url}\n${item.name}\n${item.stock ? 'Hay stock\n' : 'No hay stock :(\n'}`
  }, '')
}

exports.queryWithItemsToString = queryWithItems => {
  return queryWithItems.reduce((acum, q) => {
    return `${q.query}\n${itemsToString(q.items)}\n`
  }, '')
}