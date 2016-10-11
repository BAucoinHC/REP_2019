/**
 * Created by Abdessamad on 8/22/2016.
 */

(function () {
    'use strict';

    angular
        .module('appendix4RecordModule', ['tissuesFluidsOriginModule', 'sourceAnimalModule'])
})();

(function () {
    'use strict';

    angular
        .module('appendix4RecordModule')
        .component('cmpAppendixFourRecord', {
            templateUrl: './components/appendix-four/tpl-appendix-four-record.html',
            controllerAs: 'ap4RecCtrl',
            controller: app4RecCtrl,
            bindings: {
                record: '<',
                showListErrors: '&'
            }

        });

    function app4RecCtrl(){

        var self = this;
        self.isSourced = ""; //determines if at least one source is selected
        self.model = {}
        self.$onInit = function(){

        }
        self.$onChanges = function (changes) {
            if (changes.record) {
                self.model = angular.copy(changes.record.currentValue);
            }

        }
        self.isSourcedSelected = function () {
            var result = (self.model.humanSourced || self.model.animalSourced)
            if (result) {
                self.isSourced = result;
            } else {
                self.isSourced = "";
            }
            return (result);

        }

        self.noSelectionError = function () {
            return ((self.appendix4RecForm.$dirty && !self.isSourcedSelected() ) || (self.showListErrors() && !self.isSourcedSelected()));
        }
        /**
         * Used to show field level errors
         * @param isInvalid
         * @param isTouched
         * @returns {boolean}  true if you should show error
         */
        self.showError = function (isInvalid, isTouched) {
            return ((isInvalid && isTouched) || (isInvalid && self.showListErrors()))
        }

    }
})();
