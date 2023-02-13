# photo tools

at its heart, a set of photography files sorting loging, accessible through a cli command `photo`.

Stuff, the sanitze command does:

* detecting families of images
  * same corename, where corename is a little tighter defined than the usual basename (fileName before extension)
* deleting „lonely“ RAWs (after the l)

NEXT: a download command to 'leech' from configured, “known” sd card location and copy to incoming location (+sanitation ↑)

## status

[![build status](https://github.com/nocke/photo/actions/workflows/ci.yml/badge.svg)](https://github.com/nocke/photo/actions/workflows/ci.yml?query=branch%3Amaster)

## „Devrun” for development

keep running the sanitize command in a loop, watching on every filechange:

`npm run devrun` (or simply `./devrun`) to run the basic cli command (currently in 3 flavors)

`npm run devrun:loop` same thing, but in a loop, watching the entire folder, except node_modules

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

## Debugging

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

