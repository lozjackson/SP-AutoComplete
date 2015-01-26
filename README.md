# SP-AutoComplete

v0.1.1

This AutoComplete tool is for use with SharePoint 2010 forms.  It uses jquery.SPServices to get list items from SharePoint
and then uses the jquery-UI AutoComplete widget to create an auto complete input field using the SharePoint list as source.

There is also an option to get an additional field from the source list and use that data to populate an additional field
on the SharePoint form.

Dependencies: 
* jquery-2.1.1.min.js (may work with other versions of jquery, but not tested)
* jquery-ui.min.js
* jquery-ui.min.css
* jquery.SPServices-2014.01.min.js (may work with other versions of jquery.SPServices, but not tested)

# Use

Instructions for creating an autocomplete input field
	
Use the following piece of script to add an autocomplete field.  This should be called once the page has finished loading.. 

ie. place it in jquery's document ready function.
	
	Example:
	 
	$(document).ready(function () {
		
		new AutoComplete({
			ListName: "Source List Name",													// Required
			FieldName: "Source Field Name",													// Required (Default: "Name")
			ACFormField: "The name of the form field to turn into an autocomplete field",	// Required (Default: "Name")
			ListSite: "Source List Site Name", 												// Optional
			AdditionalField: "Additional Source Field Name",								// Optional
			AdditionalFormField: "The form field to hold the additional info",				// Optional
		});
	
	});


# Options

Required:

	@param (String) ListName
		This is the list where the auto-complete data is stored.
		Required


Defaults:
		
	@param (String) FieldName
		This is the field in the 'ListName' list that the data is compiled from.
		Default: Name
		
	@param (String) ACFormField
		The 'ACFormField' is the textbox field that we want to turn into an auto-complete textbox field using Jquery-UI's auto-complete widget.
		Default: Name
			
	@param (Number) MinLength
		This is the minimum number of characters that needs to be typed before the auto-complete drop down list appears.
		Default: 1
	
	@param (Boolean) DisableSaveButton
		If true, then the save button will be disabled when the name field is invalid.
		Default: true
		
	@param (String) Http
		Specifiy 'http' or 'https'.  
		Default: http
	
	@param (String) HostName
		This is the server hostname.. ie. www.example.com
		Default: window.location.hostname
	
	@param (String) WebURL
		This is the site that hosts the list specified by ACListName.
		Default: Http + "://" + HostName + '/' + ListSite;


Optional:

	@param (String) ListSite
		This is the site the list is hosted on.  If not specified then the current SharePoint site will be used.
		This option only needs to be specified when the source list is on a different site/sub-site.
		Optional.
		
	@param (Function) ListItemProcess
		If a function is stored in this variable, then it will be applied to each list item before adding the item to the ACList Array.
		Optional
	
	@param (String) AdditionalField
		This is an optional second field in the ListName list that data is retrieved from. 
		This data will be placed in brackets after the ACFieldName value in the auto-complete list.
		ie. Name (Additional Info), where 'Name' is the value from ACFieldName, and 'Additional Info' is the value from AdditionalField.
		If this var is left blank, then no additional data will be retrieved.
		Optional
	
	@param (String) AdditionalFormField
		This is the field that the additional info will be placed into after the auto-complete field loses focus.
		Optional
