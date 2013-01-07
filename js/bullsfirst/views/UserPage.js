﻿/**
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
 * bullsfirst/views/UserPage
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/domain/UserContext',
        'bullsfirst/framework/Message',
        'bullsfirst/framework/MessageBus',
        'bullsfirst/framework/Page',
        'bullsfirst/views/AccountsTabView',
        'bullsfirst/views/OrdersTabView',
        'bullsfirst/views/PositionsTabView',
        'bullsfirst/views/TabbarView',
        'bullsfirst/views/TransactionsTabView',
        'bullsfirst/views/UsernameView',
        'bullsfirst/views/TransferView'],
       function(UserContext, Message, MessageBus, Page, AccountsTabView, OrdersTabView, PositionsTabView, TabbarView,
                TransactionsTabView, UsernameView, TransferView) {
    'use strict';

    return Page.extend({
        usernameView: null,
        tabbarView: null,
        accountsTabView: null,
        positionsTabView: null,
        ordersTabView: null,
        transactionsTabView: null,

        events: {
            'click #sign-out': 'logout',
            'click #trade-button': 'trade',
            'click #transfer-button': 'transfer',
            'click #modalCloseButton': 'closeModalWindow'
        },

        initialize: function() {
            this.usernameView = new UsernameView({el: '.username-view', model: UserContext.getUser()});
            this.tabbarView = new TabbarView({el: '#user-page .tabbar'});
            this.accountsTabView = new AccountsTabView({el: '#accounts-tab'});
            this.positionsTabView = new PositionsTabView({el: '#positions-tab'});
            this.ordersTabView = new OrdersTabView({el: '#orders-tab'});
            this.transactionsTabView = new TransactionsTabView({el: '#transactions-tab'});

            // Subscribe to events
            MessageBus.on(Message.UserLoggedInEvent, function() {
                UserContext.updateAccounts();
            });
        },

        closeModalWindow: function () {
            $('#transfer-button').removeClass('buttonPressed');
            $('#transfer-form').validationEngine('hideAll');
        },

        logout: function() {
            UserContext.reset();
            MessageBus.trigger(Message.UserLoggedOutEvent);
            return false;
        },

        trade: function() {
            return false;
        },

        transfer: function (event) {
            var transferButton = $(event.currentTarget),
                transferView = new TransferView({ model: UserContext.getBaseAccounts() });

            transferButton.addClass('buttonPressed');
            transferView.render().showModal(
                {
                    backgroundClickClosesModal: false,
                    'targetContainer': $('#transfer-window').draggable(),
                    //TODO: move this to a css file
                    css: {
                        'top': '0px',
                        'right': '0px',
                        'padding-left': '9.5px',
                        'padding-right': '9.5px',
                        'background-color': 'transparent'
                    }
                }
            );
            return false;
        },

        selectTab: function(tab) {
            this.$el.find('.tab').each(function() {
                if (this.id === tab) {
                    $(this).removeClass('nodisplay');
                }
                else {
                    $(this).addClass('nodisplay');
                }
            });
        }
    });
});