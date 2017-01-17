/**
 * Pull information from spreadsheet to generate an array of counselor objects
 *
 * @return {counselors}
 */
function getCounselors() {
  //establish spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
 
  //establish sheet for Counselors information
  var sheet = ss.getSheetByName('Counselors');

  //establish range of data from sheet
  var range = sheet.getDataRange();

  //extract data from range
  var values = range.getValues();
  
  //establish list of counselors
  var counselors = [];  

  //iterate through each row on the sheet to extract counselor information
  for (i=1; i < values.length; i++) {    

    //create a new counselor object
    var counselor = {
      name: values[i][0].toString().trim(), //counselor's name
      email: values[i][1].toString().trim(), //counselor's email
      phone: values[i][2].toString().trim(), //counselor's phone number
      unitType: values[i][3].toString().trim(), //counselor's unit type
      unitNum: values[i][4].toString().trim(), //counselor's unit number
      help: values[i][5].toString().trim(), //willing to help all units
      ypt: values[i][6], //youth protection training date
      status: values[i][7], //counselor's status (Active, Retired, Unknown)
      mbs: [], //merit badges
      isPending: function() {
        for (i_mb = 0; i_mb < this.mbs.length; i_mb++) {
          if (this.mbs[i_mb].status == 'Pending') {
            return true;
            break;
          }
        }
        return false;
      } //determine if counselor is pending approval for any merit badge
    }
    
    //add counselor to array
    counselors.push(counselor);
  }
  
  //pull merit badge information
  var meritBadges = getMeritBadges();
  
  //establish sheet for Counselor Records
  sheet = ss.getSheetByName('Records');
  
  //establish range from sheet
  range = sheet.getDataRange();
  
  //extract data from range
  values = range.getValues();
  
  //iterate through all rows on sheet to capture counselor records for merit badges
  for (i=1; i < values.length; i++) {   
    
    //only record official merit badges - exclude typos
    if (values[i][1].toString().trim() in meritBadges) {
    
      //create a new merit badge record object
      var mb = {
        badge: values[i][1].toString().trim(), //merit badge name
        registered: values[i][2],  //registration (application) date to teach merit badge
        approved: values[i][3], //approval date to teach merit badge
        lastActive: values[i][4], //last date of counselor activity with the system
        status: values[i][5] //status to teach merit badge (Active, Retired, Pending, Denied, Unknown)
      }
      
      //ensure merit badge has not been retired by Nationals
      if (meritBadges[mb.badge][0] == 'Retired') {
        mb.status = 'Retired';
      }
      
      //lookup related counselor to link record
      for (j = 0; j < counselors.length; j++) {
        if (counselors[j].name == values[i][0].toString().trim()) {
          //add merit badge record to counselor object
          counselors[j].mbs.push(mb);
          break;
        }
      }
    }
  }
  return counselors
}
