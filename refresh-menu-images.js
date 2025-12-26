const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Re-download all menu images (42 files) with queries
 * that match dish/drink names & descriptions exactly.
 *
 * Source: https://loremflickr.com (stable, no API key required).
 * Using precise queries with premium restaurant menu photography keywords
 * for consistent professional food photography style.
 */

const IMG_DIR = path.join(__dirname, 'public', 'img');

/** @type {{ filename: string; query: string; sig: number }[]} */
const IMAGES = [
  // Pizze - максимально точные запросы для каждого блюда
  { filename: 'pizza-margherita.jpg', query: 'pizza margherita classic italian mozzarella fresh basil tomato sauce thin crust wood fired', sig: 1 },
  { filename: 'pizza-pepperoni.jpg', query: 'pepperoni pizza spicy sausage mozzarella cheese red sauce italian', sig: 2 },
  { filename: 'pizza-quattro-formaggi.jpg', query: 'quattro formaggi pizza four cheese mozzarella gorgonzola parmesan ricotta white pizza', sig: 3 },
  { filename: 'pizza-capricciosa.jpg', query: 'capricciosa pizza ham prosciutto mushrooms artichokes black olives mozzarella', sig: 4 },

  // Primi Piatti - паста с максимально точными описаниями
  { filename: 'pasta-carbonara.jpg', query: 'spaghetti carbonara italian pasta egg yolk parmesan cheese pancetta guanciale black pepper creamy', sig: 5 },
  { filename: 'pasta-bolognese.jpg', query: 'spaghetti bolognese meat sauce ground beef tomato paste red wine carrots celery onions parmesan', sig: 6 },
  { filename: 'pasta-amatriciana.jpg', query: 'pasta amatriciana roma italy guanciale pancetta tomato sauce pecorino romano red pepper flakes', sig: 7 },
  { filename: 'pasta-alfredo.jpg', query: 'fettuccine alfredo pasta creamy white sauce butter parmesan cheese garlic italian', sig: 8 },
  { filename: 'lasagna.jpg', query: 'lasagna italian baked pasta layers meat sauce bechamel mozzarella parmesan cheese', sig: 9 },
  { filename: 'risotto-funghi.jpg', query: 'mushroom risotto creamy arborio rice porcini mushrooms parmesan white wine italian northern', sig: 10 },

  // Secondi Piatti - мясные блюда с точными описаниями
  { filename: 'ossobuco-braised.jpg', query: 'ossobuco alla milanese braised veal shank bone marrow vegetables white wine gremolata', sig: 11 },
  { filename: 'cotoletta-breaded.jpg', query: 'cotoletta alla milanese breaded veal cutlet golden crispy parmesan cheese lombardy', sig: 12 },
  { filename: 'saltimbocca.jpg', query: 'saltimbocca alla romana veal prosciutto sage white wine butter sauce roman cuisine', sig: 13 },
  { filename: 'parmigiana-eggplant-baked.jpg', query: 'eggplant parmigiana melanzane parmigiana baked eggplant tomato sauce mozzarella parmesan italian', sig: 14 },

  // Antipasti - закуски с точными ингредиентами
  { filename: 'bruschetta.jpg', query: 'bruschetta italian appetizer toasted bread garlic fresh tomatoes basil olive oil', sig: 15 },
  { filename: 'caprese-salad.jpg', query: 'caprese salad fresh mozzarella tomatoes basil balsamic vinegar olive oil italian', sig: 16 },
  { filename: 'prosciutto-melone-correct.jpg', query: 'prosciutto melon parma ham cantaloupe sweet salty italian antipasto', sig: 17 },
  { filename: 'arancini-correct.jpg', query: 'arancini sicilian fried rice balls mozzarella cheese ragu meat sauce crispy breadcrumbs', sig: 18 },

  // Insalate - салаты с точными ингредиентами
  { filename: 'insalata-mista.jpg', query: 'italian mixed salad insalata mista arugula rocket cherry tomatoes mozzarella parmesan balsamic', sig: 19 },
  { filename: 'caesar-salad.jpg', query: 'caesar salad romaine lettuce grilled chicken parmesan croutons caesar dressing', sig: 20 },

  // Dolci - десерты с точными описаниями
  { filename: 'tiramisu.jpg', query: 'tiramisu italian dessert mascarpone coffee espresso ladyfingers cocoa powder veneto', sig: 21 },
  { filename: 'pannacotta-berry.jpg', query: 'panna cotta vanilla cream dessert berry sauce raspberry strawberry blueberry italian', sig: 22 },
  { filename: 'panna-cotta.jpg', query: 'panna cotta vanilla cream dessert caramel sauce italian gelatin', sig: 23 },

  // Bevande (Wines) - вина с точными типами
  { filename: 'vino-chianti.jpg', query: 'chianti red wine bottle toscana tuscany italy sangiovese grapes', sig: 24 },
  { filename: 'vino-pinot-grigio.jpg', query: 'pinot grigio white wine bottle veneto italy light crisp', sig: 25 },
  { filename: 'vino-barbera.jpg', query: 'barbera d asti red wine bottle piedmont italy fruity tannins', sig: 26 },
  { filename: 'vino-prosecco.jpg', query: 'prosecco sparkling wine bottle veneto italy champagne flute bubbles', sig: 27 },
  { filename: 'vino-brunello.jpg', query: 'brunello di montalcino red wine bottle toscana tuscany italy premium aged', sig: 28 },
  { filename: 'vino-amarone.jpg', query: 'amarone della valpolicella red wine bottle veneto italy dried grapes full bodied', sig: 29 },

  // Caffe - кофе с точными описаниями
  { filename: 'cappuccino.jpg', query: 'cappuccino italian coffee espresso steamed milk foam latte art cup', sig: 30 },
  { filename: 'espresso.jpg', query: 'espresso italian coffee shot dark strong crema cup saucer', sig: 31 },
  { filename: 'caffe-latte.jpg', query: 'caffe latte coffee espresso steamed milk white cup italian', sig: 32 },
  { filename: 'caffe-mocha.jpg', query: 'mocha coffee espresso chocolate milk steamed foam cup', sig: 33 },
  { filename: 'caffe-americano.jpg', query: 'americano coffee espresso hot water black cup', sig: 34 },
  { filename: 'caffe-macchiato.jpg', query: 'macchiato coffee espresso milk foam dot cup italian', sig: 35 },
  { filename: 'caffe-corretto.jpg', query: 'espresso corretto coffee grappa sambuca alcohol shot italian', sig: 36 },

  // Limoncello - лимончелло с точными вариантами
  { filename: 'limoncello.jpg', query: 'limoncello lemon liqueur yellow bottle glass italian amalfi coast', sig: 37 },
  { filename: 'limoncello-cream.jpg', query: 'crema di limoncello cream limoncello white milky bottle glass italian', sig: 38 },
  { filename: 'limoncello-mint.jpg', query: 'limoncello mint cocktail green fresh leaves glass italian', sig: 39 },
  { filename: 'limoncello-honey.jpg', query: 'limoncello honey liqueur golden yellow bottle glass italian', sig: 40 },
  { filename: 'limoncello-iced.jpg', query: 'limoncello ice cocktail cold frozen glass cubes italian', sig: 41 },

  // Contorni - гарниры
  { filename: 'contorni-verdure.jpg', query: 'grilled vegetables italian side dish zucchini peppers eggplant asparagus olive oil', sig: 42 },
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function cleanImages(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const f of files) {
    const lower = f.toLowerCase();
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
      fs.unlinkSync(path.join(dirPath, f));
    }
  }
}

