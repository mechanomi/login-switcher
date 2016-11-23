var popover = document.querySelector('.popover');
var account;

var getAccount = function () {

  // Get uid and image from DOM
  var primary = document.querySelectorAll(".tab_blog")[1];

  if (!primary) return false;

  var blog_icon = primary.querySelector('.blog_icon');
  var blog_name = primary.querySelector('.blog_name');

  var name = blog_name.getAttribute("href").slice(6);
  var icon = blog_icon.getAttribute("style").slice(21, -1);

  return {
      uid: name,
      name: name,
      icon: icon
  };
};

account = getAccount();

if (account) {
  chrome.extension.sendMessage({
    type: 'showPageAction',
    site: "tumblr"
  });
  chrome.extension.sendMessage({
    type: 'saveAccount',
    site: "tumblr",
    account: account
  });
}
