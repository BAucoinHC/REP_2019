/**
 * Created by Abdessamad on 9/21/2016.
 */

(function () {
    'use strict';

    angular
        .module('activeIngRecordModule', ['dossierDataLists','hpfbConstants'])
})();

(function () {
    'use strict';

    angular
        .module('activeIngRecordModule')
        .component('cmpActiveIngRecord', {
            templateUrl: 'app/scripts/components/formulations/tpl-active-ing-record.html',
            controllerAs: 'ingRecCtrl',
            controller: activeIngRecCtrl,
            bindings: {
                showErrors: '&',
                deleteBtn: '<',
                record: '<',
                onAddIng: '&',
                onUpdate: '&',
                onDelete: '&',
                onCancel: '&',
                isDetailValid: '&',
                recordIndex: '<'
            }

        });
    activeIngRecCtrl.$inject = ['DossierLists', '$scope','$translate', 'OTHER'];
    function activeIngRecCtrl(DossierLists, $scope, $translate,OTHER) {

        var self = this;
        self.nanoMaterialList = DossierLists.getNanoMaterials();
        self.yesNoList = DossierLists.getYesNoList();
        self.activeList = DossierLists.getActiveList();
        self.UnitsList=DossierLists.getUnitsList();
        self.savePressed = false;
        self.lang = $translate.proposedLanguage() || $translate.use();
        self.newIngred = false;
        self.ingModel = {
            newIngred: 'Y',
            ingId: "",
            ingLabel: "",
            cas: "",
            standard: "",
            strength: null,
            units: "",
            otherUnits:"",
            per: "",
            nanoMaterial: {id:"",en:"",fr:""},
            nanoMaterialOther: "",
            calcAsBase: "",
            humanAnimalSourced: ""
        };
        self.$onInit = function () {
            self.savePressed = false;
            self.backup = angular.copy(self.ingModel);
        };

        self.$onChanges = function (changes) {

            //TODO: move init code to changes event where it belongs
            if (changes.record && changes.record.currentValue) {
                //self.ingModel = changes.record.currentValue;
                self.ingModel = angular.copy(changes.record.currentValue);
                if (!self.ingModel.ingId) {
                    self.ingModel.newIngred = 'Y';
                    self.newIngred = true;
                } else {
                    self.ingModel.newIngred = 'N';
                    self.newIngred = false;
                }

            }
        };

        $scope.$watch('ingRecCtrl.newIngred', function () {
            if (self.newIngred === true) {
                self.ingModel.newIngred = 'Y';
                self.ingModel.ingId = "";
            } else {
                self.ingModel.newIngred = 'N';
            }
        }, true);

        /**
         * Only fires on selection from the list
         * @param item
         * @param model
         * @param label
         * @param event
         */
        self.ingredSelectionUpdated = function (item, model, label, event) {
            self.ingModel.ingId = item.id;
        };

        self.saveIng = function () {
            if (self.activeIngForm.$valid) {
                if (self.record) {
                    self.onUpdate({ing: self.ingModel});
                } else {
                    self.onAddIng({ing: self.ingModel});
                }
                self.activeIngForm.$setPristine();
                self.savePressed = false;
            } else {
                self.savePressed = true;
            }
        };

        self.discardChanges = function () {
            self.ingModel = angular.copy(self.backup);
            self.activeIngForm.$setPristine();
            self.onCancel();
        }

        self.delete = function () {
            if (self.record) {
                self.onDelete();
            }

        };

        self.copy = function () {
            var ingredientCopy = angular.copy(self.ingModel);
            self.onAddIng({ing: ingredientCopy});
        }




        /**
         * Controls showing errors for a field
         * @param isInvalid
         * @param isTouched
         * @returns {*}
         */
        self.showError = function (isInvalid, isTouched) {
            return ((isInvalid && isTouched) || (isInvalid && self.showErrors()) || (isInvalid && self.savePressed))
        }

        /**
         * Sets the state of the nanomaterial other field
         * @returns {boolean} true if other is the value
         */
        self.isNanoOther = function () {

            if (self.ingModel.nanoMaterial.id === DossierLists.getOtherValue()) {
                return true;
            } else {
                self.ingModel.nanoMaterialOther = "";
                return false;
            }
        };

        /**
         * @ngDoc determines if units Other should be shown
         * @returns {boolean}
         */
        self.isUnitsOther = function () {

            if(!self.ingModel) return false;
            if ((self.ingModel.units.id === OTHER)) {
                return true;
            } else {
                self.ingModel.otherUnits = "";
                return false;
            }
        };


        $scope.$watch('ingRecCtrl.activeIngForm.$dirty', function () {
            self.isDetailValid({state: !self.activeIngForm.$dirty});
        }, true);


    }

})();
