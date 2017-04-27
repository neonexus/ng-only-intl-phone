'use strict';

var bcCountries = require('bc-countries');
var angular = require('angular');

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
                    scope.number = scope.ngModel = bcCountries.formatNumber(bcCountries.changeDialCode(scope.number, country.dialCode));
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
