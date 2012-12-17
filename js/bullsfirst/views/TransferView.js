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
/*global $, alert, define, Backbone*/
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/ErrorUtil',
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/services/AccountService',
        'bullsfirst/services/InstrumentService',
        'bullsfirst/views/TemplateManager'],
       function (UserContext, ErrorUtil, Message, MessageBus, AccountService, InstrumentService, TemplateManager) {
    'use strict';
    return Backbone.ModalView.extend({
        events: {
            'click .transfer-tabbar a': 'selectTab',
            'click select[name=toAccount]': 'processToAccountSelection',
            'click #process-transfer-button': 'processTransfer',
            'click #add-external-account-button': 'addExternalAcoount'
        },

        selectTab: function (event) {
            var selectedTab = $(event.currentTarget),
                prevSelectedTab = $('.transfer-tabbar a.selected'),
                fieldContainers = $('.transfer-fields-container');

            if (selectedTab[0] !== prevSelectedTab[0]) {
                $('#transfer-form').validationEngine('hideAll');

                //toggle display of field containers (securities vs cash)

                fieldContainers.toggleClass('nodisplay');
                fieldContainers.find('input').toggleClass('validate[required]');

                //toggle selected tab
                selectedTab.toggleClass('selected');
                prevSelectedTab.toggleClass('selected');

                //re-attach validation engine
                $('#transfer-form').validationEngine();
            }
            return false;
        },

        processToAccountSelection: function (event) {
            //TODO: Find a better way to display empty option for a 'select' tag
            var toAccountDropdown = $(event.currentTarget),
                emptyOption = toAccountDropdown.find('option[value=""]');

            if (emptyOption) {
                emptyOption.hide();
            }
        },

        processTransfer: function () {
            //get the form currently being displayed
            var transferRequest,
                transferForm = $('#transfer-form');

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
            alert('Transfer processed');
            UserContext.updateAccounts();
            $('#modalCloseButton').click();
        },

        addExternalAcoount: function () {
            alert('Under Construction');
        },

        populateSymbolField: function () {
            //get instruments
            InstrumentService.getInstruments(function (data) {
                var instruments = $.map(data, function (instrument) {
                    return {
                        label: instrument.symbol + ' (' + instrument.name + ')',
                        value: instrument.symbol
                    };
                });
                $('#symbol').autocomplete({
                    source: instruments
                });
            }, ErrorUtil.showError);
        },

        render: function() {
            var template = TemplateManager.getTemplate('transfer'),
                accounts = this.model.toJSON(),
                selectedAccount = UserContext.getSelectedAccount(),
                that = this;

            $(this.el).html(template({
                accounts: accounts,
                selectedAccount: selectedAccount
            }));
            _.defer(function () {
                $('#transfer-form').validationEngine();
                that.populateSymbolField();
            });
            return this;
        }

    });
});