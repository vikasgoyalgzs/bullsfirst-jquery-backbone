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
 * bullsfirst/views/TemplateManager
 *
 * @author Naresh Bhatia
 */
define(['bullsfirst/framework/Formatter',
        'text!bullsfirst/templates/account.txt',
        'text!bullsfirst/templates/transfer.txt',
        'text!bullsfirst/templates/addExternalAccount.txt'],
       function (Formatter, accountTemplate, transferTemplate, addExternalAccountTemplate) {

    var templates;

    return {
        initialize: function() {
            this._registerHelpers();
            this.templates = {
                'account': Handlebars.compile(accountTemplate),
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
            return this.templates[name];
        }
    };
});