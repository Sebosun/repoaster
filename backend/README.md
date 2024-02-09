# Token

Get token by putting this into discord console [source](https://stackoverflow.com/questions/67348339/any-way-to-get-my-discord-token-from-browser-dev-console)

```js
(webpackChunkdiscord_app.push([
  [""],
  {},
  (e) => {
    m = [];
    for (let c in e.c) m.push(e.c[c]);
  },
]),
m)
  .find((m) => m?.exports?.default?.getToken !== void 0)
  .exports.default.getToken();
```

# .envs:

- Token (self explanatory) TEST_GUILD - id of guild im testing in
- TEST_CHANNEL - id of channel im testing in
