# SP-AutoComplete 

v0.1.3

This auto-complete tool is for use with SharePoint 2010 forms.  It uses jquery.SPServices to get list items from SharePoint
and then uses the jquery-UI AutoComplete widget to create an auto complete input field using the SharePoint list as source.

There is also an option to get an additional field from the source list and use that data to populate an additional field
on the SharePoint form.


# Dependencies  

* jQuery
* jQuery-UI
* jQuery.SPServices


# Use

Use the following script (see example) to add an auto-complete field to a SharePoint 2010 form.  This should be called once the page has finished loading..  ie. place it in jquery's document ready function.

1. Set `ListName` to the name of the list where the auto-complete source data is stored.  This is the only required parameter.

2. Set `FieldName` to the name of the column to use from that list.  This parameter is optional and will default to 'Name' if not specified.

3. Set the `ACFormField` parameter to the title of your input element that you want to transform into an auto-complete field.  This parameter is optional and will default to 'Name' if not specified.

You can also specify an additional column to be fetched from the source list by setting `AdditionalField` to the name of the additional column to be fetched.
This data will be set in brackets and appended to the first field.  ie. "Name (Comment)" - where Name is the data value from `FieldName`, and Comment is the value from `AdditionalField`.

If you set `AdditionalFormField` to another input element in your form, then it's value will be set to the value of `AdditionalField`.


# Example
	 
	$(document).ready(function () {
		
		new AutoComplete({
			ListName: "Source List Name",												// Required
			FieldName: "Source Field Name",												// Default: "Name"
			ACFormField: "The name of the auto-complete input element on your form",	// Default: "Name"
			
			AdditionalField: "Additional Source Field Name",							// Optional
			AdditionalFormField: "The form field to hold the additional info",			// Optional
		});
	
	});



# Options

Required:

* `ListName` (String)  
This is the list where the auto-complete data is stored.  
Required


Defaults:
	
* `FieldName` (String)  
This is the field in the `ListName` list that the data is compiled from.  
Default: Name
	
* `ACFormField` (String)  
The `ACFormField` is the textbox field that we want to turn into an auto-complete textbox field using Jquery-UI's auto-complete widget.  
Default: Name
	
* `MinLength` (Number)  
This is the minimum number of characters that needs to be typed before the auto-complete drop down list appears.  
Default: 1
	
* `DisableSaveButton` (Boolean)  
If true, then the save button will be disabled when the name field is invalid.  
Default: true


Optional:
	
* `ListItemProcess` (Function)  
If a function is stored in this variable, then it will be applied to each list item before adding the item to the `ACList` Array.  
Optional

* `AdditionalField` (String)  
This is an optional second field in the `ListName` list that data is retrieved from.  This data will be placed in brackets after the `ACFieldName` value in the auto-complete list.  ie. "Name (Additional Info)", where 'Name' is the value from `ACFieldName`, and 'Additional Info' is the value from `AdditionalField`.  If this var is left blank, then no additional data will be retrieved.  
Optional
	
* `AdditionalFormField` (String)  
This is the field that the additional info will be placed into after the auto-complete field loses focus.  
Optional

* `ListSite` (String)  
This is the site the list is hosted on.  If not specified then the current SharePoint site will be used.  This option only needs to be specified when the source list is on a different site/sub-site.  
Optional.  Default: Current SharePoint site.

* `Http` (String)  
Specifiy 'http' or 'https'.  
Optional.  Default: http

* `HostName` (String)  
This is the server hostname.. ie. www.example.com  
Optional.  Default: window.location.hostname

* `WebURL` (String)  
This is the site that hosts the list specified by `ListName`.  
Optional.  Default: `Http + "://" + HostName + '/' + ListSite;`
