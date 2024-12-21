import express from 'express';
import { credentialsRouter, torrentRouter } from './logic/src/common/router';
import { Container } from './logic/src/injectable';

const app = express();
const port = 3000;

const URL = 'https://filelist.io/browse.php?search=silo&cat=27&searchin=1&sort=4';
const DOWNLOAD_URL = 'https://filelist.io/download.php?id=';

// app.get('/', async (req, res) => {
//   try {
//     const browser = await playwright.chromium.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto('https://filelist.io');
//     await page.getByPlaceholder('username').fill('Dairo2055');
//     await page.getByPlaceholder('password').fill('af7up3ca');
//     await page.getByRole('button').click();
//     const cookies = await page.context().cookies();
//     const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');
//
//     const res = await fetch(URL, {
//       credentials: 'include',
//       headers: {
//         Cookie: cookieHeader,
//       },
//     });
//
//     const html = await res.text();
//     const $ = cheerio.load(html);
//     const ceva = $('div.torrentrow');
//
//     const idElement = $(ceva[0]).find('a[href^="details.php?id="]');
//     const id = idElement?.attr('href')?.split('id=')[1];
//     console.log(`${DOWNLOAD_URL}${id}`);
//     const downloadRes = await fetch(`${DOWNLOAD_URL}${id}`, {
//       credentials: 'include',
//       headers: {
//         Cookie: cookieHeader,
//       },
//     });
//
//     const buffer = await downloadRes.arrayBuffer();
//     const fileArray = new Uint8Array(buffer);
//
//     const filePath = '/Users/antonio/Documents/ceva.torrent';
//     fs.writeFileSync(filePath, fileArray);
//     console.log(`Torrent file saved to ${filePath}`);
//
//     const cmd = spawn('transmission-remote', ['-a', filePath]);
//
//     cmd.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });
//
//     cmd.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     });
//
//     cmd.on('close', (code) => {
//       console.log(`child process exited with code ${code}`);
//     });
//
//     const cmd2 = spawn('transmission-remote', ['-l']);
//
//     cmd2.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });
//
//     cmd2.stderr.on('data', (data) => {
//       console.error(`stderr: ${data}`);
//     });
//
//     cmd2.on('close', (code) => {
//       console.log(`child process exited with code ${code}`);
//     });
//
//     // ceva.each((index, element) => {
//     //   // Get the content of the element
//     //   const content = $(element).html();
//     //   const idElement = $(element).find('a[href^="details.php?id="]')
//     //   const id = idElement?.attr('href')?.split('id=')[1];
//     //
//     //   // Print the extracted ID
//     //   console.log(`Torrent row ${index + 1} - ID: ${id}`);
//     //
//     //   // Process the content as needed (e.g., extract specific data)
//     //   // console.log(`Torrent row ${index + 1}:`, content);
//     // });
//   } catch (error) {
//     console.log(error);
//   }
//
//   res.send('Hello World!');
// });
app.use(express.json());
app.use(credentialsRouter);
app.use(torrentRouter);

app.listen(port, async () => {
  await Container.init();
  console.log(`Example app listening on port ${port}`);
});
