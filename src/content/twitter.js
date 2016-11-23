var dropdown = document.querySelector('.global-nav .pull-right .nav .dropdown');
var account;

var getAccount = function () {

  // Get uid and image from DOM
  var account = dropdown.querySelector('.account-group');
  var img = dropdown.querySelector('.dropdown-toggle img');

  if (!account) return false;

  return {
      uid: account.getAttribute('data-user-id'),
      name: account.getAttribute('data-screen-name'),
      icon: img.getAttribute('src')
  };
};

account = getAccount();

if (account) {
  chrome.extension.sendMessage({
    type: 'showPageAction',
    site: "twitter"
  });
  chrome.extension.sendMessage({
    type: 'saveAccount',
    site: "twitter",
    account: account
  });
}
