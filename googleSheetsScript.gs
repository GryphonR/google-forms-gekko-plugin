//Setup Variables

//Form Response Columns. A=1, B=2 etc...
timeCol = 1; //Google Generated Timestamp
actionCol = 5; //Buy or Sell
priceCol = 7; //Asset Price
assetHeldCol = 6; //Asset Held
currHeldCol = 8; //Currency Held
balanceCol = 9; // Balance
assetNameCol = 4; //Asset Ticker Name
currNameCol = 3; //Currency Ticker Name
exchangeNameCol = 2; //Exchange Name



ss = SpreadsheetApp.getActiveSpreadsheet();
formSheet = ss.getSheetByName("Form Responses");

function onFormSubmit() {  
  newSubmission();
}

function newSubmission(){
  var lastSubmissionRow = formSheet.getLastRow();
  var exchange = formSheet.getRange(lastSubmissionRow, 2).getValue();
  var currency = formSheet.getRange(lastSubmissionRow, 3).getValue();
  var asset = formSheet.getRange(lastSubmissionRow, 4).getValue();
  var targetSheetName = asset+':'+currency+' '+exchange;
  var targetSheet;
  
  //DEBUG ONLY
  //targetSheetName = "TrialSheet"
  
  if(ss.getSheetByName(targetSheetName)){
     addEntry(targetSheetName);
  }else{
    yourNewSheet = ss.insertSheet();
    yourNewSheet.setName(targetSheetName);
    //Initialise new sheet...
    newSheet(targetSheetName);
  }
    
}

function addEntry(targetSheet){
  targetSheet = ss.getSheetByName(targetSheet);

  var newRow = targetSheet.getLastRow()+1;
  var lastSubmissionRow = formSheet.getLastRow();
  
  targetSheet.getRange(newRow,1).setValues(formSheet.getRange(lastSubmissionRow,timeCol).getValues());
  targetSheet.getRange(newRow,2).setValues(formSheet.getRange(lastSubmissionRow,actionCol).getValues());
  targetSheet.getRange(newRow,3).setValues(formSheet.getRange(lastSubmissionRow,priceCol).getValues());
  targetSheet.getRange(newRow,4).setValues(formSheet.getRange(lastSubmissionRow,assetHeldCol).getValues());
  targetSheet.getRange(newRow,5).setValues(formSheet.getRange(lastSubmissionRow,currHeldCol).getValues());
  targetSheet.getRange(newRow,6).setValues(formSheet.getRange(lastSubmissionRow,balanceCol).getValues());
  //Latest new balance
  targetSheet.getRange(2,4).setValues(formSheet.getRange(lastSubmissionRow,balanceCol).getValues());
  //P/L calculation
  targetSheet.getRange(newRow,7).setValue('=IF(B'+newRow+' = "sell", (1-(F'+(newRow-1)+'/F'+newRow+')),)');
  
  targetSheet.getRange(newRow, 8,1,2).merge();
  if(targetSheet.getRange(newRow,2).getValue() == 'sell')
  {  
      targetSheet.getRange(newRow,8).setValue('=SPARKLINE(G'+newRow+',{"charttype","bar";"max",MAX(ABS(H$2),ABS(I$2));"color1",IF(G'+newRow+'>0,"green","red");"rtl",IF(G'+newRow+'>0,false,true);"nan","ignore";"empty","ignore"})');
  }
  
}

function newSheet(targetSheetName){
  targetSheet = ss.getSheetByName(targetSheetName);
  var lastSubmissionRow = formSheet.getLastRow();
  
  targetSheet.getRange(1,1).setValue("Pair");
  targetSheet.getRange(1,2).setValue("Exchange");
  targetSheet.getRange(1,3).setValue("Starting Balance");
  targetSheet.getRange(1,4).setValue("Latest Balance");
  targetSheet.getRange(1,5).setValue("P/L");
  targetSheet.getRange("F1:G2").mergeAcross();
  targetSheet.getRange("F1").setValue("% Profitable Trades");
  targetSheet.getRange(1,8).setValue("Best Trade");
  targetSheet.getRange(1,9).setValue("Worst Trade");
  targetSheet.getRange(2,8).setValue("=MAX(G5:G300)");
  targetSheet.getRange(2,9).setValue("=MIN(G5:G300)");
  
  targetSheet.getRange(4,1).setValue("Time");
  targetSheet.getRange(4,2).setValue("Action");
  targetSheet.getRange(4,3).setValue("Price");
  targetSheet.getRange(4,4).setValue("Asset");
  targetSheet.getRange(4,5).setValue("Currency");
  targetSheet.getRange(4,6).setValue("Balance");
  targetSheet.getRange("H4:I4").merge();
  targetSheet.getRange(4,7).setValue("% Profit");
  
  //Add colour
  targetSheet.getRange("A1:I1").setBackgroundRGB(147, 204, 234).setFontWeight("bold");
  targetSheet.getRange("A4:I4").setBackgroundRGB(147, 204, 234).setBorder(true, false, false, false, false, false).setFontWeight("bold");

  
  //Set sparkline row height
  targetSheet.setRowHeight(3, 70);
  
  //Fill in data from form responses sheet
  targetSheet.getRange("A2").setValue(formSheet.getRange(lastSubmissionRow, assetNameCol).getValue()+':'+formSheet.getRange(lastSubmissionRow, currNameCol).getValue());
  targetSheet.getRange("B2").setValue(formSheet.getRange(lastSubmissionRow, exchangeNameCol).getValue());
  targetSheet.getRange("C2").setValue(formSheet.getRange(lastSubmissionRow, balanceCol).getValue());
  
  //P/L formula
  targetSheet.getRange("E2").setValue("=IF((1-D2/C2) > 1, (1-D2/C2), -(1-D2/C2))");
  targetSheet.getRange("F2").setValue('=COUNTIF(G5:G1000, ">0")/COUNTIF(G5:G1000, "<>")');
  
  //Add Sparklines
  //Profit
  targetSheet.getRange("A3:E3").merge();
  targetSheet.getRange("A3").setValue("=SPARKLINE(F5:F1000)");  
  //Trades
  targetSheet.getRange("F3:I3").merge();
  targetSheet.getRange("F3").setValue('=SPARKLINE(G5:G1000,{"charttype","column";"negcolor","red";"color","green"})');
  
  addEntry(targetSheetName);
  
}
