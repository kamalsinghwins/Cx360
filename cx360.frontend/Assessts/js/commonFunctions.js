var _FullDateFormat = "N",
     API_URL = "http://localhost:52416",
    //API_URL = "https://api-lifeplan72qa.cx360.net";
Cx360URL = "https://staging-api72qa.cx360.net";
var resctrictMaxchars = 8000,
    restrictChars100 = 100,
    restrictChars250 = 250,
    restrictChar50 = 50;
restrcitChar2000 = 2000;
var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
function LZ(x) { return (x < 0 || x > 9 ? "" : "0") + x }
var DateFormat = 'MM/d/y';
$(document).ready(function () {

    $("select.apply-select2").select2({ width: "100%" });
    $('.dateIcon').click(function () {

        $(this).datepicker("show");
    });
    $('.clockIcon').click(function () {
        $(this).siblings(".time").timepicker("show")
    });
});
$(document).on("keypress", ".decimalOnly", function (evt) {
    return isNumber(evt, this);
});

$(document).on('keyup', ".IntegerOnly", function (e) {
    var $self = $(this),
        v = $self.val(),
        max = 2147483647;

    //blank any input that isint a number
    if (!/^\d*$/.test(v)) {
        $self.val('');
        return;
    }

    //trim the value until it meets the condition
    if (v >= max) {
        while (v >= max) {
            v = v.substring(0, v.length - 1);
        }

        $self.val(v);
    }
});
$(document).on("keypress", ".preventSpecialChar", function (evt) {
    var character = String.fromCharCode(event.keyCode);
    return isValid(character);
});
function isNumber(evt, element) {

    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // Check minus and only once.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // Check for dots and only once.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}
function isValid(str) {
    return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

function InitCalendar(Elem, Title, YearRange, onClose) {
    $(Elem).datepicker({
        showOn: "focus",
        buttonImage: "",
        buttonImageOnly: true,
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>',
        changeMonth: true,
        changeYear: true,
        buttonText: Title,
        showWeek: true,
        yearRange: ((typeof YearRange === undefined) ? "-10:+10" : YearRange),
        showButtonPanel: true,
        onSelect: function (dateText, inst) {
            $(this).change();
            setTimeout("$(':input:eq(' + (" + $(':input').index(this) + " + 1) + ')').focus().select()", 20);
        },
        onClose: ((typeof onClose === undefined) ? function (dateText, inst) { } : onClose)
    });
}
function getTimepickerOptions() {
    var opt;
    if (_FullDateFormat == "Y") {
        opt = { 'timeFormat': 'H:i' };
    } else {
        opt = { 'timeFormat': 'h:i A' };
    }
    return opt;
}
function timepickerFormatError(ctl) {
    showErrorMessage("Please enter a valid time value.");
    setTimeout(function () { $('#' + ctl).focus().val(''); }, 10);
}
function showErrorMessage(msg) {
    var tm = localStorage.getItem("messageTimeout") || 3000;
    localStorage.removeItem("messageTimeout");
    $.bigBox({
        title: "Error!",
        content: msg,
        color: "#C46A69",
        icon: "fa fa-warning shake animated",
        sound: false,
        timeout: tm
    });
}
function generateDecryptURL(menuUrl) {
    try {

        var returnURL = 'A';

        $.ajax({
            url: '../AjaxRequest.aspx?FunctionName=IncidentManagementId&MenuUrl=' + menuUrl,
            type: 'GET',
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                if (result != null) {
                    returnURL = result;
                }
            },
            error: function (x, y, z) {

            }
        }).always(function () {
            // hideLoader();
        });
        return returnURL;
    } catch (e) {
        logError(e, arguments.callee.trace());
    }
}

function GetParameterValues(param) {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
        var urlparam = url[i].split('=');
        if (urlparam[0] == param) {
            return urlparam[1];
        }
    }
}
function showRecordSaved(msg, isFieldChanged) {

    var tm = localStorage.getItem("messageTimeout") || 3000;
    localStorage.removeItem("messageTimeout");

    if (typeof msg == "undefined") {
        msg = (localStorage.getItem("savedMessage") == "") ? "Your changes have been saved." : localStorage.getItem("savedMessage");
        localStorage.removeItem("savedMessage");
    }

    if (typeof isFieldChanged !== "undefined" && isFieldChanged == true) {
        _IsFieldChanged = false;
    }

    $.bigBox({
        title: "Success",
        content: msg,
        color: "#296191",
        icon: "fa fa-thumbs-up bounce animated",
        sound: false,
        timeout: tm
    });
}
function GetAPIEndPoints(key) {
    var API_ENDPONTS = {
        GETINCIDENTMANAGEMENT: "/IncidentManagementAPI/GetIncidentManagement",
        INSERTMODIFYTABDETAILS: "/IncidentManagementAPI/InsertModifyTabDetails",
        FILLSTATEFORMSPDF: "/IncidentManagementAPI/FillableStateFormPDF",
        EDITALLRECORD: "/IncidentManagementAPI/EditAllRecord",
        DELETEMASTERRECORD: "/IncidentManagementAPI/DeleteMasterRecord",
        UPLOADPDF: "/IncidentManagementAPI/UploadPDFFiles",
        //LifePlanApi
        INSERTMODIFYLIFEPLANDETAIL: "/LifePlanAPI/InsertModifyLifePlanDetail",
        HANDLELIFEPLANDETAIL: "/LifePlanAPI/HandleLifePlanDetail",
        HANDLEMEETINGTAIL: "/LifePlanAPI/HandleMeetingDetail",
        HANDLEINDIVIDUALSAFERECORDS: "/LifePlanAPI/HandleIndividualSafeRecords",
        HANDLEASSESSMENTNARRATIVESUMMARY: "/LifePlanAPI/HandleAssessmentNarrativeSummary",
        HANDLEOUTCOMESSTRATEGIES: "/LifePlanAPI/HandleOutcomesStrategies",
        HANDLEHCBSWaiver: "/LifePlanAPI/HandleHCBSWaiver",
        HANDLEFUNDALNATURALCOMMUNITYRESOURCES: "/LifePlanAPI/HandleFundalNaturalCommunityResources",
        HANDLELIFEPLANVERSIONING: "/LifePlanAPI/HandleLifePlanVersioning",
        FILLABLELIFEPLANPDF: "/LifePlanAPI/FillableLifePlanPDF",
        GETMASTERAUDITRECORD: "/LifePlanAPI/GetMasterAuditRecords",
        GETAUDITCHILDRECORD: "/LifePlanAPI/GetChildAuditRecords",
        INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL: "/ComprehensiveAssessmentAPI/InsertModifyComprehensiveAssessmentDetail",
        HANDLEASSESSMNETVERSIONING: "/ComprehensiveAssessmentAPI/HandleAssessmentVersioning",
        GETCOMPREHENIVEASSESSMENTDETAIL: "/ComprehensiveAssessmentAPI/GetComprehensiveAssessmentDetail",
        GETASSESSMENTPDFTEMPLATE: "/ComprehensiveAssessmentAPI/PrintAssessmentPDF",
        SUGGESTEDOUTCOMESSTRATEGIES: "/LifePlanAPI/LifePlanEXportedRecords",
        DOWNLOADPDFFILE: "/IncidentManagementAPI/DownloadUPloadedFile",
        INSERTMODIFYLCANSDETAIL: "/CANSAPI/InsertModifyCANSTabs",
        GETTREATMENTPLANDETAILS: "/CANSAPI/GetTreatmentPlanDetails",
        ADDTREATMENTPLANDETAIL: "/CANSAPI/AddCansTreatmentPlanFields",
        HANDLELIFEPLANNOTIFICATIONS: "/LifePlanAPI/HandleLifeNotifications",
        INERTMODIFYSUBMISSIONFORM: "/LifePlanAPI/InsertModifysubmissionForm",
        MANAGESERVICEINTERVENTIONS: "/CANSAPI/ManageServiceInterventionActions",
        HANDLECANSVERSIONING: "/CANSAPI/HandleCansVersioning",
        GETCANSASSESSMENTDETAIL: "/CANSAPI/GetCANSAssessmentDetails",
        GENERATEANDIMPORTXML: "/CANSAPI/GenerateAndImportXML",
        GETCANSASSESSMENTPDFTEMPLATE: "/CANSAPI/PrintAssessmentPDF",
        HANDLEMemberRepresentative: "/LifePlanAPI/HandleMemberRepresentative",
        HANDLEMEMBERRIGHT: "/LifePlanAPI/HandleMemberRight",
        UPLOADOFFLINEPDF: "/ComprehensiveAssessmentAPI/UploadOfflinePDF",
        GETCCOCOMPREHENIVEASSESSMENTDETAIL: "/ComprehensiveAssessmentAPI/GetCCOComprehensiveAssessmentDetail",
        HandleCCOComprehensiveAssessmentVersioning: "/ComprehensiveAssessmentAPI/HandleCCOComprehensiveAssessmentVersioning",
        GETCCOCOMPREHENIVEASSESSMENTDETAIL: "/ComprehensiveAssessmentAPI/GetCCOComprehensiveAssessmentDetail",
        FillCCOComprehensiveAssessmentPDF: "/ComprehensiveAssessmentAPI/FillableCCOComprehensiveAssessment"

    };
    return API_URL + API_ENDPONTS[key];
}

