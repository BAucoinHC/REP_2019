/**
 * Created by dkilty on 10/30/2016.
 */

(function () {
    'use strict';

    angular
        .module('countryRecordModule', ['ui.select'])
})();

(function () {
    'use strict';

    angular
        .module('countryRecordModule')
        .config(function (uiSelectConfig) {
            uiSelectConfig.theme = 'selectize';
        })
        .component('cmpCountryRecord', {
            templateUrl: './components/country-list/tpl-country-record.html',
            controller: countryRecordController,
            controllerAs:'countryRecCtrl',
            bindings: {
                record: '<',
                onDelete: '&',
                showErrors: '&',
                countryList:'<',
                fieldsetLabel:'@'
            }
        });

    countryRecordController.$inject = ['$filter']
    function countryRecordController($filter) {
        var vm = this;

        vm.model = {};
        vm.countries=[];
        vm.$onInit = function(){

        };

        vm.$onChanges = function (changes) {

            if(changes.countryList){
                vm.countries=changes.countryList.currentValue;
            }
            if (changes.record) {
                vm.model = changes.record.currentValue;
                if (vm.model.name) {
                    vm.model.pair = $filter('findCountryObject')(vm.countries, vm.model.name);
                    //TODO get object
                }
            }

        };

        vm.deleteRecord = function()  {
            vm.onDelete({id: vm.model.id})
        };


        vm.showError = function (isInvalid, isTouched) {
            return ((isInvalid && isTouched) || (isInvalid && vm.showErrors()) )
        }

        vm.isUnknown=function(){
            if(vm.model.name==='UNKNOWN'){ //TODO constants service

                return true;
            }
            return false;
        }
    }
})();