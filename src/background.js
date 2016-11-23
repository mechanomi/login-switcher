if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}

var tabs = {}

search_cookies = {
  "tumblr": {domain: "tumblr.com"},
  "twitter": {domain: "twitter.com"}
}

delete_cookies = {
  "tumblr": ["anon_id"],
  "twitter": ["twid"],
}

save_cookies = {
  "tumblr": ["pfp", "pfs", "pfu"],
  "twitter": ["auth_token"],
}

function getCookieUrl (cookie) {
  var prefix = cookie.secure ? 'https://' : 'http://';
  if (cookie['domain'].charAt(0) == ".")
    cookie['domain'] = cookie['domain'].slice(1);
  return prefix + cookie['domain'] + cookie['path'];
}

var accounts = {

  accounts: {},

  get: function (site, uid) {
    return this.accounts[site][uid];
  },

  set: function (site, uid, data, callback) {
    if (!this.accounts.hasOwnProperty(site)) {
      this.accounts[site] = {};
    }
    this.accounts[site][uid] = data;
    if (callback) this.save(callback);
  },

  remove: function (site, uid, callback) {
    delete this.accounts[site][uid];
    if (callback) this.save(callback);
  },

  save: function (callback) {
    var accounts = this.accounts;
    var json = JSON.stringify(accounts);
    chrome.storage.sync.set({ 'accounts': json }, function () {
      callback(accounts);
    });
  },

  getAll: function (callback) {
    if (!callback) return this.accounts;
    var self = this;
    chrome.storage.sync.get('accounts', function (json) {
      if (json.accounts && json.accounts.length) {
        self.accounts = JSON.parse(json.accounts);
      }
      callback(self.accounts);
    });
  },

  setAll: function (accounts, callback) {
    this.accounts = accounts;
    if (callback) this.save(callback);
  },

  getSiteAccounts: function (site) {
    return this.accounts[site];
  }

};

var handlers = {

  getAccounts: function (message, sender, sendResponse) {
    accounts.getAll(function (accounts) {
      sendResponse(accounts);
    });

    return true;
  },

  removeAccount: function (message, sender, sendResponse) {
    accounts.remove(message.site, message.uid, sendResponse);

    return true;
  },

  switchAccount: function (site, uid) {
    var account = accounts.get(site, uid);
    var expires = new Date;
    expires.setFullYear(expires.getFullYear() + 10);

    async.series([
      function (callback) {
        // delete existing cookies
        chrome.cookies.getAll(search_cookies[site], function (cookies) {
          async.each(cookies, function (cookie, callback) {
            if (delete_cookies[site].indexOf(cookie.name) >= 0) {
              url = getCookieUrl(cookie);
              chrome.cookies.remove({
                "url": url,
                "name": cookie.name
              }, function () {callback();});
            } else {
              callback();
            }
          }, callback);
        });
      },
      function (callback) {
        // set the new cookies
        if (!account || account.ignored) {
          // revisit this logic
          callback();
        }
        async.each(account.cookies, function (cookie, callback) {
          // recreate cookie stuff
          cookie['url'] = getCookieUrl(cookie);
          cookie['expirationDate'] = expires / 1000;
          if (cookie['hostOnly'])
            delete cookie['domain'];
          delete cookie['hostOnly'];
          chrome.cookies.set(cookie, function () {callback();});
        }, callback);
      },
      function (callback) {
        chrome.tabs.getSelected(null, function (tab) {
          chrome.tabs.reload(tab.id);
          // chrome.tabs.update(tab.id, {url: "/nslater/lists/signal" });
        });
        callback();
      }
    ]);
  },

  saveAccount: function (message, sender, sendResponse) {

    async.waterfall([
      function (callback) {
        // fetch accounts before making modifications
        // no need to do this if/when we switch datastores
        accounts.getAll(function () {callback();});
      },
      function (callback) {
        chrome.cookies.getAll(search_cookies[message.site], function (cookies) {
          callback(null, cookies);
        });
      },
      function (cookies, callback) {
        if (!cookies) callback(true);

        var login_cookies = [];

        for (var i in cookies) {
          delete cookies[i]['expirationDate'];
          delete cookies[i]['storeId'];
          delete cookies[i]['session'];
          if (save_cookies[message.site].indexOf(cookies[i].name) >= 0) {
            login_cookies.push(cookies[i]);
          }
        }

        accounts.set(message.site, message.account.uid, {
          name: message.account.name,
          icon: message.account.icon,
          cookies: login_cookies
        }, callback);
      }
    ], function (err, result) {
      sendResponse();
    });

    return true;
  },

  ignore: function (message, sender, sendResponse) {
    accounts.getAll(function (all) {
      // Reset
      for (var uid in all) {
        all[uid].ignored = false;
      }

      // Update
      message.ignore.forEach(function (uid) {
        all[uid].ignored = true;
      });

      // Save
      accounts.setAll(all, sendResponse);
    });

    return true;
  },

  showPageAction: function (message, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);

    // call sendResponse?

    return true;
  },

};

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {

  if (sender.id !== window.location.host)
    // Not from us
    return;

  if (sender.tab)
    tabs[sender.tab.id] = message.site;

  if (message.type in handlers)
    return handlers[message.type](message, sender, sendResponse);

  return false;
});