function HandleAPIError(jqXHR, exception) {
    if (jqXHR.status === 0) {
        showErrorMessage('Not connect.\n Verify Network.');
    } else if (jqXHR.status == 404) {
        showErrorMessage('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        showErrorMessage('Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        showErrorMessage('Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        showErrorMessage('Time out error.');
    } else if (exception === 'abort') {
        showErrorMessage('Ajax request aborted.');
    } else {
        showErrorMessage('Uncaught Error.\n' + jqXHR.responseText);
    }
}
function jsonWrapperWithTimePicker(tag, elem) {
    if ($(elem).hasClass('date') && $(elem).val() != '' && $(elem).val() != null) {
        return $(elem).is(":visible") == true ? $(elem).val() + (($('#TextBox' + tag + 'Time').length != 0) ? ' ' + $('#TextBox' + tag + 'Time').val() : '') : '';
    }
    else if (($(elem).hasClass('time') && !$(elem).hasClass('onlyTime')) && $(elem).val() != '' && $(elem).val() != null) {
        return $(elem).is(":visible") == true ? + ($("#" + $(elem).attr("date-id")).val()) + $(elem).val() : '';
    }
    else if ($(elem).attr('type') == 'checkbox') {
        return ($(elem).prop('checked') == true) ? 'Y' : 'N';
    }
    else if ($(elem).attr('id').indexOf("TextBox") > -1) {
        return ($(elem).val());
    }
    else {
        if ($(elem).prop('tagName') == 'SELECT') {
            return (($(elem).val() == null || $(elem).val() == '-1') ? '' : $(elem).val());
        } else {
            return (($(elem).val() == null) ? '' : $(elem).val());
        }
    }

}
function jsonWrapperWithDateTimePicker(tag, elem) {
    if ($(elem).hasClass('date') && $(elem).val() != '' && $(elem).val() != null) {
        return $(elem).is(":visible") == true ? $(elem).val() : '';
    }
    else if ($(elem).hasClass('time')) {
        return $(elem).is(":visible") == true ? ($(elem).val() == "" ? "1900-06-04" : "1900-01-01 " + $(elem).val()) : '1900-06-04';
    }
    else if ($(elem).attr('type') == 'checkbox') {
        return ($(elem).prop('checked') == true) ? 'Y' : 'N';
    }
    else if ($(elem).attr('id').indexOf("TextBox") > -1) {
        return ($(elem).val());
    }
    else {
        if ($(elem).prop('tagName') == 'SELECT') {
            return (($(elem).val() == null || $(elem).val() == '-1') ? '' : $(elem).val());
        } else {
            return (($(elem).val() == null) ? '' : $(elem).val());
        }
    }

}
function BindDropDownOptions(json, id, val, options) {

    $.each(json, function (data, value) {
        $(id).append($("<option></option>").val(value[val]).html(value[options]));
    });
}
function authenticateUser() {
    var isAuthenticated = true;
    if (isAuthenticated) {
        return true;
    }
    else {
        window.location.href = 'PermissionDenied.html';
    }
}

function BindUserDefinedCodes(DropDown, Category) {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetUserDefinedOptionByCategory',
        data: { 'CateegoryName': Category, },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownOptions(result, DropDown, "UDID", "UDDescription");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindGetList(DropDown, Category, ClientId) {

    if (Category == 'Network Provider List') {
        data = { 'FormName': Category, 'Criteria': 'ClientID=' + ClientId + '' };
    }
    else {
        data = { 'FormName': Category, 'Criteria': '1=1' };
    }
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Common/GetList',
        data: data,
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            if (Category == 'Network Provider List') {
                BindDropDownOptions(result, DropDown, "UD_ExternalStaffAssignmentID", "PracticeFacilityname");
                $("#DropDownFacilityName").attr("josn", JSON.stringify(result));
            }
            else if (Category == 'Services') {
                BindDropDownOptions(result, DropDown, "ServiceID", "ServiceName");
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindAllStaff(id) {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetAllStaff',
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            BindDropDownOptions(result, id, "StaffID", "StaffName");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function getFormattedTime() {
    var today = new Date();
    var y = today.getFullYear();
    // JavaScript months are 0-based.
    var m = today.getMonth() + 1;
    var d = today.getDate();
    var h = today.getHours();
    var mi = today.getMinutes();
    var s = today.getSeconds();
    return m + "/" + d + "/" + y + "-" + h + ":" + mi + ":" + s;
}

function formatPhoneNumber(_Control) {
    _Control.value = _Control.value.replace(/[^0-9]/g, '');
    if (_Control.value.length >= 10) {
        _Control.value = _Control.value.substring(0, 10);
    }
    if (_Control.value.length > 3 && _Control.value.length <= 5) {
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{2})/, '$1-$2');
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{1})/, '$1-$2');
    }
    else if (_Control.value.length > 5 && _Control.value.length <= 10) {
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/, '$1-$2-$3');
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{3})([0-9]{3})/, '$1-$2-$3');
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{3})([0-9]{2})/, '$1-$2-$3');
        _Control.value = _Control.value.replace(/([0-9]{3})([0-9]{3})([0-9]{1})/, '$1-$2-$3');

    }
}
function formatPhoneNumberClient(value) {
    if (value != null) {
        value = value.replace(/[^0-9]/g, '');
        if (value.length >= 10) {
            value = value.substring(0, 10);
        }
        if (value.length > 3 && value.length <= 5) {
            value = value.replace(/([0-9]{3})([0-9]{2})/, '$1-$2');
            value = value.replace(/([0-9]{3})([0-9]{1})/, '$1-$2');
        }
        else if (value.length > 5 && value.length <= 10) {
            value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{4})/, '$1-$2-$3');
            value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{3})/, '$1-$2-$3');
            value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{2})/, '$1-$2-$3');
            value = value.replace(/([0-9]{3})([0-9]{3})([0-9]{1})/, '$1-$2-$3');

        }
        return value;
    }
    return "";


}
function createTd(text) {
    let td = $("<td/>");
    $(td).html(text);
    return td;
}
function createBtnAction(editMethod, deleteMethod) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", '' + editMethod + '(this);');
    $(updateBtn).val("").html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteCurrentRow(this);');
    $(deleteBtn).val("").html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
