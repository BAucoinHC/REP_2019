/**
 * Created by Abdessamad on 7/5/2016.
 */

(function () {
    'use strict';

    angular
        .module('addressList', ['addressModule'])
})();

(function () {
    'use strict';

    angular
        .module('addressList')
        .component('cmpAddressList', {
            templateUrl: 'app/views/tpl-address-list.html',
            bindings: {
                formName: '<',
                addresses: '<',
                onUpdate: '&'
            },
            controller: addressListCtrl
        });

    addressListCtrl.$inject = ['$filter'];

    function addressListCtrl($filter) {

        var vm = this;
        vm.addressDetailsValid = true;
        //  vm.addressList = vm.addresses;
        //angular.copy(vm.addresses, vm.addressList);

        vm.$onInit = function () {

            vm.addressDetailsValid = true;
            vm.focused = false;

            vm.tableRowExpanded = false;
            vm.tableRowIndexCurrExpanded = "";
            vm.tableRowIndexPrevExpanded = "";
            vm.dayDataCollapse = [true, true, true, true, true, true];
            vm.transactionShow = 0;
            vm.newAdrFormShow = false;
            vm.addressList = vm.addresses;// ? vm.addressList : [];


            /*console.log("cmpAddressList $onInit: addressList " + JSON.stringify(vm.addresses));*/

        }

        vm.deleteAddress = function (aID) {
            var idx = vm.addressList.indexOf(
                $filter('filter')(vm.addressList, {addressID: aID}, true)[0]);
            console.log("cmpAddressList deleteAddress idx: " + idx);

            vm.addressList.splice(idx, 1);
            vm.onUpdate({newList:vm.addressList});
            vm.addressDetailsValid = true; //case that incomplete record is deleted
            if (vm.addressList.length == 0) {
                vm.resetTableRow();
            }
        }

        vm.addAddress = function () {

            var defaultAddress = {
                addressID: 145,
                companyName: "Test default",
                amendRecord: false,
                addressRole: {
                    manufacturer: false,
                    mailing: false,
                    billing: false,
                    importer: false
                },
                street: "",
                city: "",
                provLov: "",
                provState: "",
                province_text: "",
                country: "",
                postalCode: ""
            };
            //create a new address record and update the addresses
            vm.addressList.push(defaultAddress);
            vm.selectTableRow((vm.addressList.length - 1), "");

            //vm.newAdrFormShow = true;
            vm.addressDetailsValid = false;
            vm.onUpdate({newList:vm.addressList});

        }

        /* vm.updateAddress = function (address) {

            var idx = vm.addressList.indexOf(
                $filter('filter')(vm.addressList,{addressID: address.addressID},true)[0]
            );

            console.log("cmpAddressList updateAddress idx: " + idx);

            vm.addressList[idx] = address;
            vm.onUpdate({newList:vm.addressList});

         }*/
        vm.onUpdateAddressRecord = function (address) {
            console.log("Is there an address" + address)
            vm.addressDetailsValid = address.isDetailValid;
            var idx = vm.addressList.indexOf(
                $filter('filter')(vm.addressList, {addressID: address.addressID}, true)[0]
            );
            vm.addressList[idx] = address;
            vm.onUpdate({newList: vm.addressList});
        }

        vm.resetTableRow = function () {
            vm.tableRowIndexPrevExpanded = "";
            vm.tableRowExpanded = false;
            vm.tableRowIndexCurrExpanded = "";
        }

        vm.dayDataCollapseFn = function () {
            for (var i = 0; vm.addressList.length - 1; i += 1) {
                vm.dayDataCollapse.append('true');
            }
        };
        //dan seledcts table row
        vm.selectTableRow = function (index, adrId) {

            if (!vm.addressDetailsValid) return;

            if (vm.dayDataCollapse === 'undefined') {
                vm.dayDataCollapse = vm.dayDataCollapseFn();
            } else {
                    //case no previous row was expanded
                if (vm.tableRowExpanded === false && vm.tableRowIndexCurrExpanded === "") {
                    vm.tableRowIndexPrevExpanded = "";
                    vm.tableRowExpanded = true;
                    vm.tableRowIndexCurrExpanded = index;
                    // vm.storeIdExpanded = storeId;
                    vm.dayDataCollapse[index] = false;
                } else if (vm.tableRowExpanded === true) {
                    if (vm.tableRowIndexCurrExpanded === index) {
                        vm.tableRowExpanded = false;
                        vm.tableRowIndexCurrExpanded = "";
                        vm.dayDataCollapse[index] = true;
                    } else {
                        vm.tableRowIndexPrevExpanded = vm.tableRowIndexCurrExpanded;
                        vm.tableRowIndexCurrExpanded = index;
                        //  vm.storeIdExpanded = storeId;
                        vm.dayDataCollapse[vm.tableRowIndexPrevExpanded] = true;
                        vm.dayDataCollapse[vm.tableRowIndexCurrExpanded] = false;
                    }
                }
            }
        }

    }
})();