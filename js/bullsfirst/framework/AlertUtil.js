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
 * bullsfirst/framework/AlertUtil
 *
 * Utility functions showing alerts using jQuery Alerts
 * See: http://www.codeproject.com/Articles/295236/jQuery-UI-Alerts-Dialog-using-ThemeRollers
 *
 * @author Naresh Bhatia
 */
define(
    [
        'jqueryalerts'
    ],
    function() {
    'use strict';

    return {
        showError: function(message) {
            $.alert(message, {
                title: 'Error',
                icon: 'alert',
                buttons: {
                    'Ok': function() {
                        // make sure we always add this line in our handlers
                        $(this).dialog('close');
                    }
                }
            });
        }
    };
});