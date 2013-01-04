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
 * bullsfirst/views/TemplateManager
 *
 * @author Naresh Bhatia
 */
define(
    [
        'bullsfirst/framework/Formatter',
        'handlebars',
        'text!bullsfirst/templates/account.html',
        'text!bullsfirst/templates/account-selector.html',
        'text!bullsfirst/templates/position.html',
        'text!bullsfirst/templates/transfer.html',
        'text!bullsfirst/templates/addExternalAccount.html'
    ],
    function(Formatter, Handlebars, accountTemplate, accountSelectorTemplate, positionTemplate, transferTemplate, addExternalAccountTemplate) {
        'use strict';

        var _templates;

        return {
            initialize: function() {
                this._registerHelpers();
                _templates = {
                    'account': Handlebars.compile(accountTemplate),
                    'account-selector': Handlebars.compile(accountSelectorTemplate),
                    'position': Handlebars.compile(positionTemplate),
                    'transfer': Handlebars.compile(transferTemplate),
                    'addExternalAccount': Handlebars.compile(addExternalAccountTemplate)
                };
            },

            _registerHelpers : function() {
                Handlebars.registerHelper('formatMoney', function(money) {
                    return Formatter.formatMoney(money);
                });
                Handlebars.registerHelper('ifEqual', function (left, right, options) {
                if (Handlebars.Utils.isEmpty(left) ||
                    Handlebars.Utils.isEmpty(right) ||
                    (left !== right)) {
                    return options.inverse(this);
                } else {
                    return options.fn(this);
                }
            });
            },

            getTemplate: function(name) {
                return _templates[name];
            }
        };
    }
);