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
  log.debug('gforms function');

  this.formID = gfc.formID;
  this.formUrl = 'https://docs.google.com/forms/d/e/' + this.formID + '/formResponse?usp=pp_url&'

  //Track advice, linked to trades
  this.advicePrice = 0;
  this.adviceTime = 0;

  this.done = done;
  this.setup();
};

gforms.prototype.setup = function(done) {
  var setupGforms = function(err, result) {
    log.info('gForms Plugin Active. Any new trades will be sent to your google form');

  };
  setupGforms.call(this)

};

gforms.prototype.processAdvice = function(advice) {
  //Get advice price and time
  this.advicePrice = advice.candle.close;
  this.adviceTime = Date.now();
};

gforms.prototype.processTrade = function(trade) {
  let currency = config.watch.currency;
  let asset = config.watch.asset;
  let exchange = config.watch.exchange;
  let tradeTime = Date.now();

  let timeToComplete = (tradeTime - this.adviceTime)*60000;//Difference in ms, converted to minutes

  //build up data string
  let dataString =
    'entry.' + gfc.exchange + '=' + exchange + '&' +
    'entry.' + gfc.currency + '=' + currency + '&' +
    'entry.' + gfc.asset + '=' + asset + '&' +
    'entry.' + gfc.action + '=' + trade.action + '&' +
    'entry.' + gfc.price + '=' + trade.price + '&' +
    'entry.' + gfc.assetCount + '=' + trade.portfolio.asset + '&' +
    'entry.' + gfc.currencyCount + '=' + trade.portfolio.currency + '&' +
    'entry.' + gfc.advicePrice + '=' + this.advicePrice + '&' +
    'entry.' + gfc.timeToComplete + '=' + timeToComplete + '&' +
    'entry.' + gfc.tag + '=' + gfc.botTag + '&' +
    'entry.' + gfc.balance + '=' + trade.balance;

  //log.info(this.formUrl + dataString);

  request.post(this.formUrl + dataString + '&submit=Submit', function(error, response) {});


};

module.exports = gforms;
