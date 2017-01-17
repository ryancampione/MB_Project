/**
 * Notify counselors that have been recently approved to teach a merit badge
 *
 */
function sendNewlyApprovedEmails() {
  //get counselors information from spreadsheet
  var counselors = getCounselors();
  
  //establish user interface for spreadsheet
  var ui = SpreadsheetApp.getUi();
  
  //get benchmark date to determine if a counselor was 'recently approved'
  var benchmark = getBenchmarkDate();
  
  //iterate through each counselor
  for (i = 0; i < counselors.length; i++) {
    var counselor = counselors[i];
    var recentlyApproved = false;
    
    //determine if a conselor was recently approved
    for (j = 0; j < counselor.mbs.length; j++) {
      //approval date is more recent then benchmark date
      if (counselor.mbs[j].approved > benchmark) {
        recentlyApproved = true;
        break;
/**
 * Notify counselors that have been recently approved to teach a merit badge
 *
 */
function sendNewlyApprovedEmails() {
  //get counselors information from spreadsheet
  var counselors = getCounselors();
  
  //establish user interface for spreadsheet
  var ui = SpreadsheetApp.getUi();
  
  //get benchmark date to determine if a counselor was 'recently approved'
  var benchmark = getBenchmarkDate();
  
  //iterate through each counselor
  for (i = 0; i < counselors.length; i++) {
    var counselor = counselors[i];
    
    //skip retired counselors
    if (counselor.status != 'Retired') {
      
      //determine if a conselor was recently approved
      var recentlyApproved = false;
      for (j = 0; j < counselor.mbs.length; j++) {
        //approval date is more recent then benchmark date
        if (counselor.mbs[j].status == 'Active' && counselor.mbs[j].approved > benchmark) {
          recentlyApproved = true;
          break;
        }
      }
      if (recentlyApproved) {
        
        //only email counselors that have an email address
        if (counselor.email != '') {
          
          //confirm with the user before emailing a counselor
          var response = ui.alert(
            'Notify Newly Approved Counselor', 
            'Are you sure you want to email ' + counselor.name + '?', 
            ui.ButtonSet.YES_NO
          );
          
          //user clicks YES button
          if (response == ui.Button.YES) {
            
            //get templated html file with counselor informtion
            var htmlMsg = getHTMLTemplate(counselor, 'TemplateNewlyApproved').getContent();
            
            //send email through gmail
            GmailApp.sendEmail(
              counselor.email, //counselor.email,
              'Approved Merit Badge Counselor', //email subject
              'Congratualtions, you have been approved to be a merit badge counselor.', //plain text
              {
                htmlBody: htmlMsg, //html message
                name: 'Mountaineer Area Council Advancement' //senders name
              }
            );
            ui.alert('Email successfully sent to ' + counselor.name);
            
            //user clicks NO button
          } else if (response == ui.Button.NO) {
            ui.alert('Alright, ' + counselor.name + ' was not emailed.');
            
            //user closes the prompt window without responding
          } else {
            ui.alert('Notifications canceled.');
            return;
          }
          
          //notify user that the counselor is missing an email address
        } else {
          ui.alert('Error: Cannot email ' + counselor.name + '.\nNo email address found.');
        }
      }
    }
  }
}


/**
 * Email counselors to reconfrim that they wish to continue serving as counselors
 *
 */
function sendReconfirmEmail() {
  //get counselors information from spreadsheet
  var counselors = getCounselors();
    
    //iterate through each counselor
    for (i = 0; i < counselors.length; i++) {
    var counselor = counselors[i];
    
    //only email counselors with an unknown status and an email address
    if (counselor.status == 'Unknown' || counselor.email != '') {
      var htmlMsg = getHTMLTemplate(counselor, 'TemplateReconfirm').getContent();
      
      //send email through gmail
      GmailApp.sendEmail(
        counselor.email, //counselor.email,
        'Follow Up: Merit Badge Counselor', //email subject
        'Thank you for serving as a merit badge counselor in 2016. Would you like to continue serving in 2017? Click Here: ' + getReconfirmFormLink(counselor,'Yes'), 
        {
          htmlBody: htmlMsg, //html message
          name: 'Mountaineer Area Council Advancement' //senders name
        }
      );
    }
  }
}


/**
 * Get benchmark date from spreadsheet
 *
 * @return {date} benchmark date
 */
function getBenchmarkDate() {
  //establish spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  //establish sheet for Counselors
  var sheet = ss.getSheetByName('Settings');
  
  //establish range from sheet
  var range = sheet.getRange("F1");
  
  //extract data from range
  var value = range.getValues();
  return value[0][0];
}


/**
 * Get html template file with counselor's information
 *
 * @return {HtmlOutput}
 */
function getHTMLTemplate(counselor, template) {
  var t = HtmlService.createTemplateFromFile(template);
  t.counselor = counselor;
  return t.evaluate();
}


/**
 * Get file location for HTML Services
 * (Used to link stylesheet)
 *
 * @return {HTMl Output}
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


/**
 * Genearte url to prefiled Google Form with counselor's informtion
 *
 * @param {counselor}
 * @param {string} answer to reconfirm question
 * @return {string} url
 */
function getReconfirmFormLink(counselor,reconfirm) {
  var link = '';
  
  //form url
  link = 'https://docs.google.com/forms/d/e/1FAIpQLSeW-YZmHQy8JJHVMlNtOv2NWVo8ekgTOGz_kxAEGPg8UNLFlg/viewform?';
  
  //reconfirm
  link+= 'entry.1638971109=' + reconfirm.toString();
  
  //full name
  link += '&entry.1382249611=' + counselor['name'].toString().replace(' ', '+');
  
  //email
  link += '&entry.687380762=' + counselor['email'].toString();
  
  //phone
  link += '&entry.47665138=' + counselor['phone'].toString().replace(' ', '+');
  
  //unit type
  link += '&entry.1762778775=' + counselor['unitType'].toString().replace(' ', '+');
  
  //unit number
  link += '&entry.1739667129=' + counselor['unitNum'].toString();
  
  //help other units
  link += '&entry.268023147=' + counselor['help'].toString();
  
  //youth protection training
  var expirationDate = new Date(2015, 1, 20);
  if ( isDate(counselor['ypt']) && counselor['ypt'] > expirationDate) {
    link += '&entry.2058760198=' + formatDate(counselor['ypt'],'yyyy-mm-dd');
  }
  
  //merit badges
  for (linkBdg = 0; linkBdg < counselor.mbs.length; linkBdg++) {
    if ( counselor.mbs[linkBdg].status == 'Active' || counselor.mbs[linkBdg].status == '') {
      link += '&entry.2018708776=' + counselor.mbs[linkBdg]['badge'].toString().replace(' ', '+');
    }
  }
  
  return link;
}

/**
 * Determine if value is a date
 *
 * @param {variant} value, What is checked to detremine if it is a date.
 * @return {boolean} true if value is a date.
 */
function isDate(value) {
  return Date.parse(value) > 0;
}


/**
 * Format date value
 *
 * @param {date} value, The date to be formated.
 * @param {string} format, The format of the date.
 * @return {string} a formated date.
 */
function formatDate(value, format) {
  if (isDate(value)) {
    var day = value.getDate();
    var month = value.getMonth() + 1;
    var year = value.getFullYear();
    
    switch (format) {
      case 'mm/dd/yyyy':
        return month + '/' + day + '/' + year;
        break;
      
      case 'yyyy-mm-dd':
        return year + '-' + leadingZero(month,2) + '-' + leadingZero(day,2);
        break;
      
      default:
        return value;
    }
  } else {
    return value;
  }
}

/**
 * Convert a number to a string with leading zeros
 *
 * @param {number} value
 * @param {number} expectedLength
 * @return {string} formated number
 */
function leadingZero(value, expectedLength) {
  var zeroStr = value.toString();
  for (charLength = value.toString().length; charLength < expectedLength; charLength++) {
    zeroStr = "0" + zeroStr;
  }
  return zeroStr;
}
