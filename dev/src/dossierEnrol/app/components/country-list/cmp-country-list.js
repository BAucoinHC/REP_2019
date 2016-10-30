/**
 * Created by Abdessamad on 8/16/2016.
 */
(function () {
    'use strict';

    angular
        .module('countryListModule', ['dataLists', 'countryRecordModule'])
})();

(function () {
    'use strict';

    angular
        .module('countryListModule')
        .component('cmpCountryList', {
            templateUrl: './components/country-list/tpl-country-list.html',
            controller: countryListController,
            controllerAs: 'countryListCtrl',
            bindings: {
                withUnknown: '<',
                listItems: '<',
                onUpdate: '&',
                onDelete: '&',
                showErrors: '&',
                fieldLabel: '@'
            }
        });

    countryListController.$inject = ['$filter', 'getCountriesISO3166'];


    function countryListController($filter, getCountriesISO3166) {
        var self = this;
        self.baseCountries = getCountriesISO3166.getCountryList3Letter();
        self.countryList = angular.copy(self.baseCountries);
        self.model = {};
        self.isDetailValid = true;
        self.resetToCollapsed = true;
        self.selectRecord = 0;
        self.columnDef = [
            {
                label:  self.fieldLabel,
                binding: "name",
                width: "100"
            },
        ]
        self.hasUnknown = false;
        self.emptyModel = {"id": "", "name": ""}

        self.$onInit = function () {

            if (angular.isUndefined(self.model.list)) { //TODO should be comimg from parent
                self.model.list = [];
                console.log("creating an empty list")
            }

        }

        self.$onChanges = function (changes) {
            if (changes.withUnknown) {
                setUnknownCountryState(changes.withUnknown.currentValue);
            }
            if (changes.listItems) {
                self.model.list = changes.listItems.currentValue;
            }
        };
        function setUnknownCountryState(isUnknown) {
            var countries = angular.copy(self.baseCountries);
            if (isUnknown) {
                countries.push("UNKNOWN") //TODO should be from constants service
                self.countryList = countries;
                self.hasUnknown = true;
                self.emptyModel = {"id": "", "name": "", unknownCountryDetails: ""};
                self.columnDef = [
                    {
                        label:  self.fieldLabel,
                        binding: "name",
                        width: "50"
                    },
                    {
                        label: "UNKNOWN_COUNTRY_DETAILS",
                        binding: "unknownCountryDetails",
                        width: "50"
                    },
                ]
            } else {
                self.countryList = countries;
                self.hasUnknown = false;
                self.emptyModel = {"id": "", "name": ""};
                self.columnDef = [
                    {
                        label:  self.fieldLabel,
                        binding: "name",
                        width: "100"
                    }
                ]

            }

        }
        self.addNew = function () {
            console.log("adding a new value")
            var maxID = getListMaxID();
            var item = angular.copy(self.emptyModel);
            item.id = (getListMaxID() + 1);
            (self.model.list).push(item);
            setRecord(-1);
            self.resetToCollapsed = !self.resetToCollapsed;
            setRecord(self.model.list.length - 1);
            //self.editRecord(item);
            //self.onUpdate({list: self.model.list});

        };

        function setRecord(value) {
            self.selectRecord = value;

        }

        self.deleteRecord = function (_id) {
            //console.log("Deleting item: "+_id);

            var idx = self.model.list.indexOf(
                $filter('filter')(self.model.list, {id: _id}, true)[0]
            );
            if (idx < 0) return;

            self.model.list.splice(idx, 1);
            // self.onUpdate({list:self.model.list});
        };


        /***
         * Shows a control error if touched and invalid or remote trigger
         * @param isInvalid
         * @param isTouched
         * @returns {*}
         */
        self.showError = function (isInvalid, isTouched) {
            return ((isInvalid && isTouched) || (isInvalid && self.showErrors()))
        }

        function getListMaxID() {

            var out = 0;
            var list = self.model.list;
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id > out) {
                        out = list[i].id;
                    }
                }
            }
            return out;

        }
    }
})();