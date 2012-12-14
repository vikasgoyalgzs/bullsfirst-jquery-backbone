/**
 * Copyright 2012 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * bullsfirst/views/TransferView
 *
 * @author Vikas Goyal
 */
/* jslint flags */
/*global $, jQuery, define, Backbone, _*/
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/ErrorUtil',
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/services/AccountService',
        'bullsfirst/views/TemplateManager'],
       function (UserContext, ErrorUtil, Message, MessageBus, AccountService, TemplateManager) {

    return Backbone.ModalView.extend({
        events: {
            'click .transfer-tabbar a': 'selectTab',
            'click select[name=toAccount]': 'processToAccountSelection',
            'click #process-transfer-button': 'processTransfer',
            'click #add-external-account-button': 'addExternalAcoount'
        },

        selectTab: function (ev) {
            var selectedTab = $(ev.currentTarget),
                prevSelectedTab = $('.transfer-tabbar a.selected'),
                securitiesForm = $('#securities-transfer-form'),
                cashForm = $('#cash-transfer-form');

            if (selectedTab !== prevSelectedTab) {
                $('#transfer-forms-container form').validationEngine('hideAll');

                //toggle display of forms
                securitiesForm.toggleClass('nodisplay');
                cashForm.toggleClass('nodisplay');

                //toggle selected tab
                selectedTab.toggleClass('selected');
                prevSelectedTab.toggleClass('selected');
            }
            return false;
        },

        processToAccountSelection: function (event) {
            //TODO: Find a better way to display empty 'select' tag
            var toAccountDropdown = $(event.currentTarget),
                emptyOption = toAccountDropdown.find('option[value=""]');

            if (emptyOption) {
                emptyOption.hide();
            }
        },

        processTransfer: function () {
            //get the form currently being displayed
            var transferRequest,
                transferForm = $('#transfer-forms-container form').not('.nodisplay');

            if (transferForm.validationEngine('validate')) {
                transferRequest = transferForm.serializeForm();
                //if the price is non-zero, the request is for securities transfer
                if (transferRequest.price) {
                    this.transferSecurities(transferRequest);
                } else {
                    this.transferCash(transferRequest);
                }
            }
            return false;
        },

        transferCash: function (transferCashRequest) {
            AccountService.transferCash(transferCashRequest.fromAccount,
                {
                    toAccountId: transferCashRequest.toAccount,
                    amount: transferCashRequest.amount
                }, _.bind(this.transferProcessed, this), ErrorUtil.showError);
        },

        transferSecurities: function (transferSecuritiesRequest) {
            AccountService.transferSecurities(transferSecuritiesRequest.fromAccount,
                {
                    toAccountId: transferSecuritiesRequest.toAccount,
                    symbol: transferSecuritiesRequest.symbol,
                    quantity: transferSecuritiesRequest.quantity,
                    pricePaidPerShare: {
                        amount: transferSecuritiesRequest.price,
                        currency: 'USD'
                    }
                }, _.bind(this.transferProcessed, this), ErrorUtil.showError);
        },
        
        transferProcessed: function () {
            alert("Transfer processed");
            UserContext.updateAccounts();
            $('#modalCloseButton').click();
        },

        addExternalAcoount: function () {
            alert('Under Construction');
        },

        render: function() {
            var template = TemplateManager.getTemplate('transfer'),
                accounts = this.model.toJSON(),
                selectedAccount = UserContext.getSelectedAccount();

            $(this.el).html(template({
                accounts: accounts,
                selectedAccount: selectedAccount
            }));
            _.defer(function () {
                $('#securities-transfer-form').validationEngine();
                $('#cash-transfer-form').validationEngine();
            })
            return this;
	    }

    });
});