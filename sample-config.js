//Add this to your CLI Config  file. Populate it with the codes from a pre-filled gforms link.

// eg:-
// https://docs.google.com/forms/d/e/1FAIpQLSd25H--Example-Form-ID--dCHmuYbvXRvtmMA/viewform?usp=pp_url&
// entry.134--Q-ID--16648=exchange&entry.174--Q-ID--58251=currency&entry.105--Q-ID--4059=asset&entry.680--Q-ID--386=Action&
// entry.146--Q-ID--11579=price&entry.361--Q-ID--35=assetHeld&entry.433--Q-ID--3481=CurrHeld&entry.120--Q-ID--82384=Balance&entry.620--Question ID--6103=Initial+Balance


config.gforms = {
  enabled: true,
  //Form ID - the long code from the form url
  formID: '',
  //Form question ID's - get them from a prefilled link. May already be correct if you copied my form
  exchange: '1346916648',
  currency: '1743858251',
  asset: '105864059',
  action: '68010386',
  assetCount: '3616735',
  price: '1463011579',
  currencyCount: '433943481',
  balance: '620326103',
  advicePrice: '1202282384'
};