function download(url, destPath, redirectsLeft = 8) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          (res.statusCode === 301 || res.statusCode === 302) &&
          res.headers.location &&
          redirectsLeft > 0
        ) {
          res.resume();
          const nextUrl = new URL(res.headers.location, url).toString();
          return download(nextUrl, destPath, redirectsLeft - 1)
            .then(resolve)
            .catch(reject);
        }

        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => {
          try {
            fs.unlinkSync(destPath);
          } catch (_) {}
          reject(err);
        });
      })
      .on('error', reject);
  });
}

function buildLoremFlickrUrl(query, lock) {
  // loremflickr expects tags separated by comma
  // Using precise food photography keywords for accurate dish matching
  // Adding professional food photography style keywords for consistency
  const tags = query.trim().replace(/\s+/g, ',');
  const encoded = encodeURIComponent(tags);
  // High resolution for professional quality (2000x1500 for premium print and digital menu)
  // Adding food photography keywords for consistent style
  return `https://loremflickr.com/2000/1500/${encoded},food,photography,restaurant,menu?lock=${lock}`;
}

async function main() {
  ensureDir(IMG_DIR);
  cleanImages(IMG_DIR);

  console.log(`Downloading ${IMAGES.length} menu images...`);

  let ok = 0;
  let fail = 0;

  for (const img of IMAGES) {
    const url = buildLoremFlickrUrl(img.query, img.sig);
    const dest = path.join(IMG_DIR, img.filename);
    try {
      await download(url, dest);
      ok++;
      process.stdout.write(`✓ ${img.filename}\n`);
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      fail++;
      process.stdout.write(`✗ ${img.filename} (${e.message})\n`);
    }
  }

  console.log(`Done. Success: ${ok}, Failed: ${fail}`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});



