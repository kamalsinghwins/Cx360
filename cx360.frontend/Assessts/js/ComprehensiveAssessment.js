var sum = 0, token, clientId, reportedBy, comprehensiveAssessmentId, assessmentVersioiningId, sectionStatus, currentRow, selectedText = "",blankComprehensiveAssessmentId;
var sectionChanged = false;

$(document).ready(function () {

    GetAuthToken();
    $(".select2").select2();

    InitalizeDateControls();
    CloseErrorMeeage();
    $('.shData').click(function () {
        $('.adField').toggleClass('show');
    });
    $('.shData1').click(function () {
        $('.adField1').toggleClass('show');
    });
    $('.shData2').click(function () {
        $('.adField2').toggleClass('show');
    });
    $('.shData3').click(function () {
        $('.adField3').toggleClass('show');
    });

    $('input').on("keyup", function () {
        sectionChanged = true;
    });
    $("#DropDownHousingSubsidyType").change(function () {
        selectedText = $(this).find("option:selected").text();
        selectedValue = $(this).val();
        if (selectedText == 'Other (specify)') {
            $("#otherDetailsParent").removeClass("hidden");

        }
        else {
            $("#otherDetailsParent").addClass("hidden");
        }
    });
    $("#DropDownHousingSubsidyType").change(function () {
        selectedTextHousing = $(this).find("option:selected").text();
        selectedValueHousing = $(this).val();
        
    });

    
    $('#TextBoxElectronicSignature').on("change", function () {
        if ($(this).val() != "") {
            $.ajax({
                type: "GET",
                data: { "EPIN": $(this).val() },
                url: "https://staging-api.cx360.net/api/Client/ValidateEPIN",
                headers: {
                    'Token': token,
                },
                success: function (response) {
                    if (response.length > 0) {
                        $("#TextBoxStaffName").val(response[0].FirstName + " , " + response[0].LastName);
                        $("#TextBoxStaffTitle").val(response[0].Title);
                        $("#TextBoxStaffCredentials").val(response[0].StaffCredentails);
                    }
                    else {
                        $("#TextBoxStaffName").val("");
                        $("#TextBoxStaffTitle").val("");
                        $("#TextBoxStaffCredentials").val("");
                    }
                },
                error: function (xhr) { HandleAPIError(xhr) }
            });
        }
    });
    comprehensiveAssessmentId = GetParameterValues('ComprehensiveAssessmentId');
    assessmentVersioiningId = GetParameterValues('AssessmentVersioningId');
    if (comprehensiveAssessmentId > 0 && assessmentVersioiningId > 0) {
        ManageComprehensiveAssessment(comprehensiveAssessmentId);
    }
    else {
        DisableSaveButtonChildSection();

    }
});