function doConfirm(msg, yesFn, noFn) {
    var confirmBox = $("#confirmBox");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(function () {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show();
}
function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function FormatDateControl(Object) {

    var formatedDate = "";
    var d = Object.value;
    var y = new Date;
    var dArray;

    if (d.indexOf("/") > -1 || d.indexOf("-") > -1) {

        if (d.indexOf("/") > -1)
            dArray = d.split("/");
        else
            dArray = d.split("-");

        switch (dArray.length) {
            case 2:
                formatedDate = dArray[0] + "/" + dArray[1] + "/" + y.getFullYear();
                break;
            case 3:

                if (parseInt(dArray[2]) > 1900)
                    formatedDate = dArray[0] + "/" + dArray[1] + "/" + dArray[2];
                else if (parseInt(dArray[2]) > 40)
                    formatedDate = dArray[0] + "/" + dArray[1] + "/19" + dArray[2];
                else
                    formatedDate = dArray[0] + "/" + dArray[1] + "/20" + dArray[2];
                break;
        }
    }
    else {
        switch (d.length) {
            case 4:
                formatedDate = d.substr(0, 2) + "/" + d.substr(2, 2) + "/" + y.getFullYear();
                break;
            case 5:
                break;
            case 6:
                {
                    if (parseInt(d.substr(4, 2)) > 40)
                        formatedDate = d.substr(0, 2) + "/" + d.substr(2, 2) + "/19" + d.substr(4, 2);
                    else
                        formatedDate = d.substr(0, 2) + "/" + d.substr(2, 2) + "/20" + d.substr(4, 2);
                }
                break;
            case 8:
                formatedDate = d.substr(0, 2) + "/" + d.substr(2, 2) + "/" + d.substr(4, 4);
                break;
        }
    }

    if (formatedDate == "")
        Object.value = d;
    else
        Object.value = formatedDate;
    isValidateDate(Object.value, Object);
}
function isValidateDate(datePart, control) {
    var regEx = new RegExp(/(?=\d)^(?:(?!(?:10\D(?:0?[5-9]|1[0-4])\D(?:1582))|(?:0?9\D(?:0?[3-9]|1[0-3])\D(?:1752)))((?:0?[13578]|1[02])|(?:0?[469]|11)(?!\/31)(?!-31)(?!\.31)|(?:0?2(?=.?(?:(?:29.(?!000[04]|(?:(?:1[^0-6]|[2468][^048]|[3579][^26])00))(?:(?:(?:\d\d)(?:[02468][048]|[13579][26])(?!\x20BC))|(?:00(?:42|3[0369]|2[147]|1[258]|09)\x20BC))))))|(?:0?2(?=.(?:(?:\d\D)|(?:[01]\d)|(?:2[0-8])))))([-.\/])(0?[1-9]|[12]\d|3[01])\2(?!0000)((?=(?:00(?:4[0-5]|[0-3]?\d)\x20BC)|(?:\d{4}(?!\x20BC)))\d{4}(?:\x20BC)?)(?:$|(?=\x20\d)\x20))?((?:(?:0?[1-9]|1[012])(?::[0-5]\d){0,2}(?:\x20[aApP][mM]))|(?:[01]\d|2[0-3])(?::[0-5]\d){1,2})?$/);
    var flag = regEx.test(datePart);
    if (datePart != "") {
        if (flag) {
            control.value = datePart;
        }
        else {
            control.value = "";
            showErrorMessage("Invalid date.");
        }
    }
}
//restrict the text area 8000 characters
$(document).on("keyup", ".resctrictMaxchars", function (evt) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, resctrictMaxchars));
   
    var remain = resctrictMaxchars - parseInt(tlength);
    if (remain <= 0) {
        showErrorMessage("Field is allowed not more than 8000 characters");
        return;
    }
});

