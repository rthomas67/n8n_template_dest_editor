# Summary
Adds a button with a slide-out text area for editing the list of
template destinations kept in the browser's local storage.

The items in the list get added when you click the template 
link in the instance, but then there's no way to remove
any old ones.

# How to Install
* This is a [UserScript](<https://openuserjs.org/about/Userscript-Beginners-HOWTO>)
* Install with the [TamperMonkey](<https://www.tampermonkey.net/>) browser extension.

# How to Use
Once the UserScript is installed and activated, navigate to one of the template
details pages (e.g. [Backup Tag-Selected Workflows to Gitlab](<https://n8n.io/workflows/2376-backup-tag-selected-workflows-to-gitlab/>) ) and the `Modify Template Destinations` button will appear below the `Use workflow` button.

* Click the button to open the list.
* Make changes to the list.
* Click the `Save` button.
* Reload the page.
  * TODO (maybe): Find a way to refresh the list that displays when `Use Workflow` is clicked, without reloading the page.
