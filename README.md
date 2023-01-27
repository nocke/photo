# photo tools

[internal REF photoDevnotes_2022.txt](../knowhow/devnotes/_project/photoDev2022/photoDevnotes_2022.txt)

## sample scripts for development

```bash
./ptest   (bash file)
```

* rsyncs the test folder to original state
* runs `src/main.js` (in three flavors)
* (mostly non actions just checking the command)

```bash
./ptest-watch
```

runs psanitize TODO

## „tests” for development

Uses Mocha test framework and Chai assertion library.

```bash
npm test
```