//restrict the text area 250 characters
$(document).on("keyup", ".restrictChars250", function (evt) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, restrictChars250));
    
    var remain = restrictChars250 - parseInt(tlength);
    if (remain <= 0) {
        showErrorMessage("Field is allowed not more than 50 characters");
        return;
    }
});
//restrict the text area 100 characters
$(document).on("keyup", ".restrictChars100", function (evt) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, restrictChars100));
   
    var remain = restrictChars100 - parseInt(tlength);
    if (remain <= 0) {
        showErrorMessage("Field is allowed not more than 100 characters");
    }
});
//restrict the text area 50 characters
$(document).on("keyup", ".restrictChar50", function (evt) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, restrictChar50));
    
    var remain = restrictChar50 - parseInt(tlength);
    if (remain <= 0) {
        showErrorMessage("Field is allowed not more than 50 characters");
    }
});
//restrict the text area 2000 characters
$(document).on("keyup", ".restrictChars2000", function (evt) {
    var tlength = $(this).val().length;
    $(this).val($(this).val().substring(0, restrcitChar2000));
    
    var remain = restrcitChar2000 - parseInt(tlength);
    if (remain <= 0) {
        showErrorMessage("Field is allowed not more than 2000 characters");
    }
});
function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");
    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
}
function formatDate(date, format) {
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var y = date.getYear() + "";
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var E = date.getDay();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    // Convert real date parts into formatted versions
    var value = new Object();
    if (y.length < 4) { y = "" + (y - 0 + 1900); }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H == 0) { value["h"] = 12; }
    else if (H > 12) { value["h"] = H - 12; }
    else { value["h"] = H; }
    value["hh"] = LZ(value["h"]);
    if (H > 11) { value["K"] = H - 12; } else { value["K"] = H; }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) { value["a"] = "PM"; }
    else { value["a"] = "AM"; }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
            result = result + value[token];
        }
        else {
            result = result + token;
        }
    }

    return result;
}
// Removes ending whitespaces
function RTrim(value) {

    var re = /((\s*\S+)*)\s*/;
    try {
        return value.replace(re, "$1");
    }
    catch (E) {
        return value;
    }

}

