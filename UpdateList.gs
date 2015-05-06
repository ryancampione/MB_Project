//update form to reflect merit badge choices from spreadsheet
function updateForm() {
 
  //defult values 
  var frmItemDesc = 'Which Merit Badge would you like a counselor for?';
  var frmItemId=0;
  var mbList = [];
  var mbChoices = [];
  
  //establish form by id
  var form = FormApp.openById('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg');
  Logger.log('Form: ' + form.getTitle()); 
  
  //gets all items inside the form
  var allItems = form.getItems();
  Logger.log('Total items in this form ' + allItems.length)
   
  //set form item by id
  frmItemId = allItems[3].getId();
  Logger.log(allItems[3].getId());
  
  //error checking in case item to edit was not found
  if (frmItemId == 0) {
    Logger.log('Error: item ' + frmItemDesc + ' not found!');
    return; 
  } 
  
  //establishing item to listItem by id
  var frmItem = form.getItemById(frmItemId).asListItem();  
  
  //establish spreadsheet
  var ss = SpreadsheetApp.openById('1G-97WcZdqg9zrEaBHBRrSpOAcllNCnd1YlbcpU4HCR0');
  Logger.log('Spreadsheet: ' + ss.getName());
  
  //establish range from spreadsheet
  var mbRange = ss.getSheetByName('MB Counselors').getDataRange();
  
  //extract each merit badge from range
  var mbValues = mbRange.getValues();
    
  //iterate through all rows on sheet
  for (i=1; i < mbValues.length; i++) {
    var mbValue = mbValues[i][5].toString().trim(); //merit badge name
    var mbPerm = mbValues[i][6].toString().trim(); //councilor's permission 
    var mbDate = mbValues[i][8].toString().trim(); //councilor's youth protection date
    Logger.log('Merit Badge ' + i + ': ' + mbValue + ' / ' + mbPerm + ' / ' + validDateRange(mbDate));
    
    //check if councilor is valid and willing
    if (!(mbValue == '' ) && (mbPerm == 'Yes') && (validDateRange(mbDate) == true)) {
      //add merit badge to list
      mbList.push(mbValue);
    }
  }
  
  //remove duplicates from list
  var mbCleanList = removeDuplicates(mbList);
  
  //convert list into choices
  for (i=0; i<= mbCleanList.length; i++) {
    if (mbCleanList[i] > '') {
      mbChoices.push(frmItem.createChoice(mbCleanList[i]));
    }
  }
  
  if (mbChoices.length >= 1) {
    //setting the choice array to drop down item
    frmItem.setChoices(mbChoices);
  } else {
    Logger.log('Error: No merit badges found!');
  }
}

//check if date is within the last year
function validDateRange(dateString) {
  
  //input date
  var d1 = new Date(dateString);
  
  //first date is todays date
  var d2 = new Date();
  
  //last date one year ago
  var d0 = new Date(d2.getYear() -2, d2.getMonth(), d2.getDate());
  
  //check if input date is between first and last dates
  if ((d1 >= d0) && (d1 <= d2)) {
    return true;
  } 
  else {
    return false;
  }  
}

//remove duplicate merit badges
function removeDuplicates(list) {
  //iterate through every element in the array 
  if (list.length > 1) {
    for (j=0;j<list.length;j++) {
      for (k=j+1;k<=list.length;k++) {
        if (list[j] == list[k]) {
          //remove duplicate elements
          list.splice(k,1);
        }
      }
    }
  }
  list.sort();
  return list;
}
