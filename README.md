# Google Forms Gekko Plugin (V2.1)
A gekko plugin for live trading that submits all trades to a google spreadsheet through Forms

NOTE: Main branch is now V2.1. For legacy, go to the V1 tag (Branch > Tags> V1).


## What it does
Each time gekko completes a trade (live or paper) it updates a google sheet with the trade price and new balances via a post request to a google form. 
One form can be used to submit data from all bots, a new sheet is automatically created for each pair and exchange combination. Each sheet has a basic list of trades and overall P/L as well as % profitable trades, slippage from advice price, exposure time, and time taken to fill the order.
Profit and loss in a FIAT currency at time of trade is also recorded using the cryptocompare API - Useful if you need to do tax calculations.

The plugin can only log values gekko gives it, and relies on the gekko trade event being triggered. Recent versions of gekko on the develop branch have not been emmitting the trade event, and not always reporting figures that agree with the exchange.
A fix for the emit event triggering (as of 5/2018) was suggested by xFFFFF here: https://forum.gekko.wizb.it/thread-56609-post-58687.html#pid58687



Each sheet looks like this:
![alt text](https://i.imgur.com/pDQrveG.png "Example")
^From testing with a paper trader set up purely to generate lots of trades - I'll get a better image when I have one!

## Setup in Gekko
* Download/Clone this repo.
* Copy the gforms.js into gekko/plugins - this is the main plugin code.
* Copy the code below into gekko/plugins.js, between the existing plugins. This registers the plugin with Gekko.
```
{
    name: 'Google Forms',
    description: 'Logs Trades to Google Forms',
    slug: 'gforms'
    async: false,
    modes: ['realtime'],
    dependencies: [{
      module: 'request',
      version: '2.85.0'
    }]
},
```
* Copy the code from sample-config.js into your CLI config file.

Finally, the 'require' module is needed - in your gekko root run
```
npm i require --save
```

## Setup in Google Drive
* Make a copy of [this google sheet](https://drive.google.com/drive/folders/1z8DTSmIa6W4tyupwOGPsBSDTbhKSYoo0?usp=sharing) (Right Click, Make Copy) into your google drive. 
* In the Config tab of the copied sheet, follow the setup instructions.
  
## Link the two!
* From the instructions in the google sheet, you should have your prefilled form link on the clipboard.
* Paste into the prefill field in your cli config.
* Add a tag for your bot in the 'tag' field.

When the first trade comes in google will need your permission to contact an outside service (cryptocompare). This is to get the FIAT price at the time of the trade. If this makes the first response in the form fail to generate a new tab, go to tools>script editor, at the top, select function onFormSubmit, and press the play button. This will prompt it to ask for permission.

Note that it will take a couple of sells before all the sparkline graphs start working properly - until then they'll all read #NA.
___
If you want to leave a tip, go give it to askmike and support gekko! If you've already done that and still want to leave a tip, thanks!

LTC: Lapmuu1Th2BGBMG6vVyM83swoT8Qc6PiZP
