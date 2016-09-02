/**
 * Created by dkilty on 8/26/2016.
 */
(function () {
    'use strict';
    angular
        .module('activityApp', [
            'pascalprecht.translate',
            'ngMessages',
            'ngAria',
            'fileIO',
            'ngSanitize',
            'activityService',
            'applicationInfoService',
            'applicationInfo',
            'filterLists',
            'relatedActivityList',
            'activityChange',
            'activityForm',
            'numberFormat',
            'contactModule26'

        ])
})();

(function () {
    'use strict';
    angular
        .module('activityApp')
        .controller('MainController', MainController);

    MainController.$inject = ['ActivityService', 'ApplicationInfoService', 'hpfbFileProcessing', '$filter', '$scope', '$location']

    function MainController(ActivityService, ApplicationInfoService, hpfbFileProcessing, $filter, $scope, $location) {

        var vm = this;
        //TODO magic number

        vm.isIncomplete = true;
        vm.userType = "EXT";
        vm.saveXMLLabel = "SAVE_DRAFT"
        vm.updateValues = 0;
        vm.setAmendState = _setApplTypeToAmend;
        vm.showContent = _loadFileContent;
        vm.disableXML = true;
        vm.activityService = new ActivityService();
        vm.applicationInfoService = new ApplicationInfoService();
        vm.rootTag = vm.activityService.getRootTag();
        vm.activityRoot = vm.activityService.getModelInfo();
        vm.configField = {
            "label": "CONTROL_NUMBER",
            "fieldLength": "6",
            "tagName": "dstsControlNumber"
        };
        vm.yesNoList=["Y","N"]
        vm.initUser = function (id) {
            if (!id) id = 'EXT'
            vm.userType = id;
            if (id == 'INT') {
                vm.saveXMLLabel = "APPROVE_FINAL"
            } else {
                vm.saveXMLLabel = "SAVE_DRAFT"
            }

        }

        /**
         * @ngdoc method -returns whether this application is an amendment
         * @returns {boolean}
         */
        vm.isAmend = function () {
            //return true
            return (vm.activityRoot.applicationType ===  vm.applicationInfoService.getAmendType())
        }


        /**
         *
         * @ngdoc method Saves the model content in JSON format
         */
        vm.saveJson = function () {
            var writeResult = _transformFile()
            hpfbFileProcessing.writeAsJson(writeResult, "activityEnrol", vm.rootTag);
        }
        /**
         * @ngdoc method - saves the data model as XML format
         */
        vm.saveXML = function () {
            var writeResult = _transformFile()
            hpfbFileProcessing.writeAsXml(writeResult, "activityEnrol", vm.rootTag);
        }

        vm.showError = function (isTouched, isInvalid) {

            if ((isInvalid && isTouched) || (vm.showErrors() && isInvalid )) {
                return true
            }
            return false
        }
        vm.showErrorCheck = function (isTouched, value) {

            if ((!value && isTouched) || (vm.showErrors() && !value )) {
                return true
            }
            return false
        }

        //TODO handled save pressed?
        vm.showErrors = function () {
            return false;
        }
        vm.setThirdParty = function () {
            console
            vm.thirdPartyState = (vm.activityRoot.isThirdParty === "Y")
        }
        /**
         * @ngdcc method updates data and increments version before creating json
         */
        function _transformFile() {
            updateDate();
            if (!vm.isExtern()) {
                vm.applicationInfoService.incrementMajorVersion();
                updateModelOnApproval();
            } else {
                vm.applicationInfoService.incrementMinorVersion();
            }
            _updateInfoValues();
            var writeResult = vm.activityService.transformToFileObj(vm.activityRoot);
            return writeResult;
        }

        function _updateInfoValues() {
            vm.updateValues++;
        }

        $scope.$watch("main.activityEnrolForm.$valid", function () {
            disableXMLSave()
        }, true);

        function disableXMLSave() {

            vm.disableXML = vm.activityEnrolForm.$invalid || (vm.activityRoot.applicationType == vm.applicationInfoService.getApprovedType() && vm.isExtern())
        }

        function disableJSONSave() {

            vm.disableJson = (vm.activityRoot.applicationType ==  vm.applicationInfoService.getApprovedType() && vm.isExtern())
        }

        function _setComplete() {
            vm.isIncomplete = !vm.activityRoot.dstsControlNumber;
        }

        function _loadFileContent(fileContent) {
            if (!fileContent)return;
            vm.activityService = new ActivityService();
            var resultJson = fileContent.jsonResult;
            if (resultJson) {
                vm.activityService.transformFromFileObj(resultJson);
                vm.activityRoot = {};
                vm.activityRoot = {};
                angular.extend(vm.activityRoot, vm.activityService.getModelInfo())
                _setComplete();
            }
            disableXMLSave();
        };
        /**
         * ngdoc method to set the application type to amend
         * @private
         */
        function _setApplTypeToAmend() {

            vm.activityRoot.applicationType = vm.ApplicationInfoService.getAmendType();
            disableXMLSave();
        }

        /**
         * @ngdoc method -updates the date field to the current date
         */
        function updateDate() {
            if (vm.activityRoot) {
                vm.activityRoot.dateSaved =  vm.applicationInfoService.getTodayDate();
            }
        }

        vm.isExtern = function () {
            if (vm.userType == "EXT") {
                return true;
            }
            return false;
        }

    }
})();

(function () {
    'use strict';
    angular
        .module('activityApp')
        .config(['$translateProvider', function ($translateProvider) {
            $translateProvider.useStaticFilesLoader({
                files: [
                    {
                        prefix: 'app/resources/countries-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/address-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/stateProvinces-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/general-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/fileIO-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/messages-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/contact-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/applicationInfo-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/activityInfo-',
                        suffix: '.json'
                    },
                    {
                        prefix: 'app/resources/activityList-',
                        suffix: '.json'
                    }

                ]
            })
            $translateProvider.preferredLanguage('en');
            //this prevents conflicts with ngMessage
            $translateProvider.directivePriority(1);
            $translateProvider.useSanitizeValueStrategy('sanitize');
        }]);
})();