function BindUserDefinedCodesRadio(Type, Category) {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetUserDefinedOptionByCategory',
        data: { 'CateegoryName': Category, },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindRadioOptions(result, Type);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindRadioOptions(result, type) {
    if (type == 'radio') {
        $('.radio0').val(result[0].UDID);
        $('.radio1').val(result[1].UDID);
        $('.radio2').val(result[2].UDID);
        $('.radio3').val(result[3].UDID);
    }
    else if (type == 'radioYesNo') {
        $('.radioYes').val(result[0].UDID);
        $('.radioNo').val(result[1].UDID);
    }

}
function DisableBackGround() {
    var offSet = 21;
    var screenHeight = screen.availHeight - offSet;
    var screenWidth = screen.availWidth - offSet;
    if (document.documentElement.scrollHeight > screenHeight) screenHeight = document.documentElement.scrollHeight - offSet;
    if (document.documentElement.scrollWidth > screenWidth) screenWidth = document.documentElement.scrollWidth - offSet;
    //document.getElementById("navigation").style.visibility = "hidden";
    var left = ((document.documentElement.clientWidth - 140) / 2) + document.documentElement.scrollLeft;
    var top = ((document.documentElement.clientHeight - 30) / 2) + document.documentElement.scrollTop;

    var backgroundHTML = '<div id="DivDisable" style="right: 0; left: 0px; top: 0px; background-color: black; filter: alpha(opacity = 70); opacity: 0.8; width: 0px; height: 0px; position: absolute; vertical - align: middle; z-index: 999999999">'
        + '<span id = "ImageWait" style = "position: absolute; display: none; text-align: center;">'
        + '<img src="Assessts/images/ajax-loader.gif" > <br />'
        + '<font color="white"size="6">Please wait....</font>'
        + '</span>'
        + '</div>';
    $(backgroundHTML).appendTo("body");
    if (!$.isEmptyObject($("#DivDisable"))) {
        $("#DivDisable").css('height', screenHeight + 'px').css('width', screenWidth + 'px');
        $('#ImageWait').css('display', 'block');
        $('#ImageWait').css('top', top)
        $('#ImageWait').css('left', left);
    }
    else {
        if (location.href != parent.location.href)
            parent.DisableBackGround();
    }
}
function EnableBackGround() {
    if ($.isEmptyObject($("#navigation")))
        $("#navigation").css('visibility', '');
    if (!$.isEmptyObject($("#DivDisable"))) {
        $("#DivDisable").css('height', '0px');
        $("#DivDisable").css('width', '0px');
        $("#ImageWait").css('display', 'none');
    }
    else if (parent != null) {
        parent.EnableBackGround();
    }

}
function validateEmail(control) {

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(control.value)) {
        return re.test(control.value);
    }

    else {
        showErrorMessage("Please enter vaild email address");
        return;
    }
}
//comprehensive assessments
function collapseSection(section) {
    $('.' + section).click();
}


