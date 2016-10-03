/**
 * Created by Abdessamad on 7/5/2016.
 */

(function () {
    'use strict';

    angular
        .module('contactModule', [
            'dataLists'
        ])
})();

(function () {
    'use strict';

    angular
        .module('contactModule')
        .component('cmpContactDetails',{
            templateUrl: './components/contactDetails/tpl-contact-details.html',
            controller: contactCtrl,
            bindings: {
                contactRecord: '<',
                onUpdate: '&', //should be removed not used, deprecated
                isAmend: '<',
                showErrors: '&'
            }
    });

    contactCtrl.$inject = ['getContactLists']
    function contactCtrl( getContactLists) {
        var vm = this;
        vm.isEditable = true;
        vm.ngModelOptSetting = {updateOn: 'blur'}
        vm.salutationList = getContactLists.getSalutationList();
        vm.langCorrespondance = getContactLists.getLanguages();
        vm.phoneReg=/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        vm.contactModel = {
            isDetailValid: false,
            contactId: "",
            amendRecord: false,
            addressRole: {
                manufacturer: false,
                mailing: false,
                billing: false,
                importer: false
            },
            contactRole: "",
            salutation: "",
            givenName: "",
            surname: "",
            initials: "",
            title: "",
            phone: "",
            PhoneExt: "",
            fax: ""
        };
        vm.$onInit = function () {
            /*console.log("init contact details");
           if (vm.contactRecord) {
                //doesn't copy as this is a dumb component
                vm.contactModel = vm.contactRecord;
             }*/
        }
        //TODO rename
        vm.$onChanges=function(changes){
            if(changes.contactRecord){
                vm.contactModel = changes.contactRecord.currentValue;

            }
            if (changes.isAmend) {
                vm.isEditable = changes.isAmend.currentValue;
            }

        }
        vm.showError=function(ctrl){
            if((ctrl.$invalid && ctrl.$touched) || (vm.showErrors()&&ctrl.$invalid )){
                return true
            }
            return false
        }

    }

})();

