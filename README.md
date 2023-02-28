[![build status](https://github.com/nocke/photo/actions/workflows/ci.yml/badge.svg)](https://github.com/nocke/photo/actions/workflows/ci.yml?query=branch%3Amaster)
# photo tools

at its heart, a cli command `photo`
• for sanitizing, renaming and deleting photo and video files
• next: smart command-line importing
• next: rating based deletion of “unselected takes“ and company

Stuff, the sanitze command does:

* detecting families of images
  * same corename, where corename is a little tighter defined than the usual basename (fileName before extension)
* deleting „lonely“ RAWs (after the l)

## integration

There will one day be more elegant ways, but for now I suggest adding a bash file to your `~/bin` folder named `photo` and `chmod u+x` it, as a redirection script:

```bash
#!/usr/bin/env bash

node "/depot/PUBLIC/@nocke/photo/src/main.js" "$@"
```

## “Devrun” for development

restores the `./TEST-FOLDER` in its initial state (using `rsync`) and runs a (somewhat) representative photo cli command with sanitize option. (locally adjust to your need and liking)

`npm run devrun` (or simply `./devrun`) to run the basic cli command

`npm run devrun:loop` same thing, but in a loop, watching the entire folder, except node_modules. see [./script/saveloop](./script/saveloop)

----

## runnning all tests

To run a small mocha testsuite, using the Chai assertion library:

    npm t

(or `npm test` or `npm run test` naturally)

## running all tests in loop, watching for changes

    npm run test:loop

### running single tests:

    npm run test test/executableTest/paramTest.js

also (easier to autocomplete resp. lazier...)

    npm run test ./test/executableTest/paramTest.js
    npm t ./test/executableTest/paramTest.js
    npm t test/executableTest/paramTest.js

### running single test in loop \o/

    npm run test:loop --test=test/executableTest/paramTest.js

----

## debugging

Project has a [.vscode/launch.json](.vscode/launch.json) launch config.

### Debugging the command

use the config named

    Launch `photo -v sanitize`

As part of devrun resp. as a preLaunchTask, Testfiles are rsynced to original state. This will need some local adaption to work. TODO

### Debugging a single test file

use the config named

    "Debug single test"

adapt last `arg` for the desired test.

in vscode: use [Mocha Test Adapter](https://github.com/hbenl/vscode-mocha-test-adapter)

----

## internal notes

[internal REF photoDevnotes_2022.txt](../knowhow/devnotes/_project/photoDev2022/photoDevnotes_2022.txt)


[internal REF OLD_photocmd](../../depot/projects/OLD_photocmd/)

    code /depot/projects/OLD_photocmd

