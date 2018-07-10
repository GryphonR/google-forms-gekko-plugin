/**
 * Created by Gryphon on 22/3/18.
 */

var _ = require('lodash');
const request = require('request');
var log = require('../core/log.js');
var util = require('../core/util.js');
var config = util.getConfig();
var gfc = config.gforms;


var gforms = function(done) {
  _.bindAll(this);

this.currentPrice = 0;

  //Track advice, linked to trades
  this.advicePrice = 0;
  this.adviceTime = 0;
  this.questions = [];

  var prefill = gfc.prefill;
  prefill = prefill.slice(34, prefill.length);
  var result = prefill.search('/');
  this.formID = prefill.slice(0, result);
  prefill = prefill.slice(result + 20, prefill.length);
  this.formUrl = 'https://docs.google.com/forms/d/e/' + this.formID + '/formResponse?usp=pp_url&'

  let count = 0;

  while (prefill.length > 8) {
    var start = prefill.search('entry') + 6;
    var end = prefill.search('=');
    this.questions.push(prefill.slice(start, end));
    prefill = prefill.slice(end + 2, prefill.length);
    count++
  }

  if (this.questions.length > 11) {
    log.info(`Warning: Check prefill link. 11 fields were expected, found ${count}. Plugin may still work as expected.`)
  } else if (this.questions.length < 11) {
    if (this.questions.length == 0) {
      log.info(`Error parsing prefill link. 0 fields were found. Plugin will not work.`)
    } else {
      log.info(`Warning: Check prefill link. 11 fields were expected, found ${count}. Plugin may still work but will be missing data.`)
    }
  } else {
    log.info(`Prefilled link parsed successfully. 11 fields found.`)
  }

  this.done = done;
  this.setup();
};

gforms.prototype.setup = function(done) {
  var setupGforms = function(err, result) {
    log.info('gForms Plugin Active. Any new trades will be sent to your google form');

  };
  setupGforms.call(this)

};

gforms.prototype.processCandle = function(candle, done) {
  this.currentPrice = candle.close;
  done();
}

gforms.prototype.processAdvice = function(advice) {
  //Get advice price and time
  this.advicePrice = this.currentPrice;
  this.adviceTime = Date.now();
};

gforms.prototype.processTradeCompleted = function(trade) {
  let currency = config.watch.currency;
  let asset = config.watch.asset;
  let exchange = config.watch.exchange;
  let tradeTime = Date.now();

  let timeToComplete = (tradeTime - this.adviceTime); //Difference in ms, converted to minutes

  //build up data string
  let dataString =
    'entry.' + this.questions[0] + '=' + gfc.botTag + '&' +
    'entry.' + this.questions[1] + '=' + exchange + '&' +
    'entry.' + this.questions[2] + '=' + currency + '&' +
    'entry.' + this.questions[3] + '=' + asset + '&' +
    'entry.' + this.questions[4] + '=' + trade.action + '&' +
    'entry.' + this.questions[5] + '=' + trade.portfolio.asset + '&' +
    'entry.' + this.questions[6] + '=' + trade.price + '&' +
    'entry.' + this.questions[7] + '=' + trade.portfolio.currency + '&' +
    'entry.' + this.questions[8] + '=' + trade.balance + '&' +
    'entry.' + this.questions[9] + '=' + this.advicePrice + '&' +
    'entry.' + this.questions[10] + '=' + timeToComplete;

  /*
  Index: (-1 for array index)
  1: Tag
  2: Exchange
  3: Currency
  4: Asset
  5: Action
  6: Asset in Portfolio
  7: Price
  8: Currency in Portfolio
  9: Balance
  10: Advice Price
  11: Time to Fill
*/

  log.info("Sending Trade Data to your Google Sheet");
  log.info(this.formUrl + dataString);

  request.post(this.formUrl + dataString + '&submit=Submit', function(error, response) {});


};

module.exports = gforms;
