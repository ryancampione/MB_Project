//send email notification to last response
function emailCouncilors() {
  
  //defult values 
  var sName = 'MB Counselors';
  var subject = 'Merit Badge Councilor Requested';
  var aEmails = [];
  
  //establish form by id
  var form = FormApp.openById('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg');
  
  //establish last response
  var allResponses = form.getResponses();
  var last = allResponses.length - 1;
  var itemResponses = allResponses[last].getItemResponses();
  
  //record desired merit badge from last response
  var badge = itemResponses[2].getResponse();
  
  //establish spreadsheet
  var ss = SpreadsheetApp.openById('1G-97WcZdqg9zrEaBHBRrSpOAcllNCnd1YlbcpU4HCR0');
  
  //establish range from spreadsheet
  var mbRange = ss.getSheetByName(sName).getDataRange();
  
  //extract each merit badge from range
  var mbValues = mbRange.getValues();
  
  //iterate through all rows on sheet
  for (i=1; i < mbValues.length; i++) {
    var mbEmail = mbValues[i][1].toString().trim(); //merit badge counselor
    var mbValue = mbValues[i][4].toString().trim(); //merit badge name
    var mbPerm = mbValues[i][5].toString().trim(); //councilor's permission 
    var mbDate = mbValues[i][6].toString().trim(); //councilor's approved date
    Logger.log('Merit Badge ' + i + ': ' + mbEmail + ' / ' + mbValue + ' / ' + mbPerm + ' / ' + validDateRange(mbDate));
    
    //check if councilor is valid and willing
    if ((mbValue == badge) && (mbPerm == 'Yes') && (validDateRange(mbDate) == true)) {
      //add email to list
      aEmails.push(mbEmail);
    }
  }
  
  //build list of all counselors' emails
  var email = aEmails[0];
  for (i=1;i<aEmails.length;i++) {
    email = email + ', ' + aEmails[i];
  }
  
  //record replyto email
  var replyto = itemResponses[1].getResponse();
  
  //build body of email
  var cName = itemResponses[0].getResponse();
  var comments = itemResponses[3].getResponse(); 
  var body = 'Hello, \n' + cName + ' has requested a counselor for the ' + badge + ' merit badge. ';
  body = body + 'Could you please reply to this email to arrange the details. \n \n';
  body = body + 'Additional comments: ' + comments;
  
  //send email notification to counselor
   MailApp.sendEmail(email,replyto,subject,body);
}
