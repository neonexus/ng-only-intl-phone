(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ngIntlPhone = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('bcPhoneNumberTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('ng-only-intl-phone/ng-intl-phone.html','<md-select ng-model="weapon" placeholder="Weapon" class="md-no-underline">\n    <md-option value="axe">Axe</md-option>\n    <md-option value="sword">Sword</md-option>\n    <md-option value="wand">Wand</md-option>\n    <md-option value="pen">Pen?</md-option>\n</md-select>\n\n<md-input-container>\n    <label>Select Country:</label>\n    <md-select ng-model="country" placeholder="Select Your Country">\n        <md-option ng-repeat="country in allCountries" ng-value="selectedCountry.name" value="selectedCountry.name">\n            <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="country.iso2Code"></i> {{country.name}}\n        </md-option>\n    </md-select>\n</md-input-container>\n\n<md-input-container class="md-block animated fade" flex>\n    <label>Phone type</label>\n    <md-select ng-model="phone.type"\n               required\n               name="phoneType"\n               ng-disabled="phone.verifyCodeReady">\n        <md-option value="mobile">\n            Mobile\n        </md-option>\n        <md-option value="hardLine">\n            Land-line\n        </md-option>\n    </md-select>\n    <div ng-messages="verifyDevices.phoneType.$error" class="error-messages slide-right">\n        <div ng-message="required" class="message slide-left">This field is required</div>\n    </div>\n</md-input-container>\n\n<section class="input-group">\n    <label for="{{name}}" ng-if="label">{{label}}</label>\n    <div class="input-group-btn" uib-dropdown uib-keyboard-nav>\n        <md-button class="md-button md-raised" ng-disabled="ngDisabled">\n            <span class="iti-flag bc-phone-number-flag" ng-class="selectedCountry.iso2Code"></span>\n            <span class="caret"></span>\n            <span class="sr-only">Select country: {{selectedCountry.name}}</span>\n        </md-button>\n        <ul class="uib-dropdown-menu bc-phone-number-dropdown-menu dropdown-menu" role="menu">\n            <li ng-repeat="country in preferredCountries" ng-click="selectCountry(country)"\n                ng-class="{active: isCountrySelected(country)}" role="menuitem">\n                <a href="#" ng-click="$event.preventDefault()" class="bc-phone-number-country-anchor">\n                    <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="country.iso2Code"></i>\n                    <span ng-bind="country.name"></span>\n                </a>\n            </li>\n            <li role="separator" class="divider" ng-show="preferredCountries && preferredCountries.length"></li>\n            <li ng-repeat="country in allCountries" ng-click="selectCountry(country)"\n                ng-class="{active: isCountrySelected(country)}" role="menuitem">\n                <a href="#" ng-click="$event.preventDefault()" class="bc-phone-number-country-anchor">\n                    <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="country.iso2Code"></i>\n                    <span ng-bind="country.name"></span>\n                </a>\n            </li>\n        </ul>\n    </div>\n\n    <input type="tel"\n           name="{{name}}"\n           id="{{name}}"\n           class="form-control"\n           ng-model="number"\n           ng-disabled="ngDisabled"\n           ng-change="changed()"/>\n</section>\n');}]);
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var bcCountries = (typeof window !== "undefined" ? window['bcCountries'] : typeof global !== "undefined" ? global['bcCountries'] : null);
var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

global.angular = angular;
require('../build/js/templates');

angular.module('ngIntlPhone', ['bcPhoneNumberTemplates'])
    .service('ngIntlPhone', function(){
        this.isValid = bcCountries.isValidNumber;
        this.format = bcCountries.formatNumber;
    })
    .directive('ngIntlPhone', function(){

        if (typeof (bcCountries) === 'undefined') {
            throw new Error('bc-countries not found, did you forget to load the Javascript?');
        }

        function getPreferredCountries(preferredCodes){
            var preferredCountries = [];

            for (var i = 0; i < preferredCodes.length; i++) {
                var country = bcCountries.getCountryByIso2Code(preferredCodes[i]);
                if (country) { preferredCountries.push(country); }
            }

            return preferredCountries;
        }

        return {
            templateUrl: 'ng-only-intl-phone/ng-intl-phone.html',
            require: 'ngModel',
            scope: {
                preferredCountriesCodes: '@preferredCountries',
                defaultCountryCode: '@defaultCountry',
                selectedCountry: '=?',
                isValid: '=',
                ngModel: '=',
                ngChange: '&',
                ngDisabled: '=',
                name: '@',
                label: '@'
            },
            link: function(scope, element, attrs, ctrl){
                scope.selectedCountry = bcCountries.getCountryByIso2Code(scope.defaultCountryCode || 'us');
                scope.allCountries = bcCountries.getAllCountries();
                scope.number = scope.ngModel;
                scope.changed = function(){
                    scope.ngChange();
                };

                if (scope.preferredCountriesCodes) {
                    var preferredCodes = scope.preferredCountriesCodes.split(' ');
                    scope.preferredCountries = getPreferredCountries(preferredCodes);
                }

                scope.selectCountry = function(country){
                    scope.selectedCountry = country;
                    scope.number = scope.ngModel = bcCountries.changeDialCode(scope.number, country.dialCode);
                };

                scope.isCountrySelected = function(country){
                    return country.iso2Code == scope.selectedCountry.iso2Code;
                };

                scope.resetCountry = function(){
                    var defaultCountryCode = scope.defaultCountryCode;

                    if (defaultCountryCode) {
                        var defaultCountry = bcCountries.getCountryByIso2Code(defaultCountryCode);
                        var number = bcCountries.changeDialCode(scope.number, defaultCountry.dialCode);

                        scope.selectedCountry = defaultCountry;
                        scope.ngModel = number;
                        scope.number = number;
                    }
                };

                scope.resetCountry();

                scope.$watch('ngModel', function(newValue){
                    scope.number = newValue;
                });

                scope.$watch('number', function(newValue){
                    ctrl.$setValidity('phoneNumber', bcCountries.isValidNumber(newValue));
                    scope.isValid = bcCountries.isValidNumber(newValue);
                });

                scope.$watch('number', function(newValue){
                    if (newValue === '') { scope.ngModel = ''; }
                    else if (newValue) {
                        var digits = bcCountries.getDigits(newValue);
                        var countryCode = bcCountries.getIso2CodeByDigits(digits);

                        if (countryCode) {
                            var dialCode = bcCountries.getDialCodeByDigits(digits);
                            var number = bcCountries.formatNumber(newValue);

                            if (dialCode !== scope.selectedCountry.dialCode) {
                                scope.selectedCountry = bcCountries.getCountryByIso2Code(countryCode);
                            }

                            scope.ngModel = number;
                            scope.number = number;
                        }
                        else { scope.ngModel = newValue; }
                    }
                });
            }
        };
    });

module.exports = 'ngIntlPhone';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../build/js/templates":1}]},{},[2])(2)
});