//////////////////////////////////////////////////////////////////////////////////////

function getAge(dateString) {
    debugger
    let birth = new Date(dateString);
    let now = new Date();
    let beforeBirth = ((() => { birth.setDate(now.getDate()); birth.setMonth(now.getMonth()); return birth.getTime() })() < birth.getTime()) ? 0 : 1;
    return now.getFullYear() - birth.getFullYear() - beforeBirth;
}

function BindContactAndSupports(fieldId, id) {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetContactsandCircleofSupport?ClientID=' + id + '',
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            BindFundalNaturalCommunityResourcesTable(fieldId, result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindFundalNaturalCommunityResourcesTable(fieldId, result) {
    $('#' + fieldId).DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "autoWidth": false,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "aaData": result,
        "columns": [{ "data": "ContactType" }, { "data": "Relationship" }, { "data": "ContactName" }, { "data": "OrganizationName" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
}

function currentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
}


function BindLocation(DropDown) {

    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetAllLocation',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            if (result.length > 0) {
                BindLocationDropDownOptions(result, DropDown, "LocationID", "LocationName");
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindLocationDropDownOptions(json, id, val, options) {

    $.each(json, function (data, value) {
        $(id).append($("<option></option>").val(value[val]).html(value[options]));
    });
}

function BindAuthorizeService(DropDown, SectionName) {
    text = SectionName.toString().replace(/\\"/g, '"').replace(/"/g, '\\"');
    apiUrl = "https://staging-api72qa.cx360.net/api/Incident/GetAuthorizedServices?SectionID=" + text;
    apiUrl = apiUrl.replace(/"/g, '');
    $.ajax({
        type: "GET",
        url: apiUrl,
        headers: {
            'TOKEN': "xyDHhu/JMEBi4koXSq0vk2uY6PzWXEZtVKZgU7o6GGI0VGohNp2LKlK888fh9N3ZFVruoQj2lUUjeC7YkapL+A=="
        },
        success: function (result) {
            debugger;
            if (result != null && result != undefined) {
                //  BindDropDownOptions(result, DropDown, "UD_ExternalStaffAssignmentID", "PracticeFacilityname");
                //    var json= JSON.stringify(result);
                $.each(result, function (data, value) {
                    $(DropDown).append($("<option></option>").val(value['UDID']).html(value['UDDescription']));
                });
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
