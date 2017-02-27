# ng-only-intl-phone

## Installation

### Bower
```bash
bower install --save ng-only-intl-phone
```
```js
angular.module('myApp', ['ngIntlPhone'])
```

### NPM
```bash
npm install --save ng-only-intl-phone
```
```js
angular.module('myApp', [require('ng-only-intl-phone')])
```

### Other (not recommended)
Just download the [dist](https://github.com/neonexus/ng-only-intl-phone/tree/master/dist) folder.

## Usage
```html
<ng-intl-phone ng-model='theNumber' default-country='us' preferred-countries='us gb ca' is-valid='isValid'></ng-intl-phone>
```

```js
angular.module('myModule', ['ngIntlPhone', function(ngIntlPhone) {
  scope.formattedNumber = ngIntlPhone.format('966501234567');
  scope.isValid = ngIntlPhone.isValid(scope.formattedNumber);
}]);
```

Note that `ng-model` and `is-valid` are scope variables.

## Release

Build a new version:

```sh
gulp build
```

Update version in bower.json and package.json and commit:

```sh
git commit -a -m "Release 1.0.0"
```

Tag, sign and push:

```sh
git tag -s v1.0.0 -m "v1.0.0"
git push --tags
```