function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");
    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
}
function GetAuthToken() {


    $.ajax({
        type: "GET",
        url: 'https://staging-api.cx360.net/api/AuthenticateUser',
        headers: {
            'APIKEY': '6C194C7A-A3D0-4090-9B62-9EBAAA3848C5',
            'CustomerCode': 'BASE72_1011',
            'UserName': 'incident@core.com',
            'Password': 'test@123'
        },
        success: function (result) {
            BindDropDowns(result);
            BindDiagnosiscodes();
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindDropDowns(result) {
    token = _token;
    reportedBy = _userId


    $.ajax({
        type: "GET",
        url: 'https://staging-api.cx360.net/api/Incident/GetClientDetails',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownIndividualName(result);

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindDiagnosiscodes() {
    $.ajax({
        type: "GET",
        data: { "FormName": "Diagnosis Codes", "Criteria": "1=1" },
        url: 'https://staging-api.cx360.net/api/Common/GetList',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownOptions(result, "#DropDownCondition", "DiagnosisID", "DiagnosisDescription");

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
//#region Lifeplan
function BindDropDownIndividualName(result) {
    $.each(result, function (data, value) {
        $("#DropDownClientId").append($("<option></option>").val(value.ClientID).html(value.LastName + "," + " " + value.FirstName));
    });
    $("#DropDownClientId").attr("josn", JSON.stringify(result))

    $("#DropDownClientId").attr("onchange", "FillClientDetails(this)");
    $("#DropDownClientId").attr("disabled", true);

    clientId = GetParameterValues('ClientID');
    if (clientId != undefined) {
        $("select[id$=DropDownClientId]").val(clientId);


        var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
        var parse = jQuery.parseJSON(jsonObject);
        var res = $.grep(parse, function (IndividualNmae) {
            return IndividualNmae.ClientID == clientId;
        });


        var DBO = (res[0].BirthDate);
        if (DBO != null) {
            DBO = DBO.slice(0, 10).split('-');
            DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
        }


        var EnrollmentDate = (res[0]["Enrollment Date"]);
        if (EnrollmentDate != null) {
            EnrollmentDate = EnrollmentDate.slice(0, 10).split('-');
            EnrollmentDate = EnrollmentDate[1] + '/' + EnrollmentDate[2] + '/' + EnrollmentDate[0];
        }



        $("#TextBoxDateOfBirth").val(DBO)//.val(res[0].BirthDate)
        $("#TextBoxAddressLine1").val(res[0].Address1)
        $("#TextBoxAddressLine2").val(res[0].Address2)
        $("#TextBoxCity").val(res[0].City)
        $("#TextBoxState").val(res[0].State)
        $("#TextBoxZipCode").val(res[0].ZipCode)
        $('#TextBoxPhoneNumber').val(formatPhoneNumberClient(res[0].Phone));
        $("#TextBoxAge").val(res[0].Age)
        $("#TextBoxGender").val(res[0].Gender)
        $("#TextBoxEthnicity").val(res[0].Ethnicity)
        $("#TextBoxRace").val(res[0].Race)
        $("#TextBoxRelationshipStatus").val(res[0].MaritalStatus)
        //   $("#TextBoxMedicaid").val(res[0].MedicaidNumber)
    }

}

function FillClientDetails(object) {
    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownClientId").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (IndividualName) {
        return IndividualName.ClientID == selectedValue;
    });
    var DBO = (res[0].BirthDate);
    if (DBO != null) {

        DBO = DBO.slice(0, 10).split('-');
        DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
    }
    var EnrollmentDate = (res[0]["Enrollment Date"]);
    if (EnrollmentDate != null) {
        EnrollmentDate = EnrollmentDate.slice(0, 10).split('-');
        EnrollmentDate = EnrollmentDate[1] + '/' + EnrollmentDate[2] + '/' + EnrollmentDate[0];
    }

    $("#TextBoxDateOfBirth").val(DBO)//.val(res[0].BirthDate)
    $("#TextBoxAddressLine1").val(res[0].Address1)
    $("#TextBoxAddressLine2").val(res[0].Address2)
    $("#TextBoxCity").val(res[0].City)
    $("#TextBoxState").val(res[0].State)
    $("#TextBoxZipCode").val(res[0].ZipCode)
    $('#TextBoxPhoneNumber').val(formatPhoneNumberClient(res[0].Phone));
    $("#TextBoxAge").val(res[0].Age)
    $("#TextBoxGender").val(res[0].Gender)
    $("#TextBoxEthnicity").val(res[0].Ethnicity)
    $("#TextBoxRace").val(res[0].Race)
    $("#TextBoxRelationshipStatus").val(res[0].MaritalStatus)
    //   $("#TextBoxMedicaid").val(res[0].MedicaidNumber)
}
function DisableSaveButtonChildSection() {
    $(".loader").hide();
    $(".btnDisable").prop("disabled", true);
    $("#btnSaveAsNew, #btnPublishVersion").addClass("hidden");
    $("#btnPrintPDf").hide();
    $("#labelAssessmentStatus, #labelDocumentVersion").text("");
    $(".bgProgress").hide();
    $(".bgInprogress").hide();
}
function CloseErrorMeeage() {

    $('select').click(function () {
        if ($(this).hasClass("req_feild") && ($(this).val() != '' || $(this).val() > 1)) {
            $(this).siblings("span.errorMessage").addClass("hidden");
        }
    });
    $('input').blur(function () {
        if ($(this).attr("type") == "radio" && $(this).hasClass("req_feild")) {
            var radio = $(this).attr("name");
            $('input[name=' + radio + ']').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).hasClass("req_feild")) {
            $(this).siblings("span.errorMessage").addClass("hidden");

        }
    })
    $('textarea').blur(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
    $('span').click(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
}

function ShowHideButtonsAndSections(status, version) {
    if (status == "Published" && version == true) {
        $("#btnSaveAsNew").removeClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").addClass("hidden");
        $(".btnChildTbales").prop("disabled", true);
        $(".btnCommon").hide();
        $(".greenColor").prop("disabled", true);
        $(".redColor").prop("disabled", true);
        $(".form-control").prop("disabled", true);
    }
    else if (status == "Published" && version == false) {
        $("#btnSaveAsNew,  #btnPublishVersion").addClass("hidden");
        $("#btnPrintPDf").show();
        $(".btnChildTbales").prop("disabled", true);
        $(".btnCommon").hide();
        $(".greenColor").prop("disabled", true);
        $(".redColor").prop("disabled", true);
        $(".form-control").prop("disabled", true);
    }
    else if (status == "Draft") {
        $("#btnSaveAsNew").addClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").removeClass("hidden");
        $(".btnChildTbales").prop("disabled", true);
        $(".btnCommon").text("Edit");
        $(".btnCommon").show();
        $(".greenColor").prop("disabled", true);
        $(".redColor").prop("disabled", true);
        $(".form-control").prop("disabled", true);
    }
}
function HandleStartSection(section, mode, star) {
    if (mode == "Published") {
        $("." + section).hide();
    }
    else {
        $("#" + startId).show();
        $("#" + completedId).hide();
        $("#" + inprogressId).hide();
    }
}

function HandleCompleteSection(mode, startId, completedId, inprogressId) {
    if (mode == "Published") {
        $(".bgStart").hide();
        $(".bgProgress").hide();
        $(".bgInprogress").hide();
    }
    else {
        $("#" + startId).hide();
        $("#" + completedId).show();
        $("#" + inprogressId).hide();
    }
}
function HandleInprogressSection(mode, startId, completedId, inprogressId) {
    if (mode == "Published") {
        $(".bgStart").hide();
        $(".bgProgress").hide();
        $(".bgProgress").hide();
    }
    else {
        $("#" + startId).hide();
        $("#" + completedId).hide();
        $("#" + inprogressId).show();
    }
}
function validateMasterSectionTab() {
    var checked = null;
    $(".masterSection .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if ($(this).val() == "" || $(this).val() == "-1") {
            $(this).siblings("span.errorMessage").removeClass("hidden");
            $(this).focus();
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}

//#region Save functions tab
function InsertModifyComprehensiveAssessment() {
    if ($("#ComprehensiveAssessmentSaveBtn").text() == "Edit") {
        $("#ComprehensiveAssessmentSaveBtn").text("Ok");
        $('.masterSection .comprehensiveAssessment').prop("disabled", false);
        $('.masterSection .readonly').prop("disabled", true);
        $("#ComprehensiveAssessmentSaveBtn").text("Ok");
        return;
    }
    if (!validateMasterSectionTab()) return;
    var json = [],
        item = {},
        tag;
    blankComprehensiveAssessmentId = $("#TextBoxComprehensiveAssessmentId").val();
    $('.masterSection .comprehensiveAssessment').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "ComprehensiveAssessment", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                ComprehensiveAssessmentSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyMedicalSection() {

    if ($("#btnMedicalSection").text() == "Edit") {
        $("#btnMedicalSection").text("Ok");
        $('.section1 .form-control').prop("disabled", false);
        $("#btnMedicalMedications").prop("disabled", false);
        $("#btnMedicalDiagnoses").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        $("#btnMedicalSection").text("Ok");
        return;
    }

    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitMedicalSection();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitMedicalSection();
    });

}
function InsertModifyMentalHealthSection() {
    if ($("#btnMentalHealth").text() == "Edit") {
        $("#btnMentalHealth").text("Ok");
        $('.mentalHealth .form-control').prop("disabled", false);
        $("#btnAddMedicalHealthMedications").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        $("#btnMentalHealth").text("Ok");
        return;
    }
    doConfirm("Have you completed the section?", function yes() {
        sectionStatus = "Completed";
        SubmitMentalHealthSection();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitMentalHealthSection();
    });
}
function InsertModifyAssessmentFinancial() {

    if ($("#btnAssessmentFinancial").text() == "Edit") {
        $("#btnAssessmentFinancial").text("Ok");
        $('.financialSection .form-control').prop("disabled", false);
        $("#btnAddFinancialMemebrStatus").prop("disabled", false);
        $("#btnAddFinancialMemberNeeds").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitAssessmentFinancial();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitAssessmentFinancial();
    });


}
function InsertModifyAssessmentHousing() {
    if ($("#btnAssessmentHousing").text() == "Edit") {
        $("#btnAssessmentHousing").text("Ok");
        $('.housingSecton .form-control').prop("disabled", false);
        $("#btnAddHousingSubsidies").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitAssessmentHousing();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitAssessmentHousing();
    });
}
function InsertModifyAssessmentDomesticViolance() {
    if ($("#btnDomesticViolance").text() == "Edit") {
        $("#btnDomesticViolance").text("Ok");
        $('.domesticViolence .form-control').prop("disabled", false);
        $("#btnAddDomesticViolanceRelationship").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitAssessmentDomesticViolance();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitAssessmentDomesticViolance();
    });
}
function InsertModifyAssessmentLegal() {
    if ($("#btnAssessmentLegal").text() == "Edit") {
        $("#btnAssessmentLegal").text("Ok");
        $('.generalLegal .form-control').prop("disabled", false);
        $("#btnAddLegalCourtDates").prop("disabled", false);
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitAssessmentLegal();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitAssessmentLegal();
    });
}


function SubmitMedicalSection() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.section1 .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });



    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    if ($("#MedicalDiagnosis tbody tr").length >= 1 && $("#MedicalDiagnosis tbody tr td").length > 1) {
        var rowLength = $("#MedicalDiagnosis tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["MedicalDiagnosisId"] = $("#MedicalDiagnosis tbody tr:eq(" + i + ") td:eq(1)").text();
            firstTable["Condition"] = $("#MedicalDiagnosis tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["LatestResult"] = $("#MedicalDiagnosis tbody tr:eq(" + i + ") td:eq(3)").text();
            firstTable["LastResultDate"] = $("#MedicalDiagnosis tbody tr:eq(" + i + ") td:eq(4)").text();
            JsonFirstTable.push(firstTable);
        }
    }
    if ($("#MedicalMedications tbody tr").length >= 1 && $("#MedicalMedications tbody tr td").length > 1) {
        var rowLength = $("#MedicalMedications tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var secondTable = {};
            secondTable["MedicalMedicationId"] = $("#MedicalMedications tbody tr:eq(" + i + ") td:eq(0)").text();
            secondTable["MedicationDosage"] = $("#MedicalMedications tbody tr:eq(" + i + ") td:eq(1)").text();
            JsonSecondTable.push(secondTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentMedical", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable), JsonChildSecondTable: JSON.stringify(JsonSecondTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentMedicalSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitMentalHealthSection() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [];
    $('.mentalHealth .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);

    if ($("#MedicalHealthMedications tbody tr").length >= 1 && $("#MedicalHealthMedications tbody tr td").length > 1) {
        var rowLength = $("#MedicalHealthMedications tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["MedicalHealthMedicationsId"] = $("#MedicalHealthMedications tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["MedicationDosage"] = $("#MedicalHealthMedications tbody tr:eq(" + i + ") td:eq(1)").text();
            JsonFirstTable.push(firstTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentMedicalHealth", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentMentalHealthSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitAssessmentFinancial() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.financialSection .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    if ($("#FinancailMemberStatus tbody tr").length >= 1 && $("#FinancailMemberStatus tbody tr td").length > 1) {
        var rowLength = $("#FinancailMemberStatus tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["EntitlementsType"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["FinancialMemberStatusId"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(1)").text();
            firstTable["Entitlements"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(2)").text();
            firstTable["RecievesAmount"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(3)").text();
            firstTable["RecertificationDate"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(4)").text();
            firstTable["StableNoNeeds"] = $("#FinancailMemberStatus tbody tr:eq(" + i + ") td:eq(5)").text();
            JsonFirstTable.push(firstTable);
        }
    }
    if ($("#FinancialMemberNeeds tbody tr").length >= 1 && $("#FinancialMemberNeeds tbody tr td").length > 1) {
        var rowLength = $("#FinancialMemberNeeds tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var secondTable = {};
            secondTable["FinancialElementsType"] = $("#FinancialMemberNeeds tbody tr:eq(" + i + ") td:eq(0)").text();
            secondTable["FinancialMemberNeedId"] = $("#FinancialMemberNeeds tbody tr:eq(" + i + ") td:eq(1)").text();
            secondTable["FinancialElement"] = $("#FinancialMemberNeeds tbody tr:eq(" + i + ") td:eq(2)").text();
            secondTable["AssisstanceNeeded"] = $("#FinancialMemberNeeds tbody tr:eq(" + i + ") td:eq(3)").text();
            secondTable["StableNoNeeds"] = $("#FinancialMemberNeeds tbody tr:eq(" + i + ") td:eq(4)").text();
            JsonSecondTable.push(secondTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentFinancial", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable), JsonChildSecondTable: JSON.stringify(JsonSecondTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentFinancialSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitAssessmentHousing() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [];
    $('.housingSecton .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);

    if ($("#HousingSubsidies tbody tr").length >= 1 && $("#HousingSubsidies tbody tr td").length > 1) {
        var rowLength = $("#HousingSubsidies tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["HousingSubsidyType"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["HousingSubsidyId"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(1)").text();
            firstTable["HousingSubsidy"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(2)").text();
            firstTable["RecievesDetailsCase"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(4)").text();
            firstTable["OtherDetail"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(3)").text();
            firstTable["Pending"] = $("#HousingSubsidies tbody tr:eq(" + i + ") td:eq(5)").text();


            JsonFirstTable.push(firstTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentHousing", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentHousingSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitAssessmentDomesticViolance() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [];
    $('.domesticViolence .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);

    if ($("#DomesticViolanceRelationship tbody tr").length >= 1 && $("#DomesticViolanceRelationship tbody tr td").length > 1) {
        var rowLength = $("#DomesticViolanceRelationship tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["DomesticViolanceMemberRelationshipId"] = $("#DomesticViolanceRelationship tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["Name"] = $("#DomesticViolanceRelationship tbody tr:eq(" + i + ") td:eq(1)").text();
            firstTable["Relationship"] = $("#DomesticViolanceRelationship tbody tr:eq(" + i + ") td:eq(2)").text();
            JsonFirstTable.push(firstTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentDomesticViolance", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentDomesticViolanceSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitAssessmentLegal() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [];
    $('.generalLegal .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = "1";
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);

    if ($("#LegalCourtDates tbody tr").length >= 1 && $("#LegalCourtDates tbody tr td").length > 1) {
        var rowLength = $("#LegalCourtDates tbody tr").length;
        for (i = 0; i < rowLength; i++) {
            var firstTable = {};
            firstTable["LegalCourtDateId"] = $("#LegalCourtDates tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["LegalDate"] = $("#LegalCourtDates tbody tr:eq(" + i + ") td:eq(1)").text();
            firstTable["LegalDateDetails"] = $("#LegalCourtDates tbody tr:eq(" + i + ") td:eq(2)").text();
            JsonFirstTable.push(firstTable);
        }
    }
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentLegal", Json: JSON.stringify(json), ReportedBy: reportedBy, JsonChildFirstTable: JSON.stringify(JsonFirstTable) },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AssessmentLegalSaved(result);


            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitAreasSafeguardReview() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.safeguardReview .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "AreasSafeguardReview", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                AreasSafeguardReviewSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitLivingSkills() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.livingSkills .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "IndependentLivingSkills", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                LivingSkillsSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitBehavioralSupportServices() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.supportServices .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "BehavioralSupportServices", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                BehavioralSupportServicesSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitEducationalVocationalStatus() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.vocationalStatus .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "EducationalVocationalStatus", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                EducationalVocationalStatusSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitSelfDirectedServices() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.directedServices .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "SelfDirectedServices", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                SelfDirectedServicesSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitTransitionPlanning() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.transitionPlanning .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "TransitionPlanning", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                TransitionPlanningSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitGeneral() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.generalSection .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "General", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                GeneralSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitSafetyRisk() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.riskAssessment .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "SafetyRisk", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                SafetyRiskSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitDepressionScreening() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.depressionScreening .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "DepressionScreening", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                DepressionScreeningSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitSubstanceAbuseScreening() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.abuseScreening .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "SubstanceAbuseScreening", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                SubstanceAbuseScreeningSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SubmitSafetyPlan() {
    var json = [],
        item = {},
        tag, JsonFirstTable = [],
        JsonSecondTable = [];
    $('.safetyPlan .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompanyId"] = 1;
    item["ComprehensiveAssessmentId"] = $("#TextBoxComprehensiveAssessmentId").val();
    item["AssessmentVersioningId"] = $("#TextBoxAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "SafetyPlan", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                SafetyPlanSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
//#end region

function ComprehensiveAssessmentSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabsComprehensiveAssessment[0].ValidatedRecord == false) {
            showErrorMessage("Comprehensvie Assessment already exists in Draft for client");
            return;
        }
        else {
            showRecordSaved("Record Saved Successfully.");
            $(".btnDisable").prop("disabled", false);
            $("#btnSaveAsNew").addClass("hidden");
            $("#btnPublishVersion").show();
            $("#btnPrintPDf").show();
            changeExistingURL(result.AllTabsComprehensiveAssessment[0].ComprehensiveAssessmentId, result.AllTabsComprehensiveAssessment[0].AssessmentVersioningId);

            $("#TextBoxComprehensiveAssessmentId").val(result.AllTabsComprehensiveAssessment[0].ComprehensiveAssessmentId);
            $("#TextBoxAssessmentVersioningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentVersioningId);
            if (result.AllTabsComprehensiveAssessment[0].DocumentVersion != "") {
                $("#TextBoxDocumentStatus").text(result.AllTabsComprehensiveAssessment[0].DocumentStatus);
                $("#TextBoxDocumentVersion").text(result.AllTabsComprehensiveAssessment[0].DocumentVersion);
            }
            $('.masterSection .comprehensiveAssessment').attr("disabled", true);
            if ($("#ComprehensiveAssessmentSaveBtn").text() == "Ok") {
                $("#ComprehensiveAssessmentSaveBtn").text("Edit");
            }
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function changeExistingURL(comprehensiveAssessmentId,assessmentVersioningId) {
    if (blankComprehensiveAssessmentId < 1) {
        var currentURL = window.location.href.split('?')[0];
        var newURL = currentURL + "?ComprehensiveAssessmentId=" + comprehensiveAssessmentId + "&AssessmentVersioningId=" + assessmentVersioningId;
        history.pushState(null, 'Comprehensive Assessment', newURL);
    }
}
function AssessmentMedicalSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentMedicalId").val(result.AllTabsComprehensiveAssessment[0].AssessmentMedicalId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedMedical").show();
            $("#statusStartMedical").hide();
            $("#statusInprogressMedical").hide();
        }
        else {
            $("#statusCompletedMedical").hide();
            $("#statusStartMedical").hide();
            $("#statusInprogressMedical").show();
        }

        $('.section1 .form-control').prop("disabled", true);
        if ($("#btnMedicalSection").text() == "Ok") {
            $("#btnMedicalSection").text("Edit");
        }
        $("#btnMedicalMedications").prop("disabled", true);
        $("#btnMedicalDiagnoses").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#MedicalDiagnosis tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.Condition));
                $(tr).append(createTd(base.MedicalDiagnosisId));
                $(tr).append(createTd(base.ConditionText));
                $(tr).append(createTd(base.LatestResult));
                $(tr).append(createTd(base.LastResultDate));

                $(tr).append(createBtnAction("EditMedicalDiagnosis", ""));
                $(tbl).append(tr);
            }

        }
        if (result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable != null) {
            var tbl = $("#MedicalMedications tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.MedicalMedicationId));
                $(tr).append(createTd(base.MedicationDosage));
                $(tr).append(createBtnAction("EditMedicalMedications", ""));
                $(tbl).append(tr);
            }
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function AssessmentMentalHealthSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentMedicalHelathId").val(result.AllTabsComprehensiveAssessment[0].AssessmentMedicalHelathId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedMedicalHealth").show();
            $("#statusStartMedicalHealth").hide();
            $("#statusInprogressMedicalHealth").hide();
        }
        else {
            $("#statusCompletedMedicalHealth").hide();
            $("#statusStartMedicalHealth").hide();
            $("#statusInprogressMedicalHealth").show();
        }

        $('.mentalHealth .form-control').prop("disabled", true);
        if ($("#btnMentalHealth").text() == "Ok") {
            $("#btnMentalHealth").text("Edit");
        }
        $("#btnAddMedicalHealthMedications").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#MedicalHealthMedications tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.MedicalMedicationId));
                $(tr).append(createTd(base.MedicationDosage));
                $(tr).append(createBtnAction("EditMedicalHealthMedications", ""));
                $(tbl).append(tr);
            }

        }

    }
    else {
        showErrorMessage(result.Message);
    }
}
function AssessmentFinancialSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentFinancialId").val(result.AllTabsComprehensiveAssessment[0].AssessmentFinancialId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusStartFinancial").hide();
            $("#statusCompletedFinancial").show();
            $("#statusInprogressFinancial").hide();
        }
        else {
            $("#statusCompletedFinancial").hide();
            $("#statusStartFinancial").hide();
            $("#statusInprogressFinancial").show();
        }

        $('.financialSection .form-control').prop("disabled", true);
        if ($("#btnAssessmentFinancial").text() == "Ok") {
            $("#btnAssessmentFinancial").text("Edit");
        }
        $("#btnAddFinancialMemebrStatus").prop("disabled", true);
        $("#btnAddFinancialMemberNeeds").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#FinancailMemberStatus tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.EntitlementsType));
                $(tr).append(createTd(base.FinancialMemberStatusId));
                $(tr).append(createTd(base.Entitlements));
                $(tr).append(createTd(base.RecievesAmount));
                $(tr).append(createTd(base.RecertificationDate));
                $(tr).append(createTd(base.StableNoNeeds));
                $(tr).append(createBtnAction("EditFinancialMemberStatus", ""));
                $(tbl).append(tr);
            }

        }
        if (result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable != null) {
            var tbl = $("#FinancialMemberNeeds tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataSecondTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.FinancialElementsType));
                $(tr).append(createTd(base.FinancialMemberNeedId));
                $(tr).append(createTd(base.FinancialElement));
                $(tr).append(createTd(base.AssisstanceNeeded));
                $(tr).append(createTd(base.StableNoNeeds));
                $(tr).append(createBtnAction("EditFinancialMemberNeeds", ""));
                $(tbl).append(tr);
            }
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function AssessmentHousingSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentHousingId").val(result.AllTabsComprehensiveAssessment[0].AssessmentHousingId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedHousing").show();
            $("#statusStartHousing").hide();
            $("#statusInprogressHousing").hide();
        }
        else {
            $("#statusCompletedHousing").hide();
            $("#statusStartHousing").hide();
            $("#statusInprogressHousing").show();
        }

        $('.housingSecton .form-control').prop("disabled", true);
        if ($("#btnAssessmentHousing").text() == "Ok") {
            $("#btnAssessmentHousing").text("Edit");
        }
        $("#btnAddHousingSubsidies").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#HousingSubsidies tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.HousingSubsidyType));
                $(tr).append(createTd(base.HousingSubsidyId));
                $(tr).append(createTd(base.HousingSubsidy));
                $(tr).append(createTd(base.OtherDetail));
                $(tr).append(createTd(base.RecievesDetailsCase));
                $(tr).append(createTd(base.Pending));
                $(tr).append(createBtnAction("EditHousingSubsidies", ""));
                $(tbl).append(tr);
            }

        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function AssessmentDomesticViolanceSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentDomesticViolanceId").val(result.AllTabsComprehensiveAssessment[0].AssessmentDomesticViolanceId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedDomesticViolance").show();
            $("#statusStartDomesticViolance").hide();
            $("#statusInprogressDomesticViolance").hide();
        }
        else {
            $("#statusCompletedDomesticViolance").hide();
            $("#statusStartDomesticViolance").hide();
            $("#statusInprogressDomesticViolance").show();
        }

        $('.domesticViolence .form-control').prop("disabled", true);
        if ($("#btnDomesticViolance").text() == "Ok") {
            $("#btnDomesticViolance").text("Edit");
        }
        $("#btnAddDomesticViolanceRelationship").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#DomesticViolanceRelationship tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.DomesticViolanceMemberRelationshipId));
                $(tr).append(createTd(base.Name));
                $(tr).append(createTd(base.Relationship));
                $(tr).append(createBtnAction("EditDomesticViolanceRelationship", ""));
                $(tbl).append(tr);
            }

        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function AssessmentLegalSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        $("#TextBoxAssessmentLegalId").val(result.AllTabsComprehensiveAssessment[0].AssessmentLegalId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedLegal").show();
            $("#statusStartLegal").hide();
            $("#statusInprogressLegal").hide();
        }
        else {
            $("#statusCompletedLegal").hide();
            $("#statusStartLegal").hide();
            $("#statusInprogressLegal").show();
        }

        $('.generalLegal .form-control').prop("disabled", true);
        if ($("#btnAssessmentLegal").text() == "Ok") {
            $("#btnAssessmentLegal").text("Edit");
        }
        $("#btnAddLegalCourtDates").prop("disabled", true);

        if (result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable != null) {
            var tbl = $("#LegalCourtDates tbody");
            tbl.html("");
            for (var i = 0; i < JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable).length; i++) {
                let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDataFirstTable)[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.LegalCourtDateId));
                $(tr).append(createTd(base.LegalDate));
                $(tr).append(createTd(base.LegalDateDetails));
                $(tr).append(createBtnAction("EditLegalCourtDates", ""));
                $(tbl).append(tr);
            }

        }
    }
    else {
        showErrorMessage(result.Message);
    }
}


//#legal section
function InsertModifyAreasSafeguardReview() {

    if ($("#AreasSafeguardReviewSaveBtn").text() == "Edit") {
        $("#AreasSafeguardReviewSaveBtn").text("Ok");
        $('.safeguardReview .form-control').attr("disabled", false);
        $("#AreasSafeguardReviewSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitAreasSafeguardReview();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitAreasSafeguardReview();
    });

}
function AreasSafeguardReviewSaved(result) {

    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        // $("#btnSaveAsNew").addClass("hidden");
        $("#TextBoxAssessmentAreasSafeguardReviewId").val(result.AllTabsComprehensiveAssessment[0].AssessmentAreasSafeguardReviewId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedSafeguardReview").show();
            $("#statusStartSafeguardReview").hide();
            $("#statusInprogressSafeguardReview").hide();
        }
        else {
            $("#statusCompletedSafeguardReview").hide();
            $("#statusStartSafeguardReview").hide();
            $("#statusInprogressSafeguardReview").show();
        }

        $('.safeguardReview .form-control').attr("disabled", true);
        if ($("#AreasSafeguardReviewSaveBtn").text() == "Ok") {
            $("#AreasSafeguardReviewSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}


function InsertModifyLivingSkills() {
    if ($("#LivingSkillsSaveBtn").text() == "Edit") {
        $("#LivingSkillsSaveBtn").text("Ok");
        $('.livingSkills .form-control').attr("disabled", false);
        $("#LivingSkillsSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitLivingSkills();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitLivingSkills();
    });

}
function LivingSkillsSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentIndependentLivingSkillsId").val(result.AllTabsComprehensiveAssessment[0].AssessmentIndependentLivingSkillsId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedLivingSkills").show();
            $("#statusStartLivingSkills").hide();
            $("#statusInprogressLivingSkills").hide();
        }
        else {
            $("#statusCompletedLivingSkills").hide();
            $("#statusStartLivingSkills").hide();
            $("#statusInprogressLivingSkills").show();
        }

        $('.livingSkills .form-control').attr("disabled", true);
        if ($("#LivingSkillsSaveBtn").text() == "Ok") {
            $("#LivingSkillsSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifyBehavioralSupportServices() {
    if ($("#BehavioralSupportServicesSaveBtn").text() == "Edit") {
        $("#BehavioralSupportServicesSaveBtn").text("Ok");
        $('.supportServices .form-control').attr("disabled", false);
        $("#BehavioralSupportServicesSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitBehavioralSupportServices();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitBehavioralSupportServices();
    });

}
function BehavioralSupportServicesSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentBehavioralSupportServicesId").val(result.AllTabsComprehensiveAssessment[0].AssessmentBehavioralSupportServicesId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedBehavioralSupport").show();
            $("#statusStartBehavioralSupport").hide();
            $("#statusInprogressBehavioralSupport").hide();
        }
        else {
            $("#statusCompletedBehavioralSupport").hide();
            $("#statusStartBehavioralSupport").hide();
            $("#statusInprogressBehavioralSupport").show();
        }

        $('.supportServices .form-control').attr("disabled", true);
        if ($("#BehavioralSupportServicesSaveBtn").text() == "Ok") {
            $("#BehavioralSupportServicesSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifyEducationalVocationalStatus() {
    if ($("#EducationalVocationalStatusSaveBtn").text() == "Edit") {
        $("#EducationalVocationalStatusSaveBtn").text("Ok");
        $('.vocationalStatus .form-control').attr("disabled", false);
        $("#EducationalVocationalStatusSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitEducationalVocationalStatus();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitEducationalVocationalStatus();
    });

}
function EducationalVocationalStatusSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentEducationalVocationalStatusId").val(result.AllTabsComprehensiveAssessment[0].AssessmentEducationalVocationalStatusId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedVocational").show();
            $("#statusStartVocational").hide();
            $("#statusInprogressVocational").hide();
        }
        else {
            $("#statusCompletedVocational").hide();
            $("#statusStartVocational").hide();
            $("#statusInprogressVocational").show();
        }

        $('.vocationalStatus .form-control').attr("disabled", true);
        if ($("#EducationalVocationalStatusSaveBtn").text() == "Ok") {
            $("#EducationalVocationalStatusSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifySelfDirectedServices() {
    if ($("#SelfDirectedServicesSaveBtn").text() == "Edit") {
        $("#SelfDirectedServicesSaveBtn").text("Ok");
        $('.directedServices .form-control').attr("disabled", false);
        $("#SelfDirectedServicesSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitSelfDirectedServices();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitSelfDirectedServices();
    });

}
function SelfDirectedServicesSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentSelfDirectedServicesId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSelfDirectedServicesId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedSelfDirected").show();
            $("#statusStartSelfDirected").hide();
            $("#statusInprogressSelfDirected").hide();
        }
        else {
            $("#statusCompletedSelfDirected").hide();
            $("#statusStartSelfDirected").hide();
            $("#statusInprogressSelfDirected").show();
        }

        $('.directedServices .form-control').attr("disabled", true);
        if ($("#SelfDirectedServicesSaveBtn").text() == "Ok") {
            $("#SelfDirectedServicesSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifyTransitionPlanning() {
    if ($("#TransitionPlanningSaveBtn").text() == "Edit") {
        $("#TransitionPlanningSaveBtn").text("Ok");
        $('.transitionPlanning .form-control').attr("disabled", false);
        $("#TransitionPlanningSaveBtn").text("Ok");
        return;
    }

    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitTransitionPlanning();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitTransitionPlanning();
    });
}
function TransitionPlanningSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentTransitionPlanningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentTransitionPlanningId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedTransitionPlan").show();
            $("#statusStartTransitionPlan").hide();
            $("#statusInprogressTransitionPlan").hide();
        }
        else {
            $("#statusCompletedTransitionPlan").hide();
            $("#statusStartTransitionPlan").hide();
            $("#statusInprogressTransitionPlan").show();
        }

        $('.transitionPlanning .form-control').attr("disabled", true);
        if ($("#TransitionPlanningSaveBtn").text() == "Ok") {
            $("#TransitionPlanningSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifyGeneral() {
    if ($("#GeneralSaveBtn").text() == "Edit") {
        $("#GeneralSaveBtn").text("Ok");
        $('.generalSection .form-control').attr("disabled", false);
        $("#GeneralSaveBtn").text("Ok");
        return;
    }

    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitGeneral();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitGeneral();
    });
}
function GeneralSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentGeneralId").val(result.AllTabsComprehensiveAssessment[0].AssessmentGeneralId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedGeneral").show();
            $("#statusStartGeneral").hide();
            $("#statusInprogressGeneral").hide();
        }
        else {
            $("#statusCompletedGeneral").hide();
            $("#statusStartGeneral").hide();
            $("#statusInprogressGeneral").show();
        }

        $('.generalSection .form-control').attr("disabled", true);
        if ($("#GeneralSaveBtn").text() == "Ok") {
            $("#GeneralSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifySafetyRisk() {
    if ($("#SafetyRiskSaveBtn").text() == "Edit") {
        $("#SafetyRiskSaveBtn").text("Ok");
        $('.riskAssessment .form-control').attr("disabled", false);
        $("#SafetyRiskSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitSafetyRisk();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitSafetyRisk();
    });

}
function SafetyRiskSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentSafetyRiskId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSafetyRiskId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedSafetyRisk").show();
            $("#statusStartSafetyRisk").hide();
            $("#statusInprogressSafetyRisk").hide();
        }
        else {
            $("#statusCompletedSafetyRisk").hide();
            $("#statusStartSafetyRisk").hide();
            $("#statusInprogressSafetyRisk").show();
        }

        $('.riskAssessment .form-control').attr("disabled", true);
        if ($("#SafetyRiskSaveBtn").text() == "Ok") {
            $("#SafetyRiskSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifyDepressionScreening() {
    if ($("#DepressionScreeningSaveBtn").text() == "Edit") {
        $("#DepressionScreeningSaveBtn").text("Ok");
        $('.depressionScreening .form-control').attr("disabled", false);
        $("#DepressionScreeningSaveBtn").text("Ok");
        return;
    }

    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitDepressionScreening();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitDepressionScreening();
    });
}
function DepressionScreeningSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentDepressionScreeningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentDepressionScreeningId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedDepression").show();
            $("#statusStartDepression").hide();
            $("#statusInprogressDepression").hide();
        }
        else {
            $("#statusCompletedDepression").hide();
            $("#statusStartDepression").hide();
            $("#statusInprogressDepression").show();
        }

        $('.depressionScreening .form-control').attr("disabled", true);
        if ($("#DepressionScreeningSaveBtn").text() == "Ok") {
            $("#DepressionScreeningSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifySubstanceAbuseScreening() {
    if ($("#SubstanceAbuseScreeningSaveBtn").text() == "Edit") {
        $("#SubstanceAbuseScreeningSaveBtn").text("Ok");
        $('.abuseScreening .form-control').attr("disabled", false);
        $("#SubstanceAbuseScreeningSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitSubstanceAbuseScreening();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitSubstanceAbuseScreening();
    });

}
function SubstanceAbuseScreeningSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentSubstanceAbuseScreeningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSubstanceAbuseScreeningId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedSubstance").show();
            $("#statusStartSubstance").hide();
            $("#statusInprogressSubstance").hide();
        }
        else {
            $("#statusCompletedSubstance").hide();
            $("#statusStartSubstance").hide();
            $("#statusInprogressSubstance").show();
        }

        $('.abuseScreening .form-control').attr("disabled", true);
        if ($("#SubstanceAbuseScreeningSaveBtn").text() == "Ok") {
            $("#SubstanceAbuseScreeningSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}

function InsertModifySafetyPlan() {
    if ($("#SafetyPlanSaveBtn").text() == "Edit") {
        $("#SafetyPlanSaveBtn").text("Ok");
        $('.safetyPlan .form-control').attr("disabled", false);
        $("#SafetyPlanSaveBtn").text("Ok");
        return;
    }
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        SubmitSafetyPlan();
    }, function no() {
        sectionStatus = "Inprogress"
        SubmitSafetyPlan();
    });

}
function SafetyPlanSaved(result) {
    if (result.Success == true && result.IsException == false) {

        showRecordSaved("Record Saved Successfully.");
        $(".btnDisable").prop("disabled", false);
        $("#TextBoxAssessmentSafetyPlanId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSafetyPlanId);
        var status = result.AllTabsComprehensiveAssessment[0].Status;
        if (status == "Completed") {
            $("#statusCompletedSafetyPlan").show();
            $("#statusStartSafetyPlan").hide();
            $("#statusInprogressSafetyPlan").hide();
        }
        else {
            $("#statusCompletedSafetyPlan").hide();
            $("#statusStartSafetyPlan").hide();
            $("#statusInprogressSafetyPlan").show();
        }

        $('.safetyPlan .form-control').attr("disabled", true);
        if ($("#SafetyPlanSaveBtn").text() == "Ok") {
            $("#SafetyPlanSaveBtn").text("Edit");
        }

    }
    else {
        showErrorMessage(result.Message);
    }

}
//endregion











//#region add,,edit,delete the enteries in child tables
function AddMedicalDiagnoses(result) {
    var tbl = $("#MedicalDiagnosis tbody");
    if ($("#MedicalDiagnosis tbody tr").length <= 1 && $("#MedicalDiagnosis tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnMedicalDiagnoses").hasClass("editMode")) {
        let tr = $("<tr/>");
        $(tr).append(createTd($("#DropDownCondition").val()));
        $(tr).append(createTd($("#TextBoxMedicalDiagnosisId").val()));
        $(tr).append(createTd($("#DropDownCondition option:selected").text()));
        $(tr).append(createTd($("#TextBoxLatestResult").val()));
        $(tr).append(createTd($("#TextBoxLastResultDate").val()));

        $(tr).append(createBtnAction("EditMedicalDiagnosis", ""));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#DropDownCondition").val()));
        $(currentRow).append(createTd($("#TextBoxMedicalDiagnosisId").val()));
        $(currentRow).append(createTd($("#DropDownCondition option:selected").text()));
        $(currentRow).append(createTd($("#TextBoxLatestResult").val()));
        $(currentRow).append(createTd($("#TextBoxLastResultDate").val()));

        $(currentRow).append(createBtnAction("EditMedicalDiagnosis", ""));
        $(tbl).append(currentRow);
        $("#btnMedicalDiagnoses").removeClass("editMode");
    }

    $("#DropDownCondition").val(null).trigger('change');
    $("#TextBoxMedicalDiagnosisId").val("");
    $("#TextBoxLatestResult").val("");
    $("#TextBoxLastResultDate").val("");


}
function AddMedicalMedications(result) {
    var tbl = $("#MedicalMedications tbody");
    if ($("#MedicalMedications tbody tr").length <= 1 && $("#MedicalMedications tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnMedicalMedications").hasClass("editMode")) {
        let tr = $("<tr/>");
        $(tr).append(createTd($("#TextBoxMedicalMedicationId").val()));
        $(tr).append(createTd($("#TextBoxMedicationDosage").val()));
        $(tr).append(createBtnAction("EditMedicalMedications", "DeleteMedicalMedications"));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#TextBoxMedicalMedicationId").val()));
        $(currentRow).append(createTd($("#TextBoxMedicationDosage").val()));
        $(currentRow).append(createBtnAction("EditMedicalMedications", "DeleteMedicalMedications"));
        $(tbl).append(currentRow);
        $("#btnMedicalMedications").removeClass("editMode");
    }

    $("#TextBoxMedicalMedicationId").val("");
    $("#TextBoxMedicationDosage").val("");

}
function AddMedicalHealthMedications(result) {
    var tbl = $("#MedicalHealthMedications tbody");
    if ($("#MedicalHealthMedications tbody tr").length <= 1 && $("#MedicalHealthMedications tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddMedicalHealthMedications").hasClass("editMode")) {
        let tr = $("<tr/>");
        $(tr).append(createTd($("#TextBoxMedicalHealthMedicationsId").val()));
        $(tr).append(createTd($("#TextBoxMedicationHealthDosage").val()));
        $(tr).append(createBtnAction("EditMedicalHealthMedications", "DeleteMedicalHealthMedications"));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#TextBoxMedicalHealthMedicationsId").val()));
        $(currentRow).append(createTd($("#TextBoxMedicationHealthDosage").val()));
        $(currentRow).append(createBtnAction("EditMedicalHealthMedications", "DeleteMedicalHealthMedications"));
        $(currentRow).append(tr);
        $("#btnAddMedicalHealthMedications").removeClass("editMode");
    }


    $("#TextBoxMedicalHealthMedicationsId").val("");
    $("#TextBoxMedicationHealthDosage").val("");
}
function AddFinancialMemebrStatus(result) {
    var tbl = $("#FinancailMemberStatus tbody");
    if ($("#FinancailMemberStatus tbody tr").length <= 1 && $("#FinancailMemberStatus tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddFinancialMemebrStatus").hasClass("editMode")) {
        if (!ValidateMemberStatus()) return;
        let tr = $("<tr/>");
        $(tr).append(createTd($("#DropDownEntitlementsType").val()));
        $(tr).append(createTd($("#TextBoxFinancialMemberStatusId").val()));
        $(tr).append(createTd($("#DropDownEntitlementsType option:selected").text()));
        $(tr).append(createTd($("#TextBoxRecievesAmount").val()));
        $(tr).append(createTd($("#TextBoxRecertificationDate").val()));
        $(tr).append(createTd($("#TextBoxStableNoNeeds").val()));

        $(tr).append(createBtnAction("EditFinancialMemberStatus", "DeleteFinancialMemberStatus"));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#DropDownEntitlementsType").val()));
        $(currentRow).append(createTd($("#TextBoxFinancialMemberStatusId").val()));
        $(currentRow).append(createTd($("#DropDownEntitlementsType option:selected").text()));
        $(currentRow).append(createTd($("#TextBoxRecievesAmount").val()));
        $(currentRow).append(createTd($("#TextBoxRecertificationDate").val()));
        $(currentRow).append(createTd($("#TextBoxStableNoNeeds").val()));

        $(currentRow).append(createBtnAction("EditFinancialMemberStatus", "DeleteFinancialMemberStatus"));
        $(tbl).append(currentRow);
        $("#btnAddFinancialMemebrStatus").removeClass("editMode");
    }


    $("#DropDownEntitlementsType").val("");
    $("#TextBoxFinancialMemberStatusId").val("");
    $("#TextBoxRecievesAmount").val("");
    $("#TextBoxRecertificationDate").val("");
    $("#TextBoxStableNoNeeds").val("");
}
function AddFinancialMemberNeeds(result) {
    var tbl = $("#FinancialMemberNeeds tbody");
    if ($("#FinancialMemberNeeds tbody tr").length <= 1 && $("#FinancialMemberNeeds tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddFinancialMemberNeeds").hasClass("editMode")) {
        if (!ValidateFinancialMemberNeeds()) return;
        let tr = $("<tr/>");
        $(tr).append(createTd($("#DropDownFinancialElementsType").val()));
        $(tr).append(createTd($("#TextBoxFinancialMemberNeedId").val()));
        $(tr).append(createTd($("#DropDownFinancialElementsType option:selected").text()));
        $(tr).append(createTd($("#TextBoxAssisstanceNeeded").val()));
        $(tr).append(createTd($("#TextBoxMemeberNeedsStableNoNeeds").val()));

        $(tr).append(createBtnAction("EditFinancialMemberNeeds", "DeleteFinancialMemberNeeds"));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#DropDownFinancialElementsType").val()));
        $(currentRow).append(createTd($("#TextBoxFinancialMemberNeedId").val()));
        $(currentRow).append(createTd($("#DropDownFinancialElementsType option:selected").text()));
        $(currentRow).append(createTd($("#TextBoxAssisstanceNeeded").val()));
        $(currentRow).append(createTd($("#TextBoxMemeberNeedsStableNoNeeds").val()));

        $(currentRow).append(createBtnAction("EditFinancialMemberNeeds", ""));
        $(tbl).append(currentRow);
        $("#btnAddFinancialMemberNeeds").removeClass("editMode");

    }


    $("#DropDownFinancialElementsType").val("");
    $("#TextBoxFinancialMemberNeedId").val("");
    $("#TextBoxAssisstanceNeeded").val("");
    $("#TextBoxMemeberNeedsStableNoNeeds").val("");

}
function AddHousingSubsidies(result) {
    var tbl = $("#HousingSubsidies tbody");
    if ($("#HousingSubsidies tbody tr").length <= 1 && $("#HousingSubsidies tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddHousingSubsidies").hasClass("editMode")) {
        if (!ValidateHousingSubsidies()) return;
        let tr = $("<tr/>");
        $(tr).append(createTd($("#DropDownHousingSubsidyType").val()));
        $(tr).append(createTd($("#TextBoxHousingSubsidyId").val()));
        $(tr).append(createTd($("#DropDownHousingSubsidyType option:selected").text()));
        $(tr).append(createTd($("#TextBoxOtherDetail").val()));
        $(tr).append(createTd($("#TextBoxRecievesDetailsCase").val()));
        $(tr).append(createTd($("#TextBoxPending").val()));

        $(tr).append(createBtnAction("EditHousingSubsidies", ""));
        $(tbl).append(tr);

    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#DropDownHousingSubsidyType").val()));
        $(currentRow).append(createTd($("#TextBoxHousingSubsidyId").val()));
        $(currentRow).append(createTd($("#DropDownHousingSubsidyType option:selected").text()));
        $(currentRow).append(createTd($("#TextBoxOtherDetail").val()));
        $(currentRow).append(createTd($("#TextBoxRecievesDetailsCase").val()));
        $(currentRow).append(createTd($("#TextBoxPending").val()));

        $(currentRow).append(createBtnAction("EditHousingSubsidies", ""));
        $(tbl).append(currentRow);
        $("#btnAddHousingSubsidies").removeClass("editMode");
    }
    $("#DropDownHousingSubsidyType").val("");
    $("#TextBoxHousingSubsidyId").val("");
    $("#TextBoxOtherDetail").val("");
    $("#TextBoxRecievesDetailsCase").val("");
    $("#TextBoxPending").val("");
}
function AddDomesticViolanceRelationship(result) {
    var tbl = $("#DomesticViolanceRelationship tbody");
    if ($("#DomesticViolanceRelationship tbody tr").length <= 1 && $("#DomesticViolanceRelationship tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddDomesticViolanceRelationship").hasClass("editMode")) {
        let tr = $("<tr/>");
        $(tr).append(createTd($("#TextBoxDomesticViolanceMemberRelationshipId").val()));
        $(tr).append(createTd($("#TextBoxName").val()));
        $(tr).append(createTd($("#TextBoxRelationship").val()));
        $(tr).append(createBtnAction("EditDomesticViolanceRelationship", ""));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#TextBoxDomesticViolanceMemberRelationshipId").val()));
        $(currentRow).append(createTd($("#TextBoxName").val()));
        $(currentRow).append(createTd($("#TextBoxRelationship").val()));
        $(currentRow).append(createBtnAction("EditDomesticViolanceRelationship", ""));
        $(tbl).append(currentRow);
        $("#btnAddDomesticViolanceRelationship").removeClass("editMode");
    }

    $("#TextBoxDomesticViolanceMemberRelationshipId").val("");
    $("#TextBoxName").val("");
    $("#TextBoxRelationship").val("");
}
function AddLegalCourtDates(result) {
    var tbl = $("#LegalCourtDates tbody");
    if ($("#LegalCourtDates tbody tr").length <= 1 && $("#LegalCourtDates tbody tr td").length <= 1) {
        tbl.html("");
    }
    if (!$("#btnAddLegalCourtDates").hasClass("editMode")) {
        let tr = $("<tr/>");
        $(tr).append(createTd($("#TextBoxLegalCourtDateId").val()));
        $(tr).append(createTd($("#TextBoxLegalDate").val()));
        $(tr).append(createTd($("#TextBoxLegalDateDetails").val()));
        $(tr).append(createBtnAction("EditLegalCourtDates", ""));
        $(tbl).append(tr);
    }
    else {
        $(currentRow).html("");
        $(currentRow).append(createTd($("#TextBoxLegalCourtDateId").val()));
        $(currentRow).append(createTd($("#TextBoxLegalDate").val()));
        $(currentRow).append(createTd($("#TextBoxLegalDateDetails").val()));
        $(currentRow).append(createBtnAction("EditLegalCourtDates", ""));
        $(tbl).append(currentRow);
        $("#btnAddLegalCourtDates").removeClass("editMode");
    }

    $("#TextBoxLegalCourtDateId").val("");
    $("#TextBoxLegalDate").val("");
    $("#TextBoxLegalDateDetails").val("");
}

function DeleteCurrentRow(object) {
    $(object).closest("tr").remove();
}
function EditMedicalDiagnosis(object) {
    currentRow = $(object).closest("tr");
    var condition = $(currentRow).find("td:eq(0)").text();
    var medicalDiagnosisId = $(currentRow).find("td:eq(1)").text();
    var latesResult = $(currentRow).find("td:eq(3)").text();
    var latesResultDate = $(currentRow).find("td:eq(4)").text();


    $("#DropDownCondition").val(condition);
    $("#TextBoxMedicalDiagnosisId").val(medicalDiagnosisId);
    $("#TextBoxLatestResult").val(latesResult);
    $("#TextBoxLastResultDate").val(latesResultDate);
    $("#btnMedicalDiagnoses").addClass("editMode");

    return false;
}

function EditMedicalMedications(object) {
    currentRow = $(object).closest("tr");
    var medicalMedicationId = $(currentRow).find("td:eq(0)").text();
    var medicationDosage = $(currentRow).find("td:eq(1)").text();


    $("#TextBoxMedicalMedicationId").val(medicalMedicationId);
    $("#TextBoxMedicationDosage").val(medicationDosage);
    $("#btnMedicalMedications").addClass("editMode");

    return false;
}

function EditMedicalHealthMedications(object) {
    currentRow = $(object).closest("tr");
    var medicalHealthMedicationId = $(currentRow).find("td:eq(0)").text();
    var medicationDosage = $(currentRow).find("td:eq(1)").text();


    $("#TextBoxMedicalHealthMedicationsId").val(medicalHealthMedicationId);
    $("#TextBoxMedicationHealthDosage").val(medicationDosage);
    $("#btnAddMedicalHealthMedications").addClass("editMode");
    return false;
}

function EditFinancialMemberStatus(object) {
    currentRow = $(object).closest("tr");
    var elementsType = $(currentRow).find("td:eq(0)").text();
    var financialMemberStatusId = $(currentRow).find("td:eq(1)").text();
    var RecievesAmount = $(currentRow).find("td:eq(3)").text();
    var recertificationDate = $(currentRow).find("td:eq(4)").text();
    var stableNoNeeds = $(currentRow).find("td:eq(5)").text();

    $("#DropDownEntitlementsType").val(elementsType);
    $("#TextBoxFinancialMemberStatusId").val(financialMemberStatusId);
    $("#TextBoxRecievesAmount").val(RecievesAmount);
    $("#TextBoxRecertificationDate").val(recertificationDate);
    $("#TextBoxStableNoNeeds").val(stableNoNeeds);
    $("#btnAddFinancialMemebrStatus").addClass("editMode");

    return false;
}

function EditFinancialMemberNeeds(object) {
    var currentRow = $(object).closest("tr");
    var financialElementsType = $(currentRow).find("td:eq(0)").text();
    var financialMemberNeedId = $(currentRow).find("td:eq(1)").text();
    var assisstanceNeeded = $(currentRow).find("td:eq(3)").text();
    var memeberNeedsStableNoNeeds = $(currentRow).find("td:eq(4)").text();
    $("#DropDownFinancialElementsType").val(financialElementsType);
    $("#TextBoxFinancialMemberNeedId").val(financialMemberNeedId);
    $("#TextBoxAssisstanceNeeded").val(assisstanceNeeded);
    $("#TextBoxMemeberNeedsStableNoNeeds").val(memeberNeedsStableNoNeeds);
    $("#btnAddFinancialMemberNeeds").addClass("editMode");
}
function EditHousingSubsidies(object) {
    currentRow = $(object).closest("tr");
    var housingSubsidyId = $(currentRow).find("td:eq(0)").text();
    var financialMemberNeedId = $(currentRow).find("td:eq(1)").text();
    var otherDetail = $(currentRow).find("td:eq(3)").text();
    var recievesDetailsCase = $(currentRow).find("td:eq(4)").text();
    var pending = $(currentRow).find("td:eq(4)").text();

    if (housingSubsidyId == "4") {
        $("#otherDetailsParent").removeClass("hidden");
    }
    else {
        $("#otherDetailsParent").addClass("hidden");
    }
    $("#DropDownHousingSubsidyType").val(housingSubsidyId);
    $("#TextBoxHousingSubsidyId").val(financialMemberNeedId);
    $("#TextBoxOtherDetail").val(otherDetail);
    $("#TextBoxRecievesDetailsCase").val(recievesDetailsCase);
    $("#TextBoxPending").val(pending);
    $("#btnAddHousingSubsidies").addClass("editMode");
}
function EditDomesticViolanceRelationship(object) {
    var currentRow = $(object).closest("tr");
    var domesticViolanceMemberRelationshipId = $(currentRow).find("td:eq(0)").text();
    var name = $(currentRow).find("td:eq(1)").text();
    var relationship = $(currentRow).find("td:eq(2)").text();

    $("#TextBoxDomesticViolanceMemberRelationshipId").val(domesticViolanceMemberRelationshipId);
    $("#TextBoxName").val(name);
    $("#TextBoxRelationship").val(relationship);
    $("#btnAddDomesticViolanceRelationship").addClass("editMode");
}

function EditLegalCourtDates(object) {
    currentRow = $(object).closest("tr");
    var legalCourtDateId = $(currentRow).find("td:eq(0)").text();
    var legalDate = $(currentRow).find("td:eq(1)").text();
    var legalDateDetails = $(currentRow).find("td:eq(2)").text();

    $("#TextBoxLegalCourtDateId").val(legalCourtDateId);
    $("#TextBoxLegalDate").val(legalDate);
    $("#TextBoxLegalDateDetails").val(legalDateDetails);
    $("#btnAddLegalCourtDates").addClass("editMode");
    return false;
}

function ValidateMemberStatus() {
    var checked = null;
    var selectedText = $("#DropDownEntitlementsType").find("option:selected").text();
    $("#FinancailMemberStatus tbody tr").each(function () {
        var texttocheck = $(this).find("td:eq(2)").text().trim();
       
        if (texttocheck == selectedText) {
            var errMsg = "option already exists in the list";
            showErrorMessage(errMsg);
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}
function ValidateFinancialMemberNeeds() {
    var checked = null;
    var selectedText = $("#DropDownFinancialElementsType").find("option:selected").text();
    $("#FinancialMemberNeeds tbody tr").each(function () {
        var texttocheck = $(this).find("td:eq(2)").text().trim();

        if (texttocheck == selectedText) {
            var errMsg = "option already exists in the list";
            showErrorMessage(errMsg);
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}
function ValidateHousingSubsidies() {
    var checked = null;
    var selectedText = $("#DropDownHousingSubsidyType").find("option:selected").text();
    $("#HousingSubsidies tbody tr").each(function () {

        var texttocheck = $(this).find("td:eq(2)").text().trim();
        if (texttocheck == selectedText) {
            var errMsg = "option already exists in the list";
            showErrorMessage(errMsg);
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}
//#endregion 








//comprehensive assessments
function collapseSection(section) {
    $('.' + section).click();
}


function ShowHideFields(current, field, type, extraClass) {
    if (type == 'radio') {
        if ($(current).val() == 1) {
            $('.' + field).removeAttr('hidden');
            $('.' + field).show();
        } else {

            $('.' + field).children().children().val("");
            $('.' + field).hide();

            if (extraClass == 'ExperiencedTrauma') {
                $('.' + extraClass).prop('checked', false);
            }
            if (extraClass == 'CurrentHousing') {
                $('.' + extraClass).prop('checked', false);
                $('.currentLiving').val("");
                $('.RentArrearsSpecifyAmount').hide();
                $('.OptionsDetail').hide();
                $('.OtherSpecify').hide();
            }
        }
    }
    else if (type == 'N') {
        if ($(current).val() == 0) {
            $('.' + field).removeAttr('hidden');
            $('.' + field).show();
        } else {
            $('.' + field).children().children().val("");
            $('.' + field).hide();
        }
    }
    else if (field == 'noneAbove') {
        if ($('.' + field).is(':checked')) {
            $('.' + field).prop('checked', false);
            $('.' + extraClass).show();
        }
        else {
            $('.' + extraClass).removeAttr('hidden');
        }
    }
    else if (type == 'check') {
        if ($(current).is(':checked')) {
            $('.' + field).hide();
            $('.' + field).children().children().val("");
            if ($('.' + extraClass).is(':checked') && extraClass == 'NoneOfTheAbove') {
                $('.' + extraClass).prop('checked', false);
            };
        } else {
            $('.' + field).show();
        }
    }
    else {
        if ($(current).is(':checked')) {
            $('.' + field).removeAttr('hidden');
            $('.' + field).show();
            if (extraClass == 'Housing') {

                var data = ["HouseApartment", "FriendRelativeHome", "ImmediateGuardian", "RemainRespiteCare", "HalfwayHouse", "HomelessWithOthers", "HomelessRegistered", "HousingDetail"]
                for (i = 0; i <= data.length; i++) {
                    var className = data[i];
                    if (className != field) {
                        $('.' + className).hide();
                    }
                    if (className == 'HouseApartment') {
                        $('.houseRadio').prop('checked', false);
                    };
                    $('.' + className).children().children().val("");
                }
            }
        }
        else {
            $('.' + field).children().children().val("");
            $('.' + field).hide();
        }
    }
}


function Addscore(fieldName, filldata) {
    var sum = 0;

    var $checkboxes = $('.substanceScoreCheck');
    var countCheckedCheckboxes = $checkboxes.filter(':checked').length;
    //if (fieldName == 'substanceScoreCheck') {
    $('.substanceScoreCheck').each(function () {
        if (countCheckedCheckboxes > 0) {
            sum = 1;
        }
    });
    $('.' + fieldName).each(function () {
        if ($(this).is(':checked')) {
            sum += Number($(this).val());
        }
    });
    $('.' + filldata).val(sum);
}

//#region versioning
function CreatePublishVersion() {
    $.ajax({
        type: "POST",
        data: { TabName: "PublishAssessment", ComprehensiveAssessmentId: $("#TextBoxComprehensiveAssessmentId").val(), AssessmentVersioningId: $("#TextBoxAssessmentVersioningId").val(), ReportedBy: reportedBy },
        url: GetAPIEndPoints("HANDLEASSESSMNETVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {

                location.href = "list-page.html?ClientID=" + clientId;
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function SaveDraft() {
    $.ajax({
        type: "POST",
        data: { TabName: "CreateNewVersionAssessment", ComprehensiveAssessmentId: $("#TextBoxComprehensiveAssessmentId").val(), AssessmentVersioningId: $("#TextBoxAssessmentVersioningId").val(), ReportedBy: reportedBy },
        url: GetAPIEndPoints("HANDLEASSESSMNETVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {

                NewVersioncreated(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function NewVersioncreated(result) {
    if (result.Success == true) {
        if (result.AllTabsComprehensiveAssessment[0] != undefined) {
            showRecordSaved("New version created successfully");
            FillMasterChildPrimaryKeys(result);
            ShowHideSectionStatus(result);
            ShowHideButtons();
            BindChildTables(result);
            changeURL(result);
        }
    }

    else {
        showErrorMessage(result.Message)
    }
}
function FillMasterChildPrimaryKeys(result) {
    if (result.AllTabsComprehensiveAssessment[0] != undefined) {




        $("#TextBoxDocumentStatus").text(result.AllTabsComprehensiveAssessment[0].DocumentStatus);
        $("#TextBoxDocumentVersion").text(result.AllTabsComprehensiveAssessment[0].DocumentVersion);


        $("#TextBoxComprehensiveAssessmentId").val(result.AllTabsComprehensiveAssessment[0].ComprehensiveAssessmentId);
        $("#TextBoxAssessmentVersioningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentVersioningId);
        $("#TextBoxAssessmentMedicalId").val(result.AllTabsComprehensiveAssessment[0].AssessmentMedicalId);
        $("#TextBoxAssessmentMedicalHelathId").val(result.AllTabsComprehensiveAssessment[0].AssessmentMedicalHelathId);
        $("#TextBoxAssessmentFinancialId").val(result.AllTabsComprehensiveAssessment[0].AssessmentFinancialId);
        $("#TextBoxAssessmentHousingId").val(result.AllTabsComprehensiveAssessment[0].AssessmentHousingId);
        $("#TextBoxAssessmentDomesticViolanceId").val(result.AllTabsComprehensiveAssessment[0].AssessmentDomesticViolanceId);
        $("#TextBoxAssessmentLegalId").val(result.AllTabsComprehensiveAssessment[0].AssessmentLegalId);
        $("#TextBoxAssessmentAreasSafeguardReviewId").val(result.AllTabsComprehensiveAssessment[0].AssessmentAreasSafeguardReviewId);
        $("#TextBoxAssessmentIndependentLivingSkillsId").val(result.AllTabsComprehensiveAssessment[0].AssessmentIndependentLivingSkillsId);
        $("#TextBoxAssessmentBehavioralSupportServicesId").val(result.AllTabsComprehensiveAssessment[0].AssessmentBehavioralSupportServicesId);
        $("#TextBoxAssessmentEducationalVocationalStatusId").val(result.AllTabsComprehensiveAssessment[0].AssessmentEducationalVocationalStatusId);
        $("#TextBoxAssessmentSelfDirectedServicesId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSelfDirectedServicesId);
        $("#TextBoxAssessmentTransitionPlanningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentTransitionPlanningId);
        $("#TextBoxAssessmentGeneralId").val(result.AllTabsComprehensiveAssessment[0].AssessmentGeneralId);
        $("#TextBoxAssessmentSafetyRiskId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSafetyRiskId);
        $("#TextBoxAssessmentDepressionScreeningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentDepressionScreeningId);
        $("#TextBoxAssessmentSubstanceAbuseScreeningId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSubstanceAbuseScreeningId);
        $("#TextBoxAssessmentSafetyPlanId").val(result.AllTabsComprehensiveAssessment[0].AssessmentSafetyPlanId);
    }
    
}
function ShowHideButtons() {
    $("#btnSaveAsNew").addClass("hidden");
    $("#btnPrintPDf").show();
    $("#btnPublishVersion").show();
    $(".btnCommon").show();
    $(".btnCommon").text("Edit");
    $(".btnChildTbales").prop("disabled", false);
    $('.masterSection .comprehensiveAssessment').attr("disabled", true);
    $('.section1 .form-control').prop("disabled", true);
    $('.mentalHealth .form-control').prop("disabled", true);
    $('.financialSection .form-control').prop("disabled", true);
    $('.housingSecton .form-control').prop("disabled", true);
    $('.domesticViolence .form-control').prop("disabled", true);
    $('.generalLegal .form-control').prop("disabled", true);
    $('.safeguardReview .form-control').attr("disabled", true);
    $('.livingSkills .form-control').attr("disabled", true);
    $('.supportServices .form-control').attr("disabled", true);
    $('.vocationalStatus .form-control').attr("disabled", true);
    $('.directedServices .form-control').attr("disabled", true);
    $('.transitionPlanning .form-control').attr("disabled", true);
    $('.generalSection .form-control').attr("disabled", true);
    $('.riskAssessment .form-control').attr("disabled", true);
    $('.depressionScreening .form-control').attr("disabled", true);
    $('.abuseScreening .form-control').attr("disabled", true);
    $('.safetyPlan .form-control').attr("disabled", true);

}
function ShowHideSectionStatus(result) {
    if (result.AllTabsComprehensiveAssessment[0] != undefined) {
        //var parseJson = result.AllTabsComprehensiveAssessment[0];
        if (result.AllTabsComprehensiveAssessment[0].MedicalStatus == "Start") {
            $(".section1").show();
            $("#statusCompletedMedical").hide();
            $("#statusInprogressMedical").hide();
            $("#statusStartMedical").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].MedicalStatus == "Completed") {
                $("#statusCompletedMedical").show();
                $("#statusStartMedical").hide();
                $("#statusInprogressMedical").hide();
            }
            else {
                $("#statusCompletedMedical").hide();
                $("#statusStartMedical").hide();
                $("#statusInprogressMedical").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].MedicalHealthStatus == "Start") {
            $(".mentalHealth").show();
            $("#statusCompletedMedicalHealth").hide();
            $("#statusInprogressMedicalHealth").hide();
            $("#statusStartMedicalHealth").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].MedicalHealthStatus == "Completed") {
                $("#statusCompletedMedicalHealth").show();
                $("#statusStartMedicalHealth").hide();
                $("#statusInprogressMedicalHealth").hide();
            }
            else {
                $("#statusCompletedMedicalHealth").hide();
                $("#statusStartMedicalHealth").hide();
                $("#statusInprogressMedicalHealth").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].FinancialStatus == "Start") {
            $(".financialSection").show();
            $("#statusCompletedFinancial").hide();
            $("#statusInprogressFinancial").hide();
            $("#statusStartFinancial").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].FinancialStatus == "Completed") {
                $("#statusStartFinancial").hide();
                $("#statusCompletedFinancial").show();
                $("#statusInprogressFinancial").hide();
            }
            else {
                $("#statusCompletedFinancial").hide();
                $("#statusStartFinancial").hide();
                $("#statusInprogressFinancial").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].HousingStatus == "Start") {
            $(".housingSecton").show();
            $("#statusCompletedHousing").hide();
            $("#statusInprogressHousing").hide();
            $("#statusStartHousing").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].HousingStatus == "Completed") {
                $("#statusCompletedHousing").show();
                $("#statusStartHousing").hide();
                $("#statusInprogressHousing").hide();
            }
            else {
                $("#statusCompletedHousing").hide();
                $("#statusStartHousing").hide();
                $("#statusInprogressHousing").show();
            }
        }




        if (result.AllTabsComprehensiveAssessment[0].DomesticViolanceStatus == "Start") {
            $(".domesticViolence").show();
            $("#statusCompletedDomesticViolance").hide();
            $("#statusInprogressDomesticViolance").hide();
            $("#statusStartDomesticViolance").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].DomesticViolanceStatus == "Completed") {
                $("#statusCompletedDomesticViolance").show();
                $("#statusStartDomesticViolance").hide();
                $("#statusInprogressDomesticViolance").hide();
            }
            else {
                $("#statusCompletedDomesticViolance").hide();
                $("#statusStartDomesticViolance").hide();
                $("#statusInprogressDomesticViolance").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].LegalStatus == "Start") {
            $(".generalLegal").show();
            $("#statusCompletedLegal").hide();
            $("#statusInprogressLegal").hide();
            $("#statusStartLegal").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].LegalStatus == "Completed") {
                $("#statusCompletedLegal").show();
                $("#statusStartLegal").hide();
                $("#statusInprogressLegal").hide();
            }
            else {
                $("#statusCompletedLegal").hide();
                $("#statusStartLegal").hide();
                $("#statusInprogressLegal").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].SafegaurdReviewStatus == "Start") {
            $(".safeguardReview").show();
            $("#statusCompletedSafeguardReview").hide();
            $("#statusInprogressSafeguardReview").hide();
            $("#statusStartSafeguardReview").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].SafegaurdReviewStatus == "Completed") {
                $("#statusCompletedSafeguardReview").show();
                $("#statusStartSafeguardReview").hide();
                $("#statusInprogressSafeguardReview").hide();
            }
            else {
                $("#statusCompletedSafeguardReview").hide();
                $("#statusStartSafeguardReview").hide();
                $("#statusInprogressSafeguardReview").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].IndependentSkillsStatus == "Start") {
            $(".livingSkills").show();
            $("#statusCompletedLivingSkills").hide();
            $("#statusInprogressLivingSkills").hide();
            $("#statusStartLivingSkills").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].IndependentSkillsStatus == "Completed") {
                $("#statusCompletedLivingSkills").show();
                $("#statusStartLivingSkills").hide();
                $("#statusInprogressLivingSkills").hide();
            }
            else {
                $("#statusCompletedLivingSkills").hide();
                $("#statusStartLivingSkills").hide();
                $("#statusInprogressLivingSkills").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].BehavioralSupoortStatus == "Start") {
            $(".supportServices").show();
            $("#statusCompletedBehavioralSupport").hide();
            $("#statusInprogressBehavioralSupport").hide();
            $("#statusStartBehavioralSupport").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].BehavioralSupoortStatus == "Completed") {
                $("#statusCompletedBehavioralSupport").show();
                $("#statusStartBehavioralSupport").hide();
                $("#statusInprogressBehavioralSupport").hide();
            }
            else {
                $("#statusCompletedBehavioralSupport").hide();
                $("#statusStartBehavioralSupport").hide();
                $("#statusInprogressBehavioralSupport").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].EducationalVocationalStatus == "Start") {
            $(".vocationalStatus").show();
            $("#statusCompletedVocational").hide();
            $("#statusInprogressVocational").hide();
            $("#statusStartVocational").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].EducationalVocationalStatus == "Completed") {
                $("#statusCompletedVocational").show();
                $("#statusStartVocational").hide();
                $("#statusInprogressVocational").hide();
            }
            else {
                $("#statusCompletedVocational").hide();
                $("#statusStartVocational").hide();
                $("#statusInprogressVocational").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].SelfDirectedStatus == "Start") {
            $(".directedServices").show();
            $("#statusCompletedSelfDirected").hide();
            $("#statusInprogressSelfDirected").hide();
            $("#statusStartSelfDirected").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].SelfDirectedStatus == "Completed") {
                $("#statusCompletedSelfDirected").show();
                $("#statusStartSelfDirected").hide();
                $("#statusInprogressSelfDirected").hide();
            }
            else {
                $("#statusCompletedSelfDirected").hide();
                $("#statusStartSelfDirected").hide();
                $("#statusInprogressSelfDirected").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].TransitionPlanningStatus == "Start") {
            $(".transitionPlanning").show();
            $("#statusCompletedTransitionPlan").hide();
            $("#statusInprogressTransitionPlan").hide();
            $("#statusStartTransitionPlan").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].TransitionPlanningStatus == "Completed") {
                $("#statusCompletedTransitionPlan").show();
                $("#statusStartTransitionPlan").hide();
                $("#statusInprogressTransitionPlan").hide();
            }
            else {
                $("#statusCompletedTransitionPlan").hide();
                $("#statusStartTransitionPlan").hide();
                $("#statusInprogressTransitionPlan").show();
            }
        }



        if (result.AllTabsComprehensiveAssessment[0].GeneralStatus == "Start") {
            $(".generalSection").show();
            $("#statusCompletedGeneral").hide();
            $("#statusInprogressGeneral").hide();
            $("#statusStartGeneral").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].GeneralStatus == "Completed") {
                $("#statusCompletedGeneral").show();
                $("#statusStartGeneral").hide();
                $("#statusInprogressGeneral").hide();
            }
            else {
                $("#statusCompletedGeneral").hide();
                $("#statusStartGeneral").hide();
                $("#statusInprogressGeneral").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].SafetyRiskStatus == "Start") {
            $(".riskAssessment").show();
            $("#statusCompletedSafetyRisk").hide();
            $("#statusInprogressSafetyRisk").hide();
            $("#statusStartSafetyRisk").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].SafetyRiskStatus == "Completed") {
                $("#statusCompletedSafetyRisk").show();
                $("#statusStartSafetyRisk").hide();
                $("#statusInprogressSafetyRisk").hide();
            }
            else {
                $("#statusCompletedSafetyRisk").hide();
                $("#statusStartSafetyRisk").hide();
                $("#statusInprogressSafetyRisk").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].DepressionScreeningStatus == "Start") {
            $(".depressionScreening").show();
            $("#statusCompletedDepression").hide();
            $("#statusInprogressDepression").hide();
            $("#statusStartDepression").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].DepressionScreeningStatus == "Completed") {
                $("#statusCompletedDepression").show();
                $("#statusStartDepression").hide();
                $("#statusInprogressDepression").hide();
            }
            else {
                $("#statusCompletedDepression").hide();
                $("#statusStartDepression").hide();
                $("#statusInprogressDepression").show();
            }
        }

        if (result.AllTabsComprehensiveAssessment[0].SubstanceAbuseStatus == "Start") {
            $(".abuseScreening").show();
            $("#statusCompletedSubstance").hide();
            $("#statusInprogressSubstance").hide();
            $("#statusStartSubstance").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].SubstanceAbuseStatus == "Completed") {
                $("#statusCompletedSubstance").show();
                $("#statusStartSubstance").hide();
                $("#statusInprogressSubstance").hide();
            }
            else {
                $("#statusCompletedSubstance").hide();
                $("#statusStartSubstance").hide();
                $("#statusInprogressSubstance").show();
            }
        }


        if (result.AllTabsComprehensiveAssessment[0].SafetyPlanStatus == "Start") {
            $(".safetyPlan").show();
            $("#statusCompletedSafetyPlan").hide();
            $("#statusInprogressSafetyPlan").hide();
            $("#statusStartSafetyPlan").show();
        }
        else {
            if (result.AllTabsComprehensiveAssessment[0].SafetyPlanStatus == "Completed") {
                $("#statusCompletedSafetyPlan").show();
                $("#statusStartSafetyPlan").hide();
                $("#statusInprogressSafetyPlan").hide();
            }
            else {
                $("#statusCompletedSafetyPlan").hide();
                $("#statusStartSafetyPlan").hide();
                $("#statusInprogressSafetyPlan").show();
            }
        }

    }
}
function BindChildTables(result) {
    //Medical Section tables
    if (result.MedicalDiagnosisDetails != undefined) {
        var tbl = $("#MedicalDiagnosis tbody");
        tbl.html("");
        for (var i = 0; i < result.MedicalDiagnosisDetails.length; i++) {
            // let base = JSON.parse(result.MedicalDiagnosis)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].Condition));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].MedicalDiagnosisId));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].ConditionText));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].LatestResult));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].LastResultDate));

            $(tr).append(createBtnAction("EditMedicalDiagnosis", ""));
            $(tbl).append(tr);
        }
    }
    if (result.MedicalMedicationDetails != undefined) {
        var tbl = $("#MedicalMedications tbody");
        tbl.html("");
        for (var i = 0; i < result.MedicalMedicationDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONMedicalMedications)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.MedicalMedicationDetails[i].MedicalMedicationId));
            $(tr).append(createTd(result.MedicalMedicationDetails[i].MedicationDosage));
            $(tr).append(createBtnAction("EditMedicalMedications", ""));
            $(tbl).append(tr);
        }
    }
    // Medical health tables

    if (result.MedicalHealthMedicationsDetails != undefined) {
        var tbl = $("#MedicalHealthMedications tbody");
        tbl.html("");
        for (var i = 0; i < result.MedicalHealthMedicationsDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONMedicalHealthMedications)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.MedicalHealthMedicationsDetails[i].MedicalMedicationId));
            $(tr).append(createTd(result.MedicalHealthMedicationsDetails[i].MedicationDosage));
            $(tr).append(createBtnAction("EditMedicalHealthMedications", ""));
            $(tbl).append(tr);
        }

    }

    // Financial Section tables
    if (result.FinancialMemberStatusDetails != undefined) {
        var tbl = $("#FinancailMemberStatus tbody");
        tbl.html("");
        for (var i = 0; i < result.FinancialMemberStatusDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONFinancialMemberStatus)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].EntitlementsType));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].FinancialMemberStatusId));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].Entitlements));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].RecievesAmount));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].RecertificationDate));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].StableNoNeeds));
            $(tr).append(createBtnAction("EditFinancialMemberStatus", ""));
            $(tbl).append(tr);
        }

    }

    if (result.FinancialMemberNeedDetails != undefined) {
        var tbl = $("#FinancialMemberNeeds tbody");
        tbl.html("");
        for (var i = 0; i < result.FinancialMemberStatusDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONFinancialMemberNeeds)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].FinancialElementsType));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].FinancialMemberNeedId));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].FinancialElement));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].AssisstanceNeeded));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].StableNoNeeds));
            $(tr).append(createBtnAction("EditFinancialMemberNeeds", ""));
            $(tbl).append(tr);
        }
    }
    //Housing section 
    if (result.HousingSubsidyDetails != undefined) {
        var tbl = $("#HousingSubsidies tbody");
        tbl.html("");
        for (var i = 0; i < result.HousingSubsidyDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONHousingSubsidies)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidyType));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidyId));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidy));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].OtherDetail));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].RecievesDetailsCase));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].Pending));
            $(tr).append(createBtnAction("EditHousingSubsidies", ""));
            $(tbl).append(tr);
        }

    }

    //Domestic violance section
    if (result.DomesticViolanceMemberRelationshipDetails != undefined) {
        var tbl = $("#DomesticViolanceRelationship tbody");
        tbl.html("");
        for (var i = 0; i < result.DomesticViolanceMemberRelationshipDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONDomesticViolanceRelationship)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].DomesticViolanceMemberRelationshipId));
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].Name));
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].Relationship));
            $(tr).append(createBtnAction("EditDomesticViolanceRelationship", ""));
            $(tbl).append(tr);
        }

    }
    //legal section 
    if (result.LegalCourtDateDetails != undefined) {
        var tbl = $("#LegalCourtDates tbody");
        tbl.html("");
        for (var i = 0; i < result.LegalCourtDateDetails.length; i++) {
            //let base = JSON.parse(result.AllTabsComprehensiveAssessment[0].JSONLegalCourtDates)[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalCourtDateId));
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalDate));
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalDateDetails));
            $(tr).append(createBtnAction("EditLegalCourtDates", ""));
            $(tbl).append(tr);
        }

    }
}
function changeURL(result) {

    var currentURL = $(location).attr("href");
    if (currentURL.indexOf('?') > -1) {
        var newURL = new URL(currentURL),
            changeAssessmentId = newURL.searchParams.set("ComprehensiveAssessmentId", result.AllTabsComprehensiveAssessment[0].ComprehensiveAssessmentId),
            changeVersionId = newURL.searchParams.set("AssessmentVersioningId", result.AllTabsComprehensiveAssessment[0].AssessmentVersioningId);
        history.pushState(null, 'Comprehensive Assessment', newURL.href);
    }
       
}
//#endregion
function DownloadPDFAssessmentPlan() {
    var data = {
        TabName: "PrintComprehensiveAssessment", ComprehensiveAssessmentId: $("#TextBoxComprehensiveAssessmentId").val(), AssessmentVersioningId: $("#TextBoxAssessmentVersioningId").val(), ReportedBy: reportedBy
    };

    fetch(GetAPIEndPoints("GETASSESSMENTPDFTEMPLATE"), {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5"
        },
    })
        .then(response => response.blob())
        .then(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "comprehensvie_assessment_1_" + $("#TextBoxComprehensiveAssessmentId").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })
}



