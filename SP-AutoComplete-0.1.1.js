/********************************************************************************************************************
* SP-AutoComplete v0.1.1
*
* Modified by: Loz Jackson
* Last Modified: 2015-01-26 15:13
*
* Dependencies: 
* jquery-2.1.1.min.js (may work with other versions of jquery, but not tested)
* jquery-ui.min.js
* jquery-ui.min.css
* jquery.SPServices-2014.01.min.js (may work with other versions of jquery.SPServices, but not tested)
*
********************************************************************************************************************/

/*
	Instructions for creating an autocomplete field
	
	1. Include this file.
	2. Use the following piece of script to add an autocomplete field.  
		This should be called once the page has finished loading.. ie. place it in jquery's document ready function.
	
	<script>
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
	</script>

*/

(function (d,w) {

	w.AutoComplete = function () 
	{
		var that = this,
		
			/*
				@param (Boolean) ACFormFieldValid
					Stores the valid status of the name Field
			*/
			ACFormFieldValid,
			
			/*
				@param (Object) SaveButton
					A reference to the save button
			*/
			SaveButton,
			
			/*
				@param (Boolean) SaveDisabled
					Stores the disabled status of the Save button
			*/
			SaveDisabled = false;
			
		/*
			@param (String) ListName
				This is the list where the auto-complete data is stored
		*/
		this.ListName 				= null;
		
		/*
			@param (String) FieldName
				This is the field in the ACListName list that the data is compiled from
		*/
		this.FieldName 				= "Name";
		
		/*
			@param (String) AdditionalField
				This is an optional second field in the ACListName list that data is retrieved from. This data will be placed in brackets after the ACFieldName value in the auto-complete list.
				ie. Student Name (Tutor Group), where 'Student Name' is the value from ACFieldName, and 'Tutor Group' is the value from ACAdditionalField
				If this var is left blank, then no additional data will be retrieved.
		*/
		this.AdditionalField 		= null;
		
		/*
			@param (Number) MinLength
				This is the minimum number characters that needs to be typed before the auto-complete drop down list appears
		*/
		this.MinLength 				= 1;
		
		/*
			@param (String) ACFormField
				The 'ACFormField' is the textbox field that we want to turn into an auto-complete textbox field using Jquery-UI's auto-complete widget
		*/
		this.ACFormField 			= "Name";
		
		//this.CheckFields = [this];
		
		/*
			@param (String) AdditionalFormField
				This is the field that the additional info will be placed into after the auto-complete field loses focus
		*/
		this.AdditionalFormField 	= null;
		
		/*
			@param (String) HostName
				This is the server hostname.. ie. sharepoint.stantonbury.org.uk
		*/
		this.HostName 				= w.location.hostname;
		
		/*
			@param (String) ListSite
				This is the site the list is hosted on.  If not specified then the current SharePoint site will be used.
				This option only needs to be specified when the source list is on a different site/sub-site.
				Optional.
		*/
		this.ListSite				= null;
		
		/*
			@param (String) Http
				Specifiy 'http' or 'https'.  Default: 'http'
		*/
		this.Http 					= 'http';
		
		/*
			@param (String) WebURL
				This is the site that hosts the list specified by ACListName
		*/
		this.WebURL					= null
		
		/*
			@param (Function) ListItemProcess
				If a function is stored in this variable, then it will be applied to each list item before adding it to the ACList.
		*/
		this.ListItemProcess 		= null;
		
		/*
			@param (Boolean) DisableSaveButton
				If true, then the save button will be disabled when the name field is invalid
		*/
		this.DisableSaveButton 		= true;
		
		/*
			@Array ACList
				This is an array variable to store the students list when the setupAutoCompleteField function is called
		*/
		this.ACList 				= [];
		
		/*
			@method checkField
				This function checks the name by calling checkACList(name) 
				If no name is found, then it checks if the name has a space in it.
				And if it does, it then assumes 'firstname surname', converts it to 'surname, firstname', then calls checkACList(name) again
			
			@param (String) name
				The name to be checked.
				
		*/
		this.checkField = function(name)
		{
			//console.log(that.ListName);
			//var name = that.ACFormField.val();
			
			ACFieldValid(false);
			
			if (name) 
			{
				checkACList(name);
				
				if (!ACFieldValid() && name.search(' ') >= 0)
				{
					var nameParts = name.split(' ');
					name = nameParts[1] + ', ' + nameParts[0];
					checkACList(name);
				} 
			}
		}
		
		/*
			@method getAdditionalField
			This function gets the tutor group part of the value in the ACField
		*/
		this.getAdditionalField = function (ACField) 
		{
			
			if (!ACField) return false;
			
			// get the tutor group part of the value in the field.
			var tg = ACField.val().substring(ACField.val().indexOf('(') + 1, ACField.val().indexOf(')'))
			
			// set the tutor group value in the Tutor Group field
			if (that.AdditionalFormField) $("input[title='" + that.AdditionalFormField + "']").val(tg);
			
			// remove the tutorGroup part from the name
			ACField.val(ACField.val().replace(' (' + tg + ')', ''));
		}
		
		/*
			@method checkACList(
				This function checks that the name is in the ACList - it searches the ACList for an entry that contains the name specified
					- If it can't find the name, it does nothing
					- If it finds the name to be correct then it calls ACFieldValid(true) and then attempts to get the additional field value
			
			@param (String) name
				The name to be checked.
				
		*/
		function checkACList(name) 
		{
			$(that.ACList).each(function(key, value) {
				if (value.toLowerCase().search(name.toLowerCase()) !== -1) 
				{
					ACFieldValid(true);
					that.ACFormField.val(value);
					if (that.AdditionalField && that.AdditionalFormField) that.getAdditionalField(that.ACFormField);
					return false;
				}
			});
		}
		
		/*
			@method ACFieldValid
				This function sets the border style on the Name field and also disables/enables the save button
			
			@param (bool) valid
				This is a boolean property that when true will set the Name field to be valid
				If this property is undefined then just return without setting anything
				
			@return (bool)
				Returns the value of ACFormFieldValid
				
		*/
		function ACFieldValid(valid) 
		{
			var borderStyle;
			
			if (valid === undefined) return ACFormFieldValid;
			
			if (valid) 
			{
				borderStyle = '2px inset #EEE';
				ACFormFieldValid = true;
			}
			else 
			{
				borderStyle = '2px dashed red';
				ACFormFieldValid = false;
			}
			
			that.ACFormField.css('border', borderStyle);
			disableSave(SaveDisabled);
			return ACFormFieldValid;
		}
		
		/*
			@method disableSave
				This function disables/enables the save button
				
			@param (bool) disable
				This is a boolean value - when true the save button will be disabled.
				This value will be overridden and set to true if:
					- the 'Contact Parents' check box is not checked
					- the name field is empty
		*/
		function disableSave(disable) 
		{
			if (!that.DisableSaveButton) return false;
			if (!that.ACFormField.val() || !ACFormFieldValid) disable = true;
			d.getElementById("Ribbon.ListForm.Edit.Commit.Publish-Large").style.display = (disable) ? 'none':'inline-block'; 
			//SaveButton.prop('disabled', disable);
			if (disable) SaveButton.attr('disabled', true);
			else SaveButton.removeAttr('disabled');
		}
		
		/*
			@method setupEventListeners
				This function sets up the event listeners so that fields are validated when the user changes stuff
		*/
		function setupEventListeners()
		{
			// check the name and call getData on blur of name field
			that.ACFormField.blur(function (e) {
				that.checkField($(e.target).val());
				//for (var i = 0; i < that.CheckFields.length; i++) that.CheckFields[i].checkField();
			});
			
			// make the enter key blur the name field
			that.ACFormField.keyup(function (e) {
				if (e.keyCode == 13) $(e.target).blur();
			});
		}
		
		/*
			@method setupAutoCompleteField
				This function sets up our autocomplete text field.
			
				This function makes a call to the SPServices.GetListItems operation, 
				which gets data from the 'ACListName' list.  The values are taken from the 'ACFieldName' field in that list.
				Additional information is taken from the 'ACAdditionalField' field in the same list.
				The data that is returned from the GetListItems operation is pushed to the 'ACList' array.
		*/
		function setupAutoCompleteField() 
		{
		
			var viewFields, params;
			that.ACList = [];
			
			that.ACFormField = $("input[title='" + that.ACFormField + "']");
			SaveButton 	= $('input[value="Save"]');
			
			viewFields = "<ViewFields><FieldRef Name='" + that.FieldName + "' />";
			if (that.AdditionalField) viewFields += "<FieldRef Name='" + that.AdditionalField + "' />";
			viewFields += "</ViewFields>";
			
			params = {
				operation: "GetListItems",
				webURL: that.WebURL,
				CAMLViewFields: viewFields,
				async: false,
				completefunc: function (xData, Status) {
					$(xData.responseXML).SPFilterNode("z:row").each(function() {
						
						var tg, value = $(this).attr("ows_" + that.FieldName);
						
						if (that.AdditionalField) 
						{
							tg = ($(this).attr("ows_" + that.AdditionalField))
							if (tg) value += ' (' + tg.slice(tg.indexOf('#')+1) + ')';
						}
						if (typeof that.ListItemProcess === 'function') value = that.ListItemProcess(value);
						that.ACList.push(value);
					});
				}
			};
			
			// set the webURL
			if (that.WebURL) params.webURL = that.WebURL;
			
			// Make SPServices.GetListItems function call
			$().SPServices(params);
			
			// create the auto-complete text field
			that.ACFormField.autocomplete({
				source: that.ACList,
				minLength: that.MinLength,
				change: function () {
					if (that.AdditionalField && that.AdditionalFormField)  that.getAdditionalField($(this));
				}
			});
			
			disableSave(true); // disable the save button
			setupEventListeners(); // Setup event listeners
		}
		
		// set the parameters
		if (arguments.length)
		{
			var obj = arguments[0];
			for (var i in obj) this[i] = obj[i];
		}
		
		// set the webURL
		if (this.ListSite) this.WebURL	= this.Http + "://" + this.HostName + '/' + this.ListSite;
		
		// setup the auto complete field
		if (this.ListName && this.ACFormField) setupAutoCompleteField();
	}							
})(document, window);
