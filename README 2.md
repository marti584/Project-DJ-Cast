# BetterBackground

[![Circle CI](https://circleci.com/gh/elGatoMantocko/BetterBackground/tree/develop.svg?style=svg)](https://circleci.com/gh/elGatoMantocko/BetterBackground/tree/develop)

### Build instructions

Install [Meteor](https://www.meteor.com/install), and then:

```
git clone git@github.com:elGatoMantocko/BetterBackground.git
cd BetterBackground
meteor
```

The app is now serving at [localhost:3000](http://localhost:3000).

#### Windows workaround

`xolvio:cucumber` currently does not run on Windows, so you will need to disable the test suite:

```
meteor remove xolvio:cucumber
```

Now you should be able to run the server correctly with `meteor`, but without the cucumber acceptance tests :(

### Run tests

The test suite uses both `xolvio:cucumber` and `sanjo:jasmine` packages. They can be run in CI mode by running `./run_tests.sh`.
