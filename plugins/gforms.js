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

  this.done = done;
  this.setup();
};

gforms.prototype.setup = function(done) {
  var setupGforms = function(err, result) {
    console.log('gForms Plugin Active. Any new trades will be sent to your google form');

  };
  setupGforms.call(this)

};


// &entry.1346916648=exchange&entry.1743858251=currency&entry.105864059=Asset&entry.68010386=Event&
//entry.1463011579=Price&entry.1529244935=Date&entry.3616735=AssetInPorf&entry.433943481=CurrenInPort&
//entry.1202282384=PortBalance&entry.620326103=Balance

gforms.prototype.processTrade = function(trade) {
  let currency = config.watch.currency;
  let asset = config.watch.asset;
  let exchange = config.watch.exchange;

  //build up string
  let dataString =
    'entry.' + gfc.exchange + '=' + exchange + '&' +
    'entry.' + gfc.currency + '=' + currency + '&' +
    'entry.' + gfc.asset + '=' + asset + '&' +
    'entry.' + gfc.action + '=' + trade.action + '&' +
    'entry.' + gfc.price + '=' + trade.price + '&' +
    'entry.' + gfc.assetCount + '=' + trade.portfolio.asset + '&' +
    'entry.' + gfc.currencyCount + '=' + trade.portfolio.currency + '&' +
    'entry.' + gfc.portfolioBalance + '=' + trade.portfolio.balance + '&' +
    'entry.' + gfc.balance + '=' + trade.balance;

  console.log(this.formUrl + dataString);

  request.post(this.formUrl + dataString + '&submit=Submit', function(error, response) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  });


};

module.exports = gforms;