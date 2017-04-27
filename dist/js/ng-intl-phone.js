(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ngIntlPhone = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('bcPhoneNumberTemplates', []).run(['$templateCache', function($templateCache) {$templateCache.put('ng-only-intl-phone/ng-intl-phone.html','\n<section class="input-group">\n    <ul class="ng-intl-phone-list">\n        <li>\n            <div class="md-menu-demo menudemoCustomTrigger" ng-cloak="" >\n                <div class="menu-demo-container" layout="column">\n                    <md-menu>\n                        <md-button aria-label="Open menu with custom trigger" class="md-icon-button" ng-click="$mdOpenMenu()">\n                            <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="selectedCountry.iso2Code"></i>\n                        </md-button>\n                        <md-menu-content width="10" ng-click="$mdMenu.close()">\n                            <md-menu-item ng-repeat="country in preferredCountries" ng-class="{active: isCountrySelected(country)}" ng-click="selectCountry(country)">\n                                <md-button ng-click="$event.preventDefault()"  aria-label="country.name" class="bc-phone-number-country-anchor">\n                                    <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="country.iso2Code"></i>\n                                    <span ng-bind="country.name"></span>\n                                </md-button>\n                            </md-menu-item>\n\n                            <md-menu-item ng-repeat="country in allCountries"\n                                          ng-class="{active: isCountrySelected(country)}"\n                                          class="ng-intl-phone-downdown-menu-divider"\n                                          ng-click="selectCountry(country)">\n                                <md-button ng-click="$event.preventDefault()"  aria-label="country.name" class="bc-phone-number-country-anchor">\n                                    <i class="glyphicon iti-flag bc-phone-number-country-icon" ng-class="country.iso2Code"></i>\n                                    <span ng-bind="country.name"></span>\n                                </md-button>\n                            </md-menu-item>\n                        </md-menu-content>\n                    </md-menu>\n                </div>\n            </div>\n        </li>\n        <li>\n            <input type="tel"\n                   name="{{name}}"\n                   id="{{name}}"\n                   class="form-control"\n                   ng-model="number"\n                   ng-disabled="ngDisabled"\n                   ng-change="changed()"/>\n        </li>\n    </ul>\n</section>\n');}]);
},{}],2:[function(require,module,exports){
(function (global){
'use strict';

var bcCountries = (typeof window !== "undefined" ? window['bcCountries'] : typeof global !== "undefined" ? global['bcCountries'] : null);
var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null);

global.angular = angular;
require('../build/js/templates');

angular.module('ngIntlPhone', ['bcPhoneNumberTemplates', 'ngMaterial', 'ngMessages'])
    .service('ngIntlPhone', function(){
        this.isValid = bcCountries.isValidNumber;
        this.format = bcCountries.formatNumber;
        this.getCountries = bcCountries.getAllCountries();
        this.getIso2CodeByDigits = bcCountries.getIso2CodeByDigits;
        this.getDialCodeByDigits = bcCountries.getDialCodeByDigits;
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
                    scope.number = bcCountries.formatNumber(newValue);
                });

                scope.$watch('number', function(newValue){
                    ctrl.$setValidity('phoneNumber', bcCountries.isValidNumber(newValue));
                    scope.isValid = bcCountries.isValidNumber(newValue);
                });

                scope.$watch('number', function(newValue){
                    if (newValue === '') { scope.ngModel = ''; }
                    else if (newValue) {
                        scope.ngModel = newValue;
                    }
                });
            }
        };
    });

module.exports = 'ngIntlPhone';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../build/js/templates":1}]},{},[2])(2)
});