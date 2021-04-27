
var treatmentPlanId = -1,
    _CansTreatmentPlanObjctiveID = -1,
    generalInformationID = -1,
    canVersioningID=-1,
    _CansTreatmentPlanItemID = -1;

$(document).ready(function () {
    if (!authenticateUser()) return;
    $(".select2").select2();
    reportedBy = 452;
    InitalizeDateControls();
    treatmentPlanId = GetParameterValues('TreatmentPlanId');
    generalInformationID = GetParameterValues('GeneralInformationID');
    canVersioningID = GetParameterValues('CansVersioningID');

    ShowTreatmentPlansDetails();
   
});
function ShowTreatmentPlansDetails() {
    if (treatmentPlanId < 1) return;

    
    $.ajax({
        type: "POST",
        data: { TabName: "TreatmentPlanDetails", TreatmentPlanId: treatmentPlanId, ReportedBy: reportedBy },
        url: GetAPIEndPoints("GETTREATMENTPLANDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {
            if (response.Success == true) {

                GetTreatmentPlanDetaillResponse(response.CommonCANSRsponse[0].CansTreatmentPlan);
            }
            else {
                showErrorMessage(response.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function GetTreatmentPlanDetaillResponse(data){
    var templateName = 'cans-treatmentplan-template';
    var treatementTemplateTable = $('#' + templateName).tmpl(JSON.parse(data));
    $('#TDClientAddictionTreatmentPlanTemplate').html(treatementTemplateTable);
    var inputs = $("div[data-name='TreatmentPlanGoal']");
    inputs.each(function () {
        var radioItem = $(this).find(".RadioGoalStatus"),
            elem = $(this);
        radioItem.each(function () {
            if ($(this).attr("data-item") == "Checked") {
                if ($(this).val() == "Completed") {
                    $(elem).find(".show-completed-date").removeClass("hidden");
                }
                else {
                    $(elem).find(".show-completed-date").addClass("hidden");
                }
                $(this).prop("checked", true);
               
            }
        })
    });
  

    InitalizeDateControls();
    SortableClientFields();
}
function SortableClientFields() {
    $('.sortable').sortable({
        helper: fixWidthHelper,
        axis: "y",
        revert: true,
        scroll: false,
        update: function (event, ui) {
            var rootName = ui.item.data("name");
            xmlObject = new String("<MainDataSet xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">");
            xmlObject += '<' + rootName + 's>';
            var $link = '';
            ui.item.parent().children().each(function (index) {
                xmlObject += '<' + rootName + '>';
                xmlObject += '<Id>' + $(this).data("id") + '</Id>';
                xmlObject += '<Position>' + (index + 1) + '</Position>';
                xmlObject += '</' + rootName + '>';
            });
            xmlObject += '</' + rootName + 's>';
            xmlObject += "</MainDataSet>";
            var data = {
                TabName: "ChangeTreatmentPlanPosition", Json: xmlObject, ReportedBy: reportedBy, TableName: rootName
            };

            $.ajax({
                type: "POST",
                data: data,
                url: GetAPIEndPoints("GETTREATMENTPLANDETAILS"),
                headers: {
                    'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                },
                success: function (response) {
                    if (response.Success == true) {

                        ChangePositionResponse(response.CommonCANSRsponse[0].JSONData);
                    }
                    else {
                        showErrorMessage(response.Message);
                    }
                },
                error: function (xhr) { HandleAPIError(xhr) }
            });
        }
    });
}
function ChangePositionResponse(result) {
    result = JSON.parse(result);
    if (typeof result == "object" && Object.keys(result).length > 0) {
        if (result.Success == "True") {
            showRecordSaved(result.Message);
        }
        else {
            showErrorMessage(result.Message);
        }
    }
}
function OpenModal(parentId, childId, modalName, element) {
    var modaldata = $(element).text();
    switch (modalName) {
        case 'TreatmentPlanObjective':
            _CansTreatmentPlanGoalID = parentId;
            _CansTreatmentPlanObjctiveID = childId;
            if (childId > 0) {
                commonUpdate("btnAddTreatmentPlanObjective", "btnDeleteTreatmentPlanObjective", "TextBoxCansTreatmentPlanObjctive", modaldata = typeof modaldata !== 'undefined' ? modaldata : "", "TreatmentPlanObjective");
            }
            else {
                commonAdd("btnAddTreatmentPlanObjective", "btnDeleteTreatmentPlanObjective", "TextBoxCansTreatmentPlanObjctive", "TreatmentPlanObjective");
            }
            $('#ModalTreatmentPlanObjective').modal('show');
            setTimeout(function () { $('#TextBoxCansTreatmentPlanObjctive').focus() }, 1000);
            break;
        case 'TreatmentPlanGoal':
            _CansTreatmentPlanItemID = parentId;
            _CansTreatmentPlanGoalID = childId;
            if (childId > 0) {
                commonUpdate("btnAddTreatmentPlanGoal", "btnDeleteTreatmentPlanGoal", "TextBoxClientGoal", modaldata = typeof modaldata !== 'undefined' ? modaldata : "", "TreatmentPlanGoal");
            }
            else {
                commonAdd("btnAddTreatmentPlanGoal", "btnDeleteTreatmentPlanGoal", "TextBoxClientGoal", "TreatmentPlanGoal");
            }
            $('#ModalTreatmentPlanGoal').modal('show');
            setTimeout(function () { $('#TextBoxClientGoal').focus() }, 1000);
            break;
        case 'TreatmentPlanItem':
            _CansTreatmentPlanId = parentId;
            _CansTreatmentPlanItemID = childId;
            if (childId > 0) {
                commonUpdate("btnAddTreatmentPlanItem", "btnDeleteTreatmentPlanItem", "TextBoxCANSItem", modaldata = typeof modaldata !== 'undefined' ? modaldata : "", "TreatmentPlanItem");
            }
            else {
                commonAdd("btnAddTreatmentPlanItem", "btnDeleteTreatmentPlanItem", "TextBoxCANSItem", "TreatmentPlanItem");
            }
            $('#ModalTreatmentPlanItem').modal('show');
            setTimeout(function () { $('#TextBoxCANSItem').focus() }, 1000);
            break;

    }
}
function commonAdd(savebuttonid, deletebuttonid, textboxid, modalname, dropdownid) {
    dropdownid = typeof dropdownid !== 'undefined' ? dropdownid : null;

    $('#' + deletebuttonid + '').addClass("hidden");
    $(".spanActionText").html("Add");
    if (dropdownid != null) {
        $('#' + dropdownid + '').val("-1");
    } else {
        $('#' + textboxid + '').val("");
    }
    $('#' + savebuttonid + '').attr("onclick", "CommonInsertModifyTreatmentPlanTemplateDetail('Insert" + modalname + "')");
}
function commonUpdate(savebuttonid, deletebuttonid, textboxid, textboxvalue, modalname) {
    $('#' + deletebuttonid + '').removeClass("hidden");
    $(".spanActionText").html("Update");
    $('#' + textboxid + '').val('' + textboxvalue + '');
    $('#' + savebuttonid + '').attr("onclick", "CommonInsertModifyTreatmentPlanTemplateDetail('Modify" + modalname + "')");
    $('#' + deletebuttonid + '').attr("onclick", "CommonInsertModifyTreatmentPlanTemplateDetail('Delete" + modalname + "')");
}
function CommonInsertModifyTreatmentPlanTemplateDetail(Action) {
    if (!ValidateModalInput(Action)) return;

    switch (Action) {
        case 'InsertTreatmentPlanObjective':
        case 'ModifyTreatmentPlanObjective':
            ObjectiveUrl(Action);
            break;
        case 'DeleteTreatmentPlanObjective':
            if (confirm("Are you sure you want to remove this item?")) {
                ObjectiveUrl(Action);
            }
            break;
        case 'InsertTreatmentPlanGoal':
        case 'ModifyTreatmentPlanGoal':
            GoalUrl(Action);
            break;
        case 'DeleteTreatmentPlanGoal':
            if (confirm("Are you sure you want to remove this item?")) {
                GoalUrl(Action);
            }
            break;
        case 'InsertTreatmentPlanItem':
        case 'ModifyTreatmentPlanItem':
            ItemUrl(Action);
            break;
        case 'DeleteTreatmentPlanItem':
            if (confirm("Are you sure you want to remove this item?")) {
                ItemUrl(Action);
            }
            break;
    }
    $.ajax({
        type: "POST",
        data: { Action: TabName, Json: JSON.stringify(formdata), ReportedBy: reportedBy },
        url: GetAPIEndPoints("ADDTREATMENTPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {
            if (response.Success == true) {

                CommonInsertModifyTreatmentPlanTemplateDetailResponse(response.CommonCANSRsponse[0].JSONData);
            }
            else {
                showErrorMessage(response.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function CommonInsertModifyTreatmentPlanTemplateDetailResponse(response) {
    response = JSON.parse(response);
    if (typeof response == "object" && Object.keys(response).length > 0) {
        if (response.Success == "True") {
            
            showRecordSaved(response.Message);

            var $element = $('.panel[data-name="' + response.Module + '"][data-id="' + response.Id + '"]');
            if (response.Module == "Objective" && $element.find('.panel-heading span').hasClass('')) {
                $element.find('.panel-heading span').addClass('text');
            }
            if ($element.length == 1 && response.Action != "Delete") {
                //Modify 
                $element.find('.panel-heading .text a').eq(0).text(response.Description);
            } else {
                if (response.Action != "Delete") {
                    var moduleInLowerCase = response.Module.toLowerCase();

                    //Insert
                    var templateName = 'cans-' + moduleInLowerCase + '-template';
                    var treatementTemplateTable = $('#' + templateName).tmpl(response);

                    var parentId = response.ParentId;
                    var $parentElement = $('.panel[data-name="' + response.ParentModule + '"][data-id="' + parentId + '"]').find('.panel-body>.sortable').eq(0);

                    if (response.Module == "TreatmentPlanItem") {
                        $('.treatmentPlanItems').append(treatementTemplateTable);
                        InitalizeDateControls();
                    } else if ($parentElement.length > 0) {
                        $parentElement.append(treatementTemplateTable)
                    }

                    SortableClientFields();
                }

                if (response.Module == "TreatmentPlanObjective") {
                    $element = $('.panel[data-name="' + response.Module + '"][data-id="' + response.Id + '"]');

                    updateObjectiveInfoTextinHeadings($element, response.goal_text, response.item_text);

                }

                if (response.Action == "Delete") {
                    //Delete
                    $element.remove();
                }
            }


            restValue();
            $('#ModalTreatmentPlanGoal').modal('hide');
            $('#ModalTreatmentPlanObjective').modal('hide');
            $('#ModalTreatmentPlanItem').modal('hide');
        }
        else {
            showErrorMessage(response.Message);
        }
    }
}

function ObjectiveUrl(Action) {
    TabName=  Action;
    
    formdata = {
        GoalId: _CansTreatmentPlanGoalID,
        ObjectiveId: _CansTreatmentPlanObjctiveID,
        Objective: $("#TextBoxCansTreatmentPlanObjctive").val()
    };
}
function GoalUrl(Action) {
    TabName =Action;
   

    formdata = {
        GoalId: _CansTreatmentPlanGoalID,
        ItemId: _CansTreatmentPlanItemID,
        Goal: $("#TextBoxClientGoal").val()
    };

}
function ItemUrl(Action) {
    TabName = Action;

    formdata = {
        ItemId: _CansTreatmentPlanItemID,
        TreatmentPlanId: _CansTreatmentPlanId,
        Item: $("#TextBoxCANSItem").val()
    };
}
function restValue() {
    _CansTreatmentPlanId = -1;
    _CansTreatmentPlanGoalID = -1;
    _CansTreatmentPlanObjctiveID = -1;
    _CansTreatmentPlanItemID = -1;
}
function updateObjectiveInfoTextinHeadings($element, goalText,itemText) {
    var $itemElement = $element.parents('[data-name="TreatmentPlanItem"]');
    var $goalElement = $element.parents('[data-name="TreatmentPlanGoal"]');
    var goalTextObejective = goalText == "" ? "" : goalText + " objectives";
    var itemTextObjective = itemText == isEmpty(itemText) ? "" : itemText + " objectives";
    $goalElement.eq(0).find('.panel-heading>').eq(0).find(".summery-text").text('(' + goalTextObejective + ')');
    $itemElement.eq(0).find('.panel-heading>').eq(0).find(".summery-text").text('(' + itemTextObjective + ')');
}
function fixWidthHelper(e, ui) {
    ui.children().each(function () {    
        $(this).width($(this).width());
    });
    return ui;
}
function ValidateModalInput(Action) {
    switch (Action) {
  
        case 'InsertTreatmentPlanObjective':
        case 'ModifyTreatmentPlanObjective':
            if ($('#TextBoxTreatmentPlanObjective').val() == '') {
                showErrorMessage("Please enter a objective.");
                $('#TextBoxTreatmentPlanObjective').focus();
                return false;
            }

            break;
        case 'InsertTreatmentPlanGoal':
        case 'ModifyTreatmentPlanGoal':
            if ($('#TextBoxClientGoal').val() == '') {
                showErrorMessage("Please enter goal.")
                $('#TextBoxClientGoal').focus();
                return false;
            }
            break;
        case 'InsertTreatmentPlanItem':
        case 'ModifyTreatmentPlanItem':
            if ($('#TextBoxCANSItem').val() == '') {
                showErrorMessage("Please enter CANS Item.")
                $('#TextBoxCANSItem').focus();
                return false;
            }
            break;
    }
    return true;
}
function ShowHide(elem) {
    var container = $(elem).parent().siblings('.panel-body');
    var sortableContainer = $(elem).parents('.sortable').eq(0);
    if ($(container).css('display') == 'none') {
        $(container).show('fast');

        $(elem).text('Hide');

        sortableContainer.sortable("disable");
    } else {
        $(container).hide('fast');
        $(elem).text('Show');

        sortableContainer.sortable("enable");
    }

    return false;
}
function EditGoal(GoalID, elem) {
    var $formElement = $(elem).parent().closest(".showHideDimension"),
        goalID = GoalID,
        goalStatus = $formElement.find("input:radio.RadioGoalStatus:checked").val(),
        completedDate = goalStatus == "Completed" ? $formElement.find(".TextBoxCompletedDate").val() : "";

    $.ajax({
        type: "POST",
        data: { TabName: "UpdateGoalItems", GoalID: goalID,  GoalStatus: goalStatus, CompletedDate: completedDate, ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLCANSDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {
            if (response.Success == true) {

                EditGoalResponse(response.CommonCANSRsponse[0].JSONData);
            }
            else {
                showErrorMessage(response.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    }); 
    
}
function EditGoalResponse(response) {
    response = JSON.parse(response);
    if (typeof response == "object" && Object.keys(response).length > 0) {
        if (response.Success == "True") {
            var $element = $('.panel[data-name="' + response.Module + '"][data-id="' + response.CansTreatmentPlanGoalID + '"]');

            showRecordSaved(response.Message);
        }
        else {
            showErrorMessage(response.Message);
        }
    }
}
function ShowHideCompleteDate(elem) {
    var $formElement = $(elem).parent().closest(".showHideDimension")
        value = $(elem).val();
    if (value == "Completed") {
        $formElement.find(".show-completed-date").removeClass("hidden");
    }
    else {
        $formElement.find(".show-completed-date").addClass("hidden");
        $formElement.find(".TextBoxCompletedDate").val("");
    }
}
function EnableDatePicker(elem) {
    $(elem).datepicker('show');
}
function CheckUnchekRadio(radioValue, parentId) {
    var $element = $('.panel[data-name="TreatmentPlanGoal"][data-id="6"]');
    $("input[name='RadioGoalStatus6'][value='Completed'").attr("checked", "checked");
}

function RedirectCansPage() {
    location.href = "CANS.html?GeneralInformationID=" + generalInformationID + "&CansVersioningID=" + canVersioningID;
}