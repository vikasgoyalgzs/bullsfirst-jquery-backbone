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
 * bullsfirst/views/PositionsTabView
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'bullsfirst/domain/UserContext',
        'bullsfirst/views/PositionSelectedAccountView',
        'bullsfirst/views/AccountSelectorView',
        'bullsfirst/views/PositionTableView'
    ],
    function(Backbone, UserContext, PositionSelectedAccountView, AccountSelectorView, PositionTableView) {
        'use strict';

        return Backbone.View.extend({

            accountSelectorView: null,
            positionSelectedAccountView: null,
            positionTableView: null,

            el: '#positions-tab',

            initialize: function(/* options */) {
                this.accountSelectorView = new AccountSelectorView({
                    el: '#postab-account-selector',
                    collection: UserContext.getBrokerageAccounts()
                });

                this.positionSelectedAccountView = new PositionSelectedAccountView({
                    el: '#postab-selected-account-name',
                    collection: UserContext.getBrokerageAccounts()
                });

                this.positionTableView = new PositionTableView({
                    collection: UserContext.getBrokerageAccounts()
                });
            },

            updatePositions: function() {
                UserContext.updateAccounts();
            }

        });
    }
);