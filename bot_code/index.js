const puppeteer = require('puppeteer');
const alert = require('alert');
// const u = require('./main.js');
// console.log(u.getUserName);
// const main = async () => {

const index = async (username, password, date, startTime1, courtNum1, startTime2 , courtNum2) => {
  const browser = await puppeteer.launch({
    // executablePath: '\Program Files\Google\Chrome',
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  
  var msFasterBy = 100; // click faster by this amount of ms, greater number means click earlier
  
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  goTo(page);
  await page.waitForNavigation();
  usernamePage(page,username);
  await page.waitForNavigation();
  passwordPage(page, password);
  await page.waitForNavigation();
  var tt = new Date()
  console.log('--Logged in at :',tt.getHours()+':'+tt.getMinutes()+':'+tt.getSeconds()+'.'+ tt.getMilliseconds() +'s');
  var timeLeft = 56 - (tt.getSeconds() + 1);
  // var timeLeft = 0; //////////////////////////////////////// COMMENT ABOVE TO TEST ////////////////////////////////////

  await new Promise(resolve => setTimeout(resolve, 1000 - tt.getMilliseconds() - msFasterBy));
  alert('Do NOT click anything, bot will click after: '+`${timeLeft+1}` +'s');
  console.log('Do NOT click anything, bot will click after:', timeLeft+1 +'s');

  // console.log('current time (s)', tt.getSeconds()+ tt.getMilliseconds()*0.001);
  // console.log('millis to next sec', 1000 - tt.getMilliseconds())
  
  setTimeout(chooseSport, timeLeft*1000, page)
  // chooseSport(page)
  await page.waitForNavigation();
  var t = new Date();
  console.log('--Enter select slot page: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
  selectSlot(page, date, courtNum1, startTime1, courtNum2, startTime2);
  await page.waitForNavigation();
  confirm(page);
  await page.waitForTimeout(1000);
  screenshot(page);
  await page.waitForTimeout(1000);

  alert('You may now close everything everywhere all at once');
};

module.exports = {index};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 async function goTo(page) {
  await page.goto(
    // "https://www.amazon.com/s?i=computers-intl-ship&bbn=16225007011&rh=n%3A16225007011%2Cn%3A11036071%2Cp_36%3A1253503011&dc&fs=true&qid=1635596580&rnid=16225007011&ref=sr_pg_1"
    "https://sso.wis.ntu.edu.sg/webexe88/owa/sso_login1.asp?t=1&p2=https://wis.ntu.edu.sg/pls/webexe88/srce_smain_s.Notice_O&extra=&pg="
    );
    var t = new Date();
    console.log('Request at: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
}

async function usernamePage(page, username) {
  await page.type("[name='UserName']", username);
  await page.select("[name='Domain']", 'STUDENT');
  page.click("[name='bOption']") // Clicking the link will indirectly cause a navigation
}

const passwordPage = async (page, password) => {
  await page.type("[name='PIN']", password);
  page.click("[name='bOption']") // Clicking the link will indirectly cause a navigation
}

const chooseSport = async (page) =>{
  try{
    await page.click("[value='1BB26']")
    var t = new Date();
    console.log('--Chose sport at: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
  }catch(e){
    alert('If this appears contact, Run again mayb ur username or password is wrong')
  }
}

const selectSlot = async (page, date, courtNum1, startTime1, courtNum2, startTime2) =>{
  
  await page.waitForNavigation({waitUntil: 'networkidle2'}); // this webpage is redirected many times maybe lol, thats why need wait idle??? i think
  var val = '1BB2BB0' + courtNum1 + date + String(Number(startTime1.slice(0,2)) - 7);
  var val2 = '1BB2BB0' + courtNum2 + date + String(Number(startTime2.slice(0,2)) - 7);

  var string = '[value="' + val +'"]'
  var string2 = '[value="' + val2 +'"]'
  // console.log(string, string2)
  try{
    await page.click(string);
    var t = new Date();
    console.log('--Clicked 1st choice: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
  } catch(e){
    try{
      await page.click(string2);
      var t = new Date();
      console.log('--Clicked 2nd choice: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
      alert('Cant book 1st choice. Trying 2nd choice...')
    }catch(e){
      alert('GGs... Either this bot suxx OR Your internet trash OR you alr booked smtn. NO courts booked. (If you skipped 2nd choice ignore this msg)')
    }
  }
  var t = new Date();
  console.log('Finished choices at : ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
}

const confirm = async (page) => {
  await page.waitForNavigation({waitUntil: 'networkidle2'}); // this webpage is redirected many times lol, thats why need wait idle
  try{
    await page.click("[value='Confirm']")
    var t = new Date();
    console.log('--Confirmed at: ',t.getHours()+':'+t.getMinutes()+':'+t.getSeconds()+'.'+ t.getMilliseconds() +'s');
    screenshot(page);
  }catch(e){
    alert('I dont think you should able to see this')
  }
}

const screenshot = async (page) =>{
  await page.screenshot({path: '../court.png'});
}


