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
advicePriceCol = 10; 



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
  targetSheet.getRange(newRow,10).setValues(formSheet.getRange(lastSubmissionRow,advicePriceCol).getValues());
  //Latest new balance
  targetSheet.getRange(2,4).setValues(formSheet.getRange(lastSubmissionRow,balanceCol).getValues());
  //P/L calculation
  targetSheet.getRange(newRow,7).setValue('=IF(B'+newRow+' = "sell", (1-(F'+(newRow-1)+'/F'+newRow+')),)');
  
  targetSheet.getRange(newRow, 8,1,2).merge();
  if(targetSheet.getRange(newRow,2).getValue() == 'sell')
  {  
      targetSheet.getRange(newRow,8).setValue('=SPARKLINE(G'+newRow+',{"charttype","bar";"max",MAX(ABS(H$2),ABS(I$2));"color1",IF(G'+newRow+'>0,"green","red");"rtl",IF(G'+newRow+'>0,false,true);"nan","ignore";"empty","ignore"})');
  }
  
  var advicePrice = formSheet.getRange(lastSubmissionRow,advicePriceCol).getValues();
  if(targetSheet.getRange(newRow,2).getValue() == 'sell'){
    targetSheet.getRange(newRow,11).setValue('=1-(J'+newRow+'/C'+newRow+')');
  }else{
    targetSheet.getRange(newRow,11).setValue('=1-(C'+newRow+'/J'+newRow+')');
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
  targetSheet.getRange("J1").setValue("Days Running");
  targetSheet.getRange("J2").setValue("=(MAX(A7:A1002) - MIN(A7:A1002))");
  targetSheet.getRange("K1").setValue("Profit Per Day");
  targetSheet.getRange("K2").setValue("=E2/J2");
  targetSheet.getRange("J3").setValue("Avg Good Trade");
  targetSheet.getRange("J4").setValue('=SUMIF(G7:G1002, ">0")/COUNTIF(G7:G1002,">0")');
  targetSheet.getRange("K3").setValue("Avg Bad Trade");
  targetSheet.getRange("K4").setValue('=SUMIF(G7:G1002, "<0")/COUNTIF(G7:G1002,"<0")');
  
  targetSheet.getRange(6,1).setValue("Time");
  targetSheet.getRange(6,2).setValue("Action");
  targetSheet.getRange(6,3).setValue("Price");
  targetSheet.getRange(6,4).setValue("Asset");
  targetSheet.getRange(6,5).setValue("Currency");
  targetSheet.getRange(6,6).setValue("Balance");
  targetSheet.getRange("H6:I6").merge();
  targetSheet.getRange(6,7).setValue("% Profit");
  targetSheet.getRange(6,10).setValue("Advice @");
  targetSheet.getRange(6,11).setValue("% Slippage");
  
  //Add colour
  targetSheet.getRange("A1:K1").setBackgroundRGB(147, 204, 234).setFontWeight("bold");
  targetSheet.getRange("J3:K3").setBackgroundRGB(147, 204, 234).setFontWeight("bold");
  targetSheet.getRange("A6:K6").setBackgroundRGB(147, 204, 234).setBorder(true, false, false, false, false, false).setFontWeight("bold");

  
  //Set sparkline row height
  //targetSheet.setRowHeight(3, 70);
  
  //Fill in data from form responses sheet
  targetSheet.getRange("A2").setValue(formSheet.getRange(lastSubmissionRow, assetNameCol).getValue()+':'+formSheet.getRange(lastSubmissionRow, currNameCol).getValue());
  targetSheet.getRange("B2").setValue(formSheet.getRange(lastSubmissionRow, exchangeNameCol).getValue());
  targetSheet.getRange("C2").setValue(formSheet.getRange(lastSubmissionRow, balanceCol).getValue());
  
  //P/L formula
  targetSheet.getRange("E2").setValue("=IF((1-D2/C2) > 1, (1-D2/C2), -(1-D2/C2))");
  targetSheet.getRange("F2").setValue('=COUNTIF(G7:G1000, ">0")/COUNTIF(G7:G1000, "<>")');
  
  //Add Sparklines
  //Profit
  targetSheet.getRange("A3:E5").merge();
  targetSheet.getRange("A3").setValue("=SPARKLINE(F7:F1000)");  
  //Trades
  targetSheet.getRange("F3:I5").merge();
  targetSheet.getRange("F3").setValue('=SPARKLINE(G7:G1000,{"charttype","column";"negcolor","red";"color","green"})');
  
  addEntry(targetSheetName);
  
}