//#region binding the sections
function ManageComprehensiveAssessment(comprehensiveAssessmentId) {
    $.ajax({
        type: "POST",
        data: { TabName: "AllComprehensiveAssessmentDetails", ComprehensiveAssessmentId: comprehensiveAssessmentId },
        url: GetAPIEndPoints("GETCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {


                setTimeout(function () {
                    $(".loader").fadeOut("slow");
                    fillAllComprehensiveAssessmentSection(result);
                }, 5000);

            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}


function fillAllComprehensiveAssessmentSection(result) {


    ComprehensiveAssessmentDetails(result);

    if (result.ComprehensiveAssessmentDetails[0] != undefined) {
        MedicalMedicationDetails(result);
        MedicalHealthMedicationsDetails(result);
        MedicalDiagnosisDetails(result);
        LegalCourtDateDetails(result);
        HousingSubsidyDetails(result);
        FinancialMemberStatusDetails(result);
        FinancialMemberNeedDetails(result);
        DomesticViolanceMemberRelationshipDetails(result);



        TransitionPlanningDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        SubstanceAbuseScreeningDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        SelfDirectedServicesDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        SafetyRiskDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        SafetyPlanDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        MedicalHelathDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        MedicalDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        LegalDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        IndependentLivingSkillsDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        HousingDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        GeneralDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        FinancialDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        EducationalVocationalStatusDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        DomesticViolanceDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        DepressionScreeningDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        BehavioralSupportServicesDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);
        AreasSafeguardReviewDetails(result, result.ComprehensiveAssessmentDetails[0].DocumentStatus);

        ShowHideButtonsAndSections(result.ComprehensiveAssessmentDetails[0].DocumentStatus, result.ComprehensiveAssessmentDetails[0].LatestVersion);
    }
    else {
        DisableSaveButtonChildSection();
        $("#DropDownClientId").attr("disabled", false);
    }
}

function ComprehensiveAssessmentDetails(result) {
    if (result.ComprehensiveAssessmentDetails[0] != undefined) {
        $("#TextBoxComprehensiveAssessmentId").val(result.ComprehensiveAssessmentDetails[0].ComprehensiveAssessmentId);
        $("#TextBoxAssessmentVersioningId").val(result.ComprehensiveAssessmentDetails[0].AssessmentVersioningId);
        clientId = result.ComprehensiveAssessmentDetails[0].ClientId;
        $("#DropDownClientId").select2('val', [result.ComprehensiveAssessmentDetails[0].ClientId]);
        $("#TextBoxDateOfBirth").val(result.ComprehensiveAssessmentDetails[0].DateOfBirth);
        $("#TextBoxAge").val(result.ComprehensiveAssessmentDetails[0].Age);
        $("#TextBoxAddressLine1").val(result.ComprehensiveAssessmentDetails[0].AddressLine1);
        $("#TextBoxAddressLine2").val(result.ComprehensiveAssessmentDetails[0].AddressLine2);
        $("#TextBoxCity").val(result.ComprehensiveAssessmentDetails[0].City);
        $("#TextBoxState").val(result.ComprehensiveAssessmentDetails[0].State);
        $("#TextBoxZipCode").val(result.ComprehensiveAssessmentDetails[0].ZipCode);
        $("#TextBoxPhoneNumber").val(result.ComprehensiveAssessmentDetails[0].PhoneNumber);
        $("#TextBoxDateOfAssessment").val(result.ComprehensiveAssessmentDetails[0].DateOfAssessment);
        $("#TextBoxRelationshipStatus").val(result.ComprehensiveAssessmentDetails[0].RelationshipStatus);
        $("#TextBoxGender").val(result.ComprehensiveAssessmentDetails[0].Gender);
        $("#TextBoxSexualOrientation").val(result.ComprehensiveAssessmentDetails[0].SexualOrientation);
        $("#TextBoxEthnicity").val(result.ComprehensiveAssessmentDetails[0].Ethnicity);
        $("#TextBoxRace").val(result.ComprehensiveAssessmentDetails[0].Race);
        $("#TextBoxLanguagesSpoken").val(result.ComprehensiveAssessmentDetails[0].LanguagesSpoken);
        $("#TextBoxReading").val(result.ComprehensiveAssessmentDetails[0].Reading);
        $("#TextBoxWriting").val(result.ComprehensiveAssessmentDetails[0].Writing);
        $("#TextBoxSupportNeeded").val(result.ComprehensiveAssessmentDetails[0].SupportNeeded);
        $("#TextBoxMedicaid_Seq").val(result.ComprehensiveAssessmentDetails[0].Medicaid_Seq);
        $("#TextBoxMCO").val(result.ComprehensiveAssessmentDetails[0].MCO);
        $("#TextBoxVerified").val(result.ComprehensiveAssessmentDetails[0].Verified);
        $("#TextBoxSS").val(result.ComprehensiveAssessmentDetails[0].SS);
        $("input[name='RadioReachedBy'][value = " + result.ComprehensiveAssessmentDetails[0].ReachedBy+ "]").prop('checked', true);
        $("#TextBoxDocumentVersion").text(result.ComprehensiveAssessmentDetails[0].DocumentVersion);
        $("#TextBoxDocumentStatus").text(result.ComprehensiveAssessmentDetails[0].DocumentStatus);

    }
}
function MedicalMedicationDetails(result) {
    if (result.MedicalMedicationDetails != undefined) {

        var tbl = $("#MedicalMedications tbody");

        tbl.html("");

        for (var i = 0; i < result.MedicalMedicationDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.MedicalMedicationDetails[i].MedicalMedicationId));
            $(tr).append(createTd(result.MedicalMedicationDetails[i].MedicationDosage));
            $(tr).append(createBtnAction("EditMedicalMedications", ""));
            $(tbl).append(tr);
        }
    }
}
function MedicalHealthMedicationsDetails(result) {
    if (result.MedicalHealthMedicationsDetails != undefined) {


        var tbl = $("#MedicalHealthMedications tbody");
        tbl.html("");

        for (var i = 0; i < result.MedicalHealthMedicationsDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.MedicalHealthMedicationsDetails[i].MedicalHealthMedicationsId));
            $(tr).append(createTd(result.MedicalHealthMedicationsDetails[i].MedicationDosage));
            $(tr).append(createBtnAction("EditMedicalHealthMedications", ""));
            $(tbl).append(tr);
        }
    }
}
function MedicalDiagnosisDetails(result) {
    if (result.MedicalDiagnosisDetails != undefined) {


        var tbl = $("#MedicalDiagnosis tbody");
        tbl.html("");
        for (var i = 0; i < result.MedicalDiagnosisDetails.length; i++) {
            let tr = $("<tr/>");

            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].Condition));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].MedicalDiagnosisId));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].ConditionText));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].LatestResult));
            $(tr).append(createTd(result.MedicalDiagnosisDetails[i].LastResultDate));

            $(tr).append(createBtnAction("EditMedicalDiagnosis", ""));
            $(tbl).append(tr);
        }

    }
}
function LegalCourtDateDetails(result) {
    if (result.LegalCourtDateDetails != undefined) {
        var tbl = $("#LegalCourtDates tbody");
            tbl.html("");        
        for (var i = 0; i < result.LegalCourtDateDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalCourtDateId));
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalDate));
            $(tr).append(createTd(result.LegalCourtDateDetails[i].LegalDateDetails));
            $(tr).append(createBtnAction("EditLegalCourtDates", ""));
            $(tbl).append(tr);
        }
    }
}
function HousingSubsidyDetails(result) {
    if (result.HousingSubsidyDetails != undefined) {


        var tbl = $("#HousingSubsidies tbody");
        tbl.html("");

        for (var i = 0; i < result.HousingSubsidyDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidyType));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidyId));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].HousingSubsidy));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].OtherDetail));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].RecievesDetailsCase));
            $(tr).append(createTd(result.HousingSubsidyDetails[i].Pending));

            $(tr).append(createBtnAction("EditHousingSubsidies", ""));
            $(tbl).append(tr);

        }
    }
}
function FinancialMemberStatusDetails(result) {
    if (result.FinancialMemberStatusDetails != undefined) {


        var tbl = $("#FinancailMemberStatus tbody");
        tbl.html("");
        for (var i = 0; i < result.FinancialMemberStatusDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].EntitlementsType));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].FinancialMemberStatusId));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].Entitlements));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].RecievesAmount));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].RecertificationDate));
            $(tr).append(createTd(result.FinancialMemberStatusDetails[i].StableNoNeeds));
            $(tr).append(createBtnAction("EditFinancialMemberStatus", ""));
            $(tbl).append(tr);
        }
    }
}
function FinancialMemberNeedDetails(result) {
    if (result.FinancialMemberNeedDetails != undefined) {


        var tbl = $("#FinancialMemberNeeds tbody");
        tbl.html("");
        for (var i = 0; i < result.FinancialMemberNeedDetails.length; i++) {

            let tr = $("<tr/>");
            $(tr).append(createTd(result.FinancialMemberNeedDetails[i].FinancialElementsType));
            $(tr).append(createTd(result.FinancialMemberNeedDetails[i].FinancialMemberNeedId));
            $(tr).append(createTd(result.FinancialMemberNeedDetails[i].FinancialElement));
            $(tr).append(createTd(result.FinancialMemberNeedDetails[i].AssisstanceNeeded));
            $(tr).append(createTd(result.FinancialMemberNeedDetails[i].StableNoNeeds));
            $(tr).append(createBtnAction("EditFinancialMemberNeeds", ""));
            $(tbl).append(tr);
        }
    }
}
function DomesticViolanceMemberRelationshipDetails(result) {
    if (result.DomesticViolanceMemberRelationshipDetails != undefined) {


        var tbl = $("#DomesticViolanceRelationship tbody");
        tbl.html("");

        for (var i = 0; i < result.DomesticViolanceMemberRelationshipDetails.length; i++) {
            let tr = $("<tr/>");
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].DomesticViolanceMemberRelationshipId));
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].Name));
            $(tr).append(createTd(result.DomesticViolanceMemberRelationshipDetails[i].Relationship));
            $(tr).append(createBtnAction("EditDomesticViolanceRelationship", ""));
            $(tbl).append(tr);
        }
    }
}




