# Login Switcher

This is a Chrome extension that lets you switch between site web accounts with a button press.

This extension currently supports Twitter and Tumblr. And will probably support Medium in the near future. I can add support for more websites if nice people ask me.

I've not submitted this to the official Chrome Extensions store (yet) so you're going to have to install manually.

Install manually like so:

1. Download the [ZIP archive](https://gitlab.com/nslater/login-switcher/repository/archive.zip?ref=master).
2. Expand the ZIP file and move the resulting `login-switcher` directory somewhere safe. This directory will need to continue existing in this location for the Chrome extension to continue to work.
3. Come back to Chrome, and visit `chrome://extensions` by typing (or copying and pasting) that URL into your address bar and hitting *Enter*.
4. Ensure the *Developer mode* checkbox in the top right-hand corner of the *Extensions* screen is ticked. If it's not ticked, tick it now, and leave it ticked. You have to do this because you're loading what's called an "unpacked extension", i.e. the files inside the `login-switcher` directory.
5. Now select the *Load unpacked extension…* button in the top left, and use the file selection menu that pops up to select the `login-switcher` directory from the location you moved it to. *Note: you are selecting the directory itself, not the files inside it!*
6. The extension is now loaded and you should see a blue icon next to your address bar.
7. To test it works, go to Twitter or Tumblr and log out. Now log back in. Now log out again, and log into one of your other accounts.
8. Now, here's the magic: select the blue icon, and it should pop up a little menu with a list of your logged in profile pictures. Select one of the profile pictures to switch to that account. Voilà!
9. To add more accounts, just log out of whatever account you're logged in as and log in to a new one.

That's it! Happy switching!

## More Info

You can read the official [developer docs](https://developer.chrome.com/extensions/getstarted#unpacked) if you want to learn more about unpacked extensions.

You can read the code, ask me about it, or ask someone you know who understands JavaScript if you want to know more about what it's doing.

Here's a textual description of what the code does:

1. Every time you request a page from Twitter or Tumblr, it grabs some information about who you're logged in as (including your profile pic) and [saves it inside your browser](https://developer.chrome.com/extensions/storage) along with the [*authentication cookies*](https://en.wikipedia.org/wiki/HTTP_cookie) needed to authenticate you to the website.
2. Every time you select one of the profile pictures from the blue button menu, it refreshes whatever page you are on, but manually inserts whatever session cookies it remembered you used last time you were signed into that account. This is usually enough to switch which account is logged in.
3. No other data is collected, and no data is transmitted anywhere. Unlike many other Chrome extensions, no third-party analytics software is used. If you reset your browser, it will lose your saved logins. But you can accumulate them easily by just logging in to your accounts again like you did originally.

That's pretty much it.

There's an *Options* screen you can access from your *Extensions* screen that lets you delete saved logins.


