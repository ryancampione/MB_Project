/**
 * Pull information from spreadsheet to generate a hash list of merit badge objects
 *
 * @return {meritBadges}
 */
function getMeritBadges() {
  //establish spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  //establish sheet for Counselors
  var sheet = ss.getSheetByName('Merit Badges');
  //establish range from sheet
  var range = sheet.getDataRange();
  //extract data from range
  var values = range.getValues();
  
  //iterate through each row on the sheet to extract counselor information
  var meritBadges = {};
  for (i = 1; i < values.length; i++) {
     var mbInfo = [
       values[i][1].toString().trim(), //merit badge status
       values[i][2], //merit badge eagle required
       values[i][3].toString().trim() //merit badge special counselor requirements
     ];
     
     meritBadges[values[i][0]] = mbInfo;
  }
  return meritBadges;
}
