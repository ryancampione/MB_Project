/update
function updateMBinfo() {
  
  //establish form by id
  var form = FormApp.openById('14XftKcdP_zCkFy9Zca5N2fm3cHYuaAesO0EWOUp4f8U');
  Logger.log('Form: ' + form.getTitle()); 
  
  //establish last response
  var allResponses = form.getResponses();
  var last = allResponses.length - 1;
  var itemResponses = allResponses[last].getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    Logger.log('Response #%s to the question "%s" was "%s"', (i).toString(), itemResponse.getItem().getTitle(), itemResponse.getResponse());
  }
  
  //record item responses
  var name = itemResponses[0].getResponse();
  var email = itemResponses[1].getResponse();
  var phone = itemResponses[2].getResponse();
  var unit = itemResponses[3].getResponse();
  var unitNum = itemResponses[4].getResponse();
  var help = itemResponses[5].getResponse();
  
  //record mb responses as array
  var mb = itemResponses[6].getResponse().toString();
  mbList = mb.split(',');
  
  //establish spreadsheet by id
  var ss = SpreadsheetApp.openById('1G-97WcZdqg9zrEaBHBRrSpOAcllNCnd1YlbcpU4HCR0');
  Logger.log('Spreadsheet: ' + ss.getName());
  
  //establish sheet from spreadsheet
  var sheet = ss.getSheetByName('MB Counselors');
  
  for (var j = 0; j < mbList.length; j++) {
    //add new row of data for each mb
    sheet.appendRow([name, email, phone, unit, unitNum, mbList[j], help, "Pending Approval","Pending Verification"]);
  }
}
