/**
 * Created by dkilty on 03/04/2017.
 */


(function () {
    'use strict';

    angular
        .module('cspApplicant', [
            'contactModule',
            'addressModule'
        ]);

})();


(function () {
    'use strict';
    angular
        .module('cspApplicant')
        .component('cmpCspApplicant', {
            templateUrl: 'app/scripts/components/cspContactRecord/tpl-csp-applicant.html',
            controller: cspApplicantCtrl,
            controllerAs: 'cspApplCtrl',
            bindings: {
                record:'<',
                addApplicant:'&',
                deleteApplicant:'&'
            }
        });



   // cspApplicantCtrl.$inject = [];

    /* @ngInject */
    function cspApplicantCtrl() {
        var vm = this;
        vm.title = 'CspApplicantCtrl';
        vm.model={
            isBillingDifferent:false
        };
        vm.applicantTextAlias="APPLICANT";
        vm.$onInit=function(){
            //after on changes called
            if(vm.model && (!vm.model.role.applicant) ){
                vm.applicantTextAlias="COMPANY_NOABBREV";
            }else{
                vm.applicantTextAlias="APPLICANT";
            }
        };

        vm.$onChanges=function(changes){

           if(changes.record){
             vm.model=changes.record.currentValue;
           }

        };

        vm.setBilling=function(){
            if(vm.model.isBillingDifferent) {

                vm.addApplicant();
            }else{
               vm.deleteApplicant();
            }
        }

        ////////////////

    }

})();

