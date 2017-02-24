'use strict';

describe('Directive: ng-intl-phone', function(){

    // load the directive's module
    beforeEach(module('ngIntlPhone'));

    var scope;

    beforeEach(inject(function($rootScope){
        scope = $rootScope.$new();
        scope.$digest();
    }));

    it('should make hidden element visible', inject(function($compile){
        var element = angular.element('<ng-intl-phone ng-model="number"></ng-intl-phone>');
        element = $compile(element)(scope);

        expect(scope.number).toBe(undefined);
    }));
});

describe('Service: ngIntlPhone', function(){

    // load the service's module
    beforeEach(module('ngIntlPhone'));

    // instantiate service
    var ngIntlPhone;
    beforeEach(inject(function(_ngIntlPhone_){
        ngIntlPhone = _ngIntlPhone_;
    }));

    describe('ngIntlPhone.format(number)', function(){

        it('should work', function(){
            expect(ngIntlPhone.format('966501234567')).toEqual('+966 50 123 4567');
        });
    });

    describe('ngIntlPhone.isValid(number)', function(){

        it('should work', function(){
            expect(ngIntlPhone.isValid('+966 50 123 4567')).toBe(true);
        });
    });
});
