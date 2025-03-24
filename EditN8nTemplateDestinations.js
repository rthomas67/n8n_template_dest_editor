// ==UserScript==
// @name         Edit n8n Template Destinations
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  Add a little editor to manage Template Destinations
// @author       Someone Awesome
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        https://n8n.io/workflows/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=n8n.io
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $ */

    function getStringArrayFromStorage(keyName) {
        var val = localStorage.getItem (keyName);
        if (val == null) {
            return [];
        } else {
            return JSON.parse(val);
        }
    }

    function updateStringArrayToStorage(keyName, newValue) {
        var newStringValue = JSON.stringify(newValue);
        localStorage.setItem(keyName, newStringValue);
    }

    function addTemplateEditorCSS() {
        var cssString =
            '.template-editor-root {margin: 0px;padding: 0px; flex: left}' +
            '.template-editor-list {margin: 0px;padding: 0px;}' +
            '.template-editor-button { text-align: center; padding: 8px 12px; cursor: pointer; color: white; background-color: #d54b00; margin: 4px 2px; font-size: 16px; font-weight: bold }' +
            '.template-editor-body {padding: 5px 10px 15px;background-color:#F4F4F8;}'
            ;
        var head = document.getElementsByTagName('head')[0];
        if (!head) {
            console.log("Page doesn't have head section... can't add css");
            return;
        }
        var newCss = document.createElement('style');
        newCss.type = "text/css";
        newCss.innerHTML = cssString;
        head.appendChild(newCss);
    }

    function addTemplateEditor() {
        addTemplateEditorCSS();

        var templateDestEditorUI = {};
        templateDestEditorUI.editorRoot = $('<div class="template-editor-root"/>');
        templateDestEditorUI.editorPopupButton = $('<button class="template-editor-button">Modify Template Destinations</button>');
        templateDestEditorUI.editorRoot.append(templateDestEditorUI.editorPopupButton);

        // This breaks other JS on the page somehow
        var pageAttachElementLogo = $('.header__wrapper-logo');
        console.log(pageAttachElementLogo);
        pageAttachElementLogo.after(templateDestEditorUI.editorRoot);

        // var pageAttachElement = document.getElementsByClassName('header__wrapper-row')[0];
        // var pageAttachElement = $('.header__wrapper-row');
        // var pageAttachElement = $('.header  ');
        // pageAttachElement.append(templateDestEditorUI.editorRoot);
    }

    var templateDestinations = getStringArrayFromStorage('N8N_TEMPLATE_DESTINATIONS');
    console.log(JSON.stringify(templateDestinations));
    addTemplateEditor();


})();