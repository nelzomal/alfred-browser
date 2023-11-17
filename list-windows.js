#!/usr/bin/env osascript -l JavaScript

function run(args) {
  let browser = args[0];
  if (!Application(browser).running()) {
    return JSON.stringify({
      items: [
        {
          title: `${browser} is not running`,
          subtitle: `Press enter to launch ${browser}`,
        },
      ],
    });
  }

  let chrome = Application(browser);
  chrome.includeStandardAdditions = true;
  let windowCount = chrome.windows.length;
  let tabsTitle =
    browser === "Safari"
      ? chrome.windows.tabs.name()
      : chrome.windows.tabs.title();
  let tabsUrl = chrome.windows.tabs.url();
  let tabsMap = {};

  for (let w = 0; w < windowCount; w++) {
    let windowName = chrome.windows[w].name();
    for (let t = 0; t < tabsTitle[w].length; t++) {
     
      let url = tabsUrl[w][t] || "";
      let matchUrl = url.replace(/(^\w+:|^)\/\//, "");
      let title = tabsTitle[w][t] || matchUrl;
      try{
        if (t==0) {
          let windowUrl = url +"?window=1"
          tabsMap[windowUrl] =
          {
            title: windowName,
            windowUrl,
            subtitle: windowUrl,
            windowIndex: w,
            tabIndex: t,
            quicklookurl: windowUrl,
            arg: `${w},${t},${windowUrl}`,
            match: `${windowName} ${decodeURIComponent(matchUrl).replace(
              /[^\w]/g,
              " ",
            )}`,
          }; 
        }
    } catch (_) {
    }
    }
  }

  let items = Object.keys(tabsMap).reduce((acc, url) => {
    acc.push(tabsMap[url]);
    return acc;
  }, []);

  return JSON.stringify({ items });
}
