bg = chrome.extension.getBackgroundPage();

var SITE;

var switchAccount = function (event) {
  var target = event.target;
  var uid;
  while (target.tagName !== 'DIV') {
    target = target.parentNode;
  }
  uid = target.getAttribute('data-user-id');
  bg.handlers.switchAccount(SITE, uid);
  window.close()
};

var render = function () {

  accounts = bg.accounts.getSiteAccounts(SITE);

  var target = document.querySelector('body');

  // clear page
  target.innerHTML = "";

  var accountsAdded = false;

  // repopulate page
  for (var uid in accounts) {

    var account = accounts[uid];

    // if (uid == currentAccount.uid || account.ignored)
    //  continue;

    div = document.createElement('div');
    div.setAttribute('data-user-id', uid);

    div.innerHTML = '<img src="' + account.icon + '">' + account.name;
    div = target.appendChild(div);
    div.addEventListener('click', switchAccount, false);

    accountsAdded = true;

  }

  if (!accountsAdded) {
    span = document.createElement('span');
    span.innerHTML = 'No other accounts';
    span = target.appendChild(span);
  }

};

document.addEventListener("DOMContentLoaded", function() {
  chrome.tabs.getSelected(null, function(tab) {
    SITE = bg.tabs[tab.id];
    render();
  });
});

