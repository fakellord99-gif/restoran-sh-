const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesToDownload = [
  {
    filename: 'insalata-mista.png',
    url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80'
  },
  {
    filename: 'contorni-verdure.png',
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80'
  }
];

const imgDir = path.join(__dirname, 'public', 'img');

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Загружено: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function downloadAll() {
  console.log('Загрузка финальных изображений...\n');
  
  for (const image of imagesToDownload) {
    const filepath = path.join(imgDir, image.filename);
    
    try {
      await downloadImage(image.url, filepath);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Ошибка ${image.filename}:`, error.message);
    }
  }
  
  console.log('\nГотово!');
}

downloadAll();