function TransitionPlanningDetails(result, status) {
    if (result.TransitionPlanningDetails[0] != undefined) {
        $("#TextBoxAssessmentTransitionPlanningId").val(result.TransitionPlanningDetails[0].AssessmentTransitionPlanningId);

        if (result.TransitionPlanningDetails[0].Vocational == true) {
            $("input[name=RadioVocational][value=" + 1 + "]").prop('checked', true);
            $(".VocationalRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].Vocational == false) {
            $("input[name=RadioVocational][value=" +0 + "]").prop('checked', true);
        }
        $("#TextBoxVocationalDetails").val(result.TransitionPlanningDetails[0].VocationalDetails);
        if (result.TransitionPlanningDetails[0].PrevocationalSkills == true) {
            $("input[name=RadioPrevocationalSkills][value=" + 1 + "]").prop('checked', true);
            $(".prevocationalSkillsRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].PrevocationalSkills == false) {
            $("input[name=RadioPrevocationalSkills][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPrevocationalSkillsDetails").val(result.TransitionPlanningDetails[0].PrevocationalSkillsDetails);
        if (result.TransitionPlanningDetails[0].HistoryOfEmployment == true) {
            $("input[name=RadioHistoryOfEmployment][value=" + 1 + "]").prop('checked', true);
            $(".historyRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].HistoryOfEmployment == false) {
            $("input[name=RadioHistoryOfEmployment][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxHistoryOfEmploymentDetails").val(result.TransitionPlanningDetails[0].HistoryOfEmploymentDetails);
        if (result.TransitionPlanningDetails[0].AccessVR == true) {
            $("input[name=RadioAccessVR][value=" + 1 + "]").prop('checked', true);
            $(".accessRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].AccessVR == false) {
            $("input[name=RadioAccessVR][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxAccessVRDetails").val(result.TransitionPlanningDetails[0].AccessVRDetails);
        if (result.TransitionPlanningDetails[0].AccessToVocationalRehabilitation == true) {
            $("input[name=RadioAccessToVocationalRehabilitation][value=" + 1 + "]").prop('checked', true);
            $(".rehabilitationRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].AccessToVocationalRehabilitation == false) {
            $("input[name=RadioAccessToVocationalRehabilitation][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxAccessToVocationalRehabilitationDetails").val(result.TransitionPlanningDetails[0].AccessToVocationalRehabilitationDetails);
        if (result.TransitionPlanningDetails[0].TicketToWork == true) {
            $("input[name=RadioTicketToWork][value=" + 1 + "]").prop('checked', true);
            $(".ticketRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].TicketToWork == false) {
            $("input[name=RadioTicketToWork][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxTicketToWorkDetails").val(result.TransitionPlanningDetails[0].TicketToWorkDetails);
        if (result.TransitionPlanningDetails[0].WelfareToWork == true) {
            $("input[name=RadioWelfareToWork][value=" + 1 + "]").prop('checked', true);
            $(".WelfareRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].WelfareToWork == false) {
            $("input[name=RadioWelfareToWork][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxWelfareToWorkDetails").val(result.TransitionPlanningDetails[0].WelfareToWorkDetails);
        if (result.TransitionPlanningDetails[0].DayActivitiesOverAge21 == true) {
            $("input[name=RadioDayActivitiesOverAge21][value=" + 1 + "]").prop('checked', true);
            $(".dayActivitiesRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].DayActivitiesOverAge21 == false) {
            $("input[name=RadioDayActivitiesOverAge21][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxDayActivitiesOverAge21Details").val(result.TransitionPlanningDetails[0].DayActivitiesOverAge21Details);
        if (result.TransitionPlanningDetails[0].CompetitiveEmployment == true) {
            $("input[name=RadioCompetitiveEmployment][value=" + 1 + "]").prop('checked', true);
            $(".competitiveEmploymentRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].CompetitiveEmployment == false) {
            $("input[name=RadioCompetitiveEmployment][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxCompetitiveEmploymentDetails").val(result.TransitionPlanningDetails[0].CompetitiveEmploymentDetails);
        if (result.TransitionPlanningDetails[0].SEMP == true) {
            $("input[name=RadioSEMP][value=" + 1 + "]").prop('checked', true);
            $(".sempRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].SEMP == false) {
            $("input[name=RadioSEMP][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxSEMPDetails").val(result.TransitionPlanningDetails[0].SEMPDetails);
        if (result.TransitionPlanningDetails[0].EmploymentNotIntegrated == true) {
            $("input[name=RadioEmploymentNotIntegrated][value=" + 1 + "]").prop('checked', true);
            $(".notIntegratedRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].EmploymentNotIntegrated == false) {
            $("input[name=RadioEmploymentNotIntegrated][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEmploymentNotIntegratedDetails").val(result.TransitionPlanningDetails[0].EmploymentNotIntegratedDetails);
        if (result.TransitionPlanningDetails[0].PathwayToEmployment == true) {
            $("input[name=RadioPathwayToEmployment][value=" + 1 + "]").prop('checked', true);
            $(".pathwayRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].PathwayToEmployment == false) {
            $("input[name=RadioPathwayToEmployment][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPathwayToEmploymentDetails").val(result.TransitionPlanningDetails[0].PathwayToEmploymentDetails);
        if (result.TransitionPlanningDetails[0].SiteBasedPrevocationalServices == true) {
            $("input[name=RadioSiteBasedPrevocationalServices][value=" + 1 + "]").prop('checked', true);
            $(".siteBasedPrevocationalRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].SiteBasedPrevocationalServices == false) {
            $("input[name=RadioSiteBasedPrevocationalServices][value=" +0 + "]").prop('checked', true);
        }
        $("#TextBoxSiteBasedPrevocationalServicesDetails").val(result.TransitionPlanningDetails[0].SiteBasedPrevocationalServicesDetails);
        if (result.TransitionPlanningDetails[0].CommunityBasedPrevocationalServices == true) {
            $("input[name=RadioCommunityBasedPrevocationalServices][value=" + 1 + "]").prop('checked', true);
            $(".PrevocationalRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].CommunityBasedPrevocationalServices == false) {
            $("input[name=RadioCommunityBasedPrevocationalServices][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxCommunityBasedPrevocationalServicesDetails").val(result.TransitionPlanningDetails[0].CommunityBasedPrevocationalServicesDetails);
        if (result.TransitionPlanningDetails[0].SelfDirectedIndividualizedBudget == true) {
            $("input[name=RadioSelfDirectedIndividualizedBudget][value=" + 1 + "]").prop('checked', true);
            $(".selfDirectedRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].SelfDirectedIndividualizedBudget == false) {
            $("input[name=RadioSelfDirectedIndividualizedBudget][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxSelfDirectedIndividualizedBudgetDetails").val(result.TransitionPlanningDetails[0].SelfDirectedIndividualizedBudgetDetails);
        if (result.TransitionPlanningDetails[0].DayHabilitation == true) {
            $("input[name=RadioDayHabilitation][value=" + 1 + "]").prop('checked', true);
            $(".dayHabilitationRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].DayHabilitation == false) {
            $("input[name=RadioDayHabilitation][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxDayHabilitationDetails").val(result.TransitionPlanningDetails[0].DayHabilitationDetails);
        if (result.TransitionPlanningDetails[0].DayHabilitationWithoutWalls == true) {
            $("input[name=RadioDayHabilitationWithoutWalls][value=" + 1 + "]").prop('checked', true);
            $(".habilitationWithoutRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].DayHabilitationWithoutWalls == false) {
            $("input[name=RadioDayHabilitationWithoutWalls][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxDayHabilitationWithoutWallsDetails").val(result.TransitionPlanningDetails[0].DayHabilitationWithoutWallsDetails);
        if (result.TransitionPlanningDetails[0].DayTreatment == true) {
            $("input[name=RadioDayTreatment][value=" + 1 + "]").prop('checked', true);
            $(".dayTreatmentRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].DayTreatment == false) {
            $("input[name=RadioDayTreatment][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxDayTreatmentDetails").val(result.TransitionPlanningDetails[0].DayTreatmentDetails);
        if (result.TransitionPlanningDetails[0].CommunityHabilitation == true) {
            $("input[name=RadioCommunityHabilitation][value=" + 1 + "]").prop('checked', true);
            $(".habilitationRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].CommunityHabilitation == false) {
            $("input[name=RadioCommunityHabilitation][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxCommunityHabilitationDetails").val(result.TransitionPlanningDetails[0].CommunityHabilitationDetails);
        if (result.TransitionPlanningDetails[0].CommunityFirstChoiceOption == true) {
            $("input[name=RadioCommunityFirstChoiceOption][value=" + 1 + "]").prop('checked', true);
            $(".communityFirstRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].CommunityFirstChoiceOption == false) {
            $("input[name=RadioCommunityFirstChoiceOption][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxCommunityFirstChoiceOptionDetails").val(result.TransitionPlanningDetails[0].CommunityFirstChoiceOptionDetails);
        if (result.TransitionPlanningDetails[0].MentalHealthProgram == true) {
            $("input[name=RadioMentalHealthProgram][value=" + 1 + "]").prop('checked', true);
            $(".mentalHealthRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].MentalHealthProgram == false) {
            $("input[name=RadioMentalHealthProgram][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMentalHealthProgramDetails").val(result.TransitionPlanningDetails[0].MentalHealthProgramDetails);
        if (result.TransitionPlanningDetails[0].AdultDayServices == true) {
            $("input[name=RadioAdultDayServices][value=" + 1 + "]").prop('checked', true);
            $(".adultDayRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].AdultDayServices == false) {
            $("input[name=RadioAdultDayServices][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxAdultDayServicesDetails").val(result.TransitionPlanningDetails[0].AdultDayServicesDetails);
        if (result.TransitionPlanningDetails[0].Volunteer == true) {
            $("input[name=RadioVolunteer][value=" + 1 + "]").prop('checked', true);
            $(".volunterRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].Volunteer == false) {
            $("input[name=RadioVolunteer][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxVolunteerDetails").val(result.TransitionPlanningDetails[0].VolunteerDetails);
        if (result.TransitionPlanningDetails[0].Retired == true) {
            $("input[name=RadioRetired][value=" + 1 + "]").prop('checked', true);
            $(".retiredRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].Retired == false) {
            $("input[name=RadioRetired][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxRetiredDetails").val(result.TransitionPlanningDetails[0].RetiredDetails);
        if (result.TransitionPlanningDetails[0].NoStructuredDaytimeActivity == true) {
            $("input[name=RadioNoStructuredDaytimeActivity][value=" + 1 + "]").prop('checked', true);
            $(".ActivityRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].NoStructuredDaytimeActivity == false) {
            $("input[name=RadioNoStructuredDaytimeActivity][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxNoStructuredDaytimeActivityDetails").val(result.TransitionPlanningDetails[0].NoStructuredDaytimeActivityDetails);
        if (result.TransitionPlanningDetails[0].AdultEducation == true) {
            $("input[name=RadioAdultEducation][value=" + 1 + "]").prop('checked', true);
            $(".collegeRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].AdultEducation == false) {
            $("input[name=RadioAdultEducation][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxAdultEducationDetails").val(result.TransitionPlanningDetails[0].AdultEducationDetails);
        if (result.TransitionPlanningDetails[0].InterestInServices == true) {
            $("input[name=RadioInterestInServices][value=" + 1 + "]").prop('checked', true);
            $(".interestRadio").removeAttr('hidden');
        }
        if (result.TransitionPlanningDetails[0].InterestInServices == false) {
            $("input[name=RadioInterestInServices][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxInterestInServicesDetails").val(result.TransitionPlanningDetails[0].InterestInServicesDetails);
        if (result.TransitionPlanningDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartTransitionPlan", "statusCompletedTransitionPlan", "statusInprogressTransitionPlan");
        } else {
            HandleInprogressSection(status, "statusStartTransitionPlan", "statusCompletedTransitionPlan", "statusInprogressTransitionPlan");
        }
    }
    else {
        HandleStartSection("transitionPlanning", status, "statusStartTransitionPlan", "statusCompletedTransitionPlan", "statusInprogressTransitionPlan");
    }
}
function SubstanceAbuseScreeningDetails(result, status) {
    if (result.SubstanceAbuseScreeningDetails[0] != undefined) {
        $("#TextBoxAssessmentSubstanceAbuseScreeningId").val(result.SubstanceAbuseScreeningDetails[0].AssessmentSubstanceAbuseScreeningId);
        if (result.SubstanceAbuseScreeningDetails[0].UsedAlcohalOrOtherDrugs == true) {
            $("input[name=RadioUsedAlcohalOrOtherDrugs][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].UsedAlcohalOrOtherDrugs == false) {
            $("input[name=RadioUsedAlcohalOrOtherDrugs][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].UsedPrescriptionOrMedication_Drugs == true) {
            $("input[name=RadioUsedPrescriptionOrMedication_Drugs][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].UsedPrescriptionOrMedication_Drugs == false) {
            $("input[name=RadioUsedPrescriptionOrMedication_Drugs][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeltUseTooMuchAlcoholOrOther_Drugs == true) {
            $("input[name=RadioFeltUseTooMuchAlcoholOrOther_Drugs][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeltUseTooMuchAlcoholOrOther_Drugs == false) {
            $("input[name=RadioFeltUseTooMuchAlcoholOrOther_Drugs][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].TriedToCutDown_QuitDrinking_OtherDrug == true) {
            $("input[name=RadioTriedToCutDown_QuitDrinking_OtherDrug][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].TriedToCutDown_QuitDrinking_OtherDrug == false) {
            $("input[name=RadioTriedToCutDown_QuitDrinking_OtherDrug][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].GoneToAnyoneForHelpBcozOfYourDrinking == true) {
            $("input[name=RadioGoneToAnyoneForHelpBcozOfYourDrinking][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].GoneToAnyoneForHelpBcozOfYourDrinking == false) {
            $("input[name=RadioGoneToAnyoneForHelpBcozOfYourDrinking][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].BlackoutsOrOtherPeriods == 'Y') {
            $("input[name=RadioBlackoutsOrOtherPeriods]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].InjuredHeadAfterDrinking == 'Y') {
            $("input[name=RadioInjuredHeadAfterDrinking]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].Convulsions_Delirium_Tremens == 'Y') {
            $("input[name=RadioConvulsions_Delirium_Tremens]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].HepatitisOrOtherLiverProblems == 'Y') {
            $("input[name=RadioHepatitisOrOtherLiverProblems]").prop('checked', true);
        }

        if (result.SubstanceAbuseScreeningDetails[0].Felt_sick_shakyOrDepressed == 'Y') {
            $("input[name=RadioFelt_sick_shakyOrDepressed]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeltCoke_BugsOrCrawlingFeeling == 'Y') {
            $("input[name=RadioFeltCoke_BugsOrCrawlingFeeling]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].InjuredAfterDrinkingOrUsing == 'Y') {
            $("input[name=RadioInjuredAfterDrinkingOrUsing]").prop('checked', true);
        }

        if (result.SubstanceAbuseScreeningDetails[0].UsedNeedlesToShootDrugs == 'Y') {
            $("input[name=RadioUsedNeedlesToShootDrugs]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].DrinkingUseCausedProblemsWithYourFamily == true) {
            $("input[name=RadioDrinkingUseCausedProblemsWithYourFamily][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].DrinkingUseCausedProblemsWithYourFamily == false) {
            $("input[name=RadioDrinkingUseCausedProblemsWithYourFamily][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].DrinkingUseCausedProblemsAtSchool_Work == true) {
            $("input[name=RadioDrinkingUseCausedProblemsAtSchool_Work][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].DrinkingUseCausedProblemsAtSchool_Work == false) {
            $("input[name=RadioDrinkingUseCausedProblemsAtSchool_Work][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].ArrestedOrOtherLegalProblems == true) {
            $("input[name=RadioArrestedOrOtherLegalProblems][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].ArrestedOrOtherLegalProblems == false) {
            $("input[name=RadioArrestedOrOtherLegalProblems][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].LostTemper_FightsWhileDrinking == true) {
            $("input[name=RadioLostTemper_FightsWhileDrinking][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].LostTemper_FightsWhileDrinking == false) {
            $("input[name=RadioLostTemper_FightsWhileDrinking][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].NeedingToDrinkOrUseDrugsMore == true) {
            $("input[name=RadioNeedingToDrinkOrUseDrugsMore][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].NeedingToDrinkOrUseDrugsMore == false) {
            $("input[name=RadioNeedingToDrinkOrUseDrugsMore][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].TryingToGetAlcoholOrDrugs == true) {
            $("input[name=RadioTryingToGetAlcoholOrDrugs][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].TryingToGetAlcoholOrDrugs == false) {
            $("input[name=RadioTryingToGetAlcoholOrDrugs][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].BreakRules_Laws == true) {
            $("input[name=RadioBreakRules_Laws][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].BreakRules_Laws == false) {
            $("input[name=RadioBreakRules_Laws][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeelBadOrGuilty == true) {
            $("input[name=RadioFeelBadOrGuilty][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeelBadOrGuilty == false) {
            $("input[name=RadioFeelBadOrGuilty][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].EverDrinkingOrOtherDrugProblem == true) {
            $("input[name=RadioEverDrinkingOrOtherDrugProblem][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].EverDrinkingOrOtherDrugProblem == false) {
            $("input[name=RadioEverDrinkingOrOtherDrugProblem][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FamilyMembersEverDrinkingOrDrugProblem == true) {
            $("input[name=RadioFamilyMembersEverDrinkingOrDrugProblem][Value=" + 1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FamilyMembersEverDrinkingOrDrugProblem == false) {
            $("input[name=RadioFamilyMembersEverDrinkingOrDrugProblem][Value=" + 0 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeelDrinkingOrDrugProblemNow == true) {
            $("input[name=RadioFeelDrinkingOrDrugProblemNow][Value=" +1 + "]").prop('checked', true);
        }
        if (result.SubstanceAbuseScreeningDetails[0].FeelDrinkingOrDrugProblemNow == false) {
            $("input[name=RadioFeelDrinkingOrDrugProblemNow][Value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxTotalScore").val(result.SubstanceAbuseScreeningDetails[0].TotalScore);

        if (result.SubstanceAbuseScreeningDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartSubstance", "statusCompletedSubstance", "statusInprogressSubstance");
        } else {
            HandleInprogressSection(status, "statusStartSubstance", "statusCompletedSubstance", "statusInprogressSubstance");
        }
    }
    else {
        HandleStartSection("abuseScreening", status, "statusStartSubstance", "statusCompletedSubstance", "statusInprogressSubstance");
    }
}
function SelfDirectedServicesDetails(result, status) {
    if (result.SelfDirectedServicesDetails[0] != undefined) {
        if (result.SelfDirectedServicesDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartSelfDirected", "statusCompletedSelfDirected", "statusInprogressSelfDirected");
        } else {
            HandleInprogressSection(status, "statusStartSelfDirected", "statusCompletedSelfDirected", "statusInprogressSelfDirected");
        }
        $("#TextBoxAssessmentSelfDirectedServicesId").val(result.SelfDirectedServicesDetails[0].AssessmentSelfDirectedServicesId);
        if (result.SelfDirectedServicesDetails[0].InterestToSelfDirectServices == true) {
            $("input[name=RadioInterestToSelfDirectServices][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SelfDirectedServicesDetails[0].InterestToSelfDirectServices == false) {
            $("input[name=RadioInterestToSelfDirectServices][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SelfDirectedServicesDetails[0].EducationOnSelfDirecting == true) {
            $("input[name=RadioEducationOnSelfDirecting][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SelfDirectedServicesDetails[0].EducationOnSelfDirecting == false) {
            $("input[name=RadioEducationOnSelfDirecting][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxServicesToSelfDirect").val(result.SelfDirectedServicesDetails[0].ServicesToSelfDirect);
        $("#TextBoxSkillsAndResources").val(result.SelfDirectedServicesDetails[0].SkillsAndResources);
        $("#TextBoxIdentifyBarriersToSelfDirecting").val(result.SelfDirectedServicesDetails[0].IdentifyBarriersToSelfDirecting);

    }

    else {
        HandleStartSection("directedServices", status, "statusStartSelfDirected", "statusCompletedSelfDirected", "statusInprogressSelfDirected");
    }
}
function SafetyRiskDetails(result, status) {
    if (result.SafetyRiskDetails[0] != undefined) {
        if (result.SafetyRiskDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartSafetyRisk", "statusCompletedSafetyRisk", "statusInprogressSafetyRisk");
        } else {
            HandleInprogressSection(status, "statusStartSafetyRisk", "statusCompletedSafetyRisk", "statusInprogressSafetyRisk");
        }


        $("#TextBoxAssessmentSafetyRiskId").val(result.SafetyRiskDetails[0].AssessmentSafetyRiskId);
        if (result.SafetyRiskDetails[0].EverThoughtsHurtingYourself == true) {
            $("input[name=RadioEverThoughtsHurtingYourself][value=" + 1 + "]").prop('checked', true);
            $(".EverThoughtsHurtingYourselfDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].EverThoughtsHurtingYourself == false) {
            $("input[name=RadioEverThoughtsHurtingYourself][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEverThoughtsHurtingYourselfDetail").val(result.SafetyRiskDetails[0].EverThoughtsHurtingYourselfDetail);
        if (result.SafetyRiskDetails[0].EverActedThoughtsHurtYourself == true) {
            $("input[name=RadioEverActedThoughtsHurtYourself][value=" + 1 + "]").prop('checked', true);
            $(".EverActedThoughtsHurtYourselfDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].EverActedThoughtsHurtYourself == false) {
            $("input[name=RadioEverActedThoughtsHurtYourself][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEverActedThoughtsHurtYourselfDetail").val(result.SafetyRiskDetails[0].EverActedThoughtsHurtYourselfDetail);
        $("#TextBoxFeelingWellOrNeedHelp").val(result.SafetyRiskDetails[0].FeelingWellOrNeedHelp);
        if (result.SafetyRiskDetails[0].ThoughtsOfHarmingYourself == true) {
            $("input[name=RadioThoughtsOfHarmingYourself][value=" + 1 + "]").prop('checked', true);
            $(".ThoughtsOfHarmingYourselfDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].ThoughtsOfHarmingYourself == false) {
            $("input[name=RadioThoughtsOfHarmingYourself][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxThoughtsOfHarmingYourselfDetail").val(result.SafetyRiskDetails[0].ThoughtsOfHarmingYourselfDetail);
        if (result.SafetyRiskDetails[0].HavePlanToEndYourLife == true) {
            $("input[name=RadioHavePlanToEndYourLife][value=" + 1 + "]").prop('checked', true);
            $(".PlanToEndYourLife").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].HavePlanToEndYourLife == false) {
            $("input[name=RadioHavePlanToEndYourLife][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPlanToEndYourLife").val(result.SafetyRiskDetails[0].PlanToEndYourLife);
        if (result.SafetyRiskDetails[0].NearFutureActOnThatPlan == true) {
            $("input[name=RadioNearFutureActOnThatPlan][value=" + 1 + "]").prop('checked', true);
            $(".NearFutureActOnThatPlanDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].NearFutureActOnThatPlan == false) {
            $("input[name=RadioNearFutureActOnThatPlan][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxNearFutureActOnThatPlanDetail").val(result.SafetyRiskDetails[0].NearFutureActOnThatPlanDetail);
        if (result.SafetyRiskDetails[0].EverAttemptedSuicideBefore == true) {
            $("input[name=RadioEverAttemptedSuicideBefore][value=" + 1 + "]").prop('checked', true);
            $(".EverAttemptedSuicideBeforeDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].EverAttemptedSuicideBefore == false) {
            $("input[name=RadioEverAttemptedSuicideBefore][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEverAttemptedSuicideBeforeDetail").val(result.SafetyRiskDetails[0].EverAttemptedSuicideBeforeDetail);
        if (result.SafetyRiskDetails[0].EverCommittedSuicideInFamily == true) {
            $("input[name=RadioEverCommittedSuicideInFamily][value=" + 1 + "]").prop('checked', true);
            $(".EverCommittedSuicideInFamilyDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].EverCommittedSuicideInFamily == false) {
            $("input[name=RadioEverCommittedSuicideInFamily][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEverCommittedSuicideInFamilyDetail").val(result.SafetyRiskDetails[0].EverCommittedSuicideInFamilyDetail);
        if (result.SafetyRiskDetails[0].FeltLikeHarmingYourself == true) {
            $("input[name=RadioFeltLikeHarmingYourself][value=" + 1 + "]").prop('checked', true);
            $(".FeltLikeHarmingYourselfDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].FeltLikeHarmingYourself == false) {
            $("input[name=RadioFeltLikeHarmingYourself][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxFeltLikeHarmingYourselfDetail").val(result.SafetyRiskDetails[0].FeltLikeHarmingYourselfDetail);
        if (result.SafetyRiskDetails[0].HearVoicesToHarmOrKillYourself == true) {
            $("input[name=RadioHearVoicesToHarmOrKillYourself][value=" + 1 + "]").prop('checked', true);
            $(".VoicesToHarmOrKillYourselfDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].HearVoicesToHarmOrKillYourself == false) {
            $("input[name=RadioHearVoicesToHarmOrKillYourself][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxHearVoicesToHarmOrKillYourselfDetail").val(result.SafetyRiskDetails[0].HearVoicesToHarmOrKillYourselfDetail);
        if (result.SafetyRiskDetails[0].FeelLikeThatActOnThoseVoices == true) {
            $("input[name=RadioFeelLikeThatActOnThoseVoices][value=" + 1 + "]").prop('checked', true);
            $(".ActOnThoseVoicesDetail").removeAttr('hidden');
        }
        if (result.SafetyRiskDetails[0].FeelLikeThatActOnThoseVoices == false) {
            $("input[name=RadioFeelLikeThatActOnThoseVoices][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxFeelLikeThatActOnThoseVoicesDetail").val(result.SafetyRiskDetails[0].FeelLikeThatActOnThoseVoicesDetail);
    }

    else {
        HandleStartSection("riskAssessment", status, "statusStartSafetyRisk", "statusCompletedSafetyRisk", "statusInprogressSafetyRisk");
    }
}
function SafetyPlanDetails(result, status) {
    if (result.SafetyPlanDetails[0] != undefined) {

        if (result.SafetyPlanDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartSafetyPlan", "statusCompletedSafetyPlan", "statusInprogressSafetyPlan");
        } else {
            HandleInprogressSection(status, "statusStartSafetyPlan", "statusCompletedSafetyPlan", "statusInprogressSafetyPlan");
        }

        $("#TextBoxAssessmentSafetyPlanId").val(result.SafetyPlanDetails[0].AssessmentSafetyPlanId);
        if (result.SafetyPlanDetails[0].LeavePerpetrator == true) {
            $("input[name=RadioLeavePerpetrator][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].LeavePerpetrator == false) {
            $("input[name=RadioLeavePerpetrator][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].OrderProtection == true) {
            $("input[name=RadioOrderProtection][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].OrderProtection == false) {
            $("input[name=RadioOrderProtection][value=" + 0 + "]").prop('checked', true);
            $(".OrderProtection").removeAttr('hidden');
        }
        $("#TextBoxOrderProtectionDetail").val(result.SafetyPlanDetails[0].OrderProtectionDetail);
        if (result.SafetyPlanDetails[0].ChildrenInvolved == true) {
            $("input[name=RadioChildrenInvolved][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].ChildrenInvolved == false) {
            $("input[name=RadioChildrenInvolved][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].ChildrenBeingAbused == true) {
            $("input[name=RadioChildrenBeingAbused][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].ChildrenBeingAbused == false) {
            $("input[name=RadioChildrenBeingAbused][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].EverBeenAbused == true) {
            $("input[name=RadioEverBeenAbused][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].EverBeenAbused == false) {
            $("input[name=RadioEverBeenAbused][value=" + 0 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].SafewayToLeave == true) {
            $("input[name=RadioSafewayToLeave][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].SafewayToLeave == false) {
            $("input[name=RadioSafewayToLeave][value=" + 0 + "]").prop('checked', true);
            $(".SafewayToLeave").removeAttr('hidden');
        }
        $("#TextBoxLeaveHomeExit").val(result.SafetyPlanDetails[0].LeaveHomeExit);
        if (result.SafetyPlanDetails[0].IsMemberTrust_LeaveDocument == true) {
            $("input[name=RadioIsMemberTrust_LeaveDocument][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].IsMemberTrust_LeaveDocument == false) {
            $("input[name=RadioIsMemberTrust_LeaveDocument][value=" + 0 + "]").prop('checked', true);
            $(".LeaveDocument").removeAttr('hidden');
        }
        $("#TextBoxImpDocumenthas").val(result.SafetyPlanDetails[0].ImpDocumenthas);
        $("#TextBoxImpDocumenthas_Address").val(result.SafetyPlanDetails[0].ImpDocumenthas_Address);
        if (result.SafetyPlanDetails[0].IsSafePlace_PersonToTakecareThings == true) {
            $("input[name=RadioIsSafePlace_PersonToTakecareThings][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].IsSafePlace_PersonToTakecareThings == false) {
            $("input[name=RadioIsSafePlace_PersonToTakecareThings][value=" + 0 + "]").prop('checked', true);
            $(".TakecareThing").removeAttr('hidden');
        }
        $("#TextBoxLeaveMyhomewillContact").val(result.SafetyPlanDetails[0].LeaveMyhomewillContact);
        if (result.SafetyPlanDetails[0].IsChildrenKnowToDial911 == true) {
            $("input[name=RadioIsChildrenKnowToDial911][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].IsChildrenKnowToDial911 == false) {
            $("input[name=RadioIsChildrenKnowToDial911][value=" + 0 + "]").prop('checked', true);
            $(".DirectionsOfMembersAddress").removeAttr('hidden');
        }
        $("#TextBoxDirectionsOfMembersAddress").val(result.SafetyPlanDetails[0].DirectionsOfMembersAddress);
        if (result.SafetyPlanDetails[0].IsSafePlaceInHomeToHide == true) {
            $("input[name=RadioIsSafePlaceInHomeToHide][value=" + 1 + "]").prop('checked', true);
        }
        if (result.SafetyPlanDetails[0].IsSafePlaceInHomeToHide == false) {
            $("input[name=RadioIsSafePlaceInHomeToHide][value=" + 0 + "]").prop('checked', true);
            $(".HomeToHide").removeAttr('hidden');
        }
        $("#TextBoxSafePlaceInHome").val(result.SafetyPlanDetails[0].SafePlaceInHome);
    }

    else {
        HandleStartSection("safetyPlan", status, "statusStartSafetyPlan", "statusCompletedSafetyPlan", "statusInprogressSafetyPlan");
    }
}
function MedicalHelathDetails(result, status) {
    if (result.MedicalHelathDetails[0] != undefined) {
        if (result.MedicalHelathDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartMedicalHealth", "statusCompletedMedicalHealth", "statusInprogressMedicalHealth");
        } else {
            HandleInprogressSection(status, "statusStartMedicalHealth", "statusCompletedMedicalHealth", "statusInprogressMedicalHealth");
        }


        $("#TextBoxAssessmentMedicalHelathId").val(result.MedicalHelathDetails[0].AssessmentMedicalHelathId);

        if (result.MedicalHelathDetails[0].BipolarDisorder == 'Y') {
            $('input[name=RadioBipolarDisorder]').prop('checked', true);
            $(".TreatmentReceived").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].Schizophrenia == 'Y') {
            $('input[name=RadioSchizophrenia]').prop('checked', true);
            $(".TreatmentReceived").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].SevereDepression == 'Y') {
            $('input[name=RadioSevereDepression]').prop('checked', true);
            $(".TreatmentReceived").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].SchizoaffectiveDisorder == 'Y') {
            $('input[name=RadioSchizoaffectiveDisorder]').prop('checked', true);
            $(".TreatmentReceived").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].NoneOfTheAbove == 'Y') {
            $('input[name=RadioNoneOfTheAbove]').prop('checked', true);
            $(".TreatmentReceived").attr('hidden');
        }
        -        $("#TextBoxTreatmentReceived").val(result.MedicalHelathDetails[0].TreatmentReceived);
        $("#TextBoxProvidersDetail").val(result.MedicalHelathDetails[0].ProvidersDetail);
        $("#TextBoxMemberSeeProvidersList").val(result.MedicalHelathDetails[0].MemberSeeProvidersList);
        if (result.MedicalHelathDetails[0].ConfusionAboutMedicine == 'Y') {
            $('input[name=RadioConfusionAboutMedicine]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].InstructionLanguage == 'Y') {
            $('input[name=RadioInstructionLanguage]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].DifficultyInMedication == 'Y') {
            $('input[name=RadioDifficultyInMedication]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MedicationSideEffects == 'Y') {
            $('input[name=RadioMedicationSideEffects]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].UnderstandingOfMedicine == 'Y') {
            $('input[name=RadioUnderstandingOfMedicine]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].RememberingMedicine == 'Y') {
            $('input[name=RadioRememberingMedicine]').prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].OtherBarriers == 'Y') {
            $('input[name=RadioOtherBarriers]').prop('checked', true);
            $(".otherBarrierDescription").removeAttr('hidden');
        }
        $("#TextBoxOherBarriersDescription").val(result.MedicalHelathDetails[0].OherBarriersDescription);
        $("#TextBoxMemberReactionOnMedication").val(result.MedicalHelathDetails[0].MemberReactionOnMedication);
        $("#TextBoxMemberReactionNotOnMedication").val(result.MedicalHelathDetails[0].MemberReactionNotOnMedication);
        $("#TextBoxAllergyPsychiatricMedications").val(result.MedicalHelathDetails[0].AllergyPsychiatricMedications);
        $("#TextBoxMemberBeenToED").val(result.MedicalHelathDetails[0].MemberBeenToED);
        $("#TextBoxRecentVisitDate").val(result.MedicalHelathDetails[0].RecentVisitDate);
        $("#TextBoxNoOfTimesMemberAdmitted").val(result.MedicalHelathDetails[0].NoOfTimesMemberAdmitted);
        $("#TextBoxDateOfRecentAdmission").val(result.MedicalHelathDetails[0].DateOfRecentAdmission);
        $("#TextBoxAgeOnsetSymptoms").val(result.MedicalHelathDetails[0].AgeOnsetSymptoms);
        $("#TextBoxOtherDetailsPsychiatricHistory").val(result.MedicalHelathDetails[0].OtherDetailsPsychiatricHistory);
        if (result.MedicalHelathDetails[0].MemberExperiencedTrauma == true) {
            $("input[name=RadioMemberExperiencedTrauma][value=" + 1 + "]").prop('checked', true);
            $(".ExperiencedDescribe").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].MemberExperiencedTrauma == false) {
            $("input[name=RadioMemberExperiencedTrauma][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberExperiencedDescribe").val(result.MedicalHelathDetails[0].MemberExperiencedDescribe);
        if (result.MedicalHelathDetails[0].MemberRecievedHelp == true) {
            $("input[name=RadioMemberRecievedHelp][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberRecievedHelp == false) {
            $("input[name=RadioMemberRecievedHelp][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberWishToReffered == true) {
            $("input[name=RadioMemberWishToReffered][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberWishToReffered == false) {
            $("input[name=RadioMemberWishToReffered][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].PreviousDrugTreatment == true) {
            $("input[name=RadioPreviousDrugTreatment][value=" + 1 + "]").prop('checked', true);
            $(".DrugTreatmentDetail").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].PreviousDrugTreatment == false) {
            $("input[name=RadioPreviousDrugTreatment][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPreviousDrugTreatmentDetail").val(result.MedicalHelathDetails[0].PreviousDrugTreatmentDetail);
        $("#TextBoxMemberRecievesKindTreatment").val(result.MedicalHelathDetails[0].MemberRecievesKindTreatment);
        $("#TextBoxListDetailsProviders").val(result.MedicalHelathDetails[0].ListDetailsProviders);
        $("#TextBoxNoOfTimesMemberSeeProviderList").val(result.MedicalHelathDetails[0].NoOfTimesMemberSeeProviderList);
        $("#TextBoxMemberAdmittedToDetoxTreatment").val(result.MedicalHelathDetails[0].MemberAdmittedToDetoxTreatment);
        $("#TextBoxDateRecentAdmission").val(result.MedicalHelathDetails[0].DateRecentAdmission);
        $("#TextBoxNoOfTimesMemberAdmittedRehab").val(result.MedicalHelathDetails[0].NoOfTimesMemberAdmittedRehab);
        $("#TextBoxDateMostRecentVisit").val(result.MedicalHelathDetails[0].DateMostRecentVisit);
        $("#TextBoxAgeOfFirstSubstance").val(result.MedicalHelathDetails[0].AgeOfFirstSubstance);
        $("#TextBoxDurationOfSoberity").val(result.MedicalHelathDetails[0].DurationOfSoberity);
        $("#TextBoxTreatmentModalityEffective").val(result.MedicalHelathDetails[0].TreatmentModalityEffective);
        $("#TextBoxSubstanceUseTriggers").val(result.MedicalHelathDetails[0].SubstanceUseTriggers);
        $("#TextBoxMemberProtectItself").val(result.MedicalHelathDetails[0].MemberProtectItself);
        $("#TextBoxPerceptionGoodAboutSubstance").val(result.MedicalHelathDetails[0].PerceptionGoodAboutSubstance);
        $("#TextBoxPerceptionNoGoodAboutSubstance").val(result.MedicalHelathDetails[0].PerceptionNoGoodAboutSubstance);
        $("#TextBoxOtherDetailSubstance").val(result.MedicalHelathDetails[0].OtherDetailSubstance);
        if (result.MedicalHelathDetails[0].DoesMemberUseTobacco == true) {
            $("input[name=RadioDoesMemberUseTobacco][value=" + 1 + "]").prop('checked', true);
            $(".UseTobaccoSpecify").removeAttr('hidden');
        }
        if (result.MedicalHelathDetails[0].DoesMemberUseTobacco == false) {
            $("input[name=RadioDoesMemberUseTobacco][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberUseTobaccoSpecify").val(result.MedicalHelathDetails[0].MemberUseTobaccoSpecify);
        $("#TextBoxNoOfTimeMemberSmokePerDay").val(result.MedicalHelathDetails[0].NoOfTimeMemberSmokePerDay);
        if (result.MedicalHelathDetails[0].MemberCurrentlyUseECigarettes == true) {
            $("input[name=RadioMemberCurrentlyUseECigarettes][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberCurrentlyUseECigarettes == false) {
            $("input[name=RadioMemberCurrentlyUseECigarettes][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberCompletedCessationProgram == true) {
            $("input[name=RadioMemberCompletedCessationProgram][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberCompletedCessationProgram == false) {
            $("input[name=RadioMemberCompletedCessationProgram][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberInteresedInProgram == true) {
            $("input[name=RadioMemberInteresedInProgram][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].MemberInteresedInProgram == false) {
            $("input[name=RadioMemberInteresedInProgram][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].ReferralMade == true) {
            $("input[name=RadioReferralMade][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalHelathDetails[0].ReferralMade == false) {
            $("input[name=RadioReferralMade][value=" + 0 + "]").prop('checked', true);
        }
    }
    else {
        HandleStartSection("mentalHealth", status, "statusStartMedicalHealth", "statusCompletedMedicalHealth", "statusInprogressMedicalHealth");
    }
}
function MedicalDetails(result, status) {
    if (result.MedicalDetails[0] != undefined) {

        if (result.MedicalDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartMedical", "statusCompletedMedical", "statusInprogressMedical");
        } else {
            HandleInprogressSection(status, "statusStartMedical", "statusCompletedMedical", "statusInprogressMedical");
        }
        $("#TextBoxAssessmentMedicalId").val(result.MedicalDetails[0].AssessmentMedicalId);

        $("input[name=RadioMedicationsOnTime][Value=" + result.MedicalDetails[0].MedicationsOnTime + "]").prop('checked', true);
        $("input[name=RadioMedicationMissed][Value=" + result.MedicalDetails[0].MedicationMissed + "]").prop('checked', true);
        $("input[name=RadioLastMedicationMissed][Value=" + result.MedicalDetails[0].LastMedicationMissed + "]").prop('checked', true);

        $("#TextBoxScore").val(result.MedicalDetails[0].Score);
        if (result.MedicalDetails[0].ConsequencesDoses == true) {
            $("input[name=RadioConsequencesDoses][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalDetails[0].ConsequencesDoses == false) {
            $("input[name=RadioConsequencesDoses][value=" + 0 + "]").prop('checked', true);
        }
        if (result.MedicalDetails[0].MedicationsInfo == true) {
            $("input[name=RadioMedicationsInfo][value=" + 1 + "]").prop('checked', true);
        }
        if (result.MedicalDetails[0].MedicationsInfo == false) {
            $("input[name=RadioMedicationsInfo][value=" + 0 + "]").prop('checked', true);
        }


        $("#TextBoxHospitalizationReason").val(result.MedicalDetails[0].HospitalizationReason);
        $("#TextBoxAllergiesList").val(result.MedicalDetails[0].AllergiesList);
        if (result.MedicalDetails[0].MedicationsInfo == true) {
            $("input[name=RadioMemberHavePain][value=" + 1 + "]").prop('checked', true);
            $(".PainArea").removeAttr('hidden');
        }
        if (result.MedicalDetails[0].MedicationsInfo == false) {
            $("input[name=RadioMemberHavePain][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPainArea").val(result.MedicalDetails[0].PainArea);
        $("#TextBoxPainOccurance").val(result.MedicalDetails[0].PainOccurance);
        $("#TextBoxPainFeeling").val(result.MedicalDetails[0].PainFeeling);
        $("#TextBoxPainReporting").val(result.MedicalDetails[0].PainReporting);
        $("#TextBoxPainScaleWorst").val(result.MedicalDetails[0].PainScaleWorst);
        $("#TextBoxPainScaleBest").val(result.MedicalDetails[0].PainScaleBest);
        $("#TextBoxPainMakesBetter").val(result.MedicalDetails[0].PainMakesBetter);
        $("#TextBoxPainMakeWorse").val(result.MedicalDetails[0].PainMakeWorse);
        $("#TextBoxPainReliefMethods").val(result.MedicalDetails[0].PainReliefMethods);
        $("#TextBoxPainAffects").val(result.MedicalDetails[0].PainAffects);
        $("#TextBoxMemberSharingHealth").val(result.MedicalDetails[0].MemberSharingHealth);
        $("#TextBoxPrimaryCareProvider").val(result.MedicalDetails[0].PrimaryCareProvider);
        $("#TextBoxPsychiatrist").val(result.MedicalDetails[0].Psychiatrist);
        $("#TextBoxPainManagementPhysician").val(result.MedicalDetails[0].PainManagementPhysician);
    }
    else {
        HandleStartSection("section1", status, "statusStartMedical", "statusCompletedMedical", "statusInprogressMedical");
    }
}
function LegalDetails(result, status) {
    if (result.LegalDetails[0] != undefined) {

        if (result.LegalDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartLegal", "statusCompletedLegal", "statusInprogressLegal");
        } else {
            HandleInprogressSection(status, "statusStartLegal", "statusCompletedLegal", "statusInprogressLegal");
        }
        $("#TextBoxAssessmentLegalId").val(result.LegalDetails[0].AssessmentLegalId);

        $("#TextBoxIncomeSupportExigentNeeds").val(result.LegalDetails[0].IncomeSupportExigentNeeds);
        $("#TextBoxIncomeSupportOngoingLegalActivity").val(result.LegalDetails[0].IncomeSupportOngoingLegalActivity);
        $("#TextBoxIncomeSupportLegalHistory").val(result.LegalDetails[0].IncomeSupportLegalHistory);
        $("#TextBoxHousingUtilitiesExigentNeeds").val(result.LegalDetails[0].HousingUtilitiesExigentNeeds);
        $("#TextBoxHousingUtilitiesOngoingLegalActivity").val(result.LegalDetails[0].HousingUtilitiesOngoingLegalActivity);
        $("#TextBoxHousingUtilitiesLegalHistory").val(result.LegalDetails[0].HousingUtilitiesLegalHistory);
        $("#TextBoxLegalStatusExigentNeeds").val(result.LegalDetails[0].LegalStatusExigentNeeds);
        $("#TextBoxLegalStatusOngoingLegalActivity").val(result.LegalDetails[0].LegalStatusOngoingLegalActivity);
        $("#TextBoxLegalStatusLegalHistory").val(result.LegalDetails[0].LegalStatusLegalHistory);
        $("#TextBoxPersonalAndFamilyExigentNeeds").val(result.LegalDetails[0].PersonalAndFamilyExigentNeeds);
        $("#TextBoxPersonalAndFamilyOngoingLegalActivity").val(result.LegalDetails[0].PersonalAndFamilyOngoingLegalActivity);
        $("#TextBoxPersonalAndFamilyLegalActivity").val(result.LegalDetails[0].PersonalAndFamilyLegalActivity);
        if (result.LegalDetails[0].MemberRegisteredSexOffender == true) {
            $("input[name=RadioMemberRegisteredSexOffender][value=" + 1 + "]").prop('checked', true);
            $(".MemberRegisteredSexOffenderDetail").removeAttr('hidden');
        }
        if (result.LegalDetails[0].MemberRegisteredSexOffender == false) {
            $("input[name=RadioMemberRegisteredSexOffender][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberRegisteredSexOffenderDetail").val(result.LegalDetails[0].MemberRegisteredSexOffenderDetail);
        $(".generalLegal #TextBoxState").val(result.LegalDetails[0].State);
        $(".generalLegal #TextBoxCity").val(result.LegalDetails[0].City);
        $(".generalLegal #TextBoxCounty").val(result.LegalDetails[0].County);
        if (result.LegalDetails[0].MemberEverIncarcerated == true) {
            $("input[name=RadioMemberEverIncarcerated][value=" + 1 + "]").prop('checked', true);
            $(".MemberEverIncarceratedDetail").removeAttr('hidden');
        }
        if (result.LegalDetails[0].MemberEverIncarcerated == false) {
            $("input[name=RadioMemberEverIncarcerated][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberEverIncarceratedDetail").val(result.LegalDetails[0].MemberEverIncarceratedDetail);
        $("#TextBoxParoleOfficerName").val(result.LegalDetails[0].ParoleOfficerName);
        $("#TextBoxParoleOfficerNumber").val(result.LegalDetails[0].ParoleOfficerNumber);
        $("#TextBoxParoleOfficerLengthOfTime").val(result.LegalDetails[0].ParoleOfficerLengthOfTime);
        if (result.LegalDetails[0].ConsentToSpeakWithParoleOfficer == true) {
            $("input[name=RadioConsentToSpeakWithParoleOfficer][value=" + 1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].ConsentToSpeakWithParoleOfficer == false) {
            $("input[name=RadioConsentToSpeakWithParoleOfficer][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxProbationOfficerName").val(result.LegalDetails[0].ProbationOfficerName);
        $("#TextBoxProbationOfficerNumber").val(result.LegalDetails[0].ProbationOfficerNumber);
        $("#TextBoxProbationOfficerLenghtOfTime").val(result.LegalDetails[0].ProbationOfficerLenghtOfTime);
        if (result.LegalDetails[0].ConsentToSpeakWithProbationOfficer == true) {
            $("input[name=RadioConsentToSpeakWithProbationOfficer][value=" + 1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].ConsentToSpeakWithProbationOfficer == false) {
            $("input[name=RadioConsentToSpeakWithProbationOfficer][value=" + 0 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].MemberHaveAttorney == true) {
            $("input[name=RadioMemberHaveAttorney][value=" + 1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].MemberHaveAttorney == false) {
            $("input[name=RadioMemberHaveAttorney][value=" + 0 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].AttorneyNameAndContact == true) {
            $(".AttorneyNameAndContact").removeAttr('hidden');
        }
        $("#TextBoxAttorneyNameAndContact").val(result.LegalDetails[0].AttorneyNameAndContact);
        if (result.LegalDetails[0].ConsentToSpeakWithAttorney == true) {
            $("input[name=RadioConsentToSpeakWithAttorney][value=" + 1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].ConsentToSpeakWithAttorney == false) {
            $("input[name=RadioConsentToSpeakWithAttorney][value=" + 0 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].ClientNeedreferralLegalServices == true) {
            $("input[name=RadioClientNeedreferralLegalServices][value=" + 1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].ClientNeedreferralLegalServices == false) {
            $("input[name=RadioClientNeedreferralLegalServices][value=" + 0 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].CourtOrderedServices == true) {
            $("input[name=RadioCourtOrderedServices][value=" + 1 + "]").prop('checked', true);
            $(".CourtOrderedServicesDetail").removeAttr('hidden');
        }
        if (result.LegalDetails[0].CourtOrderedServices == false) {
            $("input[name=RadioCourtOrderedServices][value=" + 0 + "]").prop('checked', true);
        }
     
        $("#TextBoxCourtOrderedServicesDetail").val(result.LegalDetails[0].CourtOrderedServicesDetail);
        if (result.LegalDetails[0].MemberAssisstancewithTransportation == true) {
            $("input[name=RadioMemberAssisstancewithTransportation][value=" +1 + "]").prop('checked', true);
        }
        if (result.LegalDetails[0].MemberAssisstancewithTransportation == false){
            $("input[name=RadioMemberAssisstancewithTransportation][value=" +1 + "]").prop('checked', true);
        }
    }
    else {
        HandleStartSection("generalLegal", status, "statusStartLegal", "statusCompletedLegal", "statusInprogressLegal");
    }
}
function IndependentLivingSkillsDetails(result, status) {
    if (result.IndependentLivingSkillsDetails[0] != undefined) {
        if (result.IndependentLivingSkillsDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartLivingSkills", "statusCompletedLivingSkills", "statusInprogressLivingSkills");
        } else {
            HandleInprogressSection(status, "statusStartLivingSkills", "statusCompletedLivingSkills", "statusInprogressLivingSkills");
        }
        $("#TextBoxAssessmentIndependentLivingSkillsId").val(result.IndependentLivingSkillsDetails[0].AssessmentIndependentLivingSkillsId);

        $('#DropDownLanguageSkills').val(result.IndependentLivingSkillsDetails[0].LanguageSkills);
        $('#DropDownMemoryLearning').val(result.IndependentLivingSkillsDetails[0].MemoryLearning);
        $('#DropDownAbilityToAction').val(result.IndependentLivingSkillsDetails[0].AbilityToAction);
        $('#DropDownNeedsAssistanceEating').val(result.IndependentLivingSkillsDetails[0].NeedsAssistanceEating);
        $('#DropDownMealPreparation').val(result.IndependentLivingSkillsDetails[0].MealPreparation);
        $('#DropDownHousekeepingCleanliness').val(result.IndependentLivingSkillsDetails[0].HousekeepingCleanliness);
        $('#DropDownManagingFinances').val(result.IndependentLivingSkillsDetails[0].ManagingFinances);
        $('#DropDownManagingMedications').val(result.IndependentLivingSkillsDetails[0].ManagingMedications);
        $('#DropDownPhoneUse').val(result.IndependentLivingSkillsDetails[0].PhoneUse);
        $('#DropDownTransportation').val(result.IndependentLivingSkillsDetails[0].Transportation);
        $('#DropDownProblematicSocialBehaviors').val(result.IndependentLivingSkillsDetails[0].ProblematicSocialBehaviors);
        $('#DropDownHealthComponents').val(result.IndependentLivingSkillsDetails[0].HealthComponents);
        $('#DropDownIndividualHaveSupportToHelp').val(result.IndependentLivingSkillsDetails[0].IndividualHaveSupportToHelp);
        $('#DropDownDevelopmentalMilestones').val(result.IndependentLivingSkillsDetails[0].DevelopmentalMilestones);
        $('#DropDownSelfPreservationSkills').val(result.IndependentLivingSkillsDetails[0].SelfPreservationSkills);
        // $("#TextBoxStatus").val(result.IndependentLivingSkillsDetails[0].Status);
    }
    else {
        HandleStartSection("livingSkills", status, "statusStartLivingSkills", "statusCompletedLivingSkills", "statusInprogressLivingSkills");
    }
}
function HousingDetails(result, status) {
    if (result.HousingDetails[0] != undefined) {
        if (result.HousingDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartHousing", "statusCompletedHousing", "statusInprogressHousing");
        } else {
            HandleInprogressSection(status, "statusStartHousing", "statusCompletedHousing", "statusInprogressHousing");
        }
        $("#TextBoxAssessmentHousingId").val(result.HousingDetails[0].AssessmentHousingId);
        $("input[name='RadioMemberCurrentlyLiving'][value = " + result.HousingDetails[0].MemberCurrentlyLiving + "]").prop('checked', true);

        if (result.HousingDetails[0].MemberCurrentlyLiving == 1) {
            $(".HouseApartment").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 2) {
            $(".FriendRelativeHome").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 3) {
            $(".ImmediateGuardian").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 4) {
            $(".RemainRespiteCare").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 5) {
            $(".HalfwayHouse").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 7) {
            $(".HomelessWithOthers").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 8) {
            $(".HomelessRegistered").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberCurrentlyLiving == 9) {
            $(".HousingDetail").removeAttr('hidden');
        }
        $("input[name='RadioHouseApartmentType'][value = " + result.HousingDetails[0].HouseApartmentType + "]").prop('checked', true);
        if (result.HousingDetails[0].LeaseOrMemberName == true) {
            $("input[name=RadioLeaseOrMemberName][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].LeaseOrMemberName == false) {
            $("input[name=RadioLeaseOrMemberName][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].PlaceofHouseStable == true) {
            $("input[name=RadioPlaceofHouseStable][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].PlaceofHouseStable == false) {
            $("input[name=RadioPlaceofHouseStable][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].CourtOrderedServices == true) {
            $(".CourtOrderedServicesDetail").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemebrGiveConsentToSpeak == true) {
            $("input[name=RadioMemebrGiveConsentToSpeak][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].MemebrGiveConsentToSpeak == false) {
            $("input[name=RadioMemebrGiveConsentToSpeak][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxFriendRelativeHomeDetail").val(result.HousingDetails[0].FriendRelativeHomeDetail);
        $("#TextBoxMemberRemainFriendRelativeHome").val(result.HousingDetails[0].MemberRemainFriendRelativeHome);
        $("#TextBoxMemberRemainParentImmediateGuardian").val(result.HousingDetails[0].MemberRemainParentImmediateGuardian);
        $("#TextBoxMemberRemainRespiteCare").val(result.HousingDetails[0].MemberRemainRespiteCare);
        $("#TextBoxMemberRemainHalfwayHouse").val(result.HousingDetails[0].MemberRemainHalfwayHouse);
        $("#TextBoxMemberRemainHomelessStreet").val(result.HousingDetails[0].MemberRemainHomelessStreet);
        $("#TextBoxMemberRemainHomelessWithOthers").val(result.HousingDetails[0].MemberRemainHomelessWithOthers);
        $("#TextBoxMemberRemainHomelessRegistered").val(result.HousingDetails[0].MemberRemainHomelessRegistered);
        $("#TextBoxSupportedHousingDetail").val(result.HousingDetails[0].SupportedHousingDetail);
        $("#TextBoxMemberRemainsupportedHousing").val(result.HousingDetails[0].MemberRemainsupportedHousing);

        $("#TextBoxTimeMemberResidingCurrentLocation").val(result.HousingDetails[0].TimeMemberResidingCurrentLocation);
        if (result.HousingDetails[0].ConcernsCurrentLiving == true) {
            $("input[name=RadioConcernsCurrentLiving][value=" + 1 + "]").prop('checked', true);
            $(".LivingDetails").removeAttr('hidden');
        }
        if (result.HousingDetails[0].ConcernsCurrentLiving == false) {
            $("input[name=RadioConcernsCurrentLiving][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxConcernsCurrentLivingDetails").val(result.HousingDetails[0].ConcernsCurrentLivingDetails);
        if (result.HousingDetails[0].MemberRiskLoosingCurrentHousing == true) {
            $("input[name=RadioMemberRiskLoosingCurrentHousing][value=" + 1 + "]").prop('checked', true);
            $(".RiskLoosingCurrentHousing").removeAttr('hidden');
        }
        if (result.HousingDetails[0].MemberRiskLoosingCurrentHousing == false) {
            $("input[name=RadioMemberRiskLoosingCurrentHousing][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].RentArrears = 'Y') {
            $('input[name=RadioRentArrears]').prop('checked', true);
            $(".RentArrearsSpecifyAmount").removeAttr('hidden');
        }
        $("#TextBoxRentArrearsSpecifyAmount").val(result.HousingDetails[0].RentArrearsSpecifyAmount);

        if (result.HousingDetails[0].LossOfHousingSubsidy = 'Y') {
            $('input[name=RadioLossOfHousingSubsidy]').prop('checked', true);
        }
        if (result.HousingDetails[0].LandlordIssue = 'Y') {
            $('input[name=RadioLandlordIssue]').prop('checked', true);
        }

        if (result.HousingDetails[0].Other = 'Y') {
            $('input[name=RadioOther]').prop('checked', true);
            $(".OtherSpecify").removeAttr('hidden');
        }
        $("#TextBoxOtherSpecify").val(result.HousingDetails[0].OtherSpecify);
        if (result.HousingDetails[0].RecievedNoticeCityMarshal == true) {
            $("input[name=RadioRecievedNoticeCityMarshal][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].RecievedNoticeCityMarshal == false) {
            $("input[name=RadioRecievedNoticeCityMarshal][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxAddressLossOfHousing").val(result.HousingDetails[0].AddressLossOfHousing);
        if (result.HousingDetails[0].MemberInEvictionProceedings == true) {
            $("input[name=RadioMemberInEvictionProceedings][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].MemberInEvictionProceedings == false) {
            $("input[name=RadioMemberInEvictionProceedings][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].WorkingWithAttorney == true) {
            $("input[name=RadioWorkingWithAttorney][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].WorkingWithAttorney == false) {
            $("input[name=RadioWorkingWithAttorney][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].ConsentToSpeakAttorney == true) {
            $("input[name=RadioConsentToSpeakAttorney][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].ConsentToSpeakAttorney == false) {
            $("input[name=RadioConsentToSpeakAttorney][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].APSInvolved == true) {
            $("input[name=RadioAPSInvolved][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].APSInvolved == false) {
            $("input[name=RadioAPSInvolved][value=" + 0 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].OtherHousingOptions == true) {
            $("input[name=RadioOtherHousingOptions][value=" + 1 + "]").prop('checked', true);
            $(".OptionsDetail").removeAttr('hidden');
        }
        if (result.HousingDetails[0].OtherHousingOptions == false) {
            $("input[name=RadioOtherHousingOptions][value=" + 0 + "]").prop('checked', true);
        }

        $("#TextBoxOtherHousingOptionsDetail").val(result.HousingDetails[0].OtherHousingOptionsDetail);
        if (result.HousingDetails[0].AcceptReferralShelter == true) {
            $("input[name=RadioAcceptReferralShelter][value=" + 1 + "]").prop('checked', true);
        }
        if (result.HousingDetails[0].AcceptReferralShelter == false) {
            $("input[name=RadioAcceptReferralShelter][value=" + 0 + "]").prop('checked', true);
        }
    }
    else {
        HandleStartSection("housingSecton", status, "statusStartHousing", "statusCompletedHousing", "statusInprogressHousing");
    }
}
function GeneralDetails(result, status) {
    if (result.GeneralDetails[0] != undefined) {

        if (result.GeneralDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartGeneral", "statusCompletedGeneral", "statusInprogressGeneral");
        } else {
            HandleInprogressSection(status, "statusStartGeneral", "statusCompletedGeneral", "statusInprogressGeneral");
        }
        $("#TextBoxAssessmentGeneralId").val(result.GeneralDetails[0].AssessmentGeneralId);

        $("#TextBoxNotes").val(result.GeneralDetails[0].Notes);
        $("#TextBoxElectronicSignature").val(result.GeneralDetails[0].ElectronicSignature);
        $("#TextBoxDate").val(result.GeneralDetails[0].Date);
        $("#TextBoxStaffName").val(result.GeneralDetails[0].StaffName);
        $("#TextBoxStaffTitle").val(result.GeneralDetails[0].StaffTitle);
        $("#TextBoxStaffCredentials").val(result.GeneralDetails[0].StaffCredentials);
        $("#TextBoxSignedDateTime").val(result.GeneralDetails[0].SignedDateTime);
    }
    else {
        HandleStartSection("generalSection", status, "statusStartGeneral", "statusCompletedGeneral", "statusInprogressGeneral");
    }
}
function FinancialDetails(result, status) {
    if (result.FinancialDetails[0] != undefined) {
        if (result.FinancialDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartFinancial", "statusCompletedFinancial", "statusInprogressFinancial");
        } else {
            HandleInprogressSection(status, "statusStartFinancial", "statusCompletedFinancial", "statusInprogressFinancial");
        }

        $("#TextBoxAssessmentFinancialId").val(result.FinancialDetails[0].AssessmentFinancialId);
        $("#TextBoxMembersMonthlyIncome").val(result.FinancialDetails[0].MembersMonthlyIncome);
        $("#TextBoxSourceOfIncome").val(result.FinancialDetails[0].SourceOfIncome);
        $("#TextBoxPeopleResideInHousehold").val(result.FinancialDetails[0].PeopleResideInHousehold);
        $("#TextBoxPeopleResideInHouseholdDependents").val(result.FinancialDetails[0].PeopleResideInHouseholdDependents);
        $("#TextBoxMonthlyCostOfRent").val(result.FinancialDetails[0].MonthlyCostOfRent);
    }
    else {
        HandleStartSection("financialSection", status, "statusStartFinancial", "statusCompletedFinancial", "statusInprogressFinancial");
    }
}
function EducationalVocationalStatusDetails(result, status) {
    if (result.EducationalVocationalStatusDetails[0] != undefined) {

        if (result.EducationalVocationalStatusDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartVocational", "statusCompletedVocational", "statusInprogressVocational");
        } else {
            HandleInprogressSection(status, "statusStartVocational", "statusCompletedVocational", "statusInprogressVocational");
        }
        $("#TextBoxAssessmentEducationalVocationalStatusId").val(result.EducationalVocationalStatusDetails[0].AssessmentEducationalVocationalStatusId);

        $("#TextBoxEducation").val(result.EducationalVocationalStatusDetails[0].Education);
        $("#TextBoxLevelOfEducation").val(result.EducationalVocationalStatusDetails[0].LevelOfEducation);
        if (result.EducationalVocationalStatusDetails[0].InSchool == true) {
            $("input[name=RadioInSchool][value=" + 1 + "]").prop('checked', true);
            $(".schoolRadio").removeAttr('hidden');
        }
        if (result.EducationalVocationalStatusDetails[0].InSchool == false) {
            $("input[name=RadioInSchool][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPreSchoolInformation").val(result.EducationalVocationalStatusDetails[0].PreSchoolInformation);
        $("#TextBoxCurrentEducationalPlan").val(result.EducationalVocationalStatusDetails[0].CurrentEducationalPlan);
        $("#TextBoxCurrentServicesAndAccommodations").val(result.EducationalVocationalStatusDetails[0].CurrentServicesAndAccommodations);
        $("#TextBoxMyDay").val(result.EducationalVocationalStatusDetails[0].MyDay);
        //$("#TextBoxStatus").val(result.EducationalVocationalStatusDetails[0].Status);
    }
    else {
        HandleStartSection("vocationalStatus", status, "statusStartVocational", "statusCompletedVocational", "statusInprogressVocational");
    }
}
function DomesticViolanceDetails(result, status) {
    if (result.DomesticViolanceDetails[0] != undefined) {
        if (result.DomesticViolanceDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartDomesticViolance", "statusCompletedDomesticViolance", "statusInprogressDomesticViolance");
        } else {
            HandleInprogressSection(status, "statusStartDomesticViolance", "statusCompletedDomesticViolance", "statusInprogressDomesticViolance");
        }

        $("#TextBoxAssessmentDomesticViolanceId").val(result.DomesticViolanceDetails[0].AssessmentDomesticViolanceId);
        if (result.DomesticViolanceDetails[0].MemberFeelSafeWithPeople == true) {
            $("input[name=RadioMemberFeelSafeWithPeople][value=" + 1 + "]").prop('checked', true);
            $(".MemberFeelSafeWithPeopleDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberFeelSafeWithPeople == false) {
            $("input[name=RadioMemberFeelSafeWithPeople][value=" + 0 + "]").prop('checked', true);
        }
       
        $("#TextBoxMemberFeelSafeWithPeopleDetail").val(result.DomesticViolanceDetails[0].MemberFeelSafeWithPeopleDetail);
        if (result.DomesticViolanceDetails[0].MemberNotFeelSafeWithPeople == true) {
            $("input[name=RadioMemberNotFeelSafeWithPeople][value=" + 1 + "]").prop('checked', true);
            $(".MemberNotFeelSafeWithPeopleDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberNotFeelSafeWithPeople == false) {
            $("input[name=RadioMemberNotFeelSafeWithPeople][value=" + 0 + "]").prop('checked', true);
        }
       
        $("#TextBoxMemberNotFeelSafeWithPeopleDetail").val(result.DomesticViolanceDetails[0].MemberNotFeelSafeWithPeopleDetail);
        if (result.DomesticViolanceDetails[0].MemberVictimDomesticViolance == true) {
            $("input[name=RadioMemberVictimDomesticViolance][value=" + 1 + "]").prop('checked', true);
            $(".MemberVictimDomesticViolanceDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberVictimDomesticViolance == false) {
            $("input[name=RadioMemberVictimDomesticViolance][value=" + 0+ "]").prop('checked', true);
        }
        
        $("#TextBoxMemberVictimDomesticViolanceDetail").val(result.DomesticViolanceDetails[0].MemberVictimDomesticViolanceDetail);
        if (result.DomesticViolanceDetails[0].MemberFeelsLifeInDanger == true) {
            $("input[name=RadioMemberFeelsLifeInDanger][value=" + 1 + "]").prop('checked', true);
            $(".MemberFeelsLifeInDangerDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberFeelsLifeInDanger == false) {
            $("input[name=RadioMemberFeelsLifeInDanger][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberFeelsLifeInDangerDetail").val(result.DomesticViolanceDetails[0].MemberFeelsLifeInDangerDetail);
        if (result.DomesticViolanceDetails[0].UnderstandsDomesticViolance == true) {
            $("input[name=RadioUnderstandsDomesticViolance][value=" + 1 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].UnderstandsDomesticViolance == false) {
            $("input[name=RadioUnderstandsDomesticViolance][value=" + 0 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].OtherPersonMakesAfraid == true) {
            $("input[name=RadioOtherPersonMakesAfraid][value=" + 1 + "]").prop('checked', true);
            $(".OtherPersonMakesAfraidDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].OtherPersonMakesAfraid == false) {
            $("input[name=RadioOtherPersonMakesAfraid][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxOtherPersonMakesAfraidDetail").val(result.DomesticViolanceDetails[0].OtherPersonMakesAfraidDetail);
        if (result.DomesticViolanceDetails[0].DoneAnythingInLifePlan == true) {
            $("input[name=RadioDoneAnythingInLifePlan][value=" + 1 + "]").prop('checked', true);
            $(".DoneAnythingInLifePlanDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].DoneAnythingInLifePlan == false) {
            $("input[name=RadioDoneAnythingInLifePlan][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxDoneAnythingInLifePlanDetail").val(result.DomesticViolanceDetails[0].DoneAnythingInLifePlanDetail);
        $("#TextBoxWhenPersonDisagreeAbove").val(result.DomesticViolanceDetails[0].WhenPersonDisagreeAbove);
        if (result.DomesticViolanceDetails[0].PhysicalFightingInRelationship == true) {
            $("input[name=RadioPhysicalFightingInRelationship][value=" + 1 + "]").prop('checked', true);
            $(".PhysicalFightingInRelationshipDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].PhysicalFightingInRelationship == false) {
            $("input[name=RadioPhysicalFightingInRelationship][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxPhysicalFightingInRelationshipDetail").val(result.DomesticViolanceDetails[0].PhysicalFightingInRelationshipDetail);
        if (result.DomesticViolanceDetails[0].PoliceInvolvementInViolance == true) {
            $("input[name=RadioPoliceInvolvementInViolance][value=" + 1 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].PoliceInvolvementInViolance == false) {
            $("input[name=RadioPoliceInvolvementInViolance][value=" + 0 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].ProtectionAgainstMember == true) {
            $("input[name=RadioProtectionAgainstMember][value=" + 1 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].ProtectionAgainstMember == false) {
            $("input[name=RadioProtectionAgainstMember][value=" + 0 + "]").prop('checked', true);
        }
        if (result.DomesticViolanceDetails[0].OtherPersonCriticizedMember == true) {
            $("input[name=RadioOtherPersonCriticizedMember][value=" + 1 + "]").prop('checked', true);
            $(".OtherPersonCriticizedMemberDetial").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].OtherPersonCriticizedMember == false) {
            $("input[name=RadioOtherPersonCriticizedMember][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxOtherPersonCriticizedMemberDetial").val(result.DomesticViolanceDetails[0].OtherPersonCriticizedMemberDetial);
        if (result.DomesticViolanceDetails[0].MemberEverInstitutionalization == true) {
            $("input[name=RadioMemberEverInstitutionalization][value=" + 1 + "]").prop('checked', true);
            $(".MemberEverInstitutionalizationDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberEverInstitutionalization == false) {
            $("input[name=RadioMemberEverInstitutionalization][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberEverInstitutionalizationDetail").val(result.DomesticViolanceDetails[0].MemberEverInstitutionalizationDetail);
        if (result.DomesticViolanceDetails[0].MemberIsolatedEverdayLiving == true) {
            $("input[name=RadioMemberIsolatedEverdayLiving][value=" + 1 + "]").prop('checked', true);
            $(".MemberIsolatedEverdayLivingDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberIsolatedEverdayLiving == false) {
            $("input[name=RadioMemberIsolatedEverdayLiving][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberIsolatedEverdayLivingDetail").val(result.DomesticViolanceDetails[0].MemberIsolatedEverdayLivingDetail);
        if (result.DomesticViolanceDetails[0].ObligatedInSexWitihIdentifiedAbuser == true) {
            $("input[name=RadioObligatedInSexWitihIdentifiedAbuser][value=" + 1 + "]").prop('checked', true);
            $(".ObligatedInSexWitihIdentifiedAbuserDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].ObligatedInSexWitihIdentifiedAbuser == false) {
            $("input[name=RadioObligatedInSexWitihIdentifiedAbuser][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxObligatedInSexWitihIdentifiedAbuserDetail").val(result.DomesticViolanceDetails[0].ObligatedInSexWitihIdentifiedAbuserDetail);
        if (result.DomesticViolanceDetails[0].TouchedInSexualWithoutPermission == true) {
            $("input[name=RadioTouchedInSexualWithoutPermission][value=" + 1 + "]").prop('checked', true);
            $(".TouchedInSexualWithoutPermissionDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].TouchedInSexualWithoutPermission == false) {
            $("input[name=RadioTouchedInSexualWithoutPermission][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxTouchedInSexualWithoutPermissionDetail").val(result.DomesticViolanceDetails[0].TouchedInSexualWithoutPermissionDetail);
        if (result.DomesticViolanceDetails[0].MemberMoneyUsedInappropriately == true) {
            $("input[name=RadioMemberMoneyUsedInappropriately][value=" + 1 + "]").prop('checked', true);
            $(".MemberMoneyUsedInappropriatelyDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].MemberMoneyUsedInappropriately == false) {
            $("input[name=RadioMemberMoneyUsedInappropriately][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxMemberMoneyUsedInappropriatelyDetail").val(result.DomesticViolanceDetails[0].MemberMoneyUsedInappropriatelyDetail);
        if (result.DomesticViolanceDetails[0].ForcedToMakeFinancialDecisions == true) {
            $("input[name=RadioForcedToMakeFinancialDecisions][value=" + 1 + "]").prop('checked', true);
            $(".ForcedToMakeFinancialDecisionsDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].ForcedToMakeFinancialDecisions == false) {
            $("input[name=RadioForcedToMakeFinancialDecisions][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxForcedToMakeFinancialDecisionsDetail").val(result.DomesticViolanceDetails[0].ForcedToMakeFinancialDecisionsDetail);
        if (result.DomesticViolanceDetails[0].ForcedToSignDocuments == true) {
            $("input[name=RadioForcedToSignDocuments][value=" + 1 + "]").prop('checked', true);
            $(".ForcedToSignDocumentsDetail").removeAttr('hidden');
        }
        if (result.DomesticViolanceDetails[0].ForcedToSignDocuments == false) {
            $("input[name=RadioForcedToSignDocuments][value=" + 0 + "]").prop('checked', true);
        }
       
        $("#TextBoxForcedToSignDocumentsDetail").val(result.DomesticViolanceDetails[0].ForcedToSignDocumentsDetail);

    }
    else {
        HandleStartSection("domesticViolence", status, "statusStartDomesticViolance", "statusCompletedDomesticViolance", "statusInprogressDomesticViolance");
    }
}
function DepressionScreeningDetails(result, status) {
    if (result.DepressionScreeningDetails[0] != undefined) {
        if (result.DepressionScreeningDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartDepression", "statusCompletedDepression", "statusInprogressDepression");
        } else {
            HandleInprogressSection(status, "statusStartDepression", "statusCompletedDepression", "statusInprogressDepression");
        }
        $("#TextBoxAssessmentDepressionScreeningId").val(result.DepressionScreeningDetails[0].AssessmentDepressionScreeningId);
        $("input[name=RadioLittleInterestInDoingThings][value=" + result.DepressionScreeningDetails[0].LittleInterestInDoingThings + "]").prop('checked', true);
        $("input[name=RadioFeelingDownOrDepressed][value=" + result.DepressionScreeningDetails[0].FeelingDownOrDepressed + "]").prop('checked', true);
    }
    else {
        HandleStartSection("depressionScreening", status, "statusStartDepression", "statusCompletedDepression", "statusInprogressDepression");
    }
}
function BehavioralSupportServicesDetails(result, status) {
    if (result.BehavioralSupportServicesDetails[0] != undefined) {
        if (result.BehavioralSupportServicesDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartBehavioralSupport", "statusCompletedBehavioralSupport", "statusInprogressBehavioralSupport");
        } else {
            HandleInprogressSection(status, "statusStartBehavioralSupport", "statusCompletedBehavioralSupport", "statusInprogressBehavioralSupport");
        }
        $("#TextBoxAssessmentBehavioralSupportServicesId").val(result.BehavioralSupportServicesDetails[0].AssessmentBehavioralSupportServicesId);

        $("#TextBoxChallengingBehaviors").val(result.BehavioralSupportServicesDetails[0].ChallengingBehaviors);
        if (result.BehavioralSupportServicesDetails[0].BehaviorSupportPlan == true) {
            $("input[name=RadioBehaviorSupportPlan][value=" + 1 + "]").prop('checked', true);
            $(".bspRadio").removeAttr('hidden');
        }
        if (result.BehavioralSupportServicesDetails[0].BehaviorSupportPlan == false) {
            $("input[name=RadioBehaviorSupportPlan][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxBehaviorSupportPlanDetails").val(result.BehavioralSupportServicesDetails[0].BehaviorSupportPlanDetails);
        $("#TextBoxRestrictivePhysicalInterventions").val(result.BehavioralSupportServicesDetails[0].RestrictivePhysicalInterventions);
        $("#TextBoxSkillsAndResourcesNeeded").val(result.BehavioralSupportServicesDetails[0].SkillsAndResources);
        $("#TextBoxStrengthsOfIndividual").val(result.BehavioralSupportServicesDetails[0].StrengthsOfIndividual);
        if (result.BehavioralSupportServicesDetails[0].IsEngagementInTreatmentPlan == true) {
            $("input[name=RadioIsEngagementInTreatmentPlan][value=" + 1 + "]").prop('checked', true);
            $(".treatmentPlanRadio").removeAttr('hidden');
        }
        if (result.BehavioralSupportServicesDetails[0].IsEngagementInTreatmentPlan == false) {
            $("input[name=RadioIsEngagementInTreatmentPlan][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEngagementInTreatmentPlanDetails").val(result.BehavioralSupportServicesDetails[0].EngagementInTreatmentPlanDetails);
        $("#TextBoxIdentifyBarriersToService").val(result.BehavioralSupportServicesDetails[0].IdentifyBarriersToService);
        // $("#TextBoxStatus").val(result.BehavioralSupportServicesDetails[0].Status);
    }

    else {
        HandleStartSection("supportServices", status, "statusStartBehavioralSupport", "statusCompletedBehavioralSupport", "statusInprogressBehavioralSupport");
    }
}
function AreasSafeguardReviewDetails(result, status) {
    if (result.AreasSafeguardReviewDetails[0] != undefined) {

        if (result.AreasSafeguardReviewDetails[0].Status == "Completed") {
            HandleCompleteSection(status, "statusStartSafeguardReview", "statusCompletedSafeguardReview", "statusInprogressSafeguardReview");
        } else {
            HandleInprogressSection(status, "statusStartSafeguardReview", "statusCompletedSafeguardReview", "statusInprogressSafeguardReview");
        }
        $("#TextBoxAssessmentAreasSafeguardReviewId").val(result.AreasSafeguardReviewDetails[0].AssessmentAreasSafeguardReviewId);
        if (result.AreasSafeguardReviewDetails[0].Choking == true) {
            $("input[name=RadioChoking][value=" + 1 + "]").prop('checked', true);
            $(".ChokingRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].Choking == false) {
            $("input[name=RadioChoking][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxChokingDetails").val(result.AreasSafeguardReviewDetails[0].ChokingDetails);
        if (result.AreasSafeguardReviewDetails[0].RiskOfFalls == true) {
            $("input[name=RadioRiskOfFalls][value=" + 1 + "]").prop('checked', true);
            $(".fallsRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].RiskOfFalls == false) {
            $("input[name=RadioRiskOfFalls][value=" + 0 + "]").prop('checked', true);
        }
       
        $("#TextBoxRiskOfFallsDetails").val(result.AreasSafeguardReviewDetails[0].RiskOfFallsDetails);
        if (result.AreasSafeguardReviewDetails[0].SelfHarmBehaviors == true) {
            $("input[name=RadioSelfHarmBehaviors][value=" + 1 + "]").prop('checked', true);
            $(".behaviorsRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].SelfHarmBehaviors == false) {
            $("input[name=RadioSelfHarmBehaviors][value=" + 0 + "]").prop('checked', true);
        }
       
        $("#TextBoxSelfHarmBehaviorsDetails").val(result.AreasSafeguardReviewDetails[0].SelfHarmBehaviorsDetails);
        if (result.AreasSafeguardReviewDetails[0].FireSafety == true) {
            $("input[name=RadioFireSafety][value=" + 1 + "]").prop('checked', true);
            $(".safetyRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].FireSafety == false) {
            $("input[name=RadioFireSafety][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxFireSafetyDetails").val(result.AreasSafeguardReviewDetails[0].FireSafetyDetails);
        if (result.AreasSafeguardReviewDetails[0].SafetyInTheCommunity == true) {
            $("input[name=RadioSafetyInTheCommunity][value=" + 1 + "]").prop('checked', true);
            $(".saftycommunityRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].SafetyInTheCommunity == false) {
            $("input[name=RadioSafetyInTheCommunity][value=" + 0 + "]").prop('checked', true);
        }

        $("#TextBoxSafetyInTheCommunityDetails").val(result.AreasSafeguardReviewDetails[0].SafetyInTheCommunityDetails);
        if (result.AreasSafeguardReviewDetails[0].HousingFoodInstability == true) {
            $("input[name=RadioHousingFoodInstability][value=" + 1 + "]").prop('checked', true);
            $(".instability").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].HousingFoodInstability == false) {
            $("input[name=RadioHousingFoodInstability][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxHousingFoodInstabilityDetails").val(result.AreasSafeguardReviewDetails[0].HousingFoodInstabilityDetails);
        if (result.AreasSafeguardReviewDetails[0].EmergencyEvacuation == true) {
            $("input[name=RadioEmergencyEvacuation][value=" + 1 + "]").prop('checked', true);
            $(".evacuationRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].EmergencyEvacuation == false) {
            $("input[name=RadioEmergencyEvacuation][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxEmergencyEvacuationDetails").val(result.AreasSafeguardReviewDetails[0].EmergencyEvacuationDetails);
        if (result.AreasSafeguardReviewDetails[0].BackupPlanEmergencySituations == true) {
            $("input[name=RadioBackupPlanEmergencySituations][value=" + 1 + "]").prop('checked', true);
            $(".emergencyRadio").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].BackupPlanEmergencySituations == false) {
            $("input[name=RadioBackupPlanEmergencySituations][value=" + 0 + "]").prop('checked', true);
        }
  
        $("#TextBoxBackupPlanEmergencySituationsDetails").val(result.AreasSafeguardReviewDetails[0].BackupPlanEmergencySituationsDetails);
        if (result.AreasSafeguardReviewDetails[0].LevelOfIndependence == true) {
            $("input[name=RadioLevelOfIndependence][value=" + 1 + "]").prop('checked', true);
            $(".medication").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].LevelOfIndependence == false) {
            $("input[name=RadioLevelOfIndependence][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxLevelOfIndependenceDetails").val(result.AreasSafeguardReviewDetails[0].LevelOfIndependenceDetails);
        if (result.AreasSafeguardReviewDetails[0].LevelOfSupervision == true) {
            $("input[name=RadioLevelOfSupervision][value=" + 1 + "]").prop('checked', true);
            $(".Community").removeAttr('hidden');
        }
        if (result.AreasSafeguardReviewDetails[0].LevelOfSupervision == false) {
            $("input[name=RadioLevelOfSupervision][value=" + 0 + "]").prop('checked', true);
        }
        $("#TextBoxLevelOfSupervisionDetails").val(result.AreasSafeguardReviewDetails[0].LevelOfSupervisionDetails);
        //$("#TextBoxStatus").val(result.LegalDetails[0].Status);
    }

    else {
        HandleStartSection("safeguardReview", status, "statusStartSafeguardReview", "statusCompletedSafeguardReview", "statusInprogressSafeguardReview");
    }
}
//#endregion //