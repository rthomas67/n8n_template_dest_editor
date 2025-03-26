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

    // Stuff to match the new website styles - 2025/03/26
    let editPopupButtonStyleClassList = "btn flex items-center text-center relative justify-center px-6 font-normal whitespace-nowrap rounded-lg disabled:cursor-not-allowed btn-cta text-white font-geomanist-book min-h-12 text-large-button-text min-w-36 min-w-36"
    let editPopupButtonStyleOverrides = "overflow: hidden; --gradient-glow-x: 100%; --gradient-glow-y: 50%; --bg-color-1: hsla(0,0%,100%,0); --bg-color-2: #ff9b26; --bg-color-3: #ff0c00; --bg-color-4: #fd8925;" +
      " --bg-stop-1: 100%; --bg-stop-2: 150%; background: radial-gradient(5rem 80% at var(--gradient-glow-x) var(--gradient-glow-y),#fff,#ff9b26 90%),radial-gradient(5rem 80% at 100% 50%,#fff,#ff9b26 90%);" +
      " transition-duration: .45s; transition-property: --gradient-glow-x,--gradient-glow-y,--bg-color-1,--bg-color-2,--bg-stop-1,--bg-stop-2;"

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
            '.template-dest-editor-button { ' + editPopupButtonStyleOverrides + '}\n' +
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
        templateDestEditorUI.editorPopupButton = $('<button type="button" class="' + editPopupButtonStyleClassList + ' template-dest-editor-button"><span class="w-full"> Modify Template Destinations </span></button>')
        templateDestEditorUI.editorPopupButton.click(toggleEditableFormList);
        templateDestEditorUI.editorRoot.append(templateDestEditorUI.editorPopupButton);

        var templateDestinations = loadTemplateDestinations();
        templateDestEditorUI.editableListForm = buildEditableListForm(templateDestinations);
        templateDestEditorUI.editableListForm.hide();
        templateDestEditorUI.editorRoot.append(templateDestEditorUI.editableListForm);

        // Note: This doesn't work without the allDoneMutationObserver
        // OLD Website before 3/26/2025 - var pageAttachElementUseWorkflowButtonContainer = $('[class^="use-template-container_"]');
        var pageAttachElementUseWorkflowButtonContainer = $('[class^="hero-group-info"]');
        if (pageAttachElementUseWorkflowButtonContainer) {
            console.log(pageAttachElementUseWorkflowButtonContainer);
            pageAttachElementUseWorkflowButtonContainer.append(templateDestEditorUI.editorRoot);
        }
    }

})();