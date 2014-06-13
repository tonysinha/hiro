﻿﻿﻿﻿﻿﻿﻿﻿/*-----Alerts Page----------*/
$.compliance.define("alerts",{
	fullFilterVal : "",
	completedReminderFullFilterVal : "ReminderAlertStatus|Complete",
	filterMode : false,
	currentAlertType : "",
	emailProfileList : new Array(),
	alertEntityMap : new Object(),
	alertEntityNameMap : new Object(),
	// Global Variables for Pagination/Sorting/Filtering. Must not be re-initialized
	// unless mandated.
	pageSize : 10, // Holds the Maximum number of records for page.
	endPos : 0, // Holds the end position val for displaying in UI.
	endPos_InProgressReminderAlerts : 0, // Holds the end position val for displaying InProgress Reminder Alerts in UI.
	matchedRecords : 0, // Holds the matched number of records.
	matchedRecords_InProgressReminderAlerts : 0, // Holds the matched number of InProgress Reminder Alerts records.
	returnRecords : 0, // Holds the returned number of records.
	returnRecords_InProgressReminderAlerts : 0, // Holds the returned number of InProgress Reminder Alerts records.
	startPosition : 1,	// Holds the Pagination Start value.
	startPosition_InProgressReminderAlerts : 1,	// Holds the Pagination Start value for InProgress Reminder Alerts.
	filterString : "", // Holds the filter Value
	oldfilterString : "", // Holds the older filter Value
	sortString : "", // Holds the sort Value
	sortString_InProgressReminderAlerts : "", // Holds the sort Value for InProgressReminderAlerts
	sortField : "", // Sorting Column
	sortField_InProgressReminderAlerts : "", // Sorting Column for InProgressReminderAlerts
	matchedDUNS : false, // Boolean to identify whether the Organization Name comes from Matched or unmatched record.
	isTaskFiltered : false,
	isInProgressReminderAlertsOnly : false,
	isPaginationVisible : false,
	reminderAlertsInProgressData : "",
	reminderAlertsCompletedData : "",
	isCreateRequest:false,
	init: function(){
		$('.alertsheader').siblings().css({'color':'#959595','font-weight':'normal'});
		$('.alertsheader').css({'color':'white','font-weight':'700'});
		$('#queueMovementAlertsTable').hide();
		$('#taskAlertsTable').hide();
		$('#reminderAlertsTable').hide();
		
		$('input:radio[name="alertType"]').change(function(){
            $('.alert-filter-primName, .alert-filter-div, .alert-filter-fullName, .alert-filter-startQ, .alert-filter-landQ, .alert-filter-projectid,.datepicker').val('');
            $('.alerts-table-search').hide();
            $('#SubjectName').val('');
			$('#ComplianceDivisionName').val('');
			$('#UserName').val('');
			$('#SourceComplianceQueueName').val('');
			$('#TargetComplianceQueueName').val('');
			$('#EventDate').val('');
			alerts.startPosition = 1;
			alerts.sortString = ""; 
			alerts.sortField = ""; 
			
		    if($(this).val() == 'queueMovement'){
		    	$('#queueMovementAlertsTable').show();
				$('#taskAlertsTable').hide();
		    	alerts.isTaskFiltered = false;
		    	$('#sortSourceComplianceQueueName').show();
		    	$('#sortTargetComplianceQueueName').show();
		    	$('#SourceComplianceQueueName').show();
		    	$('#TargetComplianceQueueName').show();
		    	alerts.fullFilterVal = "EventType|Alert"; 
				// Code to switch off the on change event for text.
				$(':input[type="text"]').blur();

				// Call for Service layer
				alerts.populateAlertsData("workflowAlerts", "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				
		    } else if ($(this).val() == 'task') {
		    	$('#queueMovementAlertsTable').hide();
				$('#taskAlertsTable').show();
		    	alerts.isTaskFiltered = true;
		    	$('#sortSourceComplianceQueueName').hide();
		    	$('#sortTargetComplianceQueueName').hide();
		    	$('#SourceComplianceQueueName').hide();
		    	$('#TargetComplianceQueueName').hide();
		    	alerts.fullFilterVal = "EventType|Task"; 
				// Code to switch off the on change event for text.
				$(':input[type="text"]').blur();

				// Call for Service layer
				alerts.populateAlertsData("workflowAlerts", "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
		    }
		});
		
		$('body').delegate('.alerts-main-page-tabs .screeningalerts-details , .alerts-main-page-tabs .workflowalerts-details , .alerts-main-page-tabs .reminderalerts-details , .alerts-main-page-tabs .profile-details ','click',function(e){
			e.preventDefault();
			e.stopPropagation();
			var curr=$(this);
			alerts.showAlerts($(this));
			var clicked_tab_id = $(this).attr('id');		
			if(clicked_tab_id == 'screeningAlerts' || clicked_tab_id == 'workflowAlerts' || clicked_tab_id == 'reminderAlerts' ) {
				
				alerts.currentAlertType = clicked_tab_id;
				alerts.fullFilterVal = ""; 
				alerts.isTaskFiltered = false;
				
				if(alerts.currentAlertType == 'screeningAlerts'){
					$('#screeningAlertsTable').show();
					$('#queueMovementAlertsTable').hide();
					$('#taskAlertsTable').hide();
					$('#reminderAlertsTable').hide();
					$('#workflowAlertType').hide();
					$('#inProgressReminderAlertsPagination').hide();
				} else if (alerts.currentAlertType == 'workflowAlerts') {
					$('#queueMovementAlertsTable').show();
					$('#taskAlertsTable').hide();
					$('#screeningAlertsTable').hide();
					$('#reminderAlertsTable').hide();
					$('#workflowAlertType').show();
					$('#queueMovementRadio').attr('checked', true).change();
					$('#inProgressReminderAlertsPagination').hide();
					alerts.fullFilterVal = "EventType|Alert"; 
					if(alerts.dBoardAlertType){
						if(alerts.dBoardAlertType=="task"){
							alerts.fullFilterVal = "EventType|Task"; 							
							$('#taskRadio').attr('checked', true).change();
						}
					}
				} else if (alerts.currentAlertType == 'reminderAlerts') {
					$(".completedreminderno-record").hide();
					$('#reminderAlertsTable').show();
					$('#queueMovementAlertsTable').hide();
					$('#taskAlertsTable').hide();
					$('#screeningAlertsTable').hide();
					$('#workflowAlertType').hide();
					alerts.completedReminderFullFilterVal = "ReminderAlertStatus|Complete";
					$("#completedReminderAlertsData").empty();
					$('#pagination').hide();
				}
				
				// Re-initializing the values.
				alerts.pageSize = 10; 
				alerts.endPos = 0; 
				alerts.matchedRecords = 0; 
				alerts.returnRecords = 0; 
				alerts.startPosition = 1;	
				alerts.sortString = ""; 
				alerts.sortField = ""; 	
				// Code to switch off the on change event for text.
				$(':input[type="text"]').blur();
				
				if(alerts.currentAlertType == 'reminderAlerts') {
					alerts.fullFilterVal = "ReminderAlertStatus|Inprogress" ;
					alerts.isInProgressReminderAlertsOnly = false;
					clicked_tab_id = "reminderAlertsInProgress";
				}
				
				// Call for Service layer
				// This call not required for workflow alerts as the change function for queue Movement 
				//  radio button is already called.
				if (alerts.currentAlertType != 'workflowAlerts') {					
					alerts.populateAlertsData(clicked_tab_id, "&start=" + 
							alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				}
			}
			$(".no-record").hide();
			if(clicked_tab_id == 'viewAlertsProfile' ) {
				alerts.populateExistingAlertProfiles(clicked_tab_id,"",alerts.customOptions);
			}
		});
		$('.screening-details-row-links li:nth-child(odd)').live("click", function(){
			var alertParentRow=$(this).closest('tr').prev('tr.odd');
			var tabActive=$(this).attr('class').split(' ')[0];	
			var paramArray = $(alertParentRow).children('td').eq(0).attr('id').split("-");
			var alertEntityId = paramArray[0];
			var eventId = paramArray[1];
			centerPopup('.screening-alert-details-row-popup');
			loadPopup('.screening-alert-details-row-popup');
			
			if($(this).parent().attr("id") == "screeningAlertsAdditionalLinks" ) {
				$('.alerts-popup-tabheader').show();
				$('.alert-note').show();
				$('.tpi-greylist-alerts-popup-tabheader').hide();
			} else if($(this).parent().attr("id") == "graylistAlertsAdditionalLinks") {
				$('.alerts-popup-tabheader').hide();
				$('.alert-note').hide();
				$('.tpi-greylist-alerts-popup-tabheader').show();
			}
			alerts.screeningAlertPopUpChangeHandler(tabActive, alertEntityId, eventId);
		});
		$('.screening-alert-details-header span').live("click", function(){
			disablePopup('.screening-alert-details-row-popup');
		});
		$('#queueMovementAlertNavigation, #taskAlertNavigation, #screeningAlertNavigation ,#reminderAlertNavigation').live("click", function() {
			
			var isNavigateToCompanyAlerts = false;
			var alertDetails = $(this).parent().parent();	
			var divID = alertDetails.children('input[name=divID]').val();
			var divisionName =alertDetails.children('input[name=divisionName]').val();
			var queueName = alertDetails.children('input[name=queueName]').val();
			var queueID = alertDetails.children('input[name=queueID]').val();
			var dunsNumber = alertDetails.children('input[name=dunsNumber]').val();
			var supplierID = alertDetails.children('input[name=supplierID]').val();
			
			var breadCrumb = new Array();
			if($(this).attr("id") == "queueMovementAlertNavigation") {				
				breadCrumb.push(i18n.queueMovement);
			} else if ($(this).attr("id") == "taskAlertNavigation") {
				breadCrumb.push(i18n.task);
			} else if ($(this).attr("id") == "screeningAlertNavigation") {
				breadCrumb.push(i18n.screeningAlerts);
				isNavigateToCompanyAlerts = true;
			} else if ($(this).attr("id") == "reminderAlertNavigation") {
				breadCrumb.push(i18n.reminderAlerts);
			}
			
			var url = flowExecutionUrl + "&_eventId=supplierDetails&duns=" + dunsNumber + "&breadCrumbs=" + breadCrumb + "&supplierID=" + supplierID + "&";
			var params = {
					 "supplierName" : $(this).text(),
					 "subjectId"    : supplierID,
					 "queueId"      : queueID,
					 "queueName"	: queueName,
					 "divisionId" 	: divID,
					 "divisionName"	: divisionName,
					 "qMetaID"		: queueID,
					 "isNavigateToCompanyAlerts" : isNavigateToCompanyAlerts
		    };
			$.doGet(url, params);
			
		});
		$('body').delegate('.inProgressReminderAlertCheckbox, .completedReminderAlertCheckbox','change',function(event) {
		    if(this.checked) {
		    	var yes = i18n.yes;
		    	var cancel = i18n.cancel;
		    	var reminderAlertID = $(this).parent().attr("id");
		    	var reminderStatus = $(this).closest("table").hasClass('inprogress-table') ? 'inprogress' : 'completed';
		    	
		    	var confirmationMessage = "";
		    	if($(this).attr("class") == "inProgressReminderAlertCheckbox") {
		    		confirmationMessage = i18n.completed;
		    	} else if ($(this).attr("class") == "completedReminderAlertCheckbox") {
		    		confirmationMessage = i18n.inprogress;
		    	}
		    	var buttonsOpts = {}
		    	buttonsOpts[yes] = function () {
		    			    	          	var updateComplianceReminderAlertRequestDetail = alerts.createRequestForUpdateReminderAlert(reminderAlertID, reminderStatus);
		    			    	          	updateComplianceReminderAlertRequestDetail = JSON.stringify(updateComplianceReminderAlertRequestDetail);
		    			    	          	alerts.populateAlertsData("updateComplianceReminderAlert", "&updateRequest=" + updateComplianceReminderAlertRequestDetail);
		    			    	            $(this).dialog("close");};
		    	buttonsOpts[cancel] = function () {
		    			    	        	  $('.inProgressReminderAlertCheckbox').attr('checked', false);
		    			    	        	  $('.completedReminderAlertCheckbox').attr('checked', false);
		    			    	              $(this).dialog("close");
		    			    	          };
		    	$('<div></div>').appendTo('body')
		    	  .html('<div><h6>'+ confirmationMessage + '</h6></div>')
		    	  .dialog({
		    	      modal: true, title: i18n.confirmation, zIndex: 10000, autoOpen: true,
		    	      width: 'auto', resizable: false,
		    	      buttons:buttonsOpts,
		    	      close: function (event, ui) {
		    	          $(this).remove();
		    	      }
		    	});
		    }
		});
		/*------------Click event on Pagination Buttons ------*/
		$('body').delegate('.paginationBtn','click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			var curr = $(this);
			var pagination_btn_id = $(this).attr('id');
			alerts.matchedRecords = $('#totalAlerts').text();	
			//filterString = "";
			if (pagination_btn_id == "btnFirst") {
				alerts.startPosition = 1;
				alerts.endPos = alerts.startPosition + (alerts.pageSize-1);
			} else if (pagination_btn_id == "btnPrevious") {
				alerts.startPosition = alerts.startPosition - alerts.pageSize;
				if (alerts.startPosition < 1) {
					alerts.startPosition = 1;
				} else {
					alerts.endPos = alerts.endPos - parseInt(alerts.returnRecords); // Decrement the size
																// when we click on
																// Previous
				}
			} else if (pagination_btn_id == "btnNext") {
				alerts.endPos = alerts.startPosition + (alerts.pageSize-1);
				if (alerts.endPos != alerts.matchedRecords) {
					alerts.startPosition = alerts.pageSize + alerts.startPosition;
					if ((alerts.startPosition + parseInt(alerts.returnRecords)) < alerts.matchedRecords) {
						alerts.endPos = alerts.startPosition + parseInt(alerts.returnRecords); // Increment	when we click on Next
					} else {
						alerts.endPos = alerts.matchedRecords;
					}
				}
			} else if (pagination_btn_id == "btnLast") {
				var perVal = alerts.matchedRecords % alerts.pageSize;
				//To counter the round-off problem.
				alerts.startPosition = Math.round(((alerts.matchedRecords/alerts.pageSize - perVal/ alerts.pageSize)* alerts.pageSize) + 1);
				if (perVal == 0) {
					alerts.startPosition = alerts.startPosition - 10;
				}
				alerts.endPos = alerts.matchedRecords;
			}
			
			if(alerts.currentAlertType == "reminderAlerts" || alerts.currentAlertType == "reminderAlertsInProgress" ||
					alerts.currentAlertType == "reminderAlertsCompleted") {
				alerts.currentAlertType = "reminderAlertsCompleted";
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
			} else {
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
			}
			
		});
		
		/*------------Click event on Pagination Buttons ------*/
		$('body').delegate('.inProgressReminderPaginationBtn','click',function(e) {
			e.preventDefault();
			e.stopPropagation();
			var curr = $(this);
			var pagination_btn_id = $(this).attr('id');
			alerts.matchedRecords_InProgressReminderAlerts = $('#totalAlerts_InProgressReminderAlerts').text();	
			//filterString = "";
			if (pagination_btn_id == "btnFirst_InProgressReminderAlerts") {
				alerts.startPosition_InProgressReminderAlerts = 1;
				alerts.endPos_InProgressReminderAlerts = alerts.startPosition_InProgressReminderAlerts + (alerts.pageSize-1);
			} else if (pagination_btn_id == "btnPrevious_InProgressReminderAlerts") {
				alerts.startPosition_InProgressReminderAlerts = alerts.startPosition_InProgressReminderAlerts - alerts.pageSize;
				if (alerts.startPosition_InProgressReminderAlerts < 1) {
					alerts.startPosition_InProgressReminderAlerts = 1;
				} else {
					alerts.endPos_InProgressReminderAlerts = alerts.endPos_InProgressReminderAlerts - parseInt(alerts.returnRecords_InProgressReminderAlerts); // Decrement the size
																// when we click on
																// Previous
				}
			} else if (pagination_btn_id == "btnNext_InProgressReminderAlerts") {
				alerts.endPos_InProgressReminderAlerts = alerts.startPosition_InProgressReminderAlerts + (alerts.pageSize-1);
				if (alerts.endPos_InProgressReminderAlerts != alerts.matchedRecords_InProgressReminderAlerts) {
					alerts.startPosition_InProgressReminderAlerts = alerts.pageSize + alerts.startPosition_InProgressReminderAlerts;
					if ((alerts.startPosition_InProgressReminderAlerts + parseInt(alerts.returnRecords_InProgressReminderAlerts)) < alerts.matchedRecords_InProgressReminderAlerts) {
						alerts.endPos_InProgressReminderAlerts = alerts.startPosition_InProgressReminderAlerts + parseInt(alerts.returnRecords_InProgressReminderAlerts); // Increment	when we click on Next
					} else {
						alerts.endPos_InProgressReminderAlerts = alerts.matchedRecords_InProgressReminderAlerts;
					}
				}
			} else if (pagination_btn_id == "btnLast_InProgressReminderAlerts") {
				var perVal = alerts.matchedRecords_InProgressReminderAlerts % alerts.pageSize;
				//To counter the round-off problem.
				alerts.startPosition_InProgressReminderAlerts = Math.round(((alerts.matchedRecords_InProgressReminderAlerts/alerts.pageSize - perVal/ alerts.pageSize)* alerts.pageSize) + 1);
				if (perVal == 0) {
					alerts.startPosition_InProgressReminderAlerts = alerts.startPosition_InProgressReminderAlerts - 10;
				}
				alerts.endPos_InProgressReminderAlerts = alerts.matchedRecords_InProgressReminderAlerts;
			}
			alerts.isInProgressReminderAlertsOnly = true;
			
			if($('#pagination').is(":visible")) {
				alerts.isPaginationVisible = true;
			}
			
			alerts.populateAlertsData("reminderAlertsInProgress", "&start=" + 
					alerts.startPosition_InProgressReminderAlerts + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);
		});
		
		// Function for filtering functionality in the screening alerts page.
		$('.alert-filter-entity, .alert-filter-enquiry, .alert-filter-category, .alert-filter-subcat, .alert-filter-score').bind('keyup',alerts.throttle(function() {
			// $('.queue-filter-name').bind('blur change click keypress keydown keyup',
			// function() {
			var currID = $(this).attr('id');
			currID = $.trim(currID);
			alerts.filterString = encodeURIComponent($(this).val());
			alerts.filterMode = true;
			//Reset pagination values
			alerts.startPosition = 1;
			alerts.endPos = 0;
			var filterIndex = 0;			
			filterVal = currID + "|" + alerts.filterString ;
			if (alerts.filterString.length > 2) {
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
					if(alerts.fullFilterVal == "") {
						alerts.fullFilterVal = filterVal;
					} else {				
						alerts.fullFilterVal = alerts.fullFilterVal +"||"+ filterVal;
					}
				} else {
					alerts.fullFilterVal = filterVal;
				}
				
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);		
						
				alerts.oldfilterString = alerts.filterString;
				
			} else if ((alerts.filterString.length==0)) {
				//This is the case for empty String
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
				}
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				alerts.oldfilterString = alerts.filterString;				
			}
		},1500));
		//Filter for Date picker - AlertDate
		$('.datepicker').change(alerts.throttle(function(){
			alerts.filterMode = true;
			var currID = $(this).attr('id');
			var tempFilterVal;
			if(currID == "QueueMovementEventDate" || currID == "TaskEventDate" ) {
				currID = "EventDate";
			}
			
			if(currID == "CompletedReminderEndDate") {
				currID = "ReminderEndDate";
			}
			
			if(alerts.currentAlertType == "reminderAlerts" ||  alerts.currentAlertType == "reminderAlertsInProgress"
				|| alerts.currentAlertType == "reminderAlertsCompleted" ) {
				
				alerts.currentAlertType = $(this).closest("table").hasClass('inprogress-table') ? 'reminderAlertsInProgress' : 'reminderAlertsCompleted';
				 
			}
			if(alerts.currentAlertType == "reminderAlertsCompleted") {
				tempFilterVal = alerts.completedReminderFullFilterVal;
			} else  {
				tempFilterVal = alerts.fullFilterVal;
			}
			
			alerts.filterString = $(this).val();
			//Reset pagination values
			alerts.startPosition = 1;
			alerts.endPos = 0;
			var filterVal = "" ;
			//Clear button is called.
			if (alerts.filterString == "" || alerts.filterString == null){
				filterVal = "";
				
				if (tempFilterVal != "") {
					var tokens = tempFilterVal.split('||');
					tempFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(tempFilterVal == "") {
								tempFilterVal = tokens[index];
							} else {						
								tempFilterVal = tempFilterVal +"||"+ tokens[index];
							}
						}
					}
				}
				if(alerts.currentAlertType == "reminderAlertsCompleted") {
					alerts.completedReminderFullFilterVal = tempFilterVal;
				} else  {
					alerts.fullFilterVal = tempFilterVal;
				}
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + tempFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				alerts.oldfilterString = alerts.filterString;
			} else if (alerts.filterString.length > 0){
				alerts.filterString = moment(alerts.filterString , "MM/DD/YYYY").format("YYYY-MM-DD");
				if(currID == "AlertDate") {
					alerts.filterString = alerts.filterString + "T00:00:00.000";
				} else if (currID == "EventDate") {
					alerts.filterString = alerts.filterString + "T00:00:00.000-00:00";
				} 
				
				filterVal = currID + "|" + alerts.filterString;

				if (tempFilterVal != "") {
					var tokens = tempFilterVal.split('||');
					tempFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(tempFilterVal == "") {
								tempFilterVal = tokens[index];
							} else {
								tempFilterVal = tempFilterVal +"||"+ tokens[index];
							}
						}
					}
					if(tempFilterVal == "") {
						tempFilterVal = filterVal;
					} else {				
						tempFilterVal = tempFilterVal +"||"+ filterVal;
					}
				} else {
					tempFilterVal = filterVal;
				}
				
				if(alerts.currentAlertType == "reminderAlertsCompleted") {
					alerts.completedReminderFullFilterVal = tempFilterVal;
				} else  {
					alerts.fullFilterVal = tempFilterVal;
				}
				
				if(alerts.currentAlertType == "reminderAlertsInProgress") {
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition_InProgressReminderAlerts + "&filter=" + tempFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);
				} else {					
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition + "&filter=" + tempFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				}
				alerts.oldfilterString = alerts.filterString;
			}
		},1500));
		// Function for filtering functionality in the workflow alerts page.
		$('.alert-filter-primName, .alert-filter-div, .alert-filter-fullName, .alert-filter-startQ, .alert-filter-landQ, .alert-filter-projectid').bind('keyup',alerts.throttle(function() {
			// $('.queue-filter-name').bind('blur change click keypress keydown keyup',
			// function() {
			var currID = $(this).attr('id');
			
			if(currID == "QueueMovementSubjectName" || currID == "TaskSubjectName") {
				currID = "SubjectName";
			} else if(currID == "QueueMovementComplianceDivisionName" || currID == "TaskComplianceDivisionName") {
				currID = "ComplianceDivisionName";
			}
			
			currID = $.trim(currID);
			var workflowFilterString = encodeURIComponent($(this).val());
			alerts.filterMode = true;
			//Reset pagination values
			alerts.startPosition = 1;
			alerts.endPos = 0;
			var filterIndex = 0;
			filterVal = currID + "|" + workflowFilterString;
			if (workflowFilterString.length > 2) {
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
					alerts.fullFilterVal = alerts.fullFilterVal +"||"+ filterVal;
				} else {
					alerts.fullFilterVal = filterVal;
				}
				
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);

				alerts.oldfilterString = workflowFilterString;
			} else if ((workflowFilterString.length==0)) {
				//This is the case for empty String
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
				}
				alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
						alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				alerts.oldfilterString = workflowFilterString;				
			}
		},1500));
		
		// Function for filtering functionality of Inprogress Reminder Alerts.
		$('.inprogressReminder-filter-companyname, .inprogressReminder-filter-division, .inprogressReminder-filter-queue').bind('keyup',alerts.throttle(function() {
			// $('.queue-filter-name').bind('blur change click keypress keydown keyup',
			// function() {
			var currID = $(this).attr('id');
			currID = $.trim(currID);
			var inprogressReminderFilterString = encodeURIComponent($(this).val());
			alerts.filterMode = true;
			//Reset pagination values
			alerts.startPosition_InProgressReminderAlerts = 1;
			alerts.endPos = 0;
			var filterIndex = 0;
			filterVal = currID + "|" + inprogressReminderFilterString;
			if (inprogressReminderFilterString.length > 2) {
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
					alerts.fullFilterVal = alerts.fullFilterVal +"||"+ filterVal;
				} else {
					alerts.fullFilterVal = filterVal;
				}
				
				alerts.populateAlertsData("reminderAlertsInProgress", "&start=" + 
						alerts.startPosition_InProgressReminderAlerts + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);

				alerts.oldfilterString = inprogressReminderFilterString;
			} else if ((inprogressReminderFilterString.length==0)) {
				//This is the case for empty String
				if (alerts.fullFilterVal != "") {
					var tokens = alerts.fullFilterVal.split('||');
					alerts.fullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.fullFilterVal == "") {
								alerts.fullFilterVal = tokens[index];
							} else {						
								alerts.fullFilterVal = alerts.fullFilterVal +"||"+ tokens[index];
							}
						}
					}
				}
				
				alerts.isInProgressReminderAlertsOnly = true;
				alerts.populateAlertsData("reminderAlertsInProgress", "&start=" + 
						alerts.startPosition_InProgressReminderAlerts + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);
				alerts.oldfilterString = inprogressReminderFilterString;				
			}
		},1500));
		
		// Function for filtering functionality of Completed Reminder Alerts.
		$('.completedReminder-filter-companyname, .completedReminder-filter-division, .completedReminder-filter-queue').bind('keyup',alerts.throttle(function() {
			// $('.queue-filter-name').bind('blur change click keypress keydown keyup',
			// function() {
			var currID = $(this).attr('id');
			currID = $.trim(currID);
			var completedReminderFilterString = encodeURIComponent($(this).val());
			alerts.filterMode = true;
			//Reset pagination values
			alerts.startPosition = 1;
			alerts.endPos = 0;
			var filterIndex = 0;
			filterVal = currID + "|" + completedReminderFilterString;
			if (completedReminderFilterString.length > 2) {
				if (alerts.completedReminderFullFilterVal != "") {
					var tokens = alerts.completedReminderFullFilterVal.split('||');
					alerts.completedReminderFullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.completedReminderFullFilterVal == "") {
								alerts.completedReminderFullFilterVal = tokens[index];
							} else {						
								alerts.completedReminderFullFilterVal = alerts.completedReminderFullFilterVal +"||"+ tokens[index];
							}
						}
					}
					alerts.completedReminderFullFilterVal = alerts.completedReminderFullFilterVal +"||"+ filterVal;
				} else {
					alerts.completedReminderFullFilterVal = filterVal;
				}
				
				alerts.populateAlertsData("reminderAlertsCompleted", "&start=" + 
						alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);

				alerts.oldfilterString = completedReminderFilterString;
			} else if ((completedReminderFilterString.length==0)) {
				//This is the case for empty String
				if (alerts.completedReminderFullFilterVal != "") {
					var tokens = alerts.completedReminderFullFilterVal.split('||');
					alerts.completedReminderFullFilterVal = "";
					for(var index=0; index<tokens.length; index++) {
						var subTokens = tokens[index].split('|');
						if(subTokens[0] != currID) {
							if(alerts.completedReminderFullFilterVal == "") {
								alerts.completedReminderFullFilterVal = tokens[index];
							} else {						
								alerts.completedReminderFullFilterVal = alerts.completedReminderFullFilterVal +"||"+ tokens[index];
							}
						}
					}
				}
				
				alerts.populateAlertsData("reminderAlertsCompleted", "&start=" + 
						alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				alerts.oldfilterString = completedReminderFilterString;				
			}
		},1500));
		
		$("#updateNewProfile").live("click", function(){	
			var profileQueues=$(".left-tpi-text");
			var selectedQueues=[];
			
			var queueSelectedFlag=false;
			
			$.each(profileQueues, function(queueIndex, queueValue){	
				var queueId= $(this).children(".check-box").attr("id");
				var complianceQueueId=queueId.replace("queue-","");
				var queueName=$(this).children("label").text();
				var actionArray= new Array();
				var selectedQueueDetails={"ComplianceQueueID":complianceQueueId, "ComplianceQueueEventDetail": {"ComplianceQueueEventID":[]}, "ComplianceQueueActiveIndicator":true};
				if($(this).children(".check-box").prop('checked') == true){	
					queueSelectedFlag=true;
					for(var divCount=1; divCount<=3; divCount++){
						var actionId=queueId+"-action"+divCount;
					
						if($("#"+actionId).prop('checked') == true){
							if(alerts.formatActions($("#"+actionId).parent().children("label").attr("eventText"))=="RecordAdded"){
								actionArray.push("RecordAdded");		
							}
							if(alerts.formatActions($("#"+actionId).parent().children("label").attr("eventText"))=="RecordAssignedToYou"){
								actionArray.push("RecordAssignedToUser");		
							}						
						}
					}
					if($("#queueActionCheck").prop('checked')){
						selectedQueueDetails.ComplianceQueueEventDetail.ComplianceQueueEventID=actionArray;
						selectedQueues.push(selectedQueueDetails);
					}else{
						if($(this).children(".check-box").attr("updateflag")=="true"){	
							selectedQueueDetails.ComplianceQueueActiveIndicator=false;
							selectedQueues.push(selectedQueueDetails);
						}
					}			
				}else{
					if($(this).children(".check-box").attr("updateflag")=="true"){	
						selectedQueueDetails.ComplianceQueueActiveIndicator=false;
						selectedQueues.push(selectedQueueDetails);
					}
				}
			});

			var selectedEmailsObject={"EmailAddress":[]};
			$.each(alerts.emailProfileList, function(emailIndex, emailValue){	
				selectedEmailsObject.EmailAddress.push({"TelecommunicationAddress":emailValue.email});
			});

			// create the request for save
				
			// create the compliance Division ID
			var divisionIndexSelected = document.getElementById("profileDivisions").selectedIndex;
			var selectedDivisionID=document.getElementById("profileDivisions");
			var complianceDivisionID=selectedDivisionID.options[divisionIndexSelected].value;	
			// var newProfileName =
			// selectedDivisionID.options[divisionIndexSelected].text;
			var newProfileName = $('#alertProfileName').val();
			newProfileName = $.trim(newProfileName);
			
			// create the alert Profile Name Object
			var alertProfileNameObject= {
					"@LanguageCode": "",			
					"$":newProfileName
			};

			// create the screening Result Detail Object

			var screeningResultDetailObject={ "ScreeningAlertsRequiredIndicator": $("#screeningResultsCheck").prop('checked')};

			// create the Queue Action Alert Profile Detail Object
			var queueActionAlertProfileDetailObject={
					"QueueActionAlertsRequiredIndicator": $("#queueActionCheck").prop('checked')			
			};
			
			if(queueSelectedFlag){
				queueActionAlertProfileDetailObject.ComplianceDivisionQueue=selectedQueues;
			}
			var editAlertProfileId=$("#alertProfileId").val();
			
			var editProfileRequestDetailObject={			
						"AlertProfileName": alertProfileNameObject,
						"AlertProfileID":editAlertProfileId,
						"ComplianceDivisionID":complianceDivisionID,
						"ScreeningResultAlertProfileDetail":screeningResultDetailObject,
						"QueueActionAlertProfileDetail":queueActionAlertProfileDetailObject,
						"NotificationDetail":selectedEmailsObject,
						"AlertProfileActiceIndicator": true
			};
		    
			var jsonRequest = JSON.stringify(editProfileRequestDetailObject);
			
			
			var url = flowExecutionUrl + "&_eventId=editAlertProfile&";       
			
			if(newProfileName==""){
				alert(i18n.alerts_empty_name_message);
				
			}else if(!queueSelectedFlag && $("#queueActionCheck").prop('checked')){
				
				alert(i18n.alerts_select_queue_message);
				
			}else if (selectedEmailsObject.EmailAddress.length==0){
				alert(i18n.alerts_select_email_message);
			}else{
				
				$.blockUI({ 
			    	message: '',
			    	css: {position: ''}
			    });
			
			$.ajax({
				type : 'POST',
				url  : url,
				data : {
				  "profileRequest":jsonRequest
			    },
				success : function(responseJSON) {
					$('.alerts-main-page-container').hide();
					$('.profile-main-page-container').show();
					$('.create-profile-index').show();
					$('.create-profile-index').children().show();
					$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
					$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
					$(".no-record").hide();
					alerts.populateExistingAlertProfiles("viewAlertsProfile","",alerts.customOptions);
				},
				error : function(data, errorType, exception) {
					alert(i18n.unexpectedError_msg + "\"" + errorType + "\"" + i18n.unexpectedError_message);
				}
			});	
			}
		});	
		//function for sorting the table columns
		$('.sort-fields').live("click", function() {
			$(".sort-fields span").removeClass().addClass("sort-default");
			
			if($(this).closest("table").hasClass('inprogress-table')) {
				alerts.sortField_InProgressReminderAlerts = $(this).parent().attr("sortby");
			} else {
				alerts.sortField =  $(this).parent().attr("sortby");
			} 
			
			var sortOrder =  $(this).children("span").attr("sort");			
			if (sortOrder == "asc") {
				$(this).children("span").removeClass("sort-default");
				$(this).children("span").addClass("sort-desc");
				$(this).children("span").attr("sort", "desc");
				
				if($(this).closest("table").hasClass('inprogress-table')) {
					alerts.sortString_InProgressReminderAlerts = "Ascending";
				} else {
					alerts.sortString = "Ascending";
				} 
			} else {
				$(this).children("span").removeClass("sort-default");
				$(this).children("span").addClass("sort-asc");
				$(this).children("span").attr("sort", "asc");
		
				if($(this).closest("table").hasClass('inprogress-table')) {
					alerts.sortString_InProgressReminderAlerts = "Descending";
				} else {
					alerts.sortString = "Descending";
				} 
			}
			//Reset pagination values
			alerts.startPosition = 1;
			alerts.endPos = 0;
			
			if(alerts.isTaskFiltered) {
				if(alerts.sortField != "SourceComplianceQueueName" && alerts.sortField != "TargetComplianceQueueName") {
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				}
			} else {
				if(alerts.currentAlertType != "screeningAlerts" && alerts.currentAlertType != "workflowAlerts") {					
					alerts.currentAlertType = $(this).closest("table").hasClass('inprogress-table') ? 'reminderAlertsInProgress' : 'reminderAlertsCompleted';
				}
				
				if(alerts.currentAlertType == "reminderAlertsCompleted") {
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				} else if(alerts.currentAlertType == "reminderAlertsInProgress"){
					alerts.startPosition_InProgressReminderAlerts = 1;
					alerts.isInProgressReminderAlertsOnly = true;
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition_InProgressReminderAlerts + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);
				} else {
					
					alerts.populateAlertsData(alerts.currentAlertType, "&start=" + 
							alerts.startPosition + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
				}
			}
		});

		/*------------profile Section---------*/
		$('.create-profilebtn').click(function(e){
				e.preventDefault();
				e.stopPropagation();		
				$.blockUI({ 
		        	message: '',
		        	css: {position: ''}
		        });
				$("#emailError").hide();
				$(".no-record").hide();
				var curr=$(this);
				curr.closest('.create-profile-index').hide();
				alerts.emailProfileList=[];
				
				$(".new-profile-title").html(i18n.alerts_CreateNewProfile_Message);
				$(".create-profile-detail h4, #saveNewProfile").show();
				$("#alertProfileId, #emailAddress").val("");		
								
				$("#emailList ul, #availableQueues").empty();		
				$('#profileDivisions, #updateNewProfile').hide();		
				$('#profileDivisions').empty();
				
				$("#emailAddress").watermark(i18n.addEmailMessage, {useNative: false});
						
				$('#queueActionCheck, #screeningResultsCheck').attr('checked',false);
				var divisionList;		
				
				$.ajax({
					type : 'GET',
					url : "ajax/profileDivisions",
					dataType : "json",
					success : function(data) {
						try{
							if ( alerts.checkJsonData(data, "ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision") != ""){
								divisionList= data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision;
								if(divisionList instanceof Array){
									$.each(divisionList, function(divisionIndex, divisionValue){
										if ( alerts.checkJsonData(divisionValue, "UserAccessLevel") != "" ){
											if ( divisionValue.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
												if ( typeof divisionValue.ComplianceDivisionName != 'undefined' ){
													alerts.populateDivisionDropDown("profileDivisions", divisionValue);	
												}
											}
										}
									});	
								}else{
									if ( alerts.checkJsonData(divisionList, "UserAccessLevel") != "" ){
										if ( divisionList.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
											if ( typeof divisionList.ComplianceDivisionName != 'undefined' ){
												alerts.populateDivisionDropDown("profileDivisions", divisionList);	
											}
										}
									}							
								}
							}
							
						}finally{
							var divisions=$("#profileDivisions option");
							if(divisions.length>0){	
								selectMenuPluginRecall("profileDivisions");
							}else{
								alert(i18n.alerts_empty_divisions_message);
								$('.alerts-main-page-container').hide();
								$('.profile-main-page-container').show();
								$('.create-profile-index').show();	
								$('.create-profile-index').children().show();
								$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
								$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
							}
							$.unblockUI();
						}
					},
					error: function(data, errorType, exception) {
						// TODO change to error message
						alert(i18n.unexpectedError_msg + "\"" + errorType + "\"" + i18n.unexpectedError_message);
					},
					complete: function(jqXHR, textstatus){
						$.unblockUI();
					}
				});	
				
				$('.create-profile-detail').show();
				selectMenuPluginRecall("profileDivisions");
				$('.queue-action','.screenign-results').attr('checked',false);
		});
		$('.queue-action').click(function(){		
			if($('.queue-action').prop('checked') == true){
					if($(".queuePopulatedFlag").text()=="true"){
						$('.available-queues-info,.add-email-address').show();	
					}else{
						alerts.loadAvailableQueues();
					}
				}else{
					if($('.screenign-results').prop('checked') == true){
						$('.available-queues-info').hide();	
					}else{
						$('.available-queues-info,.add-email-address').hide();	
					}
				}
			});
		$('.screenign-results').click(function(){		
			if($('.screenign-results').prop('checked') == true){
				if($('.queue-action').prop('checked') == false){		
				$('.available-queues-info').hide();	
				}			
				$('.add-email-address').show();	
			}else{
				if($('.queue-action').prop('checked') == false){
					$('.available-queues-info,.add-email-address').hide();	
				}else{
					}
			}
			});	
		$('.add-email-info .text-input').focus(function(){
			$("#emailError").hide();
			$(this).css({'color':'#000'});
			$(this).siblings().css({
				'background':'url(static/images/Post-status.png)',
				'width':'91px'});
			$("#emailError").removeAttr("style");
		}).blur(function(){
			$(this).css({'color':'#707070'});
			$(this).siblings().css({
				'background':'url(static/images/button_bg_img.jpg)',
				'width':'100px'});
			$("#emailError").removeAttr("style");
		});
		$(".country-queues-list h4 span").live("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#profileDivisions').hide();	
			$(".new-profile-title").html($("#editTitle").val());
			$(".create-profile-detail h4").hide();
			$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
			
			$('#saveNewProfile').hide();	
			$('#updateNewProfile').show();	
			$('.queue-action').prop('checked', false);
			$('.screenign-results').prop('checked', false);
				
			var selectMenuExists = false;
			
			
			$(".ui-selectmenu").each(function(i) {	    
				selectMenuExists = true;		
			});
			if (selectMenuExists){
					
				$('#profileDivisions').empty();
				//$('#profileDivisions').selectmenu("destroy");
			}
			
				
			$.blockUI({ 
		    	message: '',
		    	css: {position: ''}
		    });
			
			var updateDetailsId=$(this).closest('.country-queues-list').children(".updateDetails");	
			$("#alertProfileName").val(updateDetailsId.children(".alertName").text());
			
			$("#alertProfileId").val(updateDetailsId.children(".alertProfileId").text());
			
			var emailIds=updateDetailsId.children(".updateEmailIds").text().split(',');
			alerts.emailProfileList=[];
			 for(var i=1;i<emailIds.length;i++){	        
				 alerts.emailProfileList.push({"email":emailIds[i-1], "index":i-1});
			 }
			 	 
			 $("#emailList ul").empty();
			 $("#screeningEmailTemplate").tmpl(alerts.emailProfileList).appendTo("#emailList ul");
			 $("#emailAddress").val("");
			 $("#emailAddress").watermark(i18n.addEmailMessage, {useNative: false});
			 
			 alerts.populateUpdateQueueDetails(updateDetailsId);
			 alerts.loadUpdateAvailableQueues(updateDetailsId);	
			
		});
		
		$('.check-box').live("click", function(){
			
			var selectElementId= $(this).attr("id");	
			var queueId="";	
			
			if($(this).attr("name")=="actions"){
				var actionLocation = selectElementId.indexOf("-action");
				queueId=selectElementId.substring(0, actionLocation);
				
				if($(this).prop('checked') == true){						
					$("#"+queueId).prop("checked", true);
				}else{
					var actionId=queueId+"-action";
					var checkedFlag=false;
					for(var divCount=1; divCount<=3; divCount++){				
						if($("#"+actionId+divCount).prop('checked') == true){				
							checkedFlag=true;					
						}
							
					}
					
					if(!checkedFlag){
						$("#"+queueId).prop("checked", false);
					}
				}
				
			}else if($(this).attr("name")=="queues"){
				var actionId=selectElementId+"-action";		
				if($(this).prop('checked') == true){
					for(var divCount=1; divCount<=3; divCount++){				
						$("#"+actionId+divCount).prop("checked", true);
					}
				}else{
					for(var divCount=1; divCount<=3; divCount++){			
						$("#"+actionId+divCount).prop("checked", false);
					}
				}
			}
		});
		$("#cancelNewProfile").live("click", function(e){
			e.preventDefault();
			e.stopPropagation();
			$("#emailError").hide();
			$("#alertProfileName").val("");
			$("#alertProfileName").watermark(i18n.alertsNameText, {useNative: false});
			$(".new-profile-title").html(i18n.alerts_CreateNewProfile_Message);
			$('.alerts-main-page-container').hide();
			$('.profile-main-page-container').show();
			$('.create-profile-index').show();	
			$('.create-profile-index').children().show();
			$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
			$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
			$('#profileDivisions').empty();
			//$('#profileDivisions').selectmenu("destroy");
			$(".create-profile-index h4").show();
		});
		$('.deleteProfile').live("click", function() {	
			var updateDetailsId=$(this).closest('.country-queues-list').children(".updateDetails").attr("id");
			$(".delete-profiles-yes").attr("updateId", updateDetailsId);
		    centerPopup('.delete-profiles-confirm');
		        loadPopup('.delete-profiles-confirm');
		 });

		$('.delete-profiles-yes').live("click", function() {
		    disablePopup('.delete-profiles-confirm');
		    var updateDetailsId=$(this).attr("updateId");
		    alerts.deleteAlertProfile(updateDetailsId);
		    // Clear the action ID after performing all the necessary steps
		    $(".delete-profiles-yes").attr("updateId", "");
		});

		$('.delete-profiles-no').live("click", function() {
		    disablePopup('.delete-profiles-confirm');
		    // Clear the action ID after performing all the necessary steps
		    clickedBtnActionID = "";
		});



		$('.tbl-utility-icons .search').on('click',function(e){
			e.preventDefault();
			e.stopPropagation();	
			var activeText='';
			var currParent=$(this).parent().parent().hasClass('completed-utility');
			$('.alerts-main-page-tabs').children().each(function(){
				if($(this).hasClass('selected')){
					activeText=$(this).attr('class').split(' ')[0].replace('alerts-details','').replace('-details','');
				}
			});	
			if (activeText != 'reminder'){
				$('.'+activeText.toLowerCase()+'-alerts-table .alerts-table-search').toggle('fast');
			}else { 
				if(currParent){
					$('.completed-table .alerts-table-search').toggle('fast');					
				}else{
					$('.inprogress-table .alerts-table-search').toggle('fast');
				}
			}
									
		});	


		$("#profileDivisions").live("change", function(){
			if($('.queue-action').prop('checked') == true){
				alerts.loadAvailableQueues();
			}else{
				$("#availableQueues").empty();
			}
		});


		$("#btnAddProfileEmail").live("click", function(){
			if($('#emailAddress').val() !=""){
				if(alerts.isValidEmailAddress($('#emailAddress').val())){
					var emailIndex=alerts.emailProfileList.length;
					alerts.emailProfileList.push({"email":$('#emailAddress').val(), "index":emailIndex});		
					$("#emailList ul").empty();
					$("#screeningEmailTemplate").tmpl(alerts.emailProfileList).appendTo("#emailList ul");
					$("#emailAddress").val("");
					$("#emailAddress").watermark(i18n.addEmailMessage, {useNative: false});
					$("#emailError").hide();
				}else{
					$("#emailError").show();
				}
			}
		});


		$(".deleteEmail").live("click", function(){
			alerts.emailProfileList.splice($(this).parent().attr("index"), 1);		
			var newList=[];	
			for(var i=0;i<alerts.emailProfileList.length;i++){	        
				newList.push({"email":alerts.emailProfileList[i].email, "index":i});
			}	
			alerts.emailProfileList=newList;
			$("#emailList ul").empty();
			$("#screeningEmailTemplate").tmpl(alerts.emailProfileList).appendTo("#emailList ul");
		});

		$("#saveNewProfile").live("click", function(){	
				
				
				var profileQueues=$(".left-tpi-text");
				var selectedQueues=[];
				if($("#queueActionCheck").prop('checked')){
				$.each(profileQueues, function(queueIndex, queueValue){	
					if($(this).children(".check-box").prop('checked') == true){
					
						var queueId= $(this).children(".check-box").attr("id");
						var complianceQueueId=queueId.replace("queue-","");
						var queueName=$(this).children("label").text();
						var actionArray= new Array();
						
						// create the alert Profile Name Object
						var queueNameObject= {										
								"$":queueName
						};
					
						
						for(var divCount=1; divCount<=3; divCount++){
							var actionId=queueId+"-action"+divCount;
						
							if($("#"+actionId).prop('checked') == true){
								if(alerts.formatActions($("#"+actionId).parent().children("label").attr("eventText"))=="RecordAdded"){
									actionArray.push("RecordAdded");		
								}
								if(alerts.formatActions($("#"+actionId).parent().children("label").attr("eventText"))=="RecordAssignedToYou"){
									actionArray.push("RecordAssignedToUser");		
								}
											
							}
						}
						var selectedQueueDetails={"ComplianceQueueID":complianceQueueId, "ComplianceQueueEventDetail": {"ComplianceQueueEventID":actionArray}, "ComplianceQueueName":queueNameObject};
						selectedQueues.push(selectedQueueDetails);
					}
				});
				}
				var selectedEmailsObject={"EmailAddress":[]};
				$.each(alerts.emailProfileList, function(emailIndex, emailValue){	
					selectedEmailsObject.EmailAddress.push({"TelecommunicationAddress":emailValue.email});
				});
			
				// create the request for save
						
				// create the compliance Division ID
				var divisionIndexSelected = document.getElementById("profileDivisions").selectedIndex;
				var selectedDivisionID=document.getElementById("profileDivisions");
				var complianceDivisionID=selectedDivisionID.options[divisionIndexSelected].value;	
				// var newProfileName =
				// selectedDivisionID.options[divisionIndexSelected].text;
				var newProfileName = $('#alertProfileName').val();
				newProfileName = $.trim(newProfileName);
				// create the alert Profile Name Object
				var alertProfileNameObject= {
						"@LanguageCode": "",				
						"$":newProfileName
				};
				
				
				// create the screening Result Detail Object
			
				var screeningResultDetailObject={ "ScreeningAlertsRequiredIndicator": $("#screeningResultsCheck").prop('checked')};
			
				// create the Queue Action Alert Profile Detail Object
				var queueActionAlertProfileDetailObject={
						"QueueActionAlertsRequiredIndicator": $("#queueActionCheck").prop('checked')
				};
				if(selectedQueues.length>0){
					queueActionAlertProfileDetailObject.ComplianceDivisionQueue=selectedQueues;				
				}
				var profileRequestDetail={				
						"AlertProfileName": alertProfileNameObject,				
						"ComplianceDivisionID":complianceDivisionID,
						"ScreeningResultAlertProfileDetail":screeningResultDetailObject,
						"QueueActionAlertProfileDetail":queueActionAlertProfileDetailObject,
						"NotificationDetail":selectedEmailsObject		
				};
				
				// var
				// newProfileRequest={"CreateAlertProfileRequest":newProfileRequestObject};
				
				var jsonRequest = JSON.stringify(profileRequestDetail);
			
				var url = flowExecutionUrl + "&_eventId=saveNewProfile&"; 
				if(newProfileName==""){
					alert(i18n.alerts_empty_name_message);
					
				}else if(selectedQueues.length==0 && $("#queueActionCheck").prop('checked')){
					
					alert(i18n.alerts_select_queue_message);
					
				}else if (selectedEmailsObject.EmailAddress.length==0){
					alert(i18n.alerts_select_email_message);
				}else{
					$.blockUI({ 
				    	message: '',
				    	css: {position: ''}
				    });
				
				 postData(url, alerts.savedAlertProfile, true, {
			                "profileRequest" : jsonRequest
			        }, alerts.saveProfileCustomOptions);
					

			
				}
			
			
		});
	    $('.alerts-popup-tabheader li').live("click", function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        var currClass = $(this).attr('class').split(' ');

	        $(this).siblings().removeClass('tab-active').addClass('tab-inactive');
	        if (!$(this).hasClass('tab-active')) {
	            $(this).removeClass('tab-inactive').addClass('tab-active');
	        }
	        $('.alert-popupcontent').children().hide();
	        $('.' + currClass + '-content').attr('class');
	        $(currClass).each(function(i, val) {
	            if (val != "tab-active" && val != "tab-inactive") {
	                $('.' + val + '-content').show();
	            }
	        });

	    });
	    
	    $('.tpi-greylist-alerts-popup-tabheader li').live("click", function(e) {
	        e.preventDefault();
	        e.stopPropagation();
	        var currClass = $(this).attr('class').split(' ');

	        $(this).siblings().removeClass('tab-active').addClass('tab-inactive');
	        if (!$(this).hasClass('tab-active')) {
	            $(this).removeClass('tab-inactive').addClass('tab-active');
	        }
	        $('.alert-popupcontent').children().hide();
	        $('.' + currClass + '-content').attr('class');
	        $(currClass).each(function(i, val) {
	            if (val != "tab-active" && val != "tab-inactive") {
	                $('.' + val + '-content').show();
	            }
	        });

	    });
	    
	    if(alerts.backToAlerts != "") {
	    	alerts.dBoardAlertType = alerts.backToAlerts;
	    }
	    // Screening Alerts tab will be dispalyed by default on page load
		switch(alerts.dBoardAlertType){
		case "workflow":
			$('#workflowAlerts').click();
			break;
		case "reminder":
			$('#reminderAlerts').click();
			break;
		case "task":
			$('#workflowAlerts').click();
			break;
		default:
			$('#screeningAlerts').click();
			break;
		}
	},
	customOptions : {
			errorHandlers: {
				"INFO": function(error){ 
					var completed_reminderalerts_norecord= '<div class="completedreminderno-record"></div>';
					if(alertName != "completed"){
						$(".tbl-utility-icons").hide();
						if($(".completedreminderno-record").css('display')!="block"){
							$(".completed-utility .tbl-utility-icons").show();
						}
						if(alertName == "inprogress"){
							$('#inProgressReminderAlertsPagination').hide();
						}else{
							$('#pagination').hide();
						}						
						$('.country-main-details').show();
						var norecord= '<div class="no-record"></div>';
						$(".no-record").remove();
						$(".alerts-main-detail").append(norecord);
						$('.country-main-details').append(norecord);
						$("#existingProfiles").append(norecord);
						$(".no-record").html(i18n.noRecord_error_message_alerts);					
						$(".no-record").show();	
						
						if(alertName == "inprogress"){
							
							if(!alerts.isInProgressReminderAlertsOnly) {				
								// Call for Service layer to fetch Completed Reminder Alerts 
								//Re-initializing the values.
								alerts.pageSize = 10; 
								// Code to switch off the on change event for text.
								$(':input[type="text"]').blur();
								
								alerts.populateAlertsData("reminderAlertsCompleted", "&start=" + 
										alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
							}
						}
					}else{
						$(".completedreminderno-record").remove();						
						$(".completed-container").append(completed_reminderalerts_norecord);
						$(".completedreminderno-record").html(i18n.noRecord_error_message_alerts);
						$(".completedreminderno-record").show();
						$(".completed-utility .tbl-utility-icons").hide();
						$('#pagination').hide();
					}
				}
			}
	},
	populateAlertsData : function(eventId, params){		
		$.ajax({
			type : 'GET',
			url : flowExecutionUrl + "&_eventId=" + eventId + params,
			dataType : "json",
			success : alerts.renderAlertsDetailsTab(eventId),
			customOptions: alerts.customOptions
		});
		$(':input[type="text"]').blur();
		var alertEventId="";
		switch(eventId){
			case "reminderAlertsInProgress":{
				alertEventId=eventId.replace("reminderAlerts", "").toLowerCase();
				$('.inprogress-table.reminder-alerts-table').children('tbody').hide();
			};
			break;
			case "reminderAlertsCompleted":{
				alertEventId=eventId.replace("reminderAlerts", "").toLowerCase();
				$('.completed-table.reminder-alerts-table').children('tbody').hide();
			};
			break;
			default:
				alertEventId=eventId.replace("Alerts", "");
				$('.' + alertEventId + '-alerts-table').children('tbody').hide();
				$('#pagination').hide();
		}
		
	},
	renderAlertsDetailsTab : function (eventId) {
		// call the tab specific function to populate the data on alerts module
		switch(eventId){
			case "reminderAlertsInProgress":{
				alertName=eventId.replace("reminderAlerts", "").toLowerCase();
				$('.inprogress-table.reminder-alerts-table').children('thead').show();
			};
			break;
			case "reminderAlertsCompleted":{
				alertName=eventId.replace("reminderAlerts", "").toLowerCase();
				$('.completed-table.reminder-alerts-table').children('thead').show();
			};
			break;
			default:
				alertName=eventId.replace("Alerts", "");
				$('.' + alertName + '-alerts-table').children('thead').show();
				$('#pagination').show();
		}
		return alerts.populateAlertsFunctions[eventId];
	},
	populateAlertsFunctions : {
		workflowAlerts : function(data) {
			$('.' + alertName + '-alerts-table').children('tbody').show();
			$("#queueMovementAlertsData").empty();
			$("#taskAlertsData").empty();
			
			/*
			 * if ((data.error != "" && data.error != null && data.error !=
			 * 'undefined') || data.GetWorkflowAlertResponse == "") {
			 * $(".no-record").html(noRecord_error_message_alerts);
			 * $(".alerts-main-page-container").children().hide();
			 * $(".no-record").show();
			 */
				$(".no-record").hide();	
				$(".tbl-utility-icons").show();
				$('#EventType').selectmenu({ style : 'dropdown'});
				var ComplianceWorkflowAlert = data.GetWorkflowAlertResponse.GetWorkflowAlertResponseDetail.ComplianceWorkflowAlert;
				
				if($('#queueMovementRadio').is(':checked')) {
					
					for(var count=0; count < ComplianceWorkflowAlert.length; count++ ) {
						
						var custDet = ComplianceWorkflowAlert[count].CustomerProvidedSubjectData;
						
						var tr = document.createElement('tr'); 
						
		                	if(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail != null) {
		                		
								var td1 = document.createElement('td');
			                	var td2 = document.createElement('td');
			                	var td3 = document.createElement('td');
			                	var td4 = document.createElement('td');
			                	var td5 = document.createElement('td');
			                	var td6 = document.createElement('td');
			                	var td7 = document.createElement('td');
			                	
		                		if(ComplianceWorkflowAlert[count].Organization != null && ComplianceWorkflowAlert[count].Organization.OrganizationName != null && 
			                			ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName != null &&
			                			ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName.OrganizationName != null) {	                			
		                			$(td1).append('<a href="#" id="queueMovementAlertNavigation">'+ ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName.OrganizationName +'</a>');
			                	} else if(ComplianceWorkflowAlert[count].CustomerProvidedSubjectData != null &&
			                			ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0] != null &&
			                			ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0].SubjectName != null) {
			                		//CR-92
			                		var companyName = appendPhoneticName(ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0].SubjectName);
			                		$(td1).append('<a href="#" id="queueMovementAlertNavigation">'+ companyName +'</a>');
			                	}
		                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail != null && 
		                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName != null) {
		                			td2.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$));
		                		} 
		                		td3.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.EventDetail.EventDate));
		                		if(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.EventDetail.UserName != null) {		                			
		                			td4.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.EventDetail.UserName));
		                		}
		                		if(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.SourceComplianceQueueName != null &&
		                				typeof(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.SourceComplianceQueueName) != 'undefined'){
		                		td5.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.SourceComplianceQueueName));
		                		}
		                		if(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.TargetComplianceQueueName != null &&
		                				typeof(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.TargetComplianceQueueName) != 'undefined'){
		                		td6.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.TargetComplianceQueueName));
		                		}
		                		var projectID = ComplianceWorkflowAlert[count].SubjectQueueHistoryDetail.ProjectID;
		                		if(typeof(projectID) == 'undefined') {
		                			projectID = "";
		                		}
		                		td7.appendChild(document.createTextNode(projectID));
		                		
		                		//Adding hidden attributes
		                		var tdForDivID = "";
		                		var tdForDivName = "";
		                		var tdForQueueID = "";
		                		var tdForQueueName = "";
		                		var tddunsNumber = "";
		                		var tdsupplierID = "";
		                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail != null) {
		                			
		                			tdForDivID = document.createElement("input");
			                		tdForDivID.setAttribute("name", "divID");
			                		tdForDivID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID) != 'undefined') {		                			
			                			tdForDivID.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID);
			                		} else {
			                			tdForDivID.setAttribute("value", "");
			                		}
			                		
		                			tdForDivName = document.createElement("input");
			                		tdForDivName.setAttribute("name", "divisionName");
			                		tdForDivName.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName != null && 
			                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$ != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$) != 'undefined') {		                			
			                			tdForDivName.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$);
			                		} else {
			                			tdForDivName.setAttribute("value", "");
			                		}

			                		tdForQueueID = document.createElement("input");
			                		tdForQueueID.setAttribute("name", "queueID");
			                		tdForQueueID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID) != 'undefined') {		                			
			                			tdForQueueID.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID);
			                		} else {
			                			tdForQueueID.setAttribute("value", "");
			                		}

			                		tdForQueueName = document.createElement("input");
		                			tdForQueueName.setAttribute("name", "queueName");
			                		tdForQueueName.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName != null &&
			                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$ != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$) != 'undefined') {		                			
			                			tdForQueueName.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$);		                		
			                		} else {
			                			tdForQueueName.setAttribute("value", "");
			                		}	                		
			                		
			                		tddunsNumber = document.createElement("input");
			                		tddunsNumber.setAttribute("name", "dunsNumber");
			                		tddunsNumber.setAttribute("type", "hidden");                     
			                		if(custDet != null && custDet[0] != null && custDet[0].SubjectHeader != null &&
			                				custDet[0].SubjectHeader.DUNSNumber != null &&
			                				typeof(custDet[0].SubjectHeader.DUNSNumber) != 'undefined') {
			                			tddunsNumber.setAttribute("value", custDet[0].SubjectHeader.DUNSNumber);		                		
			                		} else {
			                			tddunsNumber.setAttribute("value", "");
			                		}	                		
			                		
			                		tdsupplierID = document.createElement("input");
			                		tdsupplierID.setAttribute("name", "supplierID");
			                		tdsupplierID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].SubjectID != null && typeof(ComplianceWorkflowAlert[count].SubjectID) != 'undefined') {
			                			tdsupplierID.setAttribute("value", ComplianceWorkflowAlert[count].SubjectID);
			                		} else {
			                			tdsupplierID.setAttribute("value", "");
			                		}
		                		} 
		                		
		                		tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);tr.appendChild(td4);tr.appendChild(td5);
			                	tr.appendChild(td6); tr.appendChild(td7);
			                	
		                		//Handling Hidden attributes
			                	tr.appendChild(tdForDivID);
			                	tr.appendChild(tdForDivName);
			                	tr.appendChild(tdForQueueID);
			                	tr.appendChild(tdForQueueName);
			                	tr.appendChild(tddunsNumber);
			                	tr.appendChild(tdsupplierID);
		                		
			                	var tbodyTable = document.getElementById('queueMovementAlertsData');
			                	tbodyTable.appendChild(tr);
			                	
		                	} 
					}
					
				} else if($('#taskRadio').is(':checked')) {

					for(var count=0; count < ComplianceWorkflowAlert.length; count++ ) {
						
						var custDet = ComplianceWorkflowAlert[count].CustomerProvidedSubjectData;
						
						var tr = document.createElement('tr'); 
						
		                if (ComplianceWorkflowAlert[count].ComplianceTask != null) {
		                		
								var td1 = document.createElement('td');
			                	var td2 = document.createElement('td');
			                	var td3 = document.createElement('td');
			                	var td4 = document.createElement('td');
			                	var td5 = document.createElement('td');
			                	var td6 = document.createElement('td');
			                	
		                		if(ComplianceWorkflowAlert[count].Organization != null && ComplianceWorkflowAlert[count].Organization.OrganizationName != null && 
			                			ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName != null &&
			                			ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName.OrganizationName != null) {	                			
			                		$(td1).append('<a href="#" id="taskAlertNavigation">'+ ComplianceWorkflowAlert[count].Organization.OrganizationName.OrganizationPrimaryName.OrganizationName +'</a>');
			                	} else if(ComplianceWorkflowAlert[count].CustomerProvidedSubjectData != null &&
			                			ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0] != null &&
			                			ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0].SubjectName != null) {
			                		//CR-92
			                		var companyName = appendPhoneticName(ComplianceWorkflowAlert[count].CustomerProvidedSubjectData[0].SubjectName);
			                		$(td1).append('<a href="#" id="taskAlertNavigation">'+ companyName +'</a>');
			                	}
		                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail != null && 
		                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName != null) {
		                			td2.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$));
		                		} 
		                		td3.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].ComplianceTask.AssignedDate));
		                		if(ComplianceWorkflowAlert[count].ComplianceTask.AssignerUserName!=null){
		                			$(td4).html(ComplianceWorkflowAlert[count].ComplianceTask.AssignerUserName);
		                		}else{
		                			$(td4).html("");
		                		}
		                		if (alerts.checkJsonData(ComplianceWorkflowAlert[count].ComplianceTask, "TaskText")== ""){		                		
		                			td5.appendChild(document.createTextNode(""));
		                		} else {                			
		                			td5.appendChild(document.createTextNode(ComplianceWorkflowAlert[count].ComplianceTask.TaskText.$$));
		                		}
		                		
		                		var projectID = ComplianceWorkflowAlert[count].ComplianceTask.ProjectID;
		                		if(typeof(projectID) == 'undefined') {
		                			projectID = "";
		                		}
		                		td6.appendChild(document.createTextNode(projectID));
		                		
		                		//Adding hidden attributes
		                		var tdForDivID = "";
		                		var tdForDivName = "";
		                		var tdForQueueID = "";
		                		var tdForQueueName = "";
		                		var tddunsNumber = "";
		                		var tdsupplierID = "";
		                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail != null) {
		                			
		                			tdForDivID = document.createElement("input");
			                		tdForDivID.setAttribute("name", "divID");
			                		tdForDivID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID) != 'undefined') {		                			
			                			tdForDivID.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionID);
			                		} else {
			                			tdForDivID.setAttribute("value", "");
			                		}
			                		
		                			tdForDivName = document.createElement("input");
			                		tdForDivName.setAttribute("name", "divisionName");
			                		tdForDivName.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName != null && 
			                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$ != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$) != 'undefined') {		                			
			                			tdForDivName.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceDivisionName.$$);
			                		} else {
			                			tdForDivName.setAttribute("value", "");
			                		}

			                		tdForQueueID = document.createElement("input");
			                		tdForQueueID.setAttribute("name", "queueID");
			                		tdForQueueID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID) != 'undefined') {		                			
			                			tdForQueueID.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueID);
			                		} else {
			                			tdForQueueID.setAttribute("value", "");
			                		}

			                		tdForQueueName = document.createElement("input");
		                			tdForQueueName.setAttribute("name", "queueName");
			                		tdForQueueName.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName != null &&
			                				ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$ != null &&
			                				typeof(ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$) != 'undefined') {		                			
			                			tdForQueueName.setAttribute("value", ComplianceWorkflowAlert[count].ComplianceDivisionQueueDetail.ComplianceQueueName.$$);		                		
			                		} else {
			                			tdForQueueName.setAttribute("value", "");
			                		}	                		
			                		
			                		tddunsNumber = document.createElement("input");
			                		tddunsNumber.setAttribute("name", "dunsNumber");
			                		tddunsNumber.setAttribute("type", "hidden");                     
			                		if(custDet != null && custDet[0] != null && custDet[0].SubjectHeader != null &&
			                				custDet[0].SubjectHeader.DUNSNumber != null &&
			                				typeof(custDet[0].SubjectHeader.DUNSNumber) != 'undefined') {
			                			tddunsNumber.setAttribute("value", custDet[0].SubjectHeader.DUNSNumber);		                		
			                		} else {
			                			tddunsNumber.setAttribute("value", "");
			                		}	                		
			                		
			                		tdsupplierID = document.createElement("input");
			                		tdsupplierID.setAttribute("name", "supplierID");
			                		tdsupplierID.setAttribute("type", "hidden");                     
			                		if(ComplianceWorkflowAlert[count].SubjectID != null && typeof(ComplianceWorkflowAlert[count].SubjectID) != 'undefined') {
			                			tdsupplierID.setAttribute("value", ComplianceWorkflowAlert[count].SubjectID);
			                		} else {
			                			tdsupplierID.setAttribute("value", "");
			                		}
		                		} 
		                		
		                		tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);tr.appendChild(td4);tr.appendChild(td5);
			                	tr.appendChild(td6);
			                	
			                	//Handling Hidden attributes
			                	tr.appendChild(tdForDivID);
			                	tr.appendChild(tdForDivName);
			                	tr.appendChild(tdForQueueID);
			                	tr.appendChild(tdForQueueName);
			                	tr.appendChild(tddunsNumber);
			                	tr.appendChild(tdsupplierID);
			                	
			                	var tbodyTable = document.getElementById('taskAlertsData');
			                	tbodyTable.appendChild(tr);
		                	}
					}
				}

				alerts.matchedRecords = data.GetWorkflowAlertResponse.GetWorkflowAlertResponseDetail.CandidateMatchedQuantity;
				
				document.getElementById('btnFirst').disabled = false;
				document.getElementById('btnPrevious').disabled = false;
				document.getElementById('btnNext').disabled = false;
				document.getElementById('btnLast').disabled = false;
				
				if(alerts.startPosition == 1) {
					document.getElementById('btnFirst').disabled = true;
					document.getElementById('btnPrevious').disabled = true;
					$('#btnFirst, #btnPrevious').css({'background' : '#b7b7b7'});
				}
				else {
					$('#btnFirst,#btnPrevious').css({'background' : '#4084CB'});
				}
				
				if(alerts.pageSize < alerts.matchedRecords) {
					$('#pagination').show();
					$('#startIndex').text(alerts.startPosition);
					if(alerts.startPosition + (alerts.pageSize-1) >= alerts.matchedRecords){
    					$('#endIndex').text(alerts.matchedRecords);
    					document.getElementById('btnNext').disabled = true;
    					document.getElementById('btnLast').disabled = true;
    					$('#btnNext,#btnLast').css({'background' : '#b7b7b7'});
    					} else {
    						$('#endIndex').text(alerts.startPosition + (alerts.pageSize-1));
    						$('#btnNext,#btnLast').css({'background' : '#4084CB'});
    					}
					$('#totalAlerts').text(alerts.matchedRecords);
				} else {	
					$('#pagination').hide();
				}
		},
		reminderAlertsInProgress : function(data) {

			if(alerts.isPaginationVisible) {
				$('#pagination').show();
			}
			
			$('.' + alertName + '-table.reminder-alerts-table').children('tbody').show();
			$("#reminderAlertsData").empty();
			
			alerts.reminderAlertsInProgressData = data;
			

				$(".no-record").hide();	
				$(".tbl-utility-icons").show();
				
				if(data.ListComplianceReminderAlertResponse != null && data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail != null) {
					var ReminderAlert = data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail.ReminderAlert;
					if(ReminderAlert != null) {
						for(var index=0; index<ReminderAlert.length; index++ ) {
							if(ReminderAlert[index] != null) {								
								var tr = document.createElement('tr');
								var companyName = "" ;
								var td1 = document.createElement('td');
								td1.setAttribute("id", ReminderAlert[index].ReminderAlertID); //sets the ReminderAlertID
								var td2 = document.createElement('td');
								var td3 = document.createElement('td');
								var td4 = document.createElement('td');
								var td5 = document.createElement('td');
								
								if(ReminderAlert[index].OrganizationPrimaryName != null && ReminderAlert[index].OrganizationPrimaryName[0] != null && 
										ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName != null && ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$ != null
										&& typeof(ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$) != 'undefined') {
									companyName = ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$;
								} else if (ReminderAlert[index].SubjectName != null) {
									
									companyName = appendPhoneticName(ReminderAlert[index].SubjectName);
								}
								
								if(companyName != "") {
									companyName = "<input type='checkbox' class='inProgressReminderAlertCheckbox'>" + companyName + "</input>";
									td1.innerHTML =  '<a href="#" id="reminderAlertNavigation">'+ companyName + '</a>';
								} else {
									companyName = "<input type='checkbox' class='inProgressReminderAlertCheckbox'></input>";
									td1.innerHTML =  '<a href="#" id="reminderAlertNavigation">'+ companyName + '</a>';
								}
								
								if(ReminderAlert[index].ComplianceDivisionName != null && ReminderAlert[index].ComplianceDivisionName[0] != null
										&& ReminderAlert[index].ComplianceDivisionName[0].$$ != null && 
										typeof(ReminderAlert[index].ComplianceDivisionName[0].$$) != "undefined") {									
									$(td2).html(ReminderAlert[index].ComplianceDivisionName[0].$$);
								}
								if(ReminderAlert[index].ComplianceQueueName != null && ReminderAlert[index].ComplianceQueueName[0] != null
										&& ReminderAlert[index].ComplianceQueueName[0].$$ != null && 
										typeof(ReminderAlert[index].ComplianceQueueName[0].$$) != "undefined") {									
									$(td3).html(ReminderAlert[index].ComplianceQueueName[0].$$);
								}
								if(ReminderAlert[index].ReminderEndDate != null && typeof(ReminderAlert[index].ReminderEndDate) != "undefined") {									
									$(td4).html(ReminderAlert[index].ReminderEndDate);
								}
								if(ReminderAlert[index].ReminderAlertDescription != null && ReminderAlert[index].ReminderAlertDescription.$$ != null &&
										typeof(ReminderAlert[index].ReminderAlertDescription.$$) != "undefined") {
									$(td5).html(ReminderAlert[index].ReminderAlertDescription.$$);
								}
								tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4); tr.appendChild(td5); 
								
								//Adding hidden attributes
		                		var tdForDivID = "";
		                		var tdForDivName = "";
		                		var tdForQueueID = "";
		                		var tdForQueueName = "";
		                		var tddunsNumber = "";
		                		var tdsupplierID = "";
		                		
		                			
		                		tdForDivID = document.createElement("input");
			                	tdForDivID.setAttribute("name", "divID");
			                	tdForDivID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceDivisionID != null &&
			                				typeof(ReminderAlert[index].ComplianceDivisionID) != 'undefined') {		                			
			                			tdForDivID.setAttribute("value", ReminderAlert[index].ComplianceDivisionID);
			                	} else {
			                			tdForDivID.setAttribute("value", "");
			                	}
			                		
			                	tdForDivName = document.createElement("input");
			                	tdForDivName.setAttribute("name", "divisionName");
			                	tdForDivName.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceDivisionName != null && 
			                			ReminderAlert[index].ComplianceDivisionName[0].$$ != null &&
			                				typeof(ReminderAlert[index].ComplianceDivisionName[0].$$) != 'undefined') {		                			
			                			tdForDivName.setAttribute("value", ReminderAlert[index].ComplianceDivisionName[0].$$);
			                	} else {
			                			tdForDivName.setAttribute("value", "");
			                	}

			                	tdForQueueID = document.createElement("input");
			                	tdForQueueID.setAttribute("name", "queueID");
			                	tdForQueueID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceQueueID != null &&
			                				typeof(ReminderAlert[index].ComplianceQueueID) != 'undefined') {		                			
			                			tdForQueueID.setAttribute("value", ReminderAlert[index].ComplianceQueueID);
			                	} else {
			                			tdForQueueID.setAttribute("value", "");
			                	}

			                	tdForQueueName = document.createElement("input");
		                		tdForQueueName.setAttribute("name", "queueName");
			                	tdForQueueName.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceQueueName != null &&
			                			ReminderAlert[index].ComplianceQueueName[0].$$ != null &&
			                				typeof(ReminderAlert[index].ComplianceQueueName[0].$$) != 'undefined') {		                			
			                			tdForQueueName.setAttribute("value", ReminderAlert[index].ComplianceQueueName[0].$$);		                		
			                	} else {
			                			tdForQueueName.setAttribute("value", "");
			                	}	                		
			                		
			                	tddunsNumber = document.createElement("input");
			                	tddunsNumber.setAttribute("name", "dunsNumber");
			                	tddunsNumber.setAttribute("type", "hidden");                     
			                	tddunsNumber.setAttribute("value", "");
			                	                		
			                		
			                	tdsupplierID = document.createElement("input");
			                	tdsupplierID.setAttribute("name", "supplierID");
			                	tdsupplierID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].SubjectID != null && typeof(ReminderAlert[index].SubjectID) != 'undefined') {
			                			tdsupplierID.setAttribute("value", ReminderAlert[index].SubjectID);
			                	} else {
			                			tdsupplierID.setAttribute("value", "");
			                	}
		                		 
			                	//Handling Hidden attributes
			                	tr.appendChild(tdForDivID);
			                	tr.appendChild(tdForDivName);
			                	tr.appendChild(tdForQueueID);
			                	tr.appendChild(tdForQueueName);
			                	tr.appendChild(tddunsNumber);
			                	tr.appendChild(tdsupplierID);
								
								var reminderAlertsTable = document.getElementById('reminderAlertsData');
								reminderAlertsTable.appendChild(tr);
								
							}
						}
						
						alerts.matchedRecords_InProgressReminderAlerts = data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail.CandidateMatchedQuantity;
							document.getElementById('btnFirst_InProgressReminderAlerts').disabled = false;
							document.getElementById('btnPrevious_InProgressReminderAlerts').disabled = false;
							document.getElementById('btnNext_InProgressReminderAlerts').disabled = false;
							document.getElementById('btnLast_InProgressReminderAlerts').disabled = false;
							
							if(alerts.startPosition_InProgressReminderAlerts == 1) {
								document.getElementById('btnFirst_InProgressReminderAlerts').disabled = true;
								document.getElementById('btnPrevious_InProgressReminderAlerts').disabled = true;
								$('#btnFirst_InProgressReminderAlerts, #btnPrevious_InProgressReminderAlerts').css({'background' : '#b7b7b7'});
							}
							else {
								$('#btnFirst_InProgressReminderAlerts,#btnPrevious_InProgressReminderAlerts').css({'background' : '#4084CB'});
							}
							
							alerts.pageSize = 10;
							
							if(alerts.pageSize < alerts.matchedRecords_InProgressReminderAlerts) {
								$('#inProgressReminderAlertsPagination').show();
								$('#startIndex_InProgressReminderAlerts').text(alerts.startPosition_InProgressReminderAlerts);
								if(alerts.startPosition_InProgressReminderAlerts + (alerts.pageSize-1) >= alerts.matchedRecords_InProgressReminderAlerts){
			    					$('#endIndex_InProgressReminderAlerts').text(alerts.matchedRecords_InProgressReminderAlerts);
			    					document.getElementById('btnNext_InProgressReminderAlerts').disabled = true;
			    					document.getElementById('btnLast_InProgressReminderAlerts').disabled = true;
			    					$('#btnNext_InProgressReminderAlerts,#btnLast_InProgressReminderAlerts').css({'background' : '#b7b7b7'});
			    					} else {
			    						$('#endIndex_InProgressReminderAlerts').text(alerts.startPosition_InProgressReminderAlerts + (alerts.pageSize-1));
			    						$('#btnNext_InProgressReminderAlerts,#btnLast_InProgressReminderAlerts').css({'background' : '#4084CB'});
			    					}
								$('#totalAlerts_InProgressReminderAlerts').text(alerts.matchedRecords_InProgressReminderAlerts);
							} else {	
								$('#inProgressReminderAlertsPagination').hide();
							}
					}
				}
			
			if(!alerts.isInProgressReminderAlertsOnly) {				
				// Call for Service layer to fetch Completed Reminder Alerts 
				//Re-initializing the values.
				alerts.pageSize = 10; 
				//alerts.endPos = 0; 
				//matchedRecords = 0; 
				//returnRecords = 0; 
				//startPosition = 1;	
				//sortString = ""; 
				//sortField = ""; 	
				// Code to switch off the on change event for text.
				$(':input[type="text"]').blur();
				
				
				
				alerts.populateAlertsData("reminderAlertsCompleted", "&start=" + 
						alerts.startPosition + "&filter=" + alerts.completedReminderFullFilterVal + "&sortStr=" + alerts.sortString+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField,alerts.customOptions);
			}
			
			
		},
		reminderAlertsCompleted : function(data) {

			$('.' + alertName + '-table.reminder-alerts-table').children('tbody').show();
			$("#completedReminderAlertsData").empty();
			
			alerts.reminderAlertsCompletedData = data;
			
				$(".completedreminderno-record").hide();
				$(".completed-utility .tbl-utility-icons").show();
				
				if(data.ListComplianceReminderAlertResponse != null && data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail != null) {
					var ReminderAlert = data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail.ReminderAlert;
					if(ReminderAlert != null) {
						for(var index=0; index<ReminderAlert.length; index++ ) {
							if(ReminderAlert[index] != null) {								
								var tr = document.createElement('tr');
								var companyName = "" ;
								var td1 = document.createElement('td');
								td1.setAttribute("id", ReminderAlert[index].ReminderAlertID); //sets the ReminderAlertID
								var td2 = document.createElement('td');
								var td3 = document.createElement('td');
								var td4 = document.createElement('td');
								var td5 = document.createElement('td');
								if(ReminderAlert[index].OrganizationPrimaryName != null && ReminderAlert[index].OrganizationPrimaryName[0] != null && 
										ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName != null && ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$ != null
										&& typeof(ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$) != 'undefined') {
									companyName = ReminderAlert[index].OrganizationPrimaryName[0].OrganizationName.$$;
								} else if (ReminderAlert[index].SubjectName != null) {
									
									companyName = appendPhoneticName(ReminderAlert[index].SubjectName);
								}
								
								if(companyName != "") {
									companyName = "<input type='checkbox' class='completedReminderAlertCheckbox'>" + companyName + "</input>";
									td1.innerHTML =  '<a href="#" id="reminderAlertNavigation">'+ companyName + '</a>';
								} else {
									companyName = "<input type='checkbox' class='completedReminderAlertCheckbox'></input>";
									td1.innerHTML =  '<a href="#" id="reminderAlertNavigation">'+ companyName + '</a>';
								}
								
								if(ReminderAlert[index].ComplianceDivisionName != null && ReminderAlert[index].ComplianceDivisionName[0] != null
										&& ReminderAlert[index].ComplianceDivisionName[0].$$ != null &&
										typeof(ReminderAlert[index].ComplianceDivisionName[0].$$) != "undefined") {									
									$(td2).html(ReminderAlert[index].ComplianceDivisionName[0].$$);
								}
								if(ReminderAlert[index].ComplianceQueueName != null && ReminderAlert[index].ComplianceQueueName[0] != null
										&& ReminderAlert[index].ComplianceQueueName[0].$$ != null && 
										typeof(ReminderAlert[index].ComplianceQueueName[0].$$) != "undefined") {									
									$(td3).html(ReminderAlert[index].ComplianceQueueName[0].$$);
								}
								if(ReminderAlert[index].ReminderEndDate != null && typeof(ReminderAlert[index].ReminderEndDate) != "undefined") {									
									$(td4).html(ReminderAlert[index].ReminderEndDate);
								}
								if(ReminderAlert[index].ReminderAlertDescription != null && ReminderAlert[index].ReminderAlertDescription.$$ != null &&
										typeof(ReminderAlert[index].ReminderAlertDescription.$$) != "undefined") {
									$(td5).html(ReminderAlert[index].ReminderAlertDescription.$$);
								}
								tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4); tr.appendChild(td5); 
								
								//Adding hidden attributes
		                		var tdForDivID = "";
		                		var tdForDivName = "";
		                		var tdForQueueID = "";
		                		var tdForQueueName = "";
		                		var tddunsNumber = "";
		                		var tdsupplierID = "";
		                		
		                			
		                		tdForDivID = document.createElement("input");
			                	tdForDivID.setAttribute("name", "divID");
			                	tdForDivID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceDivisionID != null &&
			                				typeof(ReminderAlert[index].ComplianceDivisionID) != 'undefined') {		                			
			                			tdForDivID.setAttribute("value", ReminderAlert[index].ComplianceDivisionID);
			                	} else {
			                			tdForDivID.setAttribute("value", "");
			                	}
			                		
			                	tdForDivName = document.createElement("input");
			                	tdForDivName.setAttribute("name", "divisionName");
			                	tdForDivName.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceDivisionName != null && 
			                			ReminderAlert[index].ComplianceDivisionName[0].$$ != null &&
			                				typeof(ReminderAlert[index].ComplianceDivisionName[0].$$) != 'undefined') {		                			
			                			tdForDivName.setAttribute("value", ReminderAlert[index].ComplianceDivisionName[0].$$);
			                	} else {
			                			tdForDivName.setAttribute("value", "");
			                	}

			                	tdForQueueID = document.createElement("input");
			                	tdForQueueID.setAttribute("name", "queueID");
			                	tdForQueueID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceQueueID != null &&
			                				typeof(ReminderAlert[index].ComplianceQueueID) != 'undefined') {		                			
			                			tdForQueueID.setAttribute("value", ReminderAlert[index].ComplianceQueueID);
			                	} else {
			                			tdForQueueID.setAttribute("value", "");
			                	}

			                	tdForQueueName = document.createElement("input");
		                		tdForQueueName.setAttribute("name", "queueName");
			                	tdForQueueName.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].ComplianceQueueName != null &&
			                			ReminderAlert[index].ComplianceQueueName[0].$$ != null &&
			                				typeof(ReminderAlert[index].ComplianceQueueName[0].$$) != 'undefined') {		                			
			                			tdForQueueName.setAttribute("value", ReminderAlert[index].ComplianceQueueName[0].$$);		                		
			                	} else {
			                			tdForQueueName.setAttribute("value", "");
			                	}	                		
			                		
			                	tddunsNumber = document.createElement("input");
			                	tddunsNumber.setAttribute("name", "dunsNumber");
			                	tddunsNumber.setAttribute("type", "hidden");                     
			                	tddunsNumber.setAttribute("value", "");
			                	                		
			                		
			                	tdsupplierID = document.createElement("input");
			                	tdsupplierID.setAttribute("name", "supplierID");
			                	tdsupplierID.setAttribute("type", "hidden");                     
			                	if(ReminderAlert[index].SubjectID != null && typeof(ReminderAlert[index].SubjectID) != 'undefined') {
			                			tdsupplierID.setAttribute("value", ReminderAlert[index].SubjectID);
			                	} else {
			                			tdsupplierID.setAttribute("value", "");
			                	}
		                		 
			                	//Handling Hidden attributes
			                	tr.appendChild(tdForDivID);
			                	tr.appendChild(tdForDivName);
			                	tr.appendChild(tdForQueueID);
			                	tr.appendChild(tdForQueueName);
			                	tr.appendChild(tddunsNumber);
			                	tr.appendChild(tdsupplierID);

								
								var completedReminderAlertsTable = document.getElementById('completedReminderAlertsData');
								completedReminderAlertsTable.appendChild(tr);	
								
							}
						}
						
						alerts.matchedRecords = data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail.CandidateMatchedQuantity;
							document.getElementById('btnFirst').disabled = false;
							document.getElementById('btnPrevious').disabled = false;
							document.getElementById('btnNext').disabled = false;
							document.getElementById('btnLast').disabled = false;
							
							if(alerts.startPosition == 1) {
								document.getElementById('btnFirst').disabled = true;
								document.getElementById('btnPrevious').disabled = true;
								$('#btnFirst, #btnPrevious').css({'background' : '#b7b7b7'});
							}
							else {
								$('#btnFirst,#btnPrevious').css({'background' : '#4084CB'});
							}
							
							alerts.pageSize = 10;
							
							if(alerts.pageSize < alerts.matchedRecords) {
								$('#pagination').show();
								$('#startIndex').text(alerts.startPosition);
								if(alerts.startPosition + (alerts.pageSize-1) >= alerts.matchedRecords){
			    					$('#endIndex').text(alerts.matchedRecords);
			    					document.getElementById('btnNext').disabled = true;
			    					document.getElementById('btnLast').disabled = true;
			    					$('#btnNext,#btnLast').css({'background' : '#b7b7b7'});
			    					} else {
			    						$('#endIndex').text(alerts.startPosition + (alerts.pageSize-1));
			    						$('#btnNext,#btnLast').css({'background' : '#4084CB'});
			    					}
								$('#totalAlerts').text(alerts.matchedRecords);
							} else {	
								$('#pagination').hide();
							}
					}
				}
		},
				// Method for ScreeningAlerts page
		screeningAlerts : function(data) {
					$('.' + alertName + '-alerts-table').children('tbody').show();
					$(".no-record").hide();
					$(".tbl-utility-icons").show();
					 var screeningAlertDetails = data.GetComplianceAlertsResponse.GetComplianceAlertsResponseDetail.ComplianceAlert;
			            if (screeningAlertDetails != null) {
			                $("#screeningAlertsData").empty();
                            var SubjectAlertDetail = screeningAlertDetails.SubjectAlertDetail;
			                var SubjectAlertEventDetail = screeningAlertDetails.SubjectAlertEventDetail;
			                var ComplianceDivisionQueueDetail = screeningAlertDetails.ComplianceDivisionQueueDetail;
			                
			                	if(SubjectAlertEventDetail != null && SubjectAlertEventDetail.length != null) {
			                		
			                		for(var count=0; count<SubjectAlertEventDetail.length; count++){
			                			
			                			var tr = document.createElement('tr');
			                			var td1 = document.createElement('td');
			                			td1.setAttribute("id", SubjectAlertEventDetail[count].AlertEntityID +"-"+ SubjectAlertEventDetail[count].EventID); //sets the AlertEntityId and Event Id
			                			var td2 = document.createElement('td');
			                			var td3 = document.createElement('td');
			                			var td4 = document.createElement('td');
			                			var td5 = document.createElement('td');
			                			var td6 = document.createElement('td');
			                			var td7 = document.createElement('td');
			                			var td8 = document.createElement('td');//CR-107
			                			var span = document.createElement('span');
			                			var eventTypeText = "";
			                			//CR107-Alerted Name 
			                			if(SubjectAlertEventDetail[count].Name != null && SubjectAlertEventDetail[count].Name.PrimaryName != null) {	                				
			                				span.appendChild(document.createTextNode(SubjectAlertEventDetail[count].Name.PrimaryName));
			                			} else {
			                				span.appendChild(document.createTextNode(""));
			                			}
			                			td2.appendChild(document.createTextNode(SubjectAlertEventDetail[count].InquiryDetail.SubjectName.$$));
			                			       			
			                			if(SubjectAlertEventDetail[count].EventTypeText != null) {
			                				td3.appendChild(document.createTextNode(SubjectAlertEventDetail[count].EventTypeText)); 
			                				eventTypeText = SubjectAlertEventDetail[count].EventTypeText;
			                			} else {
			                				td3.appendChild(document.createTextNode(""));
			                			}
			                			
			                			if(SubjectAlertEventDetail[count].EventSubTypeText != null) {
			                				td4.appendChild(document.createTextNode(SubjectAlertEventDetail[count].EventSubTypeText));
			                			} else {
			                				td4.appendChild(document.createTextNode(""));
			                			}
			                			td5.appendChild(document.createTextNode(formatDate((SubjectAlertEventDetail[count].AlertDate).substring(0,10),"YYYY-MM-DD")));
			                			//screeningConfiguration CR-107
			                			if(SubjectAlertEventDetail[count].InquiryDetail.ScreeningConfigurationName!=null && SubjectAlertEventDetail[count].InquiryDetail.ScreeningConfigurationName.$$!=null){
			                				td6.appendChild(document.createTextNode(SubjectAlertEventDetail[count].InquiryDetail.ScreeningConfigurationName.$$));
			                			}
			                			else{
			                				td6.appendChild(document.createTextNode(""));	
			                			}
			                			//ENTITY NAME screeningConfiguration CR-107
			                			if(SubjectAlertEventDetail[count].InquiryDetail.SupplierName!=null){
										    $(td7).append('<a href="#" id="screeningAlertNavigation">'+ appendPhoneticName(SubjectAlertEventDetail[count].InquiryDetail.SupplierName) +'</a>');
			                			}
			                			
			                			td8.appendChild(document.createTextNode(SubjectAlertEventDetail[count].ProjectID));
			                			td1.appendChild(span);
			                			tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3); tr.appendChild(td4);tr.appendChild(td5); tr.appendChild(td6);tr.appendChild(td7);tr.appendChild(td8);
			                			
			                			var tdForDivID = "";
				                		var tdForDivName = "";
				                		var tdForQueueID = "";
				                		var tdForQueueName = "";
				                		var tddunsNumber = "";
				                		var tdsupplierID = "";
				                		
				                	if(ComplianceDivisionQueueDetail != null && ComplianceDivisionQueueDetail.length != null) {
				                		
				                		tdForDivID = document.createElement("input");
					                	tdForDivID.setAttribute("name", "divID");
					                	tdForDivID.setAttribute("type", "hidden");                     
					                	if(ComplianceDivisionQueueDetail[count].ComplianceDivisionID != null &&
					                			typeof(ComplianceDivisionQueueDetail[count].ComplianceDivisionID) != 'undefined') {		                			
					                	    	tdForDivID.setAttribute("value", ComplianceDivisionQueueDetail[count].ComplianceDivisionID);
					                	} else {
					                			tdForDivID.setAttribute("value", "");
					                	}
					                		
				                		tdForDivName = document.createElement("input");
					                	tdForDivName.setAttribute("name", "divisionName");
					                	tdForDivName.setAttribute("type", "hidden");                     
					                	if(ComplianceDivisionQueueDetail[count].ComplianceDivisionName != null && 
					                				ComplianceDivisionQueueDetail[count].ComplianceDivisionName.$$ != null &&
					                	     		typeof(ComplianceDivisionQueueDetail[count].ComplianceDivisionName.$$) != 'undefined') {		                			
					                			tdForDivName.setAttribute("value", ComplianceDivisionQueueDetail[count].ComplianceDivisionName.$$);
					                	} else {
					                			tdForDivName.setAttribute("value", "");
					                	}

					                	tdForQueueID = document.createElement("input");
					                	tdForQueueID.setAttribute("name", "queueID");
					                	tdForQueueID.setAttribute("type", "hidden");                     
					                	if(ComplianceDivisionQueueDetail[count].ComplianceQueueID != null &&
					                				typeof(ComplianceDivisionQueueDetail[count].ComplianceQueueID) != 'undefined') {		                			
					                			tdForQueueID.setAttribute("value", ComplianceDivisionQueueDetail[count].ComplianceQueueID);
					                	} else {
					                			tdForQueueID.setAttribute("value", "");
					               		}

					               		tdForQueueName = document.createElement("input");
				                		tdForQueueName.setAttribute("name", "queueName");
					                	tdForQueueName.setAttribute("type", "hidden");                     
					                	if(ComplianceDivisionQueueDetail[count].ComplianceQueueName != null &&
					                				ComplianceDivisionQueueDetail[count].ComplianceQueueName.$$ != null &&
					                				typeof(ComplianceDivisionQueueDetail[count].ComplianceQueueName.$$) != 'undefined') {		                			
					                			tdForQueueName.setAttribute("value", ComplianceDivisionQueueDetail[count].ComplianceQueueName.$$);		                		
					                	} else {
					                			tdForQueueName.setAttribute("value", "");
					                	}	                		
					                		
					                	tddunsNumber = document.createElement("input");
					                	tddunsNumber.setAttribute("name", "dunsNumber");
					                	tddunsNumber.setAttribute("type", "hidden");                     
					                	tddunsNumber.setAttribute("value", "");
					                	
					                	tdsupplierID = document.createElement("input");
					                	tdsupplierID.setAttribute("name", "supplierID");
					                	tdsupplierID.setAttribute("type", "hidden");                     
					                	if(SubjectAlertEventDetail[count].InquiryDetail.SubjectID != null && typeof(SubjectAlertEventDetail[count].InquiryDetail.SubjectID) != 'undefined') {
					                			tdsupplierID.setAttribute("value", SubjectAlertEventDetail[count].InquiryDetail.SubjectID);
					                	} else {
					                			tdsupplierID.setAttribute("value", "");
					                	}
					          		                		      		
				                	
				                	    //Handling Hidden attributes
					                	tr.appendChild(tdForDivID);
					                	tr.appendChild(tdForDivName);
					                	tr.appendChild(tdForQueueID);
					                	tr.appendChild(tdForQueueName);
					                	tr.appendChild(tddunsNumber);
					                	tr.appendChild(tdsupplierID);
				                	}
			                			
			                			var tbodyTable = document.getElementById('screeningAlertsData');
			                			tbodyTable.appendChild(tr);
			                			var tr1 = document.createElement('tr');
			                			tr1.className = "details-row";
			                			var td1 = document.createElement('td');
			                			td1.setAttribute("colSpan", "6");
			                			if(eventTypeText == "Gray list") {			                				
			                				td1.innerHTML=$(".tpi-greylist-details-row-content").html();
			                			} else {
			                				td1.innerHTML=$(".screening-details-row-content").html();
			                			}
			                			tr1.appendChild(td1);
			                			tbodyTable.appendChild(tr1);
			                		}
			                	}
			                	
			                	if(SubjectAlertDetail != null && SubjectAlertDetail.length != null) {
			                		
			                		for(var index=0; index<SubjectAlertDetail.length; index++) {	                			
			                			alerts.alertEntityMap[SubjectAlertDetail[index].AlertEntityID] = SubjectAlertDetail[index]; //sets alert details for each alert in a map using AlertEntityID
			                		}
			                	}
				                

			                	alerts.matchedRecords = data.GetComplianceAlertsResponse.GetComplianceAlertsResponseDetail.CandidateMatchedQuantity;
							
							document.getElementById('btnFirst').disabled = false;
							document.getElementById('btnPrevious').disabled = false;
							document.getElementById('btnNext').disabled = false;
							document.getElementById('btnLast').disabled = false;
							
							if(alerts.startPosition == 1) {
								document.getElementById('btnFirst').disabled = true;
								document.getElementById('btnPrevious').disabled = true;
								$('#btnFirst, #btnPrevious').css({'background' : '#b7b7b7'});
							}
							else {
								$('#btnFirst,#btnPrevious').css({'background' : '#4084CB'});
							}
							
							if(alerts.pageSize < alerts.matchedRecords) {
								$('#pagination').show();
								$('#startIndex').text(alerts.startPosition);
								if(alerts.startPosition + (alerts.pageSize-1) >= alerts.matchedRecords){
			    					$('#endIndex').text(alerts.matchedRecords);
			    					document.getElementById('btnNext').disabled = true;
			    					document.getElementById('btnLast').disabled = true;
			    					$('#btnNext,#btnLast').css({'background' : '#b7b7b7'});
			    					} else {
			    						$('#endIndex').text(alerts.startPosition + (alerts.pageSize-1));
			    						$('#btnNext,#btnLast').css({'background' : '#4084CB'});
			    					}
								$('#totalAlerts').text(alerts.matchedRecords);
							} else {	
								$('#pagination').hide();
							}
			            }
			            $(".screening-alerts-table").tablerowExpand();
			            /*---------Alert expand collapse class---*/
			            $(".screening-alerts-table tbody tr.odd td:first-child").on('click',function(e){
			            		e.preventDefault();
			            		e.stopPropagation();
			            		$(this).closest('tr.odd').siblings().children('td:first-child').removeClass('down');
			            		$(this).toggleClass('down');
			            });					
	           

		},
		updateComplianceReminderAlert : function(data) {
			if(data != null && data.UpdateComplianceReminderAlertResponse != null &&
					data.UpdateComplianceReminderAlertResponse.TransactionResult != null) {
				
				if("Success" == data.UpdateComplianceReminderAlertResponse.TransactionResult.ResultText) {
					
					// Re-initializing the values.
					alerts.pageSize = 10; 
					alerts.endPos = 0; 
					alerts.matchedRecords = 0; 
					alerts.returnRecords = 0; 
					alerts.startPosition = 1;	
					//alerts.filterString = "ReminderAlertStatus|Inprogress" ;
					alerts.isInProgressReminderAlertsOnly = false;
					alerts.sortString = ""; 
					alerts.sortField = ""; 	
					// Code to switch off the on change event for text.
					$(':input[type="text"]').blur();

					// Call for Service layer
					alerts.populateAlertsData("reminderAlertsInProgress", "&start=" + 
							alerts.startPosition_InProgressReminderAlerts + "&filter=" + alerts.fullFilterVal + "&sortStr=" + alerts.sortString_InProgressReminderAlerts+ "&pagesz=" + alerts.pageSize+ "&sortCol=" + alerts.sortField_InProgressReminderAlerts,alerts.customOptions);
					
				}
			}
		},
		viewAlertsProfile : function(data, eventId) {
			alerts.isCreateRequest=false;
			alerts.populateViewAlertsProfile(data);
		}
	},
	createRequestForUpdateReminderAlert : function (reminderAlertID, reminderStatus) {
		var updateComplianceReminderAlertRequestDetail = "";
		data = reminderStatus == 'inprogress' ? alerts.reminderAlertsInProgressData:alerts.reminderAlertsCompletedData;
		if(data.ListComplianceReminderAlertResponse != null && data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail != null) {
		var ReminderAlert = data.ListComplianceReminderAlertResponse.ListComplianceReminderAlertResponseDetail.ReminderAlert;
		if(ReminderAlert != null) {
			for(var index=0; index<ReminderAlert.length; index++) {
				if(ReminderAlert[index] != null && ReminderAlert[index].ReminderAlertID == reminderAlertID) {
					var desription = "";
					var languageCode = "";
					var updatedStatus = "";
					var writingScriptISOAlpha4Code = "";
					if(ReminderAlert[index].ReminderAlertDescription != null && ReminderAlert[index].ReminderAlertDescription.$$ != null 
							&& typeof(ReminderAlert[index].ReminderAlertDescription.$$) != "undefined") {						
						desription =  ReminderAlert[index].ReminderAlertDescription.$$;
					}
					if(ReminderAlert[index].ReminderAlertDescription.$WritingScriptISOAlpha4Code != null ) {						
						writingScriptISOAlpha4Code =  ReminderAlert[index].ReminderAlertDescription.$WritingScriptISOAlpha4Code;
					}
					if(ReminderAlert[index].ReminderAlertDescription.$LanguageCode != null ) {						
						languageCode =  ReminderAlert[index].ReminderAlertDescription.$LanguageCode;
					}
					var reminderAlertDescription = {
							"@LanguageCode" : languageCode,
							"@WritingScriptISOAlpha4Code": writingScriptISOAlpha4Code,
							"$" : desription
					};
					var currentStatus = ReminderAlert[index].ReminderAlertStatus;
					if(currentStatus == "InProgress") {
						updatedStatus = "Complete";
					} else if(currentStatus == "Complete") {
						updatedStatus = "Inprogress";
					}
					var weeklyReminderIndicator = "";
					if(ReminderAlert[index].WeeklyReminderIndicator != null && typeof(ReminderAlert[index].WeeklyReminderIndicator) != "undefined") {
						weeklyReminderIndicator = ReminderAlert[index].WeeklyReminderIndicator;
					}
					updateComplianceReminderAlertRequestDetail = {
							"SubjectID" : ReminderAlert[index].SubjectID,
							"ReminderAlertDescription" : reminderAlertDescription,
							"ReminderStartDate" : ReminderAlert[index].ReminderStartDate,
							"ReminderEndDate" : ReminderAlert[index].ReminderEndDate,
							"WeeklyReminderIndicator" : weeklyReminderIndicator,
							"ReminderAlertStatus" : updatedStatus,
							"ReminderAlertID" : ReminderAlert[index].ReminderAlertID
					};
					break;
				}
			}
		}
	}
    return updateComplianceReminderAlertRequestDetail;
	},
	formatForToolTip : function (value){
		if(value=="RecordAdded"){
			return i18n.recordAdded;		
		}
		if(value=="StatusChange"){
			return i18n.statusChange;		
		}
		if(value=="RecordAssignedToUser"){
			return i18n.recordAssigned;			
		}				
	},
	// Filter function will be called after a delay of 2 seconds on key press
	throttle : function (f, delay){
	    var timer = null;
	    return function(){
	        var context = this, args = arguments;
	        clearTimeout(timer);
	        timer = window.setTimeout(function(){
	            f.apply(context, args);
	        },
	        delay);
	    };
	},
	showAlerts : function (current){
		var curr = current;
		if(!curr.hasClass('selected')){	
				curr.addClass('selected');
				curr.siblings().removeClass('selected');
			}
			var activeClass=curr.attr('class');
			var activeText=curr.closest('div').attr('class').split(' ')[0].replace('alerts-details','').replace('-details','');
		curr.siblings().each(function(){
					var imgSrc=$(this).children('img').attr('src').replace('small-active','small-inactive');
					$(this).children('img').attr('src',imgSrc)
				});
			curr.children('img').attr('src','static/images/'+activeText+'small-active.png');
			if($('.profile-details').hasClass('selected')){
					$('.alerts-main-page-container').hide();
					$('.profile-main-page-container').show();
					$('.create-profile-index').show();	
					$('.create-profile-index').children().show();
					$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
					$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
					var hideText='';
					curr.siblings().each(function(){
						hideText=$(this).closest('div').attr('class').split(' ')[0].replace('alerts-details','').replace('-details','');
						$('.'+hideText+'-alerts-detail').hide();
						$('.'+hideText+'-alerts-table .alerts-table-search input[type="text"]').val('');
						$('.'+hideText+'-alerts-table .alerts-table-search').hide();
					});
			}else{
				$('.profile-main-page-container').hide();
				$('.alerts-main-page-container').show();
				$('.alerts-main-page-container').removeClass('border-full-radius').addClass('border-notopleft-radius');
				var hideText='';
				curr.siblings().each(function(){
					hideText=$(this).closest('div').attr('class').split(' ')[0].replace('alerts-details','').replace('-details','');
					$('.'+hideText+'-alerts-detail').hide();
					$('.'+hideText+'-alerts-table .alerts-table-search input[type="text"]').val('');
					$('.'+hideText+'-alerts-table .alerts-table-search').hide();
				});
				// console.log('.'+activeText+'-alerts-detail');
				$('.'+activeText+'-alerts-detail').show();
				
			}	
		
		},
		formatTitle : function (title){
			if (title != null && title != 'undefined') {
				return title.replace(/\,/g,'<br/>');	
			} else {
				return "";
			}
		},
		formatActions : function (actionText){
			if (actionText != null && actionText != 'undefined') {
				return actionText.replace(/\ /g,'');	
			} else {
				return "";
			}
		},
		// create qtip for the given object
		createQTip : function (tipId){
			$(tipId).qtip({				
				
				position: {
			              corner: {
			                 tooltip: 'leftMiddle', // Use the corner...
			                 target: 'rightMiddle' // ...and opposite corner
			              }
						   
			           },
				show: 'mouseover',
			   	hide: {
					event:'mouseout',
			        fixed: true // Make it fixed so it can be hovered over
			     }, 
				 
			    style: { 			
				   background: '#2C374A',
				   color: '#fff',
				   textAlign: 'left',
				   border: {
					 width: 1,
					 radius:5,
					 color: '#293344'
					},
					width:{max:430 },
					'overflow': 'hidden',
					'text-overflow':'ellipsis',
					'font-family':'Arial, Helvetica, sans-serif',
					'font-size':'1.4em',
					 tip: true   			
				}
			   });	
			
		},
		populateDivisionDropDown : function (id, value){
			var combo = document.getElementById(id);
			var option = document.createElement("option");
			option.text = alerts.getLanguageDescription(value.ComplianceDivisionName);
			option.value =value.ComplianceDivisionID;
			try {
				combo.add(option, null); // Standard
			}catch(error) {
				combo.add(option); // IE only
			}
		},
		isValidEmailAddress : function (emailAddress) {
		    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		    return pattern.test(emailAddress);
		},
		getLanguageDescription : function (value){	
			 if (value instanceof Array) {
				 return alerts.checkLanguageDescription(alerts.escapeJSONforTemplate(value[0]));		 
			 }else{		 
				 return alerts.checkLanguageDescription(alerts.escapeJSONforTemplate(value));		 	
			 }
		},
		checkLanguageDescription : function (data){
			if (data.hasOwnProperty("$$") ) {		
				 return data.$$;
			 }else{			 
				 return data;
			 }	
		},
		checkJsonData : function (data, childnode) {
			 childnode = childnode.split(".");// add this
			 for (i in childnode) {
			  var key = childnode[i];
			  if (data[key] == null)
			    return "";
			  	data = data[key];
			 }
			 return data;
		},
		deleteAlertProfile : function(updateId){
			$.blockUI({ 
		    	message: '',
		    	css: {position: ''}
		    });
			var updateDetailsId=$("#"+updateId);	
			var emailIds=updateDetailsId.children(".updateEmailIds").text().split(',');
			alerts.emailProfileList=[];
			 for(var i=1;i<emailIds.length;i++){	        
				 alerts.emailProfileList.push({"email":emailIds[i-1], "index":i-1});
			 }
			var selectedEmailsObject={"EmailAddress":[]};
			$.each(alerts.emailProfileList, function(emailIndex, emailValue){	
					selectedEmailsObject.EmailAddress.push({"TelecommunicationAddress":emailValue.email});
			});
			var selectedQueues=[];
			var existingQueueIds=updateDetailsId.children(".updateProfileQueueId");
			var complianceQueueId="";
			$.each(existingQueueIds, function(existingQueueIdsIndex, existingQueueIdsValue){
				complianceQueueId=$(existingQueueIdsValue).text();
				var actionArray= new Array();
				var queueActions=updateDetailsId.children(".updateProfileActions"+complianceQueueId).text().slice(0, -1).split(',');
				
				for(var i=0;i<queueActions.length;i++){	        
					actionArray.push(queueActions[i]);	
			       
				}
				var selectedQueueDetails={"ComplianceQueueID":complianceQueueId, "ComplianceQueueEventDetail": {"ComplianceQueueEventID":actionArray}, "ComplianceQueueActiveIndicator":false};
				selectedQueues.push(selectedQueueDetails);
				
			});
			// create the request for save
			// create the compliance Division ID
			var complianceDivisionID =updateDetailsId.children(".divisionId").text();;
			var alertName = updateDetailsId.children(".alertName").text();
			// create the alert Profile Name Object
			var alertProfileNameObject= {
					"@LanguageCode": "",		
					"$":alertName
			};
			var queueTypes=updateDetailsId.children(".updateQueueTypes").text().split(',');
			var screeningResultIndicator=false;
			var queueResultIndicator=false;
			// create the screening Result Detail Object
			var screeningResultDetailObject={ "ScreeningAlertsRequiredIndicator": screeningResultIndicator};
			// create the Queue Action Alert Profile Detail Object
			var queueActionAlertProfileDetailObject={
					"QueueActionAlertsRequiredIndicator": queueResultIndicator,
					"ComplianceDivisionQueue": selectedQueues
			};
			var deleteAlertProfileId=updateDetailsId.children(".alertProfileId").text();
			var deleteProfileRequestDetailObject={			
						"AlertProfileName": alertProfileNameObject,
						"AlertProfileID":deleteAlertProfileId,
						"ComplianceDivisionID":complianceDivisionID,
						"ScreeningResultAlertProfileDetail":screeningResultDetailObject,
						"QueueActionAlertProfileDetail":queueActionAlertProfileDetailObject,
						"NotificationDetail":selectedEmailsObject,
						"AlertProfileActiceIndicator": false
			};
			var jsonRequest = JSON.stringify(deleteProfileRequestDetailObject);
			var url = flowExecutionUrl + "&_eventId=deleteAlertProfile&";        	
			$.ajax({
				type : 'POST',
				url  : url,
				data : {
				  "profileRequest":jsonRequest
			    },
				success : function(responseJSON) {
					$('.alerts-main-page-container').hide();
					$('.country-main-details').hide();
					$('.profile-main-page-container').show();
					$('.create-profile-index').show();					
					$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
					$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
					$(".no-record").hide();
					$("#existingProfiles").empty();			
					alerts.populateExistingAlertProfiles("viewAlertsProfile","",alerts.customOptions);
				},
				error : function(data, errorType, exception) {
					alert(i18n.unexpectedError_msg + "\"" + errorType + "\"" + i18n.unexpectedError_message);
				}
			});	
		},
		loadUpdateAvailableQueues : function (updateDetailsId){
			$.blockUI({ 
		    	message: '',
		    	css: {position: ''}
		    });
			//var indexSelected = document.getElementById("profileDivisions").selectedIndex;
			//var selectedDivisionId=document.getElementById("profileDivisions");
			//var divisionValue=selectedDivisionId.options[indexSelected].value;
			var divisionValue=updateDetailsId.children(".divisionId").text();
			var profileQueueList={"queuelist":[]};
			$("#availableQueues").empty();
			var queueList=[];
			$.ajax({
				type : 'GET',
				url : "ajax/profileQueueDetail?divisionID="+divisionValue,
				dataType : "json",
				success : function(data) {
					try{
						if(data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision instanceof Array){
							 queueList= data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision[0].ComplianceDivisionQueue;
							}else{
								queueList.push(data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision.ComplianceDivisionQueue);
						}
						if ( typeof queueList != 'undefined' ){					
							$.each(queueList, function(queueIndex, queueValue){	
								if(typeof queueValue.UserAccessLevel != 'undefined' ){							
									if ( queueValue.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
										profileQueueList.queuelist.push({"name":alerts.getLanguageDescription(queueValue.ComplianceQueueName),"queueId":queueValue.ComplianceDivisionQueueID});
									}
								}
							});
							
							
							
							var existingQueueIds=updateDetailsId.children(".updateProfileQueueId");
							var queueUpdateId="";
							var actionId="";
							if(profileQueueList.queuelist.length>0){
							 
							$("#profileQueueTemplate").tmpl(profileQueueList).appendTo("#availableQueues");
							 
							$.each(existingQueueIds, function(existingQueueIdsIndex, existingQueueIdsValue){
								queueUpdateId=$(existingQueueIdsValue).text();
								$("#queue-"+queueUpdateId).prop("checked", true);
								$("#queue-"+queueUpdateId).attr("updateflag", "true");
								var queueActions=updateDetailsId.children(".updateProfileActions"+queueUpdateId).text().slice(0, -1).split(',');
								
								for(var i=0;i<queueActions.length;i++){	        
							     
							       if(queueActions[i]=="RecordAdded"){
							    	   actionId="queue-"+queueUpdateId+"-action1";					    	 
							    	   $("#"+actionId).prop("checked", true);
							       }
							       if(queueActions[i]=="RecordAssignedToUser"){
							    	   actionId="queue-"+queueUpdateId+"-action3";
							    	   $("#"+actionId).prop("checked", true);
							       }
								}
							});
							}
						}
						
					}finally{
						var queueTypes=updateDetailsId.children(".updateQueueTypes").text().split(',');
						for(var i=0;i<queueTypes.length;i++){
							if(queueTypes[i]=="Queue Action"){
								$('.available-queues-info,.add-email-address').show();
								$('.queue-action').prop('checked', true);
							}
							if(queueTypes[i]=="Screening Result"){
								if(i==0){
								$('.available-queues-info').hide();
								}
								$('.add-email-address').show();		
								$('.screenign-results').prop('checked', true);
							}
						}
						
						$('.create-profilebtn').parent().hide();
						$('.create-profile-detail').show();
						selectMenuPluginRecall("profileDivisions");
						$.unblockUI();
					}
				},
				error: function(data, errorType, exception) {
					// TODO change to error message
					alert(i18n.unexpectedError_msg + "\"" + errorType + "\"" + i18n.unexpectedError_message);
				},
				complete: function(jqXHR, textstatus){
					$.unblockUI();
				}
			});		
		},
		populateUpdateQueueDetails : function (updateDetailsId){
			$('#profileDivisions').empty();
			var loadingUpdateFlag=true;
			$.ajax({
				type : 'GET',
				url : "ajax/profileDivisions",
				dataType : "json",
				success : function(data) {
					try{
						var divisionList= data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision;
						if ( typeof divisionList != 'undefined' ){	
							if(divisionList instanceof Array){
								$.each(divisionList, function(divisionIndex, divisionValue){
									if ( alerts.checkJsonData(divisionValue, "UserAccessLevel") != "" ){
										if ( divisionValue.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
											if ( typeof divisionValue.ComplianceDivisionName != 'undefined' ){
												alerts.populateDivisionDropDown("profileDivisions", divisionValue);	
											}
										}
									}
								});	
							}else{
								if ( alerts.checkJsonData(divisionList, "UserAccessLevel") != "" ){
									if ( divisionList.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
										if ( typeof divisionList.ComplianceDivisionName != 'undefined' ){
											alerts.populateDivisionDropDown("profileDivisions", divisionList);	
										}
									}
								}							
							}
							
							var divisionExists = false;
							var divisionId=updateDetailsId.children(".divisionId").text();
							$('#profileDivisions option').each(function(){
							    if (this.value == divisionId) {
							    	divisionExists = true;
							        return false;
							    }
							});
							if(divisionExists){
								document.getElementById("profileDivisions").value=divisionId;
								loadingUpdateFlag=false;
								//alerts.loadUpdateAvailableQueues(updateDetailsId);						
								//selectMenuPluginRecall("profileDivisions");
							}else{
								alert(i18n.exceptionFromService);
								
								$(".new-profile-title").html(i18n.alerts_CreateNewProfile_Message);
								$('.alerts-main-page-container').hide();
								$('.profile-main-page-container').show();
								$('.create-profile-index').show();	
								$('.create-profile-index').children().show();
								$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
								$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
								$('#profileDivisions').empty();
							
								$(".create-profile-index h4").show();
							}
						}
						
					}finally{
						if(loadingUpdateFlag){
							$.unblockUI();
						}
						selectMenuPluginRecall("profileDivisions");
					}
				},
				error: function(data, errorType, exception) {
					// TODO change to error message
					// alert(unexpectedError_msg + "\"" + errorType + "\"" +
					// unexpectedError_message);
					alert(i18n.exceptionFromService);
				},
				complete: function(jqXHR, textstatus){
					if(loadingUpdateFlag){
						$.unblockUI();
					}
				}
			});
			
			
			
		},
		/*
		 * JQuery Template doesn't work when the JSON object has any keys with name "$".
		 * This function replaces all "$" keys in the JSON object to "$$"
		 */
		escapeJSONforTemplate : function (jsonObject) {
			var dataString = JSON.stringify(jsonObject);
			data =  JSON.parse(dataString.replace(/\"\$\"/g,'"$$$$"'));
			var dataString = JSON.stringify(data);
			return JSON.parse(dataString.replace(/\"\@/g,'"$$'));
		},
		loadAvailableQueues : function (){
				$.blockUI({ 
			    	message: '',
			    	css: {position: ''}
			    });
				var indexSelected = document.getElementById("profileDivisions").selectedIndex;
				var selectedDivisionId=document.getElementById("profileDivisions");
				var divisionValue=selectedDivisionId.options[indexSelected].value;	
				var profileQueueList={"queuelist":[]};
				$("#availableQueues").empty();
				var queueList=[];
				$.ajax({
					type : 'GET',
					url : "ajax/profileQueueDetail?divisionID="+divisionValue,
					dataType : "json",
					success : function(data) {
						try{
							if(data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision instanceof Array){
							 queueList= data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision[0].ComplianceDivisionQueue;
							}else{
								queueList.push(data.ListComplianceDivisionQueueResponse.ListComplianceDivisionQueueResponseDetail.ComplianceDivision.ComplianceDivisionQueue);
							}
							if ( typeof queueList != 'undefined' ){					
								$.each(queueList, function(queueIndex, queueValue){
									if (checkJsonData(queueValue, "ComplianceQueueName") != "") {
										if(typeof queueValue.UserAccessLevel != 'undefined' ){							
											if ( queueValue.UserAccessLevel.toUpperCase() != "NO ACCESS" ){
												profileQueueList.queuelist.push({"name":alerts.getLanguageDescription(queueValue.ComplianceQueueName),"queueId":queueValue.ComplianceDivisionQueueID});
											}
										}
									}
								});
								
								
							}
							$("#profileQueueTemplate").tmpl(profileQueueList).appendTo("#availableQueues"); 
							
						}finally{					
							$.unblockUI();
						}
					},
					error: function(data, errorType, exception) {
						// TODO change to error message
						alert(i18n.unexpectedError_msg + "\"" + errorType + "\"" + i18n.unexpectedError_message);
					},
					complete: function(jqXHR, textstatus){
						$.unblockUI();
					}
				});		
				$('.available-queues-info,.add-email-address').show();		
		},
		screeningAlertPopUpChangeHandler : function(tabActiveParam, alertEntityId, eventId) {

			$("#addressData").empty();
			$("#aliasData").empty();
			$("#attributeData").empty();
			
			var screeningAlertDetails = data.GetComplianceAlertsResponse.GetComplianceAlertsResponseDetail.ComplianceAlert;

			var category = "";
			var subCategory = "";
			var eventText = "";
			
			if(screeningAlertDetails != null) {
				var SubjectAlertEventDetail = screeningAlertDetails.SubjectAlertEventDetail;
				for(var count=0; count<SubjectAlertEventDetail.length; count++) {
					var evntId = SubjectAlertEventDetail[count].EventID;
					if(evntId == eventId) {
						category = SubjectAlertEventDetail[count].EventTypeText;
						subCategory =  SubjectAlertEventDetail[count].EventSubTypeText;
						var eventTextNode = SubjectAlertEventDetail[count].EventText;
						for(var index=0; index<eventTextNode.length; index++) {
							eventText += eventTextNode[index] + ", ";
						}
						eventText = eventText.substring(0, eventText.length - 2);
						break;
					}
				}
			}
				
			var SubjectAlertDetail = alerts.alertEntityMap[alertEntityId];
			var alertTabActive = tabActiveParam;
			$("."+alertTabActive).siblings().removeClass('tab-active').addClass('tab-inactive');
			$("."+alertTabActive).addClass('tab-active');
			$("."+alertTabActive+'-content').siblings().hide();
			$("."+alertTabActive+'-content').show();
			
			if(SubjectAlertDetail != null) {
				
				$("#popupEntityName").empty();
				if(SubjectAlertDetail.Name != null) {			
					$("#popupEntityName").html(SubjectAlertDetail.Name.PrimaryName);
				}
				
				$("#InquiryNameAlertPopup").empty();
				$("#InquiryNameAlertPopup").html(SubjectAlertDetail.InquiryDetail.SubjectName.$$);
				
				$("#CategoryNameAlertPopup").empty();
				$("#CategoryNameAlertPopup").html(category);
				
				$("#SubCategoryNameAlertPopup").empty();
				$("#SubCategoryNameAlertPopup").html(subCategory);
				
				$("#DateAlertPopup").empty();
				$("#DateAlertPopup").html(formatDate((SubjectAlertDetail.AlertDate).substring(0,10),"YYYY-MM-DD"));
				
				$("#entityType").empty();
				$("#entityType").html(SubjectAlertDetail.EntityTypeText);
				
				$("#alertNote").empty();
				$("#alertNote").html(SubjectAlertDetail.AlertNoteText);
				
				$("#alertDescription").empty();
				$("#alertDescription").html(eventText);
			}
		 	
			
			$("#webURL").empty();
			if(SubjectAlertDetail.ReferenceDetail != null) {
				 var ReferenceDetail = SubjectAlertDetail.ReferenceDetail;
				 
				 if(ReferenceDetail.length != null) {
					 for(var count=0; count<ReferenceDetail.length; count++ ) {
						 var li = document.createElement('li');
						 li.className = "attribute-container";
						 
						 var attributeName = ReferenceDetail[count].SourceName;
						 var attributeValue = ReferenceDetail[count].WebPageURL;
						 
						 var attributeNameSpan = '<span class="attribute-label">' + attributeName + ':</span>';
						 var attributeValueSpan = '<a class="attribute-value activeurl" href='+ attributeValue + ' target="_new">'  + attributeValue + '</a>';
						 
						 $(attributeNameSpan).appendTo(li);
						 $(attributeValueSpan).appendTo(li);
						 
						 var tbodyTable = document.getElementById('webURL');
					      tbodyTable.appendChild(li);
						 
					 }
				 } 
			 } 
			
			 var li = document.createElement('li');
			 li.className = "attribute-container";
			 
			 var entityId = "";
			 if(SubjectAlertDetail.RenderingApplicationID != null && typeof(SubjectAlertDetail.RenderingApplicationID) != "undefined") {		 
				 entityId = SubjectAlertDetail.RenderingApplicationID;
			 }
			 var entityURLValue = alertEntityURL + entityId + alertEntityURLType;
			 
			 var attributeNameSpan = '<span class="attribute-label">' + i18n.entityURL + ':</span>';
			 var attributeValueSpan = '<a class="attribute-value activeurl" href='+ entityURLValue + ' target="_new">'  + entityURLValue + '</a>';
			 
			 $(attributeNameSpan).appendTo(li);
			 $(attributeValueSpan).appendTo(li);
			 
			 var tbodyTable = document.getElementById('webURL');
		     tbodyTable.appendChild(li);
		     
			
			 $("#attributeData").empty();
			 
			 
			 if(SubjectAlertDetail.NonspecificParameterDetail != null) {
				 var NonspecificParameterDetail = SubjectAlertDetail.NonspecificParameterDetail;
				 
				 if(NonspecificParameterDetail.length != null) {
					 for(var count=0; count<NonspecificParameterDetail.length; count++ ) {
						 var li = document.createElement('li');
						 li.className = "attribute-container";
						 
						 var attributeName = NonspecificParameterDetail[count].ParameterDescription;
						 var attributeValue = NonspecificParameterDetail[count].ParameterValue;
						 
						 var attributeNameSpan = '<span class="attribute-label">' + attributeName + ':</span>';
						 if(attributeName == "URL") {
							 var attributeValueSpan = '<span class="attribute-value activeurl">'  + attributeValue + '</span>';
						 } else {			 
							 var attributeValueSpan = '<span class="attribute-value">' + attributeValue + '</span>';
						 }
						 $(attributeNameSpan).appendTo(li);
						 $(attributeValueSpan).appendTo(li);
						 
						 var tbodyTable = document.getElementById('attributeData');
					      tbodyTable.appendChild(li);
						 
					 }
				 } 
			 } 
			 
			 if(SubjectAlertDetail.Name != null) {
				 
				 var Name  = SubjectAlertDetail.Name;
				 
				 if(Name.KnownByName != null ) {
					 var KnownByName = Name.KnownByName; 
					 
					 var liAliasType = document.createElement('li');
					 var liAliasName = document.createElement('li');
					 
					 liAliasType.className = "alias-container";
					 liAliasName.className = "alias-container";
					 
					 var aliasTypeSpan = '<span class="alias-label">'+i18n.aliasType+'</span>  <span class="alias-value"> '+i18n.knownByName+' </span>';
					 $(aliasTypeSpan).appendTo(liAliasType);
					 
					 var aliasName = "";			 
					 if (KnownByName.length != null) {				 
						 for (var index=0; index< KnownByName.length; index++) {
							 aliasName += KnownByName[index] + "<br>";
						 }
					 } 
					 
		             var aliasNameSpan = '<span class="alias-label">'+i18n.aliasNameLabel+'</span>  <span class="alias-value"> '+aliasName+' </span>';
		             $(aliasNameSpan).appendTo(liAliasName);
					 var aliasData = document.getElementById('aliasData');
					 aliasData.appendChild(liAliasType);
					 aliasData.appendChild(liAliasName);
				 }
				 
				 if(Name.FormerPrimaryName != null ) {
					 var FormerPrimaryName = Name.FormerPrimaryName; 
					 
					 var liAliasType = document.createElement('li');
					 var liAliasName = document.createElement('li');
					 
					 liAliasType.className = "alias-container";
					 liAliasName.className = "alias-container";
					 
					 var aliasTypeSpan = '<span class="alias-label">'+i18n.aliasType+'</span>  <span class="alias-value"> '+formerPrimaryName+' </span>';
					 var aliasName = "";
					 
					 if (FormerPrimaryName.length != null) {
						 for (var index=0; index< FormerPrimaryName.length; index++) {
							 aliasName += FormerPrimaryName[index] + "<br>";
						 }
					 } 
					 
					 $(aliasTypeSpan).appendTo(liAliasType);

					 var aliasNameSpan = '<span class="alias-label">'+i18n.aliasNameLabel+'</span>  <span class="alias-value"> '+aliasName+' </span>';
		             $(aliasNameSpan).appendTo(liAliasName);
		             
					 var aliasData = document.getElementById('aliasData');
					 aliasData.appendChild(liAliasType);
					 aliasData.appendChild(liAliasName);
				 }
				
				 if(Name.TradeStyleName != null ) {
					 var TradeStyleName = Name.TradeStyleName; 
					 
					 var liAliasType = document.createElement('li');
					 var liAliasName = document.createElement('li');

					 liAliasType.className = "alias-container";
					 liAliasName.className = "alias-container";
					 
					 var aliasTypeSpan = '<span class="alias-label">'+i18n.aliasType+'</span>  <span class="alias-value"> '+tradestyleName+' </span>';
					 var aliasName = "";
					 
					 if (TradeStyleName.length != null) {
						 
						 for (var index=0; index< TradeStyleName.length; index++) {
							 aliasName += TradeStyleName[index] + "<br>	";
						 }
					 } 
					 
					 $(aliasTypeSpan).appendTo(liAliasType);

					 var aliasNameSpan = '<span class="alias-label">'+i18n.aliasNameLabel+'</span>  <span class="alias-value"> '+aliasName+' </span>';
		             $(aliasNameSpan).appendTo(liAliasName);
					 
					 var aliasData = document.getElementById('aliasData');
					 aliasData.appendChild(liAliasType);
					 aliasData.appendChild(liAliasName);
				}
			 } 
		    
			 if(SubjectAlertDetail.Address != null) {
				 
				 var Address  = SubjectAlertDetail.Address;
				 
				 
				 if(Address.NonspecificAddress != null ) {
				 var NonspecificAddressNode = Address.NonspecificAddress; 
				 
				 if(NonspecificAddressNode.length != null) {
					 
					 for(var count=0; count<NonspecificAddressNode.length; count++) {
						 
						 NonspecificAddress = NonspecificAddressNode[count]; 
						 
						 var liAddressType = document.createElement('li');
						 var liCity = document.createElement('li');
						 var liProvince = document.createElement('li');
						 var liPostalCode = document.createElement('li');
						 var liCountry = document.createElement('li');
						 var liAddress = document.createElement('li');
						 
						 
						 liAddressType.className = "address-container";
						 liCity.className = "address-container";
						 liProvince.className = "address-container";
						 liPostalCode.className = "address-container";
						 liCountry.className = "address-container";
						 liAddress.className = "address-container";
						 
						 var addressTypeValue = "";
						 
						 if(NonspecificAddress.AddressTypeText != null) {					 
							 if(NonspecificAddress.AddressTypeText.toLowerCase() == "citizen") {
								 addressTypeValue = i18n.birth;
							 } else if (NonspecificAddress.AddressTypeText.toLowerCase() == "pep") {
								 addressTypeValue = i18n.primary;
							 } else {
								 addressTypeValue = i18n.notavailable_msg;
							 }
						 } else {
							 addressTypeValue = i18n.notavailable_msg;
						 }
						 
						 var primaryTownName = "";
						 var territoryName = "";
						 var postalCodeVal = "";
						 var countryName = "";
						 
						 if(NonspecificAddress.PrimaryTownName != null && typeof(NonspecificAddress.PrimaryTownName) != 'undefined') {
							 primaryTownName = NonspecificAddress.PrimaryTownName;
						 }
						 
						 if(NonspecificAddress.TerritoryName != null && typeof(NonspecificAddress.TerritoryName) != 'undefined') {
							 territoryName = NonspecificAddress.TerritoryName;
						 }
						 
						 if(NonspecificAddress.PostalCode != null && typeof(NonspecificAddress.PostalCode) != 'undefined') {
							 postalCodeVal = NonspecificAddress.PostalCode;
						 }
						 
						 if(NonspecificAddress.CountryName != null && typeof(NonspecificAddress.CountryName) != 'undefined') {
							 countryName = NonspecificAddress.CountryName;
						 }
						 
						 var addressTypeSpan = '<span class="address-label">'+i18n.addressType+'</span> <span class="address-value">'+ addressTypeValue +'</span>';
						 var citySpan = '<span class="address-label">'+ i18n.city +'</span> <span class="address-value"> '+ primaryTownName + '</span>';
						 var provinceSpan = '<span class="address-label">'+i18n.province+'</span> <span class="address-value">   '+ territoryName + '</span>';
						 var postalCodeSpan = '<span class="address-label">'+ i18n.postalCode +'</span> <span class="address-value">  '+ postalCodeVal +'</span>';
						 var countrySpan = '<span class="address-label">'+ i18n.country +'</span> <span class="address-value">   '+ countryName +'</span>';
						 var addressSpan;
						 
						 if (NonspecificAddress.StreetAddressLine != null) {
							 
							 StreetAddressLine = NonspecificAddress.StreetAddressLine;
							 var lineText = "";
							 if (StreetAddressLine.length != null) {
								 
								 for (var index=0; index< StreetAddressLine.length; index++) {
									 lineText += StreetAddressLine[index].LineText + ", ";
								 }
								 lineText = lineText.substring(0, lineText.length - 2);
							 } else {
								 lineText = StreetAddressLine.LineText;
							 }
							 
							 addressSpan = '<span class="address-label">'+ i18n.address +'</span> <span class="address-value"> '+lineText+'</span>';
							 
						 } else {
							 addressSpan = '<span class="address-label">'+ i18n.address +'</span>';
						 }
						 
						 $(addressTypeSpan).appendTo(liAddressType); $(addressSpan).appendTo(liAddress); $(citySpan).appendTo(liCity); $(provinceSpan).appendTo(liProvince);
						 $(postalCodeSpan).appendTo(liPostalCode); $(countrySpan).appendTo(liCountry); 
						 
						 var addressData = document.getElementById('addressData');
						 
						 addressData.appendChild(liAddressType); addressData.appendChild(liAddress); addressData.appendChild(liCity);
						 addressData.appendChild(liProvince); addressData.appendChild(liPostalCode); addressData.appendChild(liCountry);
					 }
				 }
			 }
		   } 
		},
		queueSort: function (prop, arr) {
      	    prop = prop.split('.');
      	    var len = prop.length;

      	    arr.sort(function (a, b) {
      	        var i = 0;
      	        while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
      	        if (a < b) {
      	            return -1;
      	        } else if (a > b) {
      	            return 1;
      	        } else {
      	            return 0;
      	        }
      	    });
      	    return arr;
      	},
      	populateExistingAlertProfiles : function(eventId, params){
      		$("#existingProfiles").empty();
      		$("#existingProfiles").html(alerts.loadingDiv);
      		var url = "ajax/viewAlertsProfile";
      		alerts.isCreateRequest=false;
      		ajaxCall(url, alerts.populateViewAlertsProfile, false, alerts.viewAlertsProfileCustomOptions);    			
    		
    	},    	
    	populateViewAlertsProfile : function(data) {
			$("#emailAddress").val("");
			$("#alertProfileName").val("");
			$("#alertProfileName").watermark(i18n.alertsNameText, {useNative: false});
			$("#emailAddress").watermark(i18n.addEmailMessage, {useNative: false});			
			$(".new-profile-title").html(i18n.alerts_CreateNewProfile_Message);
			$(".create-profile-index h4").show();			
			var inputData=alerts.escapeJSONforTemplate(data);				
			var actionNames=new Array();			
			var existingprofilesList=new Array();
			var profileNameList=[];
			if (data.error != "" && data.error != null && data.error != 'undefined') {
	    		var norecord= '<div class="no-record"></div>';
	    		$(".no-record").remove();    		
				$(".profile-data-block").append(norecord);
				$(".no-record").html(i18n.noRecord_error_message_alerts);
				$(".profile-data-block").children().hide();
				$(".no-record").show();
				return;	
			} else {
				$(".no-record").hide();
			}
			if(alerts.checkJsonData(data, "ListAlertProfileResponse.ListAlertProfileResponseDetail.ListAlertProfileCandidate")!=""){
		    profileNameList=inputData.ListAlertProfileResponse.ListAlertProfileResponseDetail.ListAlertProfileCandidate;
			$.each(profileNameList, function(index, value){
				var profileDivisionId=value.ComplianceDivisionID;
				var alertProfileId=value.AlertProfileID;
				var existingprofile={"alertProfileId":alertProfileId, "division":value.AlertProfileName.$$,"divisionId":profileDivisionId,"queueTypes":'', "alertType":[],"queueactions":[], "emaillist":[] };
				
				var queueActionFlag=value.QueueActionAlertProfileDetail.QueueActionAlertsRequiredIndicator;
				var queueTypes="";
				if(typeof queueActionFlag != 'undefined'){
					if(queueActionFlag){
						existingprofile.alertType.push({"type":i18n.queueActionMessage});
						queueTypes="Queue Action";
					}
				}
				if(value.ScreeningResultAlertProfileDetail){
				var screenResultActionFlag=value.ScreeningResultAlertProfileDetail.ScreeningAlertsRequiredIndicator;
				if(typeof screenResultActionFlag != 'undefined'){
					if(screenResultActionFlag){
						existingprofile.alertType.push({"type":i18n.screeningResultMessage});
						if(queueActionFlag){
							queueTypes=queueTypes+","+"Screening Result";
						}else{
							queueTypes="Screening Result";
						}
					}
				}
				}
				existingprofile.queueTypes=queueTypes;
				var queueList=value.QueueActionAlertProfileDetail.ComplianceDivisionQueue;
				if ( typeof queueList != 'undefined' ){					
					$.each(queueList, function(queueIndex, queueValue){						
						if(queueValue.ComplianceQueueEventDetail){
						var actionList=queueValue.ComplianceQueueEventDetail.ComplianceQueueEventID;
						var actionTitle="";
						var actionToolTipTitle="";
						if ( typeof actionList != 'undefined' ){
							$.each(actionList, function(actionIndex, actionValue){
								actionTitle=actionTitle+actionValue+",";
								actionToolTipTitle=actionToolTipTitle+alerts.formatForToolTip(actionValue)+",";
								actionNames.push(actionValue);						
							});								
						}
						if(queueValue.ComplianceQueueName != null && typeof(queueValue.ComplianceQueueName) != 'undefined'){
							existingprofile.queueactions.push({"name":queueValue.ComplianceQueueName.$$,"toolTip":actionTitle, "langToolTip":actionToolTipTitle, "queueId":queueValue.ComplianceQueueID});
						}
						}
					});	
					if(existingprofile.queueactions.length>0){
						existingprofile.queueactions=alerts.queueSort("queueId",existingprofile.queueactions);
					}
				}
				if(value.NotificationDetail){
				var mailList=value.NotificationDetail.EmailAddress;				
				if ( typeof mailList != 'undefined' ){
					var emailTitle="";
					$.each(mailList, function(emailIndex, emailValue){	
						emailTitle=emailTitle+emailValue.TelecommunicationAddress+",";
						// existingprofile.emaillist.push({"email":emailValue.TelecommunicationAddress});
					});	
					var emailProfile={"emailCount":mailList.length,"toolTip":emailTitle};
					existingprofile.emaillist.push(emailProfile);
				}
				}
				existingprofilesList.push(existingprofile);
			});	
		}
			
			/*
			 * $("#availableQueues").empty();
			 * $("#profileQueueTemplate").tmpl(data).appendTo("#availableQueues");
			 */
			$("#emailList ul").empty();
			// $("#screeningEmailTemplate").tmpl(data.emaillist).appendTo("#emailList
			// ul");			
			if(alerts.isCreateRequest){				
				$("#existingProfileTemplate").tmpl(existingprofilesList).prependTo("#existingProfiles");
			}else{
				existingprofilesList.sort(function(a, b){
	        		 var profileId1=new Date(a.alertProfileId), profileId2=new Date(b.alertProfileId);
	        		 return profileId2-profileId1; //sort by date descending
	        	});
				$("#existingProfiles").empty();
				$("#existingProfileTemplate").tmpl(existingprofilesList).appendTo("#existingProfiles");
			}
			
			alerts.createQTip('.profileEmailNames');	
			alerts.createQTip('.profileQueueNames');

		},
		viewAlertsProfileCustomOptions: {
			errorHandlers: {
				"FATAL": function(error){ 				
					$("#existingProfiles").empty();				
					errors.push(error);			
				},
				"INFO": function(error){ 
					$("#existingProfiles").empty();
					var norecord= '<div class="no-record"></div>';
					$(".no-record").remove();			
					$("#existingProfiles").append(norecord);
					$(".no-record").html(i18n.noRecord_error_message_reports);
					$(".no-record").show();	
				}
			}
		},
		savedAlertProfile : function(data) {			
			$('.alerts-main-page-container').hide();
			$('.profile-main-page-container').show();
			$('.create-profile-index').show();	
			$('.create-profile-index').children().show();
			$('.create-profile-detail,.available-queues-info,.add-email-address').hide();
			$('.alerts-main-page-container').removeClass('border-notopleft-radius').addClass('border-full-radius');
			$(".no-record").hide();	
			 if (checkJsonData(data, "newProfileResponse.ListAlertProfileResponse.ListAlertProfileResponseDetail") != "") {
				 alerts.isCreateRequest=true;
                 var newProfileDetails = data.newProfileResponse;
                 alerts.populateViewAlertsProfile(newProfileDetails);                            
             }
			 $('#profileDivisions').empty();
			//alerts.populateExistingAlertProfiles("viewAlertsProfile","",alerts.customOptions);
		},
		saveProfileCustomOptions: {
			errorHandlers: {
				"FATAL": function(error){ 					
					errors.push(error);			
				},
				"INFO": function(error){ 
					errors.push(error);			
				}
			}
		}
		
});
