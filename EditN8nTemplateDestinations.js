// ==UserScript==
// @name         Edit n8n Template Destinations
// @namespace    http://tampermonkey.net/
// @version      2025-03-24
// @description  Add a little editor to manage Template Destinations
// @author       Someone Awesome
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        https://n8n.io/workflows*
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
            '.template-dest-editor-root {margin: 0px;padding: 0px; flex: left}\n' +
            '.template-dest-editor-button { display: flex; text-align: center; justify-content: space-between; padding: 2rem 24px; cursor: pointer; color: white; background-color: #1c9985; width: 100%; margin-top: 4px; font-size: 1.8rem; font-family: moderat; border-radius: 8px; border: 2px solid #1c9985;}\n' +
            '.template-dest-editor-body { padding: 5px 10px 15px; margin-top: 4px; background-color:#BBDEFB; position: relative; width: 100%; min-width: 150px; min-height: 200px;}\n' +
            '.template-dest-editor-form { width: 100%; }\n' +
            '.template-dest-editor-layout { display: flex; flex-direction: column; justify-content: space-around; align-items: stretch; width: 100%; }\n' +
            '.template-dest-editor-textarea { min-height: 150px; width: 100%; }\n' +
            '.template-dest-editor-save-button { width: 25%; }\n'
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

    var allDoneMutationObserver = new MutationObserver(resetTimer);
    var timer = setTimeout(action, 3000, allDoneMutationObserver);
    // reset timer every time something changes
    function resetTimer(changes, allDoneMutationObserver) {
        clearTimeout(timer);
        timer = setTimeout(action, 3000, allDoneMutationObserver);
    }

    function action(observer) {
        allDoneMutationObserver.disconnect();
        addTemplateEditor();
    }

    function loadTemplateDestinations() {
        let templateDestinations = getStringArrayFromStorage('N8N_TEMPLATE_DESTINATIONS');
        console.log(JSON.stringify(templateDestinations));
        return templateDestinations;
    }

    function saveTemplateDestinations() {
        var templateDestinationsTextAreaValue = $('.template-dest-editor-textarea').val();
        console.log(templateDestinationsTextAreaValue);
        // TODO: clean up some editing mistakes (extra linefeed, blank lines, etc.)
        var templateDestinationsArray = templateDestinationsTextAreaValue.split('\n');
        updateStringArrayToStorage('N8N_TEMPLATE_DESTINATIONS', templateDestinationsArray);
        toggleEditableFormList();
    }

    function buildEditableListForm(arrayOfItems) {
        var editableListFormDiv = $('<div id="editable-list-form" class="template-dest-editor-body" />');
        // var editableListForm = $('<form class="template-dest-editor-form" />');
        // editableListFormDiv.append(editableListForm);
        var editableFormLayoutContainer=$('<div class="template-dest-editor-layout" />');
        // editableListForm.append(editableFormLayoutContainer);
        editableListFormDiv.append(editableFormLayoutContainer);
        var textArea = $('<textarea class="template-dest-editor-textarea" />');
        editableFormLayoutContainer.append(textArea);
        var textAreaContent = arrayOfItems.join('\n');
        textArea.val(textAreaContent);
        var saveButton = $('<button class="template-dest-editor-save-button">Save</button>');
        saveButton.click(saveTemplateDestinations);
        editableFormLayoutContainer.append(saveButton);
        return editableListFormDiv;
    }

    function toggleEditableFormList() {
        let listForm = $('#editable-list-form');
        // console.log(listForm);
        listForm.toggle();
    }

    function addTemplateEditor() {
        addTemplateEditorCSS();

        var templateDestEditorUI = {};
        templateDestEditorUI.editorRoot = $('<div class="template-dest-editor-root"/>');
        templateDestEditorUI.editorPopupButton = $('<button class="template-dest-editor-button">Modify Template Destinations</button>')
        templateDestEditorUI.editorPopupButton.click(toggleEditableFormList);
        templateDestEditorUI.editorRoot.append(templateDestEditorUI.editorPopupButton);

        var templateDestinations = loadTemplateDestinations();
        templateDestEditorUI.editableListForm = buildEditableListForm(templateDestinations);
        templateDestEditorUI.editableListForm.hide();
        templateDestEditorUI.editorRoot.append(templateDestEditorUI.editableListForm);

        // Note: This doesn't work without the allDoneMutationObserver
        var pageAttachElementUseWorkflowButtonContainer = $('[class^="use-template-container_"]');
        if (pageAttachElementUseWorkflowButtonContainer) {
            console.log(pageAttachElementUseWorkflowButtonContainer);
            pageAttachElementUseWorkflowButtonContainer.append(templateDestEditorUI.editorRoot);
        }
    }

})();