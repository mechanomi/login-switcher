var btn, list;

/**
 * Render list
 */

// DEFAULT URLS SHOULD BE DONE AS A SEPERATE EXTENSION FOR TWITTER?

var render = function (accounts) {
  var parent = document.getElementById('accounts');

  Object.keys(accounts).forEach(function (uid) {
    var account = accounts[uid];
    var li = document.createElement('li');
    li.innerHTML = '<label>' +
      '<input type="checkbox" data-uid="' + uid + '" ' + (account.ignored ? '' : 'checked') + '>' +
      '<img src="' + account.img + '">' +
      '<div>' + account.name + '</div>' +
    '</label>';
    li = parent.appendChild(li);

    li.querySelector('input').addEventListener('change', function () {
      btn.disabled = false;
      btn.innerHTML = 'Save';
    });
  });

  btn.addEventListener('click', save, false);
  btn.disabled = true;
};

/**
 * Save state
 */

var save = function (event) {
  var ignore = [];

  var elems = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0, len = elems.length; i < len; i++) {
    var elem = elems[i];
    if (!elem.checked)
      ignore.push(elem.getAttribute('data-uid'));
  }

  chrome.extension.sendMessage({ type: 'ignore', ignore: ignore }, function() {
    btn.disabled = true;
    btn.innerHTML = 'Saved';
  });
};

document.addEventListener('DOMContentLoaded', function () {
  btn = document.getElementById('save');
  chrome.extension.sendMessage({ type: 'getAccounts' }, render);
});
