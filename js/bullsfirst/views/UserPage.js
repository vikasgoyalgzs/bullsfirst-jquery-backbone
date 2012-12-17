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
       function (UserContext, Message, MessageBus, Page, AccountsTabView, OrdersTabView, PositionsTabView, TabbarView, TransactionsTabView, UsernameView, TransferView) {

    return Page.extend({
        el: '#user-page',

        events: {
            'click #sign-out': 'logout',
            'click #trade-button': 'trade',
            'click #transfer-button': 'transfer',
            'click #modalCloseButton': 'closeModalWindow'
        },

        initialize: function() {
            new UsernameView({model: UserContext.getUser()});
            new TabbarView({el: '#user-page .tabbar'});
            new AccountsTabView();
            new PositionsTabView();
            new OrdersTabView();
            new TransactionsTabView();

            // Subscribe to events
            MessageBus.on(Message.UserLoggedInEvent, function() {
                UserContext.updateAccounts();
            });
        },

        closeModalWindow: function () {
            $('#transfer-button').removeClass('buttonPressed');
            $('#transfer-forms-container form').validationEngine('hideAll');
        },

        logout: function() {
            UserContext.reset();
            MessageBus.trigger(Message.UserLoggedOutEvent);
            return false;
        },

        trade: function() {
            alert('Trade');
            return false;
        },

        transfer: function (event) {
            var transferButton = $(event.currentTarget),
                transferView = new TransferView({ model: UserContext.getBaseAccounts() });

            transferButton.addClass('buttonPressed');
            transferView.render().showModal(
                {
                    backgroundClickClosesModal: false,
                    "targetContainer": $("#transfer-window").draggable(),
                    css: {
                        "right": "0px",
                        "bottom": "0px",
                        "padding": "10px",
                        "background-color": "transparent"
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