const pup = require('puppeteer');
const readline = require('readline');

(async () => {
    let leitor = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    await leitor.question("Qual produto você deseja pesquisar? ", function (response) {
        search = response;
        leitor.close();
        pesquisa()
    });
})();

const url = 'https://www.mercadolivre.com.br/';
let search = 'Notebook Gamer';

//let i = 1;

async function pesquisa() {
    const browser = await pup.launch({headless: true}); // Instância o navegador
    const page = await browser.newPage(); // Instância uma nova página
    
    await page.goto(url); // Redireciona para URL

    await page.waitForSelector('#cb1-edit'); // Aguardando o seletor ser renderizado

    await page.type('#cb1-edit', search); // Escrevendo no elemento(input)

    await Promise.all([ // Necessário quando você for navegar para outra página
        page.waitForNavigation(), 
        page.click('.nav-search-btn') // Clique no elemento
    ]);

    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href)); // Recebendo os links e mapeando

    for(const link of links) {
    
        //console.log('página', i);

        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');
        await page.waitForSelector('.andes-money-amount__fraction');

        const title = await page.$eval('.ui-pdp-title', element => element.innerText);
        const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);
        
        const Buy = link

        const obj = {
            title,
            price,
            Buy
        }

        console.log(obj);

        //i = i + 1;
    }

    await page.waitForTimeout(1000); // Aguardando

    await browser.close(); // Fecha a instância do navegador
}