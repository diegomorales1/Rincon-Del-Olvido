const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  errorMessage = false;

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });

  const { width, height } = await page.viewport();

  if (width > 800) {
    await page.click('#Inicio_sesion'); 
  } else{
    await page.click('#Menu_hamburguesa');
    await page.waitForSelector('#Inicio_sesion');
    await page.click('#Inicio_sesion');
  }

  await page.waitForSelector('#Modal_inicio_sesion'); 

  await page.type('#Email', 'sebastian.castrod@usm.cl'); 
  await page.type('#Contrasena', '123456');

  await page.click('#SubmitInicioSesion'); 

  try{
    await page.waitForSelector('#Modal_inicio_sesion', { hidden: true, timeout: 5000  });
    resultMessage = 'El formulario se envió correctamente';
  } catch{
    errorMessage = true;
    resultMessage = 'Formulario no se envio correctamente, campo invalido'
  }

  const scriptName = path.basename(__filename, '.js');
  const outputPath = path.join(__dirname, `${scriptName}.txt`);

  fs.writeFileSync(outputPath, resultMessage);

  console.log(resultMessage);

  await browser.close();
  process.exit(errorMessage ? 1 : 0);
})();
