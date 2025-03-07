const readline = require("readline");
const bot = require("./index");
const fs = require("fs");
// import index from "./message.js";
// __dirname means relative to script. Use "./data.txt" if you want it relative to execution path.
// const fileStream = fs.createReadStream('./CHANGE_HERE.txt');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const u = {
  name: '??',
  password: '??',
  courtNum1: '??',
  courtNum2: '??',
  date: '??',
  startTime1: '??',
  startTime2: '??',

  loginInfo: function() {
      return `__SAVED: <<<< username: ${this.name}, password: ${this.password} >>>> If this NOT what u intended to type, ctrl + c****`
  },
  bookingInfo: function() {
    return `__Court info SAVED: <<<< ${this.date}, court1: ${this.courtNum1}, start1: ${this.startTime1}, court2: ${this.courtNum2}, start2: ${this.startTime2} >>>> If this NOT what u intended to type, ctrl + c****`
  },
  allInfo: function() {
    return `__All: <<<< ${this.name}, ${this.password}, date: ${this.date}, court1: ${this.courtNum1}, start1: ${this.startTime1}, court2: ${this.courtNum2}, start2: ${this.startTime2} >>>> If this NOT what u intended to type, ctrl + c ***`
  },
  setDate: function(date) {
    this.date = date;
    console.log(u.bookingInfo());
  },
  setBookingInfo: function(courtNum, startTime, choice) {
    // eval('courtNum' + choice);

    this['courtNum' + choice] = courtNum;
    this['startTime' + choice] = startTime;
    console.log(u.bookingInfo());
  },
  setLoginInfo: function(name, pw){
    this.name = name;
    this.password = pw;
    console.log(u.loginInfo());
  }
};

function getLoginInfo(){
  return new Promise((resolve, reject) =>{
    console.log("====================== 'ENTER' to confirm, 'CTRL C' to restart input ================");
    console.log("Note: if login info is wrong after bot has ran, restart the bot\n");

    rl.question("Enter USERNAME: ", (uname) => {
      rl.question("Enter PASSWORD: ", (pw) => {
        u.setLoginInfo(uname,pw);
        resolve()
        });
      });
    });
}

function getDate(){
  return new Promise((resolve, reject) =>{
    rl.question("Enter date dd/mm/yyyy eg(01/12/2022): ", (date) => {
      var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      var day = date[0] + date[1];
      var monthNum = date[3] + date[4];
      var year = date[6] + date[7] + date[8] + date[9];
      month = monthArray[parseInt(monthNum) - 1]
      date = day + '-' + month + '-' + year
      console.log('aaaaa'+date)
      u.setDate(date);

      resolve();
    });
  });
}

function getBookingInfo(choice){
  var position = '1st'
  if (choice === 1){
    position = '1st'
  }else{
    var position = '2nd (if 1st choice fails)'
  }
  return new Promise((resolve, reject) =>{
      rl.question("Enter start time of " + position + " court eg(0900)\n",(startTime) => {
        rl.question("Enter " + position + " court number e.g (4 NOT 04)\n",(courtNum) => {
          u.setBookingInfo(courtNum, startTime, choice);
          resolve()
        });
    });
  });
}

function buffer(){
  return new Promise((resolve, reject) =>{
    rl.question("Isit 2359 yet? (or 1min before booking time) if yes ENTER, else WAIT then ENTER\n",(ntn) => {
      resolve();
    });
  });
}

function readAndExecute(file) {
  fs.readFile(file, 'utf8', function(err, text) {
    if (!err) {
      text = text.toString().split('\n')
      var userArray = [];
      var startOn = 3; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< SET START LINE (take it as it is, index already accounted for) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      var lineNow = startOn;
      var lastLine =startOn+6;
      while(lineNow < lastLine){
        var l = text[lineNow-1]

        if(l[0] =="\r"|| l[0]==" "){
          lastLine++;
          lineNow++;
          continue;
        }
        array = l.split(":")
        info = array[1];
        if(array[0][0] == '3'){ // if '3' (Date)
          var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
          var day = info[0] + info[1];
          var monthNum = info[3] + info[4];
          var year = info[6] + info[7] + info[8] + info[9];
          month = monthArray[parseInt(monthNum) - 1]
          var info = day + '-' + month + '-' + year
        }

        userArray.push(`${info.replace(/(\r\n|\n|\r|\s)/gm, "")}`)
        lineNow++;
      }
    } else {
      console.log(err)
    }
    console.log('CHECK ==>', userArray);
    bot.index(userArray[0], userArray[1], userArray[2], userArray[3], userArray[4], userArray[5], userArray[6]);
  });
}


////////////////////

const main = async () => {
  /*
  // USING terminal user input//
  await getLoginInfo()
  await getDate()
  await getBookingInfo(1)
  console.log('If u dont have a 2nd choice, then just click ENTER to skip')
  await getBookingInfo(2)
  await buffer()
  await bot.index(u.name, u.password, u.date, u.startTime1, u.courtNum1, u.startTime2, u.courtNum2);
  */
 // ==============================================================================================================
 
 //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> USING text file <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 readAndExecute('../CHANGE_HERE.txt');
 
 //================================================================================================================
 // await test();
 // index(username, password, date, startTime1, courtNum1, startTime2, courtNum2))

}
main()


/*
ychua048
J1aY0uSem1!
14/08/2022

0900
4

//0900
//1
*/