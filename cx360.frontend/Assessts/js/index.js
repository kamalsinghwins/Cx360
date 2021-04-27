
var token,
    incidentType,
    IncidentManagementId,
    currentRow,
    reportedBy,
    currentRowMedication,
    managementid;
var datatableFlag = false;
var dataTableMedicationFlg = false;
var dataTableNotificationFlg = false;
var selectedText;
var selectedValue;
var currentRowNotification;
var Notification;
var uploadFile;
var clientId;
var incidentRolePermissions,
    editPermission, deletePermission;
var incidentManagementId, blankIncidentManagementId;
$(document).ready(function () {
    if (!authenticateUser()) return;
    $(".select2").select2();
    InitalizeDateControls();
    CloseErrorMeeage();
    AddMedication();
    AddBodyParts();
    BindDropDowns();
    GetIncidentRolesPermissions();
    HideStateForms();
    AddOPWDD147Notifiaction();
    InitalizeUploadPDF();
    ValidateUploadedFile();
    $('.radio-group .radio').click(function () {
        $(this).parent().find('.radio').removeClass('selected');
        $(this).addClass('selected');
    });

    $('#BtnBodyDiagram').click(function () {
        $('.bodyDiagram').toggleClass('hidden');
        $("#frontBody").tab("show");
        $("#BackBodyDropDwon").addClass("hidden");
        $("#frontBodyDropDwon").removeClass("hidden");
    });
    $('#AddMedication').click(function () {
        $('.medicationDesc').toggleClass('hidden');
    });
    $('#AddNotifications').click(function () {
        $('.notificationDesc').toggleClass('hidden');
    });
    $('.navMenu li').on('click', function () {
        $('.navMenu li').removeClass('active');
        $(this).addClass('active');
    });

    $(".close").click(function () {
        $(this).closest("span").addClass("hidden");
    });
    $("#BtnBodyDiagram").click(function () {
        $("#modalBodyParts").modal("show");
    })
    $("input[name$='RadioInjuryWas']").click(function () {
        var test = $(this).val();
        if (test == "false") {
            $("#ObservedDate").removeClass("hidden");
            $("#ObservedTime").removeClass("hidden");
            $("#DiscoveredDate").addClass("hidden");
            $("#DiscoveredTime").addClass("hidden");
        }
        else {
            $("#DiscoveredDate").removeClass("hidden");
            $("#DiscoveredTime").removeClass("hidden");
            $("#ObservedDate").addClass("hidden");
            $("#ObservedTime").addClass("hidden");
        }
    });
    $("input[name$='RadioEventWas']").click(function () {
        var test = $(this).val();
        if (test == "false") {
            $("#OtherObserverDate").removeClass("hidden");
            $("#OtherObserverTime").removeClass("hidden");
            $("#OtherDiscoveredDate").addClass("hidden");
            $("#OtherDiscoveredTime").addClass("hidden");
        }
        else {
            $("#OtherDiscoveredDate").removeClass("hidden");
            $("#OtherDiscoveredTime").removeClass("hidden");
            $("#OtherObserverDate").addClass("hidden");
            $("#OtherObserverTime").addClass("hidden");
        }
    });
    $("input[name$='RadioDateTimeIncidentWas']").click(function () {
        var test = $(this).val();
        if (test == "0") {
            $("#147ObsDate").removeClass("hidden");
            $("#147ObsTime").removeClass("hidden");
            $("#147DisDate").addClass("hidden");
            $("#147DisTime").addClass("hidden");
        }
        else {
            $("#147DisDate").removeClass("hidden");
            $("#147DisTime").removeClass("hidden");
            $("#147ObsDate").addClass("hidden");
            $("#147ObsTime").addClass("hidden");
        }
    });
    $("input[name$='RadioDateTimeEvent_Situation']").click(function () {
        var test = $(this).val();
        if (test == "0") {
            $("#OP150ObsDate").removeClass("hidden");
            $("#OP150ObsTime").removeClass("hidden");
            $("#OP150DisDate").addClass("hidden");
            $("#OP150DisTime").addClass("hidden");
        }
        else {
            $("#OP150DisDate").removeClass("hidden");
            $("#OP150DisTime").removeClass("hidden");
            $("#OP150ObsDate").addClass("hidden");
            $("#OP150ObsTime").addClass("hidden");
        }
    });
    $('input[name="RadioOther"]').click(function () {
        if ($(this).prop('checked')) {
            $("#TextBoxOtherSpecify").removeClass('hidden');
        } else {
            $("#TextBoxOtherSpecify").addClass('hidden');
        }
    });
    $(".disableTime").click(function () {
        var $elem;
        if ($(this).prop("checked")) {
            $elem = $(this).closest("div").parent().parent().closest("div").find("input.time");
            $($elem).length == 1 ? $($elem).attr("disabled", true) : $($($elem)[0]).attr("disabled", true);
            $($elem).length == 1 ? $($elem).val("") : $($($elem)[0]).val("");
        }
        else {
            $elem = $(this).closest("div").parent().parent().closest("div").find("input.time");
            $($elem).length == 1 ? $($elem).attr("disabled", false) : $($($elem)[0]).attr("disabled", false);;
        }
    });

     incidentManagementId = GetParameterValues('IncidentManagementId');
    //incidentManagementId = generateDecryptURL(window.location.href);
    $(".opd147id").val(incidentManagementId);
    $(".opd148id").val(incidentManagementId);
    $(".opd150id").val(incidentManagementId);
    $(".jlnid").val(incidentManagementId);
    $(".stateformid").val(incidentManagementId);
    if (incidentManagementId > 0) {
        $.ajax({
            type: "POST",
            data: { TabName: "EditAllRecord", IncidentManagementId: incidentManagementId, ReportedBy: reportedBy },
            url: GetAPIEndPoints("EDITALLRECORD"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            },
            success: function (response) {
                if (response.Success == true && response.IsException == false) {
                    clientId = response.IncidentManagementGeneralList[0].ClientId;
                    //injury
                    if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Injury") {
                        BindInjuryDropDowns();
                    }
                    //medication error
                    else if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Medication Error") {
                        BindMedicationErrorDropDowns();
                    }
                    //death
                    else if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Death") {
                        BindDeathDropDowns();
                    }
                    //others
                    else if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Other") {
                        BindOtherDropDowns();
                    }
                    BindJonathanLawDropDowns();
                    setTimeout(function () {
                        $(".loader").fadeOut("slow");
                        FillIncidentMangementGeneral(response);

                    }, 5000);
                }
                else {
                    showErrorMessage(response.Message);
                }


            },
            error: function (xhr) { HandleAPIError(xhr) }
        });

    }
    else {
        $(".loader").hide();
        setTimeout(function () {
            AddNewPermission();
        }, 5000);

    }

});
function GetIncidentRolesPermissions() {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Common/FormUserAccess',
        data: { 'FormName': 'Incident Report Utility' },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            incidentRolePermissions = result;
            editPermission = incidentRolePermissions[1].IsEnable;
            deletePermission = incidentRolePermissions[2].IsEnable;
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function FillIncidentMangementGeneral(response) {

    BindGeneralTab(response);
    BindInjuryTab(response);
    BindManagementErrorTab(response);
    BindDeathTab(response);
    BindOtherTab(response);

    $('.OPWDD147Tab').hide();
    $('.OPWDD148Tab').hide();
    $('.OPWDD150Tab').hide();
    $('.JonathanTab').hide();

    StateFormTab(response);
    BindStateFormOPWDD147Tab(response);
    BindStateformOPWDD148Tab(response);
    BindStateFormOPWDD150(response);
    BindStateFormJonathanLawTab(response);
    CheckUserPermission();
}

function ViewPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".saveBtn").addClass('hidden');
    $(".editSubRows").addClass("disable-click");
    $(".deleteSubRows").addClass("disable-click");
    $(".disabledownloadpdf").addClass("disable-click");
}
function EditViewPermission() {

    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".saveBtn").removeClass('hidden').text('Edit');
    $(".editSubRows").removeClass("disable-click")
    $(".deleteSubRows").addClass("disable-click");
    $(".disabledownloadpdf").addClass("disable-click");

}
function ViewPdfPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").removeClass('hidden');
    $(".saveBtn").addClass('hidden');
    $(".editSubRows").addClass("disable-click")
    $(".deleteSubRows").addClass("disable-click");
    $(".disabledownloadpdf").removeClass("disable-click");

}
function ViewDeletePermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".saveBtn").addClass('hidden');
    $(".editSubRows").addClass("disable-click")
    $(".deleteSubRows").removeClass("disable-click");
    $(".disabledownloadpdf").addClass("disable-click");

}
function AllPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").removeClass('hidden');
    $(".saveBtn").removeClass('hidden').text('Edit');
    $(".editSubRows").removeClass("disable-click")
    $(".deleteSubRows").removeClass("disable-click");
    $(".disabledownloadpdf").removeClass("disable-click");

}

// for all permission will not use any condition
function BindGeneralTab(response) {
    $('#TextBoxIncidentManagementId').val(incidentManagementId);
    $('#TextBoxIncident').val(response.IncidentManagementGeneralList[0].Incident);
    $('#DropDownClientId').select2('val', [response.IncidentManagementGeneralList[0].ClientId]);
    $('#TextBoxDepartment').val(response.IncidentManagementGeneralList[0].Department);
    $('#DropDownIncidentType').val(response.IncidentManagementGeneralList[0].IncidentType);

    managementid = response.IncidentManagementGeneralList[0].IncidentManagementId;
    $('#DropDownSite').select2('val', [response.IncidentManagementGeneralList[0].Site]);
    $('#TextBoxIncidentDate').val(response.IncidentManagementGeneralList[0].IncidentDate);
    $('#TextBoxIncidentDateTime').val(response.IncidentManagementGeneralList[0].IncidentTime);
    $('#TextBoxReportedDate').val(response.IncidentManagementGeneralList[0].ReportedDate);
    $('#DropDownReportedBy').select2('val', [response.IncidentManagementGeneralList[0].ReportedBy]);
    $('#DropDownReportedRelationshipToStaff').select2('val', [response.IncidentManagementGeneralList[0].ReportedRelationshipToStaf]);
    $('#DropDownLocation').select2('val', [response.IncidentManagementGeneralList[0].Location]);
    $("input[name='RadioAbuseSuspected'][value = " + response.IncidentManagementGeneralList[0].AbuseSuspected + "]").prop('checked', true);
    $("input[name='RadioNeglectSuspected'][value = " + response.IncidentManagementGeneralList[0].NeglectSuspected + "]").prop('checked', true);
    $("input[name='RadioExploitationSuspected'][value = " + response.IncidentManagementGeneralList[0].ExploitationSuspected + "]").prop('checked', true);
    $('#TextBoxDescriptionOfTheIncident').val(response.IncidentManagementGeneralList[0].DescriptionOfTheIncident);

}

function BindInjuryTab(response) {
    //Binding Injury 
    if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Injury") {
        $('#nav-injury-tab').removeClass('hidden');
        $('#nav-state-forms-tab').removeClass('hidden');
        $(".injuryid").val(managementid);
        if ($("#BtnBodyDiagram").text() == "Add Injury Body Part") {
            $("#BtnBodyDiagram").text("Review Injury Body Part");
        }
        if (response.IncidentManagementInjuryList[0] != undefined) {

            $('.injuryid').val(incidentManagementId);
            $('#TextBoxIncidentInjuryId').val(response.IncidentManagementInjuryList[0].IncidentInjuryId);
            $('#TextBoxTimeOfInjury').val(response.IncidentManagementInjuryList[0].TimeOfInjury);
            if (response.IncidentManagementInjuryList[0].TimeOfInjuryUnknown == 'Y') {
                $("input[name='CheckboxTimeOfInjuryUnknown']").prop('checked', true);
            }
            $("input[name='RadioInjuryWas'][value = " + response.IncidentManagementInjuryList[0].InjuryWas + "]").prop('checked', true);
            if (response.IncidentManagementInjuryList[0].InjuryWas == false) {
                $("#ObservedDate").removeClass('hidden');
                $("#ObservedTime").removeClass('hidden');
            } else {
                $('#DiscoveredDate').removeClass('hidden');
                $('#DiscoveredTime').removeClass('hidden');
            }
            $('#TextBoxObservedDateTime').val(response.IncidentManagementInjuryList[0].ObservedDate);
            $('#TextBoxInjuryObservedTime').val(response.IncidentManagementInjuryList[0].ObservedTime);
            $('#TextBoxDiscoveredDateTime').val(response.IncidentManagementInjuryList[0].DiscoveredDate);
            $('#TextBoxInjuryDiscoveredTime').val(response.IncidentManagementInjuryList[0].DiscoveredTime);
            $('#DropDownInjuryLocation').select2('val', [response.IncidentManagementInjuryList[0].InjuryLocation]);
            $('#DropDownInjuryCause').select2('val', [response.IncidentManagementInjuryList[0].InjuryCause]);
            $('#DropDownInjurySeverity').select2('val', [response.IncidentManagementInjuryList[0].InjurySeverity]);
            $('#DropDownInjuryColor').select2('val', [response.IncidentManagementInjuryList[0].InjuryColor]);
            $('#TextBoxLength').val(response.IncidentManagementInjuryList[0].InjurySizeLength);
            $('#TextBoxWidth').val(response.IncidentManagementInjuryList[0].InjurySizeWidth);
            $('#TextBoxDepth').val(response.IncidentManagementInjuryList[0].InjurySizeDepth);
            $('#DropDownTreatedByStaff').select2('val', [response.IncidentManagementInjuryList[0].TreatedByStaff]);
            $('#TextBoxTreatmentDate').val(response.IncidentManagementInjuryList[0].TreatmentDate);
            $('#TextBoxDescription').val(response.IncidentManagementInjuryList[0].Description);

            for (var i = 0; i < response.InjuryWitness.length; i++) {
                $("#DropDownWitnessInjury option[value=" + response.InjuryWitness[i].Witness + "]").prop("selected", true).trigger("change");
            }
            if (response.Success == true && response.IsException == false) {
                if (response.InjurySubTableList[0].IncidentInjuryId > -1) {
                    $("#TextBoxIncidentInjuryId").val(response.InjurySubTableList[0].IncidentInjuryId);
                    $('.injurySection .form-control').attr("disabled", true);
                    $('#bodyPartsForm .form-control').attr("disabled", true);
                    $("#AddBodyParts").prop("disabled", true);

                    BindMultipleBodyParts(response.InjurySubTableList[0].JSONData);

                    $('.injurySection  input[type=radio]').prop("disabled", true);
                    if ($("#BtnInjury").text() == "Ok") {
                        $("#BtnInjury").text("Edit");
                    }
                }
            }
        }
    }

}

function BindManagementErrorTab(response) {
    //Binding IncidentMedicationError
    if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Medication Error") {
        $('#nav-medication-error-tab').removeClass('hidden');
        $('#nav-state-forms-tab').removeClass('hidden');
        $(".medicationid").val(managementid);
        if ($("#AddMedication").text() == "Add Medication") {
            $("#AddMedication").text("Review Medication");
        }
        if (response.IncidentManagementMedicationErrorList[0] != undefined) {

            $('.medicationid').val(incidentManagementId);
            $('#TextBoxIncidentMedicationErrorId').val(response.IncidentManagementMedicationErrorList[0].IncidentMedicationErrorId);
            $('#TextBoxTimeOfMedicationError').val(response.IncidentManagementMedicationErrorList[0].TimeOfMedicationError);
            if (response.IncidentManagementMedicationErrorList[0].TimeOfMedicationErrorUnknown == 'Y') {
                $("input[name='CheckboxTimeOfMedicationErrorUnknown']").prop('checked', true);
            }

            $('#TextBoxMedDiscoveredDateTime').val(response.IncidentManagementMedicationErrorList[0].DiscoveredDate);
            $('#TextBoxMedDiscoveredTime').val(response.IncidentManagementMedicationErrorList[0].DiscoveredTime);
            $("#DropDownTypeOfMedError option[value='" + response.IncidentManagementMedicationErrorList[0].TypeOfMedError + "']").attr("selected", "selected");
            $("#DropDownCauseOfMedError option[value='" + response.IncidentManagementMedicationErrorList[0].CauseOfMedError + "']").attr("selected", "selected");
            $("#DropDownSeverityOfMedError option[value='" + response.IncidentManagementMedicationErrorList[0].SeverityOfMedError + "']").attr("selected", "selected");
            $("input[name='RadioMedicalAttentionNeeded'][value = " + response.IncidentManagementMedicationErrorList[0].MedicalAttentionNeeded + "]").prop('checked', true);

            for (var i = 0; i < response.SatfInvolved.length; i++) {
                $("#DropDownStaffInvolved option[value=" + response.SatfInvolved[i].SatffInvolved + "]").prop("selected", true).trigger("change");
            }

            $("input[name='RadioPrescriberNotified'][value = " + response.IncidentManagementMedicationErrorList[0].PrescriberNotified + "]").prop('checked', true);
            $('#TextBoxNameOfPrescriber').val(response.IncidentManagementMedicationErrorList[0].NameOfPrescriber);
            $('#TextBoxNotifiedDate').val(response.IncidentManagementMedicationErrorList[0].NotifiedDate);

            for (var i = 0; i < response.MediWitness.length; i++) {
                $("#DropDownWitnessMedication option[value=" + response.MediWitness[i].MedicationWitness + "]").prop("selected", true).trigger("change");
            }

            if (response.Success == true && response.IsException == false) {
                if (response.InjurySubTableList[0].IncidentMedicationErrorId > -1) {
                    BindMedicationSubFields(response.InjurySubTableList[0].JSONData);
                    $('.medicationError .form-control').attr("disabled", true);
                    $('#MedicationForm .form-control').attr("disabled", true);
                    $("#AddMultiMedication").prop("disabled", true);
                    $('.medicationError  input[type=radio]').prop("disabled", true);
                    if ($("#btnMedicationError").text() == "Ok") {
                        $("#btnMedicationError").text("Edit");
                        $("#btnMedicationError").addClass("edit")
                    }
                }
            }
        }
    }

}

function BindDeathTab(response) {
    //Binding IncidentDeath
    if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Death") {
        $('#nav-death-tab').removeClass('hidden');
        $('#nav-state-forms-tab').removeClass('hidden');
        $(".deathid").val(managementid);

        if (response.IncidentManagementDeathList[0] != undefined) {

            $('.deathid').val(incidentManagementId);
            $('#TextBoxIncidentDeathId').val(response.IncidentManagementDeathList[0].IncidentDeathId);
            $('.deathSection #TextBoxTimeOfDeath').val(response.IncidentManagementDeathList[0].TimeOfDeath);
            if (response.IncidentManagementDeathList[0].TimeOfDeathUnknown == 'Y') {
                $(".deathSection input[name='CheckboxTimeOfDeathUnknown']").prop('checked', true);
            }

            $('.deathSection #TextBoxDiscoveredDate1').val(response.IncidentManagementDeathList[0].DiscoveredDate);
            $('.deathSection #TextBoxDeathDiscoveredTime').val(response.IncidentManagementDeathList[0].DiscoveredTime);
            $('.deathSection #DropDownDeathLocation').select2('val', [response.IncidentManagementDeathList[0].DeathLocation]);
            $('.deathSection #DropDownCauseOfDeath').select2('val', [response.IncidentManagementDeathList[0].CauseOfDeath]);
            $('.deathSection #TextBoxDeathDeterminedBy').val(response.IncidentManagementDeathList[0].DeathDeterminedBy);
            $('.deathSection #TextBoxDateOfLastMedicalExam').val(response.IncidentManagementDeathList[0].DateOfLastMedicalExam);
            $(".deathSection input[name='RadioAutopsyConsent'][value = " + response.IncidentManagementDeathList[0].AutopsyConsent + "]").prop('checked', true);
            $('.deathSection #TextBoxPersonRequestingConsent').val(response.IncidentManagementDeathList[0].PersonRequestingConsent);
            $('.deathSection #TextBoxPersonConsenting').val(response.IncidentManagementDeathList[0].PersonConsenting);
            $('.deathSection #TextBoxPersonDenyingConsent').val(response.IncidentManagementDeathList[0].PersonDenyingConsent);
            $(".deathSection input[name='RadioAutopsyDone'][value = " + response.IncidentManagementDeathList[0].AutopsyDone + "]").prop('checked', true);
            $('.deathSection #TextBoxDateOfAutopsy').val(response.IncidentManagementDeathList[0].AutopsyDate);
            $('.deathSection #TextBoxDescription').val(response.IncidentManagementDeathList[0].Description);

            for (var i = 0; i < response.DeatWitness.length; i++) {
                $("#DropDownDeathWitness option[value=" + response.DeatWitness[i].DeathWitness + "]").prop("selected", true).trigger("change");
            }
        }

    }
}

function BindOtherTab(response) {
    //Binding IncidentOther
    if (response.IncidentManagementGeneralList[0].IncidentTypeDescription == "Other") {
        $('#nav-other-tab').removeClass('hidden');
        $('#nav-state-forms-tab').removeClass('hidden');
        $('.otherid').val(managementid);

        if (response.IncidentManagementOtherList[0] != undefined) {

            $('.otherSection #TextBoxTimeOfEvent').val(response.IncidentManagementOtherList[0].TimeOfEvent);
            $('.otherSection #TextBoxIncidentOtherId').val(response.IncidentManagementOtherList[0].IncidentOtherId);
            $('.otherid').val(incidentManagementId);
            if (response.IncidentManagementOtherList[0].Unknown == 'Y') {
                $(".otherSection input[name='CheckboxUnknown']").prop('checked', true);
            }

            $(".otherSection input[name='RadioEventWas'][value = " + response.IncidentManagementOtherList[0].EventWas + "]").prop('checked', true);
            if (response.IncidentManagementOtherList[0].EventWas == false) {
                $("#OtherObserverDate").removeClass('hidden');
                $("#OtherObserverTime").removeClass('hidden');
            } else {
                $('#OtherDiscoveredDate').removeClass('hidden');
                $('#OtherDiscoveredTime').removeClass('hidden');
            }
            $('.otherSection #TextBoxOtherObservedDate').val(response.IncidentManagementOtherList[0].ObservedDate);
            $('.otherSection #TextBoxOtherObservedTime').val(response.IncidentManagementOtherList[0].ObservedTime);
            $('.otherSection #TextBoxOtherDiscoveredDate').val(response.IncidentManagementOtherList[0].DiscoveredDate);
            $('.otherSection #TextBoxOtherDiscoveredTime').val(response.IncidentManagementOtherList[0].DiscoveredTime);
            $('.otherSection #DropDownEventLocation').val(response.IncidentManagementOtherList[0].EventLocation);
            $('.otherSection #DropDownOtherWitness').select2('val', [response.IncidentManagementOtherList[0].OtherWitness]);
            $('.otherSection #TextBoxOtherDescription').val(response.IncidentManagementOtherList[0].Description);

            for (var i = 0; i < response.OtheWitness.length; i++) {
                $("#DropDownOtherWitness option[value=" + response.OtheWitness[i].OtherWitness + "]").prop("selected", true).trigger("change");
            }
        }

    }

}

function StateFormTab(response) {
    $("#nav-state-forms-tab").removeClass("hidden");
    if (response.StateFormList[0] == undefined) {
        $(".uploadPDF").hide();
    }
    if (response.StateFormList[0] != undefined) {
        $("#StateFormTypePDF").empty();
        $('.stateformid').val(response.StateFormList[0].IncidentManagementId);
        $('#TextBoxStateFormId').val(response.StateFormList[0].StateFormId);
        if (response.StateFormList[0].OPWDD147 == 'Y') {
            $("input[name='CheckboxOPWDD147']").prop('checked', true);
            $('.OPWDD147Tab').show();
            $("#StateFormTypePDF").append("<option value='0'>OPWDD 147</option>");
            $("#CheckboxOPWDD147").addClass("keep-disabled");
            if ($("#AddNotifications").text() == "Add Notifications") {
                $("#AddNotifications").text("Review Notifications");
            }
        }
        if (response.StateFormList[0].OPWDD148 == 'Y') {
            $("input[name='CheckboxOPWDD148']").prop('checked', true);
            $('.OPWDD148Tab').show();
            $("#StateFormTypePDF").append("<option value='1'>OPWDD 148</option>");
            $("#CheckboxOPWDD148").addClass("keep-disabled");
        } if (response.StateFormList[0].OPWDD150 == 'Y') {
            $("input[name='CheckboxOPWDD150']").prop('checked', true);
            $('.OPWDD150Tab').show();
            $("#StateFormTypePDF").append("<option value='2'>OPWDD 150</option>");
            $("#CheckboxOPWDD150").addClass("keep-disabled");
        } if (response.StateFormList[0].JonathanLaw == 'Y') {
            $("input[name='CheckboxJonathanLaw']").prop('checked', true);
            $('.JonathanTab').show();
            $("#CheckboxJonathanLaw").addClass("keep-disabled");
        }
        BindUploadPDF(response);
    }
}

function BindStateFormOPWDD147Tab(response) {
    //Binding StateformOPWDD147
    if (response.IncidentManagementOPWDD147List[0] != undefined) {
        $('.opd147id').val(incidentManagementId);
        $('#TextBoxStatesFormOPWDD147Id').val(response.IncidentManagementOPWDD147List[0].StatesFormOPWDD147Id);
        $('.OPWDD147Tab #TextBoxAgencyCompletingForm').val(response.IncidentManagementOPWDD147List[0].AgencyCompletingForm);
        $('.OPWDD147Tab #TextBoxFacility').val(response.IncidentManagementOPWDD147List[0].Facility);
        $('.OPWDD147Tab #TextBoxProgramType147').val(response.IncidentManagementOPWDD147List[0].ProgramType147);
        $('.OPWDD147Tab #TextBoxAddress147').val(response.IncidentManagementOPWDD147List[0].Address147);
        $('.OPWDD147Tab #TextBoxPhone147').val(response.IncidentManagementOPWDD147List[0].Phone147);
        $(".OPWDD147Tab input[name='RadioGender147'][value = " + response.IncidentManagementOPWDD147List[0].Gender147 + "]").prop('checked', true);
        $('.OPWDD147Tab #TextBoxTabId147').val(response.IncidentManagementOPWDD147List[0].TabId147);
        $('.OPWDD147Tab #TextBoxIndividualName147').val(response.IncidentManagementOPWDD147List[0].IndividualName147);
        $('.OPWDD147Tab #TextBoxDOB147').val(response.IncidentManagementOPWDD147List[0].DOB147);

        $('.OPWDD147Tab #TextBoxOPWDD147MasterIncidentNumber').val(response.IncidentManagementOPWDD147List[0].MasterIncidentNumber);
        $('.OPWDD147Tab #TextBoxAgencyIncidentNumber').val(response.IncidentManagementOPWDD147List[0].AgencyIncidentNumber);
        $(".OPWDD147Tab input[name='RadioIncidentPreviouslyReported'][value = " + ((response.IncidentManagementOPWDD147List[0].IncidentPreviouslyReported) == false ? 0 : 1) + "]").prop('checked', true);
        $(".OPWDD147Tab input[name='RadioRecievesMedication'][value = " + ((response.IncidentManagementOPWDD147List[0].RecievesMedication) == false ? 0 : 1) + "]").prop('checked', true);
        $(".OPWDD147Tab input[name='RadioDateTimeIncidentWas'][value = " + ((response.IncidentManagementOPWDD147List[0].DateTimeIncidentWas) == false ? 0 : 1) + "]").prop('checked', true);
        if (response.IncidentManagementOPWDD147List[0].DateTimeIncidentWas == false) {
            $("#147ObsDate").removeClass('hidden');
            $("#147ObsTime").removeClass('hidden');
        }
        else {
            $("#147DisDate").removeClass('hidden');
            $("#147DisTime").removeClass('hidden');
        }
        $('.OPWDD147Tab #TextBoxOP147ObservedDateTime').val(response.IncidentManagementOPWDD147List[0].ObservedDate);
        $('.OPWDD147Tab #TextBoxForm147ObservedTime').val(response.IncidentManagementOPWDD147List[0].ObservedTime);
        $('.OPWDD147Tab #TextBoxOP147DiscoveredDateTime').val(response.IncidentManagementOPWDD147List[0].DiscoveredDate);
        $('.OPWDD147Tab #TextBoxForm147DiscoveredTime').val(response.IncidentManagementOPWDD147List[0].DiscoveredTime);
        $('.OPWDD147Tab #TextBoxIncidentOccuredDateTime').val(response.IncidentManagementOPWDD147List[0].IncidentOccuredDate);
        $('.OPWDD147Tab #TextBoxIncidentOccuredTime').val(response.IncidentManagementOPWDD147List[0].IncidentOccuredTime);
        $('.OPWDD147Tab #TextBoxPRSPresentAtIncident').val(response.IncidentManagementOPWDD147List[0].PRSPresentAtIncident);
        $('.OPWDD147Tab #TextBoxERSPresentAtIncident').val(response.IncidentManagementOPWDD147List[0].ERSPresentAtIncident);
        $(".OPWDD147Tab input[name='RadioReportableIncident_AbuseNeglect'][value = " + response.IncidentManagementOPWDD147List[0].ReportableIncident_AbuseNeglect + "]").prop('checked', true);
        if (response.IncidentManagementOPWDD147List[0].SeriousNotableOccurrences == false) {
            $(".OPWDD147Tab input[name='RadioSeriousNotableOccurrences'][value = " + 0 + "]").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].SeriousNotableOccurrences == true) {
            $(".OPWDD147Tab input[name='RadioSeriousNotableOccurrences'][value = " + 1 + "]").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].MinornotableOccurrences == false) {
            $(".OPWDD147Tab input[name='RadioMinornotableOccurrences'][value = " + 0 + "]").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].MinornotableOccurrences == true) {
            $(".OPWDD147Tab input[name='RadioMinornotableOccurrences'][value = " + 1 + "]").prop('checked', true);
        }
        $(".OPWDD147Tab input[name='RadioReportable_SignificantIncidents'][value = " + response.IncidentManagementOPWDD147List[0].Reportable_SignificantIncidents + "]").prop('checked', true);
        $(".OPWDD147Tab input[name='RadioIncidentOccurenceLocation'][value = " + response.IncidentManagementOPWDD147List[0].IncidentOccurenceLocation + "]").prop('checked', true);
        $('.OPWDD147Tab #TextBoxIncidentDescription').val(response.IncidentManagementOPWDD147List[0].IncidentDescription);
        $('.OPWDD147Tab #TextBoxImmedateCorrectiveAction').val(response.IncidentManagementOPWDD147List[0].ImmedateCorrectiveAction);
        if (response.IncidentManagementOPWDD147List[0].JusticeCenter == false) {
            $(".OPWDD147Tab input[name='RadioJusticeCenter'][value = " + 0 + "]").prop('checked', true);

        }
        if (response.IncidentManagementOPWDD147List[0].JusticeCenter == true) {
            $(".OPWDD147Tab input[name='RadioJusticeCenter'][value = " + 1 + "]").prop('checked', true);

        }
        $('.OPWDD147Tab #TextBoxJusticeCenteDate').val(response.IncidentManagementOPWDD147List[0].JusticeCenteDate);
        $('.OPWDD147Tab #TextBoxJusticeCenterTime').val(response.IncidentManagementOPWDD147List[0].JusticeCenteTime);
        $('.OPWDD147Tab #TextBoxJusticeCenterIdentifier').val(response.IncidentManagementOPWDD147List[0].JusticeCenterIdentifier);
        $('.OPWDD147Tab #TextBoxReportedBy').val(response.IncidentManagementOPWDD147List[0].ReportedBy);
        if (response.IncidentManagementOPWDD147List[0].LawEnforcementOfficialNotified == false) {
            $(".OPWDD147Tab input[name='RadioLawEnforcementOfficialNotified'][value = " + 0 + "]").prop('checked', true);

        }
        if (response.IncidentManagementOPWDD147List[0].LawEnforcementOfficialNotified == true) {
            $(".OPWDD147Tab input[name='RadioLawEnforcementOfficialNotified'][value = " + 1 + "]").prop('checked', true);

        }
        $('.OPWDD147Tab #TextBoxOfficialNotifiedDateTime').val(response.IncidentManagementOPWDD147List[0].OfficialNotifiedDate);
        $('.OPWDD147Tab #TextBoxOfficialNotifiedTime').val(response.IncidentManagementOPWDD147List[0].OfficialNotifiedTime);
        $('.OPWDD147Tab #TextBoxLawEnforcementAgencyName').val(response.IncidentManagementOPWDD147List[0].LawEnforcementAgencyName);
        $('.OPWDD147Tab #TextBoxPermanentAddress_PhoneNumber').val(response.IncidentManagementOPWDD147List[0].PermanentAddress_PhoneNumber);
        if (response.IncidentManagementOPWDD147List[0].SOIRA == 'Y') {
            $(".OPWDD147Tab input[name='RadioSOIRA']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].VOIRA == 'Y') {
            $(".OPWDD147Tab input[name='RadioVOIRA']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].SOICF == 'Y') {
            $(".OPWDD147Tab input[name='RadioSOICF']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].VOICF == 'Y') {
            $(".OPWDD147Tab input[name='RadioVOICF']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].FC == 'Y') {
            $(".OPWDD147Tab input[name='RadioFC']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].DC == 'Y') {
            $(".OPWDD147Tab input[name='RadioDC']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].CR == 'Y') {
            $(".OPWDD147Tab input[name='RadioCR']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD147List[0].Other == 'Y') {
            $(".OPWDD147Tab input[name='RadioOther']").prop('checked', true);
            $('.OPWDD147Tab #TextBoxOtherSpecify').removeClass('hidden');
            $('.OPWDD147Tab #TextBoxOtherSpecify').val(response.IncidentManagementOPWDD147List[0].OtherSpecify);
        }

        $('.OPWDD147Tab #TextBoxPartyCompletingItemsName').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItemsName);
        $('.OPWDD147Tab #TextBoxPartyCompletingItemsTitle').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItemsTitle);
        $('.OPWDD147Tab #TextBoxPartyCompletingItemsDate').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItemsDate);
        $('.OPWDD147Tab #TextBoxPartyReviewingItemsName').val(response.IncidentManagementOPWDD147List[0].PartyReviewingItemsName);
        $('.OPWDD147Tab #TextBoxPartyReviewingItemsTitle').val(response.IncidentManagementOPWDD147List[0].PartyReviewingItemsTitle);
        $('.OPWDD147Tab #TextBoxPartyReviewingItemsDate').val(response.IncidentManagementOPWDD147List[0].PartyReviewingItemsDate);

        $('.OPWDD147Tab #TextBoxPartyCompletingItem28').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItem28);
        $('.OPWDD147Tab #TextBoxPartyCompletingItemTitle28').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItemTitle28);
        $('.OPWDD147Tab #TextBoxPartyCompletingItemDate28').val(response.IncidentManagementOPWDD147List[0].PartyCompletingItemDate28);
        $('.OPWDD147Tab #TextBoxAdditionalStepsToSafeGuardPerson').val(response.IncidentManagementOPWDD147List[0].AdditionalStepsToSafeGuardPerson);
        $('.OPWDD147Tab #TextBoxActionsTakenToSafeGuardPerson').val(response.IncidentManagementOPWDD147List[0].ActionsTakenToSafeGuardPerson);
        $('.OPWDD147Tab #TextBoxLawEnforcementAgencyName').val(response.IncidentManagementOPWDD147List[0].LawEnforcementAgencyName);

        if (response.Success == true && response.IsException == false) {
            if (response.Opwdd147SubTable[0].StatesFormOPWDD147Id > -1) {
                $("#TextBoxStatesFormOPWDD147Id").val(response.Opwdd147SubTable[0].StatesFormOPWDD147Id);
                BindStateFormNotifications(response.Opwdd147SubTable[0].JSONData);
                $('.OPWDD147Tab .form-control').prop("disabled", true);
                if ($("#BtnOPWDD147Ok").text() == 'Ok') {
                    $("#BtnOPWDD147Ok").text('Edit');
                }
            }
        }
    }

}

function BindStateformOPWDD148Tab(response) {
    //Binding StateformOPWDD148
    if (response.IncidentManagementOPWDD148List[0] != undefined) {
        $('.opd148id').val(incidentManagementId);
        $('#TextBoxStatesFormOPWDD148Id').val(response.IncidentManagementOPWDD148List[0].StatesFormOPWDD148Id);
        $('.OPWDD148Tab #TextBoxAddInfoContact').val(response.IncidentManagementOPWDD148List[0].AddInfoContact);
        $('.OPWDD148Tab #TextBoxAtTelephone').val(response.IncidentManagementOPWDD148List[0].AtTelephone);


        $('.OPWDD148Tab #TextBoxPersonReceivingServicesName').val(response.IncidentManagementOPWDD148List[0].PersonReceivingServicesName);
        $('.OPWDD148Tab #TextBoxIncidentOccurredOrWasDiscoveredDate').val(response.IncidentManagementOPWDD148List[0].IncidentOccurredOrWasDiscoveredDate);
        $('.OPWDD148Tab #TextBoxPreliminaryClassificationOfIncident').val(response.IncidentManagementOPWDD148List[0].PreliminaryClassificationOfIncident);
        $('.OPWDD148Tab #TextBoxAgencyCompletingThisForm').val(response.IncidentManagementOPWDD148List[0].AgencyCompletingThisForm);
        $('.OPWDD148Tab #TextBoxOPWDD148MasterIncidentNumber').val(response.IncidentManagementOPWDD148List[0].MasterIncidentNumber);
        $('.OPWDD148Tab #TextBoxReportProvidedTo').val(response.IncidentManagementOPWDD148List[0].ReportProvidedTo);
        $('.OPWDD148Tab #TextBoxRelationshipToPersonReceivingServices').val(response.IncidentManagementOPWDD148List[0].RelationshipToPersonReceivingServices);
        $('.OPWDD148Tab #TextBoxPhoneNumber').val(response.IncidentManagementOPWDD148List[0].PhoneNumber);
        $('.OPWDD148Tab #TextBoxInitialnotificationProvidedToPersonReceivingDate').val(response.IncidentManagementOPWDD148List[0].InitialnotificationProvidedToPersonReceivingDate);
        $('.OPWDD148Tab #TextBoxImmediateStepsTakenInResponse').val(response.IncidentManagementOPWDD148List[0].ImmediateStepsTakenInResponse);
        $('.OPWDD148Tab #TextBoxNameOfPersonCompletingThisReport').val(response.IncidentManagementOPWDD148List[0].NameOfPersonCompletingThisReport);
        $('.OPWDD148Tab #TextBoxReportCompletedDate').val(response.IncidentManagementOPWDD148List[0].ReportCompletedDate);

    }
}

function BindStateFormOPWDD150(response) {
    //Binding StateformOPWDD150 
    if (response.IncidentManagementOPWDD150List[0] != undefined) {
        $('.opd150id').val(incidentManagementId);
        $('#TextBoxStatesFormOPWDD150Id').val(response.IncidentManagementOPWDD150List[0].StatesFormOPWDD150Id);
        $('.OPWDD150Tab #TextBoxReportingAgency').val(response.IncidentManagementOPWDD150List[0].ReportingAgency);
        $('.OPWDD150Tab #TextBoxProgramType').val(response.IncidentManagementOPWDD150List[0].ProgramType);
        $('.OPWDD150Tab #TextBoxProgramAddress').val(response.IncidentManagementOPWDD150List[0].ProgramAddress);
        $('.OPWDD150Tab #TextBoxEventAddress').val(response.IncidentManagementOPWDD150List[0].EventAddress);
        $('.OPWDD150Tab #TextBoxPhone').val(response.IncidentManagementOPWDD150List[0].Phone);
        $('.OPWDD150Tab #TextBoxIndividualName').val(response.IncidentManagementOPWDD150List[0].IndividualName);
        $('.OPWDD150Tab #TextBoxDOB').val(response.IncidentManagementOPWDD150List[0].DOB);
        $(".OPWDD150Tab input[name='RadioGender'][value = " + response.IncidentManagementOPWDD150List[0].Gender + "]").prop('checked', true);
        $('.OPWDD150Tab #TextBoxTabId').val(response.IncidentManagementOPWDD150List[0].TabId);

        $('.OPWDD150Tab #TextBoxEvent_SituationReferenceNumber').val(response.IncidentManagementOPWDD150List[0].Event_SituationReferenceNumber);
        $('.OPWDD150Tab #TextBoxPersonCompletingReport').val(response.IncidentManagementOPWDD150List[0].PersonCompletingReport);
        if (response.IncidentManagementOPWDD150List[0].DateTimeEvent_Situation == false) {
            $(".OPWDD150Tab input[name='RadioDateTimeEvent_Situation'][value = " + 0 + "]").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD150List[0].DateTimeEvent_Situation == true) {
            $(".OPWDD150Tab input[name='RadioDateTimeEvent_Situation'][value = " + 1 + "]").prop('checked', true);
        }
        if ($("input[name='RadioDateTimeEvent_Situation']").val() == false) {
            $("#OP150ObsDate").removeClass('hidden');
            $("#OP150ObsTime").removeClass('hidden');
        }
        else {
            $("#OP150DisDate").removeClass('hidden');
            $("#OP150DisTime").removeClass('hidden');
        }
        $('.OPWDD150Tab #TextBoxOP150ObservedDateTime').val(response.IncidentManagementOPWDD150List[0].ObservedDate);
        $('.OPWDD150Tab #TextBoxForm150ObservedTime').val(response.IncidentManagementOPWDD150List[0].ObservedTime);
        $('.OPWDD150Tab #TextBoxOP150DiscoveredDateTime').val(response.IncidentManagementOPWDD150List[0].DiscoveredDate);
        $('.OPWDD150Tab #TextBoxForm150DiscoveredTime').val(response.IncidentManagementOPWDD150List[0].DiscoveredTime);
        $('.OPWDD150Tab #TextBoxEvent_SituationOccureDateTime').val(response.IncidentManagementOPWDD150List[0].Event_SituationOccureDate);
        $('.OPWDD150Tab #TextBoxEvent_SituationOccureTime').val(response.IncidentManagementOPWDD150List[0].Event_SituationOccureTime);
        $(".OPWDD150Tab input[name='RadioPreliminaryClassification'][value = " + response.IncidentManagementOPWDD150List[0].PreliminaryClassification + "]").prop('checked', true);
        if (response.IncidentManagementOPWDD150List[0].AdultProtectiveServices == 'Y') {
            $(".OPWDD150Tab input[name='RadioAdultProtectiveServices']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].Hospital == 'Y') {
            $(".OPWDD150Tab input[name='RadioHospital']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].ProfessionalDisciplineOffice == 'Y') {
            $(".OPWDD150Tab input[name='RadioProfessionalDisciplineOffice']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].StatewideCentralRegisterChildAbuseAndMaltreatment == 'Y') {
            $(".OPWDD150Tab input[name='RadioStatewideCentralRegisterChildAbuseAndMaltreatment']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].FamilyMembers == 'Y') {
            $(".OPWDD150Tab input[name='RadioFamilyMembers']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].LawEnforcement == 'Y') {
            $(".OPWDD150Tab input[name='RadioLawEnforcement']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].School == 'Y') {
            $(".OPWDD150Tab input[name='RadioSchool']").prop('checked', true);
        };
        if (response.IncidentManagementOPWDD150List[0].AssessMonitorIndividual == 'Y') {
            $(".OPWDD150Tab input[name='RadioAssessMonitorIndividual']").prop('checked', true)
        };
        if (response.IncidentManagementOPWDD150List[0].EducateIndividualChoices == 'Y') {
            $(".OPWDD150Tab input[name='RadioEducateIndividualChoices']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD150List[0].InterviewInvolvedIndividuals == 'Y') {
            $(".OPWDD150Tab input[name='RadioInterviewInvolvedIndividuals']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD150List[0].OfferingReferralAppropriateService == 'Y') {
            $(".OPWDD150Tab input[name='RadioOfferingReferralAppropriateService']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD150List[0].OfferingReferralAppropriateService == 'Y') {
            $(".OPWDD150Tab input[name='RadioOfferingReferralAppropriateService']").prop('checked', true);
        }
        if (response.IncidentManagementOPWDD150List[0].Other == 'Y') {
            $(".OPWDD150Tab input[name='RadioOther']").prop('checked', true);

        }
        $('.OPWDD150Tab #TextBoxDescriptionOfEventSituation').val(response.IncidentManagementOPWDD150List[0].DescriptionOfEventSituation);
        $('.OPWDD150Tab #TextBoxSummaryResloutionOfEvent_Situation').val(response.IncidentManagementOPWDD150List[0].SummaryResloutionOfEvent_Situation);
        $('.OPWDD150Tab #TextBoxNotificationContact').val(response.IncidentManagementOPWDD150List[0].NotificationContact);
        $('.OPWDD150Tab #TextBoxNotificationDateTime').val(response.IncidentManagementOPWDD150List[0].NotificationDate);
        $('.OPWDD150Tab #TextBoxForm150NotificationTime').val(response.IncidentManagementOPWDD150List[0].NotificationTime);
        $('.OPWDD150Tab #TextBoxPersonContacted').val(response.IncidentManagementOPWDD150List[0].PersonContacted);
        $('.OPWDD150Tab #TextBoxReportedBy').val(response.IncidentManagementOPWDD150List[0].ReportedBy);
        $('.OPWDD150Tab #TextBoxMethod').val(response.IncidentManagementOPWDD150List[0].Method);

        $('.OPWDD150Tab #TextBoxNotificationContact1').val(response.IncidentManagementOPWDD150List[0].NotificationContact1);
        $('.OPWDD150Tab #TextBoxNotificationDateTime1').val(response.IncidentManagementOPWDD150List[0].NotificationDate1);
        $('.OPWDD150Tab #TextBoxForm150NotificationTime1').val(response.IncidentManagementOPWDD150List[0].NotificationTime1);
        $('.OPWDD150Tab #TextBoxPersonContacted1').val(response.IncidentManagementOPWDD150List[0].PersonContacted1);
        $('.OPWDD150Tab #TextBoxReportedBy1').val(response.IncidentManagementOPWDD150List[0].ReportedBy1);
        $('.OPWDD150Tab #TextBoxMethod1').val(response.IncidentManagementOPWDD150List[0].Method1);

        $('.OPWDD150Tab #TextBoxPartyCompletingFormTitle').val(response.IncidentManagementOPWDD150List[0].PartyCompletingFormTitle);
        $('.OPWDD150Tab #TextBoxPartyCompletingFormDate').val(response.IncidentManagementOPWDD150List[0].PartyCompletingFormDate);
        $('.OPWDD150Tab #TextBoxPartyCompletingFormName').val(response.IncidentManagementOPWDD150List[0].PartyCompletingFormName);
    }
}

function BindStateFormJonathanLawTab(response) {
    //Binding StateformJonathanLaw
    if (response.IncidentManagementJonathanLawList[0] != undefined) {

        $('.JonathanTab #jlnid').val(incidentManagementId);
        $('.JonathanTab #TextBoxStateFormJonathanLawnotificationId').val(response.IncidentManagementJonathanLawList[0].StateFormJonathanLawnotificationId);
        $('.JonathanTab #DropDownActionType').val(response.IncidentManagementJonathanLawList[0].ActionType);
        $('.JonathanTab #TextBoxNameOfPersonnotified').val(response.IncidentManagementJonathanLawList[0].NameOfPersonnotified);
        $('.JonathanTab #DropDownPersonRelationship').val(response.IncidentManagementJonathanLawList[0].PersonRelationship);
        $('.JonathanTab #TextBoxJonthanNotificationDateTime').val(response.IncidentManagementJonathanLawList[0].NotificationDate);
        $('.JonathanTab #TextBoxJonthanNotificationDateTimeTime').val(response.IncidentManagementJonathanLawList[0].NotificationTime);
        $('.JonathanTab #DropDownMethodOfNotification').val(response.IncidentManagementJonathanLawList[0].MethodOfNotification);
        $('.JonathanTab #DropDownNotifiedByStaff').select2('val', [response.IncidentManagementJonathanLawList[0].NotifiedByStaff]);
        $('.JonathanTab #TextBoxComments').val(response.IncidentManagementJonathanLawList[0].Comments);
    }
}

function BindUploadPDF(response) {
    $('.uploadPDF').show();
    var table = $('#UploadPDF').DataTable();
    var stringyfy = JSON.stringify(response.UploadedPDFResponse);
    $('#UploadPDF').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "aaData": JSON.parse(stringyfy),
        "columns": [{ "data": "FormType" }, { "data": "UploadDate" }, { "data": "Version" }, { "data": "DownloadLink" }]
    });

}




//Validate the tabs
function validateGeneralTab() {
    var checked = null;

    var incidentManagementDate = new Date($("#TextBoxIncidentDate").val()),
        currentDate = new Date();

    if (!isEmpty(incidentManagementDate) && Date.parse(incidentManagementDate) > Date.parse(currentDate)) {
        showErrorMessage("Incident Date should not be future date.");
        checked = false;
        return checked;
    }
    $("#imuFormSection .req_feild").each(function () {
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
function validateInjuryTab() {
    var checked = null;
    $(".injurySection .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if (($(this).val() == "" || $(this).val() == "-1") && $(this).is(":visible") == true) {
            if ($(this).attr("id") == "TextBoxTimeOfInjury" && $(this).val() == "" && $("#CheckboxTimeOfInjuryUnknown").prop("checked") == true) {
                checked = null;
            }
            else {
                $(this).siblings("span.errorMessage").removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }

        }
    });
    if (checked == null) {
        return true;
    }
}
function validateMedicationTab() {
    var checked = null;
    $(".medicationError .req_feild").each(function () {
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
function validateDeathTab() {
    var checked = null;
    $(".deathSection .req_feild").each(function () {
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
function validateOtherTab() {
    var checked = null;
    $(".otherSection .req_feild").each(function () {
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
function ValidateStateFroms() {
    var checked = null;
    $(".stateForms .req_feild").each(function () {
        if ($(this).attr("type") == "checkbox") {
            if ($('input[type=checkbox]:checked').length == 0) {
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
function validateOPWDD147Tab() {
    var checked = null;
    $(".OPWDD147Tab .req_feild").each(function () {
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
function validateOPWDD148Tab() {
    var checked = null;
    $(".OPWDD148Tab .req_feild").each(function () {
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
function validateOPWDD150Tab() {
    var checked = null;
    $(".OPWDD150Tab .req_feild").each(function () {
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
function validateJonathanTab() {
    var checked = null;
    $(".JonathanTab .req_feild").each(function () {
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
function ValidateUploadedFile() {
    $('#TextBoxUploadPdf').on('change', function () {
        var fileExtension = 'pdf';
        if ($(this).val().substr($(this).val().lastIndexOf('.')).toLowerCase() != ".pdf") {
            showErrorMessage("Please select the pdf file.");
            return false;
        }
        else {
            var fileName = $('#TextBoxUploadPdf')[0].files.length ? $('#TextBoxUploadPdf')[0].files[0].name : "";
            $("#uploadFile").val(fileName);
            return true;
        }
    });
    return true;
}
function validateBodyParts() {
    if (!$("#frontBodyDropDwon").hasClass("hidden") && ($("#DropDownFrontBodyPartId").val() == "" || $("#DropDownFrontBodyPartId").val() <= -1)) {
        $("#DropDownFrontBodyPartId").siblings("span.errorMessage").removeClass("hidden");
        return false;
    }
    else if (!$("#BackBodyDropDwon").hasClass("hidden") && ($("#DropDownBackBodyPartId").val() == "" || $("#DropDownBackBodyPartId").val() <= -1)) {
        $("#DropDownBackBodyPartId").siblings("span.errorMessage").removeClass("hidden");
        return false;

    }
    else if (($("#DropDownInjuryType").val() == "" || $("#DropDownInjuryType").val() <= -1)) {
        $("#DropDownInjuryType").siblings("span.errorMessage").removeClass("hidden");
        return false;

    }
    else if ($("#TextBoxDescriptionInjury").val() == "") {
        $("#TextBoxDescriptionInjury").siblings("span.errorMessage").removeClass("hidden");
        return false;

    }
    return true;
}



//Insert modify the tabs 
function InsertModifyGeneralTab() {

    if ($("#btnGeneral").text() == "Edit") {
        $('#imuFormSection .gen-control').attr("disabled", false);
        $('#imuFormSection .time').attr("disabled", false);
        $('#imuFormSection  .gen-control input[type=radio]').prop("disabled", false);
        $('#imuFormSection  #DropDownIncidentType').prop("disabled", true);
        $("#btnGeneral").text("Ok");
        return;
    }
    if (!validateGeneralTab()) return;
    incidentType = $("#DropDownIncidentType option:selected").text();
    clientId = $("#DropDownClientId").val();
    blankIncidentManagementId = $("#TextBoxIncidentManagementId").val();
    var json = [],
        item = {},
        tag;
    $('#imuFormSection .gen-control').each(function () {
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
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }

    });
    item["IncidentName"] = incidentType;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GeneralTab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            GeneralTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyInjuryTab() {
    if ($("#BtnInjury").text() == "Edit") {
        $('.injurySection .form-control').attr("disabled", false);
        $('.injurySection  input[type=radio]').prop("disabled", false);
        $("#bodyPartsForm .form-control").attr("disabled", false);
        $("#AddBodyParts").prop("disabled", false);
        $("#BtnInjury").text("Ok");
        return;
    }
    if (!validateInjuryTab()) return;
    var json = [],
        item = {},
        jsonChild = [],
        tag;
    $('.injurySection .inj-control').each(function () {
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
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    var oTable = $("#BodyParts").DataTable().rows().data();
    oTable.each(function (value, index) {
        var itembody = {};
        if (value[4] == undefined) {
            itembody["FrontBodyPartId"] = value.BodyPartId.indexOf(":Front") > -1 ? value.BodyPartId.split(":Front")[0] : "";
            itembody["BackBodyPartId"] = value.BodyPartId.indexOf(":Back") > -1 ? value.BodyPartId.split(":Back")[0] : "";
        }
        else {
            itembody["FrontBodyPartId"] = value[4].indexOf(":Front") > -1 ? value[4].split(":Front")[0] : "";
            itembody["BackBodyPartId"] = value[4].indexOf(":Back") > -1 ? value[4].split(":Back")[0] : "";
        }
        itembody["InjuryType"] = value[5] == undefined ? value.InjuryType : value[5];
        itembody["Description"] = value[3] == undefined ? value.Description : value[3];
        itembody["InjuryBodyPartId"] = value[6] == undefined ? value.InjuryBodyPartId : value[6];
        jsonChild.push(itembody);
    });

    $.ajax({
        type: "POST",
        data: { TabName: "InjuryTab", Json: JSON.stringify(json), JsonChild: JSON.stringify(jsonChild), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            InjuryTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyMediactionTab() {
    if ($("#btnMedicationError").text() == "Edit") {
        $('.medicationError .form-control').attr("disabled", false);
        $('.medicationError  input[type=radio]').prop("disabled", false);
        $("#AddMultiMedication").prop("disabled", false);
        $("#btnMedicationError").text("Ok");
        return;
    }
    if (!validateMedicationTab()) return;
    var json = [],
        item = {},
        jsonChild = [],
        tag;
    $(".medicationError .med-control").each(function () {
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
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    var oTable = $("#MedicationDesc").DataTable().rows().data();
    oTable.each(function (value, index) {
        var itemChild = {};
        itemChild["Medication"] = value[3] == undefined ? value.Medication : value[3];
        itemChild["DescriptionOfTheError"] = value[2] == undefined ? value.DescriptionOfTheError : value[2];
        itemChild["MedicationErrorSubFieldId"] = value[4] == undefined ? value.MedicationErrorSubFieldId : value[4];
        jsonChild.push(itemChild);
    });
    $.ajax({
        type: "POST",
        data: { TabName: "MedicationTab", Json: JSON.stringify(json), JsonChild: JSON.stringify(jsonChild), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            MedicationTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyDeathTab() {
    if ($("#BtnDeath").text() == "Edit") {
        $('.deathSection .form-control').attr("disabled", false);
        $('.deathSection  input[type=radio]').prop("disabled", false);
        $("#BtnDeath").text("Ok");
        return;
    }
    if (!validateDeathTab()) return;
    var json = [],
        item = {},
        tag;
    $('.deathSection .death-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "")
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
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "DeathTab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            DeathTabTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyOtherTab() {
    if ($("#BtnOther").text() == "Edit") {
        $('.otherSection .form-control').attr("disabled", false);
        $('.otherSection  input[type=radio]').prop("disabled", false);
        $("#BtnOther").text("Ok");
        return;
    }
    if (!validateOtherTab()) return;
    var json = [],
        item = {},
        tag;
    $('.otherSection .other-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "")
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
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "OtherTab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            OtherTabTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyStateFormTab() {

    if ($("#BtnOkStateForm").text() == 'Edit') {
        $('.stateForms .form-control').prop('disabled', false);
        $(".keep-disabled").prop("disabled", true);
        $("#BtnOkStateForm").text('Ok');
        return;
    }
    if (!ValidateStateFroms()) return;
    var json = [],
        item = {},
        tag;
    $('.stateForms .form-control').each(function () {
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
                if ($(this).prop("checked") == true && $(this).val() >= 0) item[tag] = $(this).val();
                else {
                }
            }
            else {
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });

    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "StateFormTab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            StateFormTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyOPWDD147() {


    if ($("#BtnOPWDD147Ok").text() == 'Edit') {
        $('.OPWDD147Tab .form-control').prop("disabled", false);
        $("#BtnOPWDD147Ok").text('Ok');
        return;
    }
    if (!validateOPWDD147Tab()) return;
    var json = [],
        item = {},
        jsonChild = [],
        tag;
    $('.OPWDD147Tab .form-control').each(function () {
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
                if ($(this).prop("checked") == true && $(this).val() >= 0) item[tag] = $(this).val();
                else {
                }
            }
            else {
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    var oTable = $("#147Notification").DataTable().rows().data();
    oTable.each(function (value, index) {
        var itembody = {};
        itembody["OPWDD147NotificationId"] = value[8] == undefined ? value.OPWDD147NotificationId : value[8];
        itembody["NotificationType"] = value[7] == undefined ? value.NotificationType : value[7];
        itembody["Notification"] = value[1] == undefined ? value.Notification : value[1];
        var date = value[2] == undefined ? value.Date == undefined ? "" : value.Date : value[2] == undefined ? "" : value[2];
        var time = value[3] == undefined ? value.Time == undefined ? "1900-06-04" : "1900-01-01 " + value.Time : value[3] == undefined ? "1900-06-04" : "1900-01-01 "+ value[3];
        itembody["NotificationDateTime"] = date;
        itembody["NotificationTime"] = time == "1900-01-01 " ? "1900-06-04" : time;
        itembody["PersonContacted"] = value[4] == undefined ? value.PersonContacted : value[4];
        itembody["ReportedBy"] = value[5] == undefined ? value.ReportedBy : value[5];
        itembody["Method"] = value[6] == undefined ? value.Method : value[6];
        itembody["Other1Desc"] = value[9] == undefined ? value.Other1Desc : value[9];
        itembody["Other2Desc"] = value[10] == undefined ? value.Other2Desc : value[11];
        itembody["Other3Desc"] = value[11] == undefined ? value.Other3Desc : value[11];
        itembody["Other4Desc"] = value[12] == undefined ? value.Other4Desc : value[12];
        jsonChild.push(itembody);
    });
    $.ajax({
        type: "POST",
        data: { TabName: "OPWDD147Tab", Json: JSON.stringify(json), JsonChild: JSON.stringify(jsonChild), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            OPWDD147TabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyOPWDD148() {


    if ($("#BtnOPWDD148Ok").text() == 'Edit') {
        $('.OPWDD148Tab .form-control').prop('disabled', false);
        $("#BtnOPWDD148Ok").text('Ok');
        return;
    }
    if (!validateOPWDD148Tab()) return;
    var json = [],
        item = {},
        tag;
    $('.OPWDD148Tab .form-control').each(function () {
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
                if ($(this).prop("checked") == true && $(this).val() >= 0) item[tag] = $(this).val();
                else {
                }
            }
            else {
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "OPWDD148Tab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            OPWDD148TabSaved(result)
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyOPWDD150() {


    if ($("#BtnOPWDD150TabOk").text() == 'Edit') {
        $('.OPWDD150Tab .form-control').prop("disabled", false);
        $("#BtnOPWDD150TabOk").text('Ok');
        return;
    }
    if (!validateOPWDD150Tab()) return;
    var json = [],
        item = {},
        tag;
    $('.OPWDD150Tab .form-control').each(function () {
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
                if ($(this).prop("checked") == true && $(this).val() >= 0) item[tag] = $(this).val();
                else {
                }
            }
            else {
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "OPWDD150Tab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            OPWDD150TabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyJonathan() {


    if ($("#BtnJonathanTabOK").text() == 'Edit') {
        $('.JonathanTab .form-control').prop("disabled", false);
        $("#BtnJonathanTabOK").text('Ok');
        return;
    }
    if (!validateJonathanTab()) return;
    var json = [],
        item = {},
        tag;
    $('.JonathanTab .form-control').each(function () {
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
                if ($(this).prop("checked") == true && $(this).val() > 0) item[tag] = $(this).val();
                else {
                    $(this).prop("checked") ? item[tag] = 'Y' : item[tag] = 'N';
                }
            }

            else {
                item[tag] = jsonWrapperWithDateTimePicker(tag, this);
            }
        }
    });
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "JonathanLawTab", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYTABDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            JonathanTabSaved(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

//#region Saved tabs success response
function GeneralTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].IncidentManagementId > -1) {
            showRecordSaved("Record saved successfully");
            $(".stateformid").val(result.AllTabs[0].IncidentManagementId);
            $("#TextBoxIncidentManagementId").val(result.AllTabs[0].IncidentManagementId);
            $(".deathid").val(result.AllTabs[0].IncidentManagementId)
            InsertManagementId(result.AllTabs[0].IncidentManagementId);
            $('#imuFormSection .form-control').attr("disabled", true);
            $('#imuFormSection  input[type=radio]').prop("disabled", true);
            changeIncidentManagementURL(result.AllTabs[0].IncidentManagementId);
            ShowHideIncidentType();
            ShowHideTabs();
            if ($("#btnGeneral").text() == "Ok") {
                $("#btnGeneral").text("Edit");
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}
function changeIncidentManagementURL(IncidentManagementId) {
    if (blankIncidentManagementId < 1) {
        var currentURL = window.location.href.split('?')[0];
        var newURL = currentURL + "?IncidentManagementId=" + IncidentManagementId;
        history.pushState(null, 'Incident Management Utility', newURL);
    }
}
function DeathTabTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].IncidentDeathId > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxIncidentDeathId").val(result.AllTabs[0].IncidentDeathId);
            $('.deathSection .form-control').attr("disabled", true);
            $('deathSection  input[type=radio]').prop("disabled", true);
            if ($("#BtnDeath").text() == "Ok") {
                $("#BtnDeath").text("Edit");
            }
        }
    }
    else {
        result.Success == false && result.IsException == true
        showErrorMessage(result.Message);
    }
}
function OtherTabTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].IncidentOtherId > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxIncidentOtherId").val(result.AllTabs[0].IncidentOtherId)
            $('.otherSection .form-control').prop("disabled", true);
            $('.otherSection  input[type=radio]').prop("disabled", true);
            if ($("#BtnOther").text() == "Ok") {
                $("#BtnOther").text("Edit");
            }
        }
    }
    else {
        result.Success == false && result.IsException == true
        showErrorMessage(result.Message);
    }
}
function InjuryTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].IncidentInjuryId > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxIncidentInjuryId").val(result.AllTabs[0].IncidentInjuryId);
            $('.injurySection .form-control').attr("disabled", true);
            $('#bodyPartsForm .form-control').attr("disabled", true);
            $("#AddBodyParts").prop("disabled", true);
            BindMultipleBodyParts(result.AllTabs[0].JSONData);
            $('.injurySection  input[type=radio]').prop("disabled", true);
            if ($("#BtnInjury").text() == "Ok") {
                $("#BtnInjury").text("Edit");
            }
            if ($("#BtnBodyDiagram").text() == "Review Injury Body Part") {
                $("#BtnBodyDiagram").text("Add Injury Body Part");
            }
        }
    }
    else {
        result.Success == false && result.IsException == true
        showErrorMessage(result.Message);
    }
}
function MedicationTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].IncidentInjuryId > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxIncidentMedicationErrorId").val(result.AllTabs[0].IncidentMedicationErrorId);
            BindMedicationSubFields(result.AllTabs[0].JSONData);
            $('.medicationError .form-control').attr("disabled", true);
            $('#MedicationForm .form-control').attr("disabled", true);
            $("#AddMultiMedication").prop("disabled", true);
            $('.medicationError  input[type=radio]').prop("disabled", true);
            if ($("#btnMedicationError").text() == "Ok") {
                $("#btnMedicationError").text("Edit");
                $("#btnMedicationError").addClass("edit")
            }
            if ($("#AddMedication").text() == "Review Medication") {
                $("#AddMedication").text("Add Medication");
            }
        }
    }
    else {
        result.Success == false && result.IsException == true
        showErrorMessage(result.Message);
    }
}
function StateFormTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        $('.stateForms .form-control').prop("disabled", true);
        HideStateForms();
        showRecordSaved("Record saved successfully");
        $("#TextBoxStateFormId").val(result.AllTabs[0].StateFormId);
        $(".stateformid").val(managementid);
        BindStateFormTypeDropDown(result);
        if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD147 == "Y") {
            $('.OPWDD147Tab').show();
            $('.uploadPDF').show();
            $(".opd147id").val(managementid);
            $("#CheckboxOPWDD147").addClass("keep-disabled");

        }
        if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD148 == "Y") {
            $('.OPWDD148Tab').show();
            $('.uploadPDF').show();
            $(".opd148id").val(managementid);
            $("#CheckboxOPWDD148").addClass("keep-disabled");

        }

        if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD150 == "Y") {
            $('.OPWDD150Tab').show();
            $('.uploadPDF').show();
            $(".opd150id").val(managementid);
            $("#CheckboxOPWDD150").addClass("keep-disabled");

        }
        if (JSON.parse(result.AllTabs[0].JSONData)[0].JonathanLaw == "Y") {
            $('.JonathanTab').show();
            $(".jlnid").val(managementid);
            $("#CheckboxJonathanLaw").addClass("keep-disabled");
            BindJonathanLawDropDowns();

        }
        if ($("#BtnOkStateForm").text() == 'Ok') {
            $("#BtnOkStateForm").text('Edit');
        }

    }

    else {

        showErrorMessage(result.Message);
    }
}
function OPWDD147TabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].StatesFormOPWDD147Id > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxStatesFormOPWDD147Id").val(result.AllTabs[0].StatesFormOPWDD147Id);
            BindStateFormNotifications(result.AllTabs[0].JSONData);
            $('.OPWDD147Tab .form-control').prop("disabled", true);
            if ($("#BtnOPWDD147Ok").text() == 'Ok') {
                $("#BtnOPWDD147Ok").text('Edit');
            }
            if ($("#AddNotifications").text() == "Review Notifications") {
                $("#AddNotifications").text("Add Notifications");
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}
function OPWDD148TabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].StatesFormOPWDD148Id > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxStatesFormOPWDD148Id").val(result.AllTabs[0].StatesFormOPWDD148Id);
            $('.OPWDD148Tab .form-control').prop("disabled", true);
            if ($("#BtnOPWDD148Ok").text() == 'Ok') {
                $("#BtnOPWDD148Ok").text('Edit');
            }
        }

    }
    else {

        showErrorMessage(result.Message);
    }
}
function OPWDD150TabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].StatesFormOPWDD150Id > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxStatesFormOPWDD150Id").val(result.AllTabs[0].StatesFormOPWDD150Id);
            $('.OPWDD150Tab .form-control').prop("disabled", true);
            if ($("#BtnOPWDD150TabOk").text() == 'Ok') {
                $("#BtnOPWDD150TabOk").text('Edit');
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}
function JonathanTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTabs[0].StateFormJonathanLawnotificationId > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxStateFormJonathanLawnotificationId").val(result.AllTabs[0].StateFormJonathanLawnotificationId);
            $('.JonathanTab .form-control').prop("disabled", true);
            //$('.date', 'select','span').attr('disabled', true)
            if ($("#BtnJonathanTabOK").text() == 'Ok') {
                $("#BtnJonathanTabOK").text('Edit');
            }
            else {
                $("#BtnJonathanTabOK").text('Ok')
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}
//#endregion


function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");
    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
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
        else if ($(this).attr("type") == "checkbox" && $(this).hasClass("req_feild")) {
            $('input[type=checkbox').change(function () {
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


function FillLocation(object) {
    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownLocation").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (location) {
        return location.LocationID == selectedValue;
    });
    $("#TextBoxLocationAddress1").val(res[0].Address1)
    $("#TextBoxLocationAddress2").val(res[0].Address2)
    $("#TextBoxLocationCity").val(res[0].City)
    $("#TextBoxLocationState").val(res[0].State)
    $("#TextBoxLocationZipCode").val(res[0].ZipCode)


}
function BindDropDownOptionsLocations(result) {
    $.each(result, function (data, value) {
        $("#DropDownLocation").append($("<option></option>").val(value.LocationID).html(value.LocationName));
    });
    $("#DropDownLocation").attr("josn", JSON.stringify(result))
    $("#DropDownLocation").attr("onchange", "FillLocation(this)")

}




function ShowHideIncidentType() {
    $("#nav-injury-tab").addClass("hidden");
    $("#nav-death-tab").addClass("hidden");
    $("#nav-medication-error-tab").addClass("hidden");
    $("#nav-other-tab").addClass("hidden");
}
function ShowHideTabs() {
    switch (incidentType) {
        case "Injury":
            $("#nav-injury-tab").removeClass("hidden");
            $("#nav-state-forms-tab").removeClass("hidden");
            BindInjuryDropDowns();
            break;
        case "Medication Error":
            $("#nav-medication-error-tab").removeClass("hidden");
            $("#nav-state-forms-tab").removeClass("hidden");
            BindMedicationErrorDropDowns();
            break;
        case "Death":
            $("#nav-death-tab").removeClass("hidden");
            $("#nav-state-forms-tab").removeClass("hidden");
            BindDeathDropDowns();
            break;
        case "Other":
            $("#nav-other-tab").removeClass("hidden");
            $("#nav-state-forms-tab").removeClass("hidden");
            BindOtherDropDowns();
            break;
        default:
            $("#nav-state-forms-tab").removeClass("hidden");
            break;
    }
}

function AddMedication() {
    var newRow;
    newRow = $('#MedicationDesc').DataTable({ searching: false, paging: false, info: false });
    newRow.columns([3, 4]).visible(false);

    $("#AddMultiMedication").on("click", function () {
        if (!$("#AddMultiMedication").hasClass("editRow")) {
            if (dataTableMedicationFlg) {
                newRow = $('#MedicationDesc').DataTable();
                var text = [{
                    "Actions": CreateMedicationErrorbtnWithPermission(),
                    "MediactionName": $("#DropDownMedication option:selected").text(),
                    "DescriptionOfTheError": $("#TextBoxMedicationDescription").val(),
                    "Medication": $("#DropDownMedication").val(),
                    "MedicationErrorSubFieldId": $("#TextBoxMedicationErrorSubFieldId").val()
                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw();
                showRecordSaved("Medication added successfully.");
                clearMedicationErrorMedications();
            }
            else {
                newRow = $('#MedicationDesc').DataTable();
                newRow.row.add([
                    CreateMedicationErrorbtnWithPermission(),
                    $("#DropDownMedication option:selected").text(),
                    $("#TextBoxMedicationDescription").val(),
                    $("#DropDownMedication").val(),
                    ""
                ]).draw();
                clearMedicationErrorMedications();
                showRecordSaved("Medication added successfully.");
            }

        }

    });


}
function AddBodyParts() {
    var newRow;

    newRow = $('#BodyParts').DataTable({ searching: false, paging: false, info: false });
    newRow.columns([4, 5, 6]).visible(false);


    var counter = 1;
    var bodyPart;
    var bodyPartValue;
    $("#AddBodyParts").on("click", function () {
        if (!$("#AddBodyParts").hasClass("editRow")) {
            if (!validateBodyParts()) return;
            if ($("#frontBodyDropDwon").hasClass("hidden")) {
                bodyPart = $("#DropDownBackBodyPartId").select2('data')[0]['text'];
                bodyPartValue = $("#DropDownBackBodyPartId").val() + ":" + "Back";
            }
            else {
                bodyPart = $("#DropDownFrontBodyPartId").select2('data')[0]['text'];
                bodyPartValue = $("#DropDownFrontBodyPartId").val() + ":" + "Front";
            }
            if (datatableFlag) {
                newRow = $('#BodyParts').DataTable();

                var data = [{
                    "Actions": CreateBodyPartsbtnWithPermissions(),
                    "BodyPartName": bodyPart,
                    "InjuryTypeName": $("#DropDownInjuryType option:selected").text(),
                    "Description": $("#TextBoxDescriptionInjury").val(),
                    "BodyPartId": bodyPartValue,
                    "InjuryType": $("#DropDownInjuryType").val(),
                    "InjuryBodyPartId": ""
                }];
                var text = JSON.stringify(data);
                var data1 = JSON.parse(text);
                newRow.rows.add(data1).draw();
                showRecordSaved("Body Part added successfully");
                clearInjuryBodyPartFields();
            }
            else {
                newRow = $('#BodyParts').DataTable();
                newRow.row.add([
                    CreateBodyPartsbtnWithPermissions(),
                    bodyPart,
                    $("#DropDownInjuryType option:selected").text(),
                    $("#TextBoxDescriptionInjury").val(),
                    bodyPartValue,
                    $("#DropDownInjuryType").val(),
                    ""
                ]).draw(false);
                showRecordSaved("Body Part added successfully");
                clearInjuryBodyPartFields();
            }

        }

    });


}
function AddOPWDD147Notifiaction() {
    newRow = $('#147Notification').DataTable({
        searching: false, paging: true, info: true
    });
    newRow.columns([7, 8, 9, 10, 11, 12]).visible(false);
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
    $("#DropDownNotificationType").change(function () {
        selectedText = $(this).find("option:selected").text();
        selectedValue = $(this).val();
        if (selectedText == 'Other1') {
            $("#Other1Desc").removeClass("hidden");
            $("#Other2Desc").addClass("hidden");
            $("#Other3Desc").addClass("hidden");
            $("#Other4Desc").addClass("hidden");
        }
        else if (selectedText == 'Other2') {
            $("#Other1Desc").addClass("hidden");
            $("#Other2Desc").removeClass("hidden");
            $("#Other3Desc").addClass("hidden");
            $("#Other4Desc").addClass("hidden");
        }
        else if (selectedText == 'Other3') {
            $("#Other1Desc").addClass("hidden");
            $("#Other2Desc").addClass("hidden");
            $("#Other3Desc").removeClass("hidden");
            $("#Other4Desc").addClass("hidden");
        }
        else if (selectedText == 'Other4') {
            $("#Other1Desc").addClass("hidden");
            $("#Other2Desc").addClass("hidden");
            $("#Other3Desc").addClass("hidden");
            $("#Other4Desc").removeClass("hidden");
        }
        else {
            $("#Other1Desc").addClass("hidden");
            $("#Other2Desc").addClass("hidden");
            $("#Other3Desc").addClass("hidden");
            $("#Other4Desc").addClass("hidden");
        }

    });


    $("#AddOPWDD147Notification").on("click", function () {
        if (!$("#AddOPWDD147Notification").hasClass("editRow")) {
            if (isEmpty($("#DropDownNotificationType").val())) {
                showErrorMessage("Plase select notification");
                return;
            }
            if (dataTableNotificationFlg) {
                newRow = $('#147Notification').DataTable();
                var rowExists = false;
                var valueCol = $('#147Notification').DataTable().column(1).data();
                var index = valueCol.length;
                for (var k = 0; k < index; k++) {
                    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                        rowExists = true;
                        break;
                    }
                }
                if (rowExists) {
                    showErrorMessage("option already exist in table");
                    return;

                }
                else {
                    var text = [{
                        "Actions": CreateNotificationBtnWithPermission(),
                        "Notification": selectedText.trim(),
                        "Date": $("#TextBoxContactNotificationDateTime").val(),
                        "Time": $("#TextBoxContactNotificationDateTimeTime").val(),
                        "PersonContacted": $("#TextBoxPersonContacted").val(),
                        "ReportedBy": $("#TextBoxContactReportedBy").val(),
                        "Method": $("#TextBoxMethod").val(),
                        "NotificationType": selectedValue,
                        "OPWDD147NotificationId": "",
                        "Other1Desc": $("#TextBoxOther1Desc").is(":visible") == true ? $("#TextBoxOther1Desc").val() : "",
                        "Other2Desc": $("#TextBoxOther2Desc").is(":visible") == true ? $("#TextBoxOther2Desc").val() : "",
                        "Other3Desc": $("#TextBoxOther3Desc").is(":visible") == true ? $("#TextBoxOther3Desc").val() : "",
                        "Other4Desc": $("#TextBoxOther4Desc").is(":visible") == true ? $("#TextBoxOther4Desc").val() : "",

                    }];
                    var stringyfy = JSON.stringify(text);
                    var data = JSON.parse(stringyfy);
                    newRow.rows.add(data).draw(false);
                    showRecordSaved("Notification added successfully.");

                    clearNotificationFields();
                }

            }
            else {
                if (isEmpty($("#DropDownNotificationType").val())) {
                    showErrorMessage("Plase select notification");
                    return;
                }
                var rowExists = false;
                newRow = $('#147Notification').DataTable();
                var valueCol = $('#147Notification').DataTable().column(1).data();
                var index = valueCol.length;
                for (var k = 0; k < index; k++) {
                    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                        rowExists = true;
                        break;
                    }
                }

                if (rowExists) {
                    showErrorMessage("option already exist in table");
                    return;
                }
                else {
                    newRow.row.add([
                        CreateNotificationBtnWithPermission(),
                        selectedText.trim(),
                        $("#TextBoxContactNotificationDateTime").val(),
                        $("#TextBoxContactNotificationDateTimeTime").val(),
                        $("#TextBoxPersonContacted").val(),
                        $("#TextBoxContactReportedBy").val(),
                        $("#TextBoxMethod").val(),
                        selectedValue,
                        $("#TextBoxOPWDD147NotificationId").val(),
                        $("#TextBoxOther1Desc").is(":visible") == true ? $("#TextBoxOther1Desc").val() : "",
                        $("#TextBoxOther2Desc").is(":visible") == true ? $("#TextBoxOther2Desc").val() : "",
                        $("#TextBoxOther3Desc").is(":visible") == true ? $("#TextBoxOther3Desc").val() : "",
                        $("#TextBoxOther4Desc").is(":visible") == true ? $("#TextBoxOther4Desc").val() : "",
                    ]).draw(false);
                    showRecordSaved("Notification added successfully.");

                    clearNotificationFields();
                }

            }

        }

    });
}
//#region Add Edit Delete With Permissions
function CreateBodyPartsbtnWithPermissions() {
    var injuryBtn = "";
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            injuryBtn = '<a href="#" class="editSubRows" onclick="EditBodyPart(this);return false;">Edit</a>'
                + '<span> <a href="#" class="deleteSubRows disable-click" onclick="DeleteRowPart(this);return false;">Delete</a></span>';
        }
        if (editPermission == "false" && deletePermission == "true") {
            injuryBtn = '<a href="#" class="editSubRows disable-click" onclick="EditBodyPart(this);return false;">Edit</a>'
                + '<span> <a href="#" class="deleteSubRows" onclick="DeleteRowPart(this);return false;">Delete</a></span>';
        }
        if (editPermission == "true" && deletePermission == "true") {
            injuryBtn = '<a href="#" class="editSubRows" onclick="EditBodyPart(this);return false;">Edit</a>'
                + '<span> <a href="#" class="deleteSubRows" onclick="DeleteRowPart(this);return false;">Delete</a></span>';
        }
    }
    return injuryBtn;
}
function CreateMedicationErrorbtnWithPermission() {
    var medicationBtn = "";
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            medicationBtn = '<a href="#" class="editSubRows" onclick="EditMedication(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows disable-click" onclick="DeleteMedication(this); event.preventDefault();"> Delete</a></span>';
        }
        if (editPermission == "false" && deletePermission == "true") {
            medicationBtn = '<a href="#" class="editSubRows disable-click" onclick="EditMedication(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="DeleteMedication(this); event.preventDefault();"> Delete</a></span>';
        }
        if (editPermission == "true" && deletePermission == "true") {
            medicationBtn = '<a href="#" class="editSubRows" onclick="EditMedication(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="DeleteMedication(this); event.preventDefault();">Delete</a></span>';
        }
    }
    return medicationBtn;
}
function CreateNotificationBtnWithPermission() {
    var notificationBtn = "";
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            notificationBtn = '<a href="#" class="editSubRows"  onclick="Edit147Notification(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows disable-click" onclick="Delete147Notification(this);event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "false" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows disable-click" onclick="Edit147Notification(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="Delete147Notification(this); event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "true" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows" onclick="Edit147Notification(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="Delete147Notification(this); event.preventDefault();">Delete</a></span>';
        }
    }
    return notificationBtn;
}
function CheckBtnPermissionAfterSave() {
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            $(".editSubRows").removeClass("disable-click");
            $(".deleteSubRows").addClass("disable-click");
        }
        if (editPermission == "false" && deletePermission == "true") {
            $(".editSubRows").addClass("disable-click");
            $(".deleteSubRows").removeClass("disable-click");
        }
        if (editPermission == "false" && deletePermission == "false") {
            $(".editSubRows").addClass("disable-click");
            $(".deleteSubRows").addClass("disable-click");
        }
        if (editPermission == "true" && deletePermission == "true") {
            $(".editSubRows").removeClass("disable-click");
            $(".deleteSubRows").removeClass("disable-click");
        }
    }
}
//#endregion 
function EditBodyPart(object) {
    var table = $('#BodyParts').DataTable();
    var bodyPart;
    currentRow = $(object).parents("tr");
    var Desription = table.row(currentRow).data()[3] == undefined ? table.row(currentRow).data().Description : table.row(currentRow).data()[3];
    bodyPart = table.row(currentRow).data()[4] == undefined ? table.row(currentRow).data().BodyPartId : table.row(currentRow).data()[4];
    var injuryType = table.row(currentRow).data()[5] == undefined ? table.row(currentRow).data().InjuryType : table.row(currentRow).data()[5];
    var injuryBodyPartId = table.row(currentRow).data()[6] == undefined ? table.row(currentRow).data().InjuryBodyPartId : table.row(currentRow).data()[6];
    var bodyPartValue;
    if (bodyPart.indexOf("Front") > -1) {
        $(".tabBtn").removeClass("active");
        $(".body").removeClass("active");
        $("#frontBody").tab("show");
        $("#frontBodyDropDwon").removeClass("hidden");
        $("#BackBodyDropDwon").addClass("hidden");
        bodyPartValue = bodyPart.split(":")[0];
        $("#DropDownFrontBodyPartId").select2('val', [bodyPartValue]);
    }
    else {
        $(".tabBtn").removeClass("active");
        $(".body").removeClass("active");
        $("#backBody").tab("show");
        $("#BackBodyDropDwon").removeClass("hidden");
        $("#frontBodyDropDwon").addClass("hidden");
        bodyPartValue = bodyPart.split(":")[0];
        $("#DropDownBackBodyPartId").select2('val', [bodyPartValue]);
    }
    $("#DropDownInjuryType").val(injuryType);
    $("#TextBoxDescriptionInjury").val(Desription);
    $("#TextBoxInjuryBodyPartId").val(injuryBodyPartId);
    $("#AddBodyParts").attr("onclick", "EditExistingRow();return false;");
    $("#AddBodyParts").addClass("editRow");

}
function EditMedication(object) {
    var table = $('#MedicationDesc').DataTable();
    currentRowMedication = $(object).parents("tr");
    var medication = table.row(currentRowMedication).data()[3] == undefined ? table.row(currentRowMedication).data().Medication : table.row(currentRowMedication).data()[3];
    var description = table.row(currentRowMedication).data()[2] == undefined ? table.row(currentRowMedication).data().DescriptionOfTheError : table.row(currentRowMedication).data()[3];
    var subFieldId = table.row(currentRowMedication).data()[4] == undefined ? table.row(currentRowMedication).data().MedicationErrorSubFieldId : table.row(currentRowMedication).data()[3];

    $("#DropDownMedication").val(medication);
    $("#TextBoxMedicationDescription").val(description);
    $("#TextBoxMedicationErrorSubFieldId").val(subFieldId);

    $("#AddMultiMedication").attr("onclick", "EditExistingRowMedication();return false;");
    $("#AddMultiMedication").addClass("editRow");
    return false;
}

function Edit147Notification(object) {
    var table = $('#147Notification').DataTable();
    currentRowNotification = $(object).parents("tr");

    Notification = table.row(currentRowNotification).data()[1] == undefined ? table.row(currentRowNotification).data().Notification : table.row(currentRowNotification).data()[1];
    var Date = table.row(currentRowNotification).data()[2] == undefined ? table.row(currentRowNotification).data().Date : table.row(currentRowNotification).data()[2];
    var Time = table.row(currentRowNotification).data()[3] == undefined ? table.row(currentRowNotification).data().Time : table.row(currentRowNotification).data()[3];
    var PersonContacted = table.row(currentRowNotification).data()[4] == undefined ? table.row(currentRowNotification).data().PersonContacted : table.row(currentRowNotification).data()[4];
    var ReportedBy = table.row(currentRowNotification).data()[5] == undefined ? table.row(currentRowNotification).data().ReportedBy : table.row(currentRowNotification).data()[5];
    var Method = table.row(currentRowNotification).data()[6] == undefined ? table.row(currentRowNotification).data().Method : table.row(currentRowNotification).data()[6];
    var NotificationType = table.row(currentRowNotification).data()[7] == undefined ? table.row(currentRowNotification).data().NotificationType : table.row(currentRowNotification).data()[7];
    var OPWDD147NotificationId = table.row(currentRowNotification).data()[8] == undefined ? table.row(currentRowNotification).data().OPWDD147NotificationId : table.row(currentRowNotification).data()[8];
    var Other1Desc = table.row(currentRowNotification).data()[8] == undefined ? table.row(currentRowNotification).data().Other1Desc : table.row(currentRowNotification).data()[9];
    var Other2Desc = table.row(currentRowNotification).data()[9] == undefined ? table.row(currentRowNotification).data().Other2Desc : table.row(currentRowNotification).data()[10];
    var Other3Desc = table.row(currentRowNotification).data()[10] == undefined ? table.row(currentRowNotification).data().Other3Desc : table.row(currentRowNotification).data()[11];
    var Other4Desc = table.row(currentRowNotification).data()[11] == undefined ? table.row(currentRowNotification).data().Other4Desc : table.row(currentRowNotification).data()[12];
    if (Other1Desc != "") {
        $("#Other1Desc").removeClass("hidden");
        $("#Other2Desc").addClass("hidden");
        $("#Other3Desc").addClass("hidden");
        $("#Other4Desc").addClass("hidden");
        $("#TextBoxOther1Desc").val(Other1Desc);
    }
    else if (Other2Desc != "") {
        $("#Other1Desc").addClass("hidden");
        $("#Other2Desc").removeClass("hidden");
        $("#Other3Desc").addClass("hidden");
        $("#Other4Desc").addClass("hidden");
        $("#TextBoxOther2Desc").val(Other2Desc);
    }
    else if (Other3Desc != "") {
        $("#Other1Desc").addClass("hidden");
        $("Other2Desc").addClass("hidden");
        $("#Other3Desc").removeClass("hidden");
        $("#Other4Desc").addClass("hidden");
        $("#TextBoxOther3Desc").val(Other3Desc);
    }
    else if (Other4Desc != "") {
        $("#Other1Desc").addClass("hidden");
        $("#Other2Desc").addClass("hidden");
        $("Other3Desc").addClass("hidden");
        $("#Other4Desc").removeClass("hidden");
        $("#TextBoxOther4Desc").val(Other4Desc);
    }
    else {
        $("#Other1Desc").addClass("hidden");
        $("#Other2Desc").addClass("hidden");
        $("#Other3Desc").addClass("hidden");
        $("#Other4Desc").addClass("hidden");
    }
    $("#TextBoxContactNotificationDateTime").val(Date);
    $("#TextBoxContactNotificationDateTimeTime").val(Time);
    $("#TextBoxPersonContacted").val(PersonContacted);
    $("#TextBoxContactReportedBy").val(ReportedBy);
    $("#TextBoxMethod").val(Method);
    $("#DropDownNotificationType").val(NotificationType);
    $("#TextBoxOPWDD147NotificationId").val(OPWDD147NotificationId);
    $("#AddOPWDD147Notification").attr("onclick", "EditExistingRowNotification();return false;");
    $("#AddOPWDD147Notification").addClass("editRow");

    return false;
}
function DeleteRowPart(object) {
    var table = $('#BodyParts').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddBodyParts").attr("onclick") != undefined) {
        $("#AddBodyParts").removeAttr("onclick");
        $("#AddBodyParts").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;
}
function DeleteMedication(object) {
    var table = $('#MedicationDesc').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddMultiMedication").attr("onclick") != undefined) {
        $("#AddMultiMedication").removeAttr("onclick");
        $("#AddMultiMedication").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;
}
function Delete147Notification(object) {
    var table = $('#147Notification').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddOPWDD147Notification").attr("onclick") != undefined) {
        $("#AddOPWDD147Notification").removeAttr("onclick");
        $("#AddOPWDD147Notification").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRow() {
    if (!validateBodyParts()) return;
    var table = $('#BodyParts').DataTable();
    if ($("#frontBodyDropDwon").hasClass("hidden")) {
        bodyPart = $("#DropDownBackBodyPartId").select2('data')[0]['text'];
        bodyPartValue = $("#DropDownBackBodyPartId").val() + ":" + "Back";
    }
    else {
        bodyPart = $("#DropDownFrontBodyPartId").select2('data')[0]['text'];
        bodyPartValue = $("#DropDownFrontBodyPartId").val() + ":" + "Front";
    }
    if (datatableFlag) {
        var data = {
            "Actions": CreateBodyPartsbtnWithPermissions(),
            "BodyPartName": bodyPart,
            "InjuryTypeName": $("#DropDownInjuryType option:selected").text(),
            "Description": $("#TextBoxDescriptionInjury").val(),
            "BodyPartId": bodyPartValue,
            "InjuryType": $("#DropDownInjuryType").val(),
            "InjuryBodyPartId": $("#TextBoxInjuryBodyPartId").val()
        }
        table.row(currentRow).data(data).draw(false);
        $("#AddBodyParts").removeAttr("onclick");
        $("#AddBodyParts").removeClass("editRow");
        showRecordSaved("Body Part edited successfully")
        clearInjuryBodyPartFields();
    }
    else {
        var data1 = [CreateBodyPartsbtnWithPermissions(),
            bodyPart,
        $("#DropDownInjuryType option:selected").text(),
        $("#TextBoxDescriptionInjury").val(),
            bodyPartValue,
        $("#DropDownInjuryType").val(),
            ""
        ];
        table.row(currentRow).data(data1).draw(false);
        $("#AddBodyParts").removeAttr("onclick");
        $("#AddBodyParts").removeClass("editRow");
        showRecordSaved("Body Part edited successfully");
        clearInjuryBodyPartFields();
    }

}
function EditExistingRowMedication() {
    var table = $('#MedicationDesc').DataTable();
    if (dataTableMedicationFlg) {
        var data = {
            "Actions": CreateMedicationErrorbtnWithPermission(),
            "MediactionName": $("#DropDownMedication option:selected").text(),
            "DescriptionOfTheError": $("#TextBoxMedicationDescription").val(),
            "Medication": $("#DropDownMedication").val(),
            "MedicationErrorSubFieldId": $("#TextBoxMedicationErrorSubFieldId").val()
        }
        table.row(currentRowMedication).data(data).draw(false);
        $("#AddMultiMedication").removeAttr("onclick");
        $("#AddMultiMedication").removeClass("editRow");
        clearMedicationErrorMedications();
        showRecordSaved("Medication edited successfully.");
    }
    else {
        var data1 = [
            CreateMedicationErrorbtnWithPermission(),
            $("#DropDownMedication option:selected").text(),
            $("#TextBoxMedicationDescription").val(),
            $("#DropDownMedication").val(),
            ""
        ]
        table.row(currentRowMedication).data(data1).draw(false);
        $("#AddMultiMedication").removeAttr("onclick");
        $("#AddMultiMedication").removeClass("editRow");
        clearMedicationErrorMedications();
        showRecordSaved("Medication edited successfully.");
    }
}
function EditExistingRowNotification() {
    var table = $('#147Notification').DataTable();
    var currentata = "";
    if (dataTableNotificationFlg) {
        var rowExists = false;
        var valueCol = $('#147Notification').DataTable().column(1).data();
        var index = valueCol.length;
        for (var k = 0; k < index; k++) {
            if (valueCol[k].toLowerCase().includes($("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase())) {
                rowExists = true;
                currentata = $("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase();
                break;
            }
        }
        if (rowExists && currentata != Notification.trim().toLowerCase()) {
            showErrorMessage("option already exist in table");
            return;

        }
        else {
            var data = {
                "Actions": CreateNotificationBtnWithPermission(),
                "Notification": $("#DropDownNotificationType").find("option:selected").text().trim(),
                "Date": $("#TextBoxContactNotificationDateTime").val(),
                "Time": $("#TextBoxContactNotificationDateTimeTime").val(),
                "PersonContacted": $("#TextBoxPersonContacted").val(),
                "ReportedBy": $("#TextBoxContactReportedBy").val(),
                "Method": $("#TextBoxMethod").val(),
                "NotificationType": $("#DropDownNotificationType").val(),
                "OPWDD147NotificationId": $("#TextBoxOPWDD147NotificationId").val(),
                "Other1Desc": $("#TextBoxOther1Desc").is(":visible") == true ? $("#TextBoxOther1Desc").val() : "",
                "Other2Desc": $("#TextBoxOther2Desc").is(":visible") == true ? $("#TextBoxOther2Desc").val() : "",
                "Other3Desc": $("#TextBoxOther3Desc").is(":visible") == true ? $("#TextBoxOther3Desc").val() : "",
                "Other4Desc": $("#TextBoxOther4Desc").is(":visible") == true ? $("#TextBoxOther4Desc").val() : "",

            };
            table.row(currentRowNotification).data(data).draw(false);
            $("#AddOPWDD147Notification").removeAttr("onclick");
            $("#AddOPWDD147Notification").removeClass("editRow");
            showRecordSaved("Notification edited successfully.");
            clearNotificationFields();
        }
    }
    else {
        var rowExists = false;
        var valueCol = $('#147Notification').DataTable().column(1).data();
        var index = valueCol.length;
        for (var k = 0; k < index; k++) {
            if (valueCol[k].toLowerCase().includes($("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase())) {
                rowExists = true;
                currentata = $("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase();
                break;
            }
        }
        if (rowExists && currentata != Notification.trim().toLowerCase()) {
            showErrorMessage("option already exist in table");
            return;

        }
        else {
            var data1 = [
                CreateNotificationBtnWithPermission(),
                $("#DropDownNotificationType").find("option:selected").text().trim(),
                $("#TextBoxContactNotificationDateTime").val(),
                $("#TextBoxContactNotificationDateTimeTime").val(),
                $("#TextBoxPersonContacted").val(),
                $("#TextBoxContactReportedBy").val(),
                $("#TextBoxMethod").val(),
                $("#DropDownNotificationType").val(),
                $("#TextBoxOPWDD147NotificationId").val(),
                $("#TextBoxOther1Desc").is(":visible") == true ? $("#TextBoxOther1Desc").val() : "",
                $("#TextBoxOther2Desc").is(":visible") == true ? $("#TextBoxOther2Desc").val() : "",
                $("#TextBoxOther3Desc").is(":visible") == true ? $("#TextBoxOther3Desc").val() : "",
                $("#TextBoxOther4Desc").is(":visible") == true ? $("#TextBoxOther4Desc").val() : ""
            ];
            table.row(currentRowNotification).data(data1).draw(false);
            $("#AddOPWDD147Notification").removeAttr("onclick");
            $("#AddOPWDD147Notification").removeClass("editRow");
            showRecordSaved("Notification edited successfully.");
            clearNotificationFields();
        }
    }
}
function clearInjuryBodyPartFields() {
    $("#DropDownBackBodyPartId").val(null).trigger('change');
    $("#DropDownFrontBodyPartId").val(null).trigger('change');
    $("#DropDownInjuryType").val("");
    $("#TextBoxDescriptionInjury").val("");
    $("#TextBoxInjuryBodyPartId").val("");
}
function clearNotificationFields() {
    $("#DropDownNotificationType").val("");
    $("#NotificationForm .form-control").val("");
}
function clearMedicationErrorMedications() {
    $("#DropDownMedication").val("");
    $("#MedicationForm, #TextBoxMedicationDescription").val("");
    $("#TextBoxMedicationErrorSubFieldId").val("");
}
function ShowHideNavs(id) {

    switch (id) {
        case "nav-general":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-general-tab").addClass("active");
            $("#" + id).tab("show");
            break;
        case "nav-injury":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-injury-tab").addClass("active");
            $("#" + id).tab("show");

            break;
        case "nav-medication-error":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-medication-error-tab").addClass("active");
            $("#" + id).tab("show");
            break;
        case "nav-death":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-death-tab").addClass("active");
            $("#" + id).tab("show");

            break;
        case "nav-other":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-other-tab").addClass("active");
            $("#" + id).tab("show");

            break;
        case "nav-state-forms":
            $(".nav-item ").removeClass("active");
            $(".tab-pane").removeClass("active");
            $("#nav-state-forms-tab").addClass("active");
            $("#" + id).tab("show");
            break;

    }
}



//Bind tabs dropdown
function BindDropDowns() {
    token = _token;
    reportedBy = _userId;
    //get all clients
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetAllClient',
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            BindDropDownOptions(result, "#DropDownClientId", "ClientID", "ClientName");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

    //getallstaff
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetAllStaff',
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            BindDropDownOptions(result, "#DropDownReportedBy", "StaffID", "StaffName");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

    //getloaction dropdwons
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetAllLocation',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownOptionsLocations(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

    BindUserDefinedCodes("#DropDownIncidentType", "UDO_IM_IncidentType");
    BindUserDefinedCodes("#DropDownSite", "RIA_Locations");
    BindUserDefinedCodes("#DropDownReportedRelationshipToStaff", "IM_Relationship");
}
function BindDeathDropDowns() {
    BindUserDefinedCodes("#DropDownDeathLocation", 'RIA_Locations');
    BindUserDefinedCodes("#DropDownCauseOfDeath", 'IM_CauseOfDeath');
    BindAllStaff("#DropDownDeathWitness");

}
function BindInjuryDropDowns() {
    //getallstaff
    BindAllStaff("#DropDownTreatedByStaff");
    BindAllStaff("#DropDownWitnessInjury");
    BindUserDefinedCodes("#DropDownInjuryLocation", 'RIA_Locations');
    BindUserDefinedCodes("#DropDownInjuryCause", 'IM_InjuryCause');
    BindUserDefinedCodes("#DropDownInjurySeverity", 'IM_InjurySeverity');
    BindUserDefinedCodes("#DropDownInjuryColor", 'IM_InjuryColor');
    BindUserDefinedCodes("#DropDownFrontBodyPartId", 'RIA_FrontBodyPart');
    BindUserDefinedCodes("#DropDownBackBodyPartId", 'RIA_BackBodyPart');
    BindUserDefinedCodes("#DropDownInjuryType", 'RIA_InjuryList');

}
function BindMedicationErrorDropDowns() {
    BindAllStaff("#DropDownStaffInvolved");
    BindAllStaff("#DropDownWitnessMedication");
    BindUserDefinedCodes("#DropDownTypeOfMedError", 'IM_TypeOfMedError');
    BindUserDefinedCodes("#DropDownCauseOfMedError", 'IM_CauseOfMedError');
    BindUserDefinedCodes("#DropDownSeverityOfMedError", 'IM_SeverityOfMedError');

    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetClientMedication',
        data: { ClientId: clientId },
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            BindDropDownOptions(result, "#DropDownMedication", "Medication List ID", "Medication Brand Name");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function BindOtherDropDowns() {
    BindUserDefinedCodes("#DropDownEventLocation", 'RIA_Locations');
    BindAllStaff("#DropDownOtherWitness");
}
function BindJonathanLawDropDowns() {
    BindUserDefinedCodes("#DropDownActionType", ' IM_ActionType');
    BindUserDefinedCodes("#DropDownPersonRelationship", '  IM_Notification');
    BindUserDefinedCodes("#DropDownMethodOfNotification", 'IM_MethodOfNotification');
    BindAllStaff("#DropDownNotifiedByStaff");
}

function ShowHideBodyDropDown(id) {
    switch (id) {
        case "frontBody":
            $(".tabBtn").removeClass("active");
            $(".body").removeClass("active");
            $("#" + id).tab("show");
            $("#frontBodyDropDwon").removeClass("hidden");
            $("#BackBodyDropDwon").addClass("hidden");
            break;
        case "backBody":
            $(".tabBtn").removeClass("active");
            $(".body").removeClass("active");
            $("#" + id).tab("show");
            $("#BackBodyDropDwon").removeClass("hidden");
            $("#frontBodyDropDwon").addClass("hidden");
            break;
    }
}
function InsertManagementId(id) {
    managementid = id;
    switch (incidentType) {
        case "Injury":
            $(".injuryid").val(id);
            break;
        case "Medication Error":
            $(".medicationid").val(id);
            break;
        case "Death":
            $(".deathid").val(id);
            break;
        case "Other":
            $(".otherid").val(id);
            break;
        default:
            break;
    }
}






function BindMedicationSubFields(json) {
    var table = $('#MedicationDesc').DataTable();
    table.clear();
    $('#MedicationDesc').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [3, 4] }
        ],
        "aaData": JSON.parse(json),
        "columns": [{ "data": "Actions" }, { "data": "MediactionName" }, { "data": "DescriptionOfTheError" }, { "data": "Medication" }, { "data": "MedicationErrorSubFieldId" }]
    });
    dataTableMedicationFlg = true;
    CheckBtnPermissionAfterSave();
}
function BindMultipleBodyParts(json) {
    var table = $('#BodyParts').DataTable();
    table.clear();
    $('#BodyParts').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [4, 5, 6] }
        ],
        "aaData": JSON.parse(json),
        "columns": [{ "data": "Actions" }, { "data": "BodyPartName" }, { "data": "InjuryTypeName" }, { "data": "Description" }, { "data": "BodyPartId" }, { "data": "InjuryType" }, { "data": "InjuryBodyPartId" }]
    });
    datatableFlag = true;
    CheckBtnPermissionAfterSave();
}

function BindStateFormNotifications(json) {
    var table = $('#147Notification').DataTable();
    table.clear();
    $('#147Notification').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": false,
        "autoWidth": false,
        'columnDefs': [
            { 'visible': false, 'targets': [7, 8, 9, 10, 11, 12] }
        ],
        "aaData": JSON.parse(json),
        "columns": [{ "data": "Actions" }, { "data": "Notification" }, { "data": "Date" }, { "data": "Time" }, { "data": "PersonContacted" },
        { "data": "ReportedBy" }, { "data": "Method" }, { "data": "NotificationType" }, { "data": "OPWDD147NotificationId" }, { "data": "Other1Desc" }, { "data": "Other2Desc" }, { "data": "Other3Desc" }, { "data": "Other4Desc" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
    dataTableNotificationFlg = true;
    CheckBtnPermissionAfterSave();
}
function HideStateForms() {
    $('.OPWDD147Tab').hide();
    $('.OPWDD148Tab').hide();
    $('.OPWDD150Tab').hide();
    $('.JonathanTab').hide();
    $('.uploadPDF').hide();
}

function DownloadPDFOPWDD150() {
    var data = {
        TabName: "OPWDD150", IncidentManagementId: $(".opd150id").val(), StateFormId: $("#TextBoxStatesFormOPWDD150Id").val()
    };

    fetch(GetAPIEndPoints("FILLSTATEFORMSPDF"), {
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
            a.download = "opwdd150_fillable_1_" + $(".opd150id").val() + "_" + $("#TextBoxStatesFormOPWDD150Id").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })
}
function DownloadPDFOPWDD148() {
    var data = {
        TabName: "OPWDD148", IncidentManagementId: $(".opd148id").val(), StateFormId: $("#TextBoxStatesFormOPWDD148Id").val()
    };

    fetch(GetAPIEndPoints("FILLSTATEFORMSPDF"), {
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
            a.download = "opwdd148_fillable_1_" + $(".opd148id").val() + "_" + $("#TextBoxStatesFormOPWDD148Id").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })

}
function DownloadPDFOPWDD147() {
    var data = {
        TabName: "OPWDD147", IncidentManagementId: $(".opd147id").val(), StateFormId: $("#TextBoxStatesFormOPWDD147Id").val()
    };

    fetch(GetAPIEndPoints("FILLSTATEFORMSPDF"), {
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
            a.download = "opwdd147_fillable_1_" + $(".opd147id").val() + "_" + $("#TextBoxStatesFormOPWDD147Id").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })

}

function UploadStateFormPDF() {
    if ($("#btnUploadPDf").text() == 'Edit') {
        $('.uploadPDF .form-control').prop("disabled", false);
        $("#btnUploadPDf").text('Ok');
        return;
    }
    if (!ValidateUploadPDF()) return;
    var json = [],
        item = {};
    var data = new FormData();
    var files = $("#TextBoxUploadPdf").get(0).files;
    if (files.length > 0) {
        data.append("File", files[0]);
    }

    if ($("#StateFormTypePDF").val() == "0") {
        data.append('IncidentManagementId', $(".opd147id").val());
        data.append('FormType', $("#StateFormTypePDF").val());
        data.append('StatesFormOPWDD147Id', $("#TextBoxStatesFormOPWDD147Id").val());
        data.append('ReportedBy', reportedBy);
    }
    else if ($("#StateFormTypePDF").val() == "1") {
        data.append('IncidentManagementId', $(".opd148id").val());
        data.append('FormType', $("#StateFormTypePDF").val());
        data.append('StatesFormOPWDD148Id', $("#TextBoxStatesFormOPWDD148Id").val());
        data.append('ReportedBy', reportedBy);

    }
    else if ($("#StateFormTypePDF").val() == "2") {

        data.append('IncidentManagementId', $(".opd150id").val());
        data.append('FormType', $("#StateFormTypePDF").val());
        data.append('StatesFormOPWDD150Id', $("#TextBoxStatesFormOPWDD150Id").val());
        data.append('ReportedBy', reportedBy);

    }

    $.ajax({
        type: "POST",
        url: GetAPIEndPoints("UPLOADPDF"),
        contentType: false,
        processData: false,
        data: data,
        //headers: {
        //    'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        //},
        success: function (result) {
            DocumentUploaded(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindStateFormTypeDropDown(result) {
    $("#StateFormTypePDF").empty();
    if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD147 == "Y") {
        $("#StateFormTypePDF").append("<option value='0'>OPWDD 147</option>");

    }
    if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD148 == "Y") {
        $("#StateFormTypePDF").append("<option value='1'>OPWDD 148</option>");

    }
    if (JSON.parse(result.AllTabs[0].JSONData)[0].OPWDD150 == "Y") {
        $("#StateFormTypePDF").append("<option value='2'>OPWDD 150</option>");

    }
}

function InitalizeUploadPDF() {
    var table = $('#UploadPDF').DataTable({ searching: false, paging: false, info: false });
}
function ValidateUploadPDF() {
    if ($("#StateFormTypePDF").val() == "" || $("#StateFormTypePDF").val() <= -1) {
        $("#StateFormTypePDF").siblings("span.errorMessage").removeClass("hidden");
        return false;
    }
    else if ($("#TextBoxUploadPdf").val() == "") {
        $("#TextBoxUploadPdf").siblings("span.errorMessage").removeClass("hidden");
        return false;
    }
    else if ($("#StateFormTypePDF").val() == "0" && $("#TextBoxStatesFormOPWDD147Id").val() == "") {
        showErrorMessage("Please save form 147 first.");
        return false;
    }
    else if ($("#StateFormTypePDF").val() == "1" && $("#TextBoxStatesFormOPWDD148Id").val() == "") {
        showErrorMessage("Please save form 148 first.");
        return false;
    }
    else if ($("#StateFormTypePDF").val() == "2" && $("#TextBoxStatesFormOPWDD150Id").val() == "") {
        showErrorMessage("Please save form 150 first.");
        return false;
    }
    return true;
}
function DocumentUploaded(result) {
    var table = $('#UploadPDF').DataTable();
    var stringyfy = JSON.stringify(result.UploadedPDFResponse);
    $('.uploadPDF .form-control').prop("disabled", true);
    if ($("#btnUploadPDf").text() == "Ok") {
        $("#btnUploadPDf").text("Edit");
    }
    showRecordSaved("PDF uploaded successfully.");
    $('#UploadPDF').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        "aaData": JSON.parse(stringyfy),
        "columns": [{ "data": "FormType" }, { "data": "UploadDate" }, { "data": "Version" }, { "data": "DownloadLink" }]
    });
}
function DownloadUPloadedFile(stateFormPdfVersioningId, incidentManagementId) {
    var data = {
        IncidentManagementId: incidentManagementId, StateFormPDFVersioningId: stateFormPdfVersioningId
    };

    fetch(GetAPIEndPoints("DOWNLOADPDFFILE"), {
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
            // var download = "opwdd147_fillable_1_" + $(".opd147id").val() + "_" + $("#TextBoxStatesFormOPWDD147Id").val() + "_" + getFormattedTime();

            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            }, 0)
        });
}

function GoToMasterPage() {
    $(".nav-item ").removeClass("active");
    $(".tab-pane").removeClass("active");
    $("#nav-general-tab").addClass("active");
    $("#nav-general").tab("show");
}
function AddNewPermission() {
    if (!isEmpty(incidentRolePermissions)) {
        if ((incidentRolePermissions[0].Action == "Add" && incidentRolePermissions[0].IsEnable == "true") && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "false")) {
            $(".printDoc").addClass('hidden');
            $(".saveBtn").removeClass('hidden').text('Ok');
        }
        if ((incidentRolePermissions[0].Action == "Add" && incidentRolePermissions[0].IsEnable == "true") && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "true")) {
            $(".printDoc").removeClass('hidden');
            $(".saveBtn").removeClass('hidden').text('Ok');
        }
        if ((incidentRolePermissions[0].Action == "Add" && incidentRolePermissions[0].IsEnable == "false") && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "false")) {
            $(".printDoc").addClass('hidden');
            $(".saveBtn").addClass('hidden').text('Ok');
        }
    }

}
function CheckUserPermission() {
    if (!isEmpty(incidentRolePermissions)) {
        if (incidentRolePermissions[3].Action == "View" && incidentRolePermissions[3].IsEnable == "true"
            && ((incidentRolePermissions[1].Action == "Edit" && incidentRolePermissions[1].IsEnable == "false")
                && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "false")
                && incidentRolePermissions[2].Action == "Delete" && incidentRolePermissions[2].IsEnable == "false")) {
            ViewPermission();
        }
        if (incidentRolePermissions[3].Action == "View" && incidentRolePermissions[3].IsEnable == "true"
            && ((incidentRolePermissions[1].Action == "Edit" && incidentRolePermissions[1].IsEnable == "true")
                && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "false")
                && (incidentRolePermissions[2].Action == "Delete" && incidentRolePermissions[2].IsEnable == "false"))) {
            EditViewPermission();
        }
        if (incidentRolePermissions[3].Action == "View" && incidentRolePermissions[3].IsEnable == "true"
            && ((incidentRolePermissions[1].Action == "Edit" && incidentRolePermissions[1].IsEnable == "false")
                && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "true")
                && (incidentRolePermissions[2].Action == "Delete" && incidentRolePermissions[2].IsEnable == "false"))) {
            ViewPdfPermission();
        }
        if (incidentRolePermissions[3].Action == "View" && incidentRolePermissions[3].IsEnable == "true"
            && ((incidentRolePermissions[1].Action == "Edit" && incidentRolePermissions[1].IsEnable == "false")
                && (incidentRolePermissions[4].Action == "Print" && incidentRolePermissions[4].IsEnable == "false")
                && (incidentRolePermissions[2].Action == "Delete" && incidentRolePermissions[2].IsEnable == "true"))) {
            ViewDeletePermission();
        }
        if (incidentRolePermissions[1].IsEnable == "true" && incidentRolePermissions[1].IsEnable == "true"
            && incidentRolePermissions[3].IsEnable == "true" && incidentRolePermissions[3].IsEnable == "true") {
            AllPermission();
        }
        if (incidentRolePermissions[3].Action == "View" && incidentRolePermissions[3].IsEnable == "false") {
            window.location.href = 'PermissionDenied.html';
        }
    }


}
function fnOpenGridForm() {

    $.ajax({
        type: "POST",
        data: JSON.stringify({}),
        url: "../Utilities/IncidentReportUtility.aspx/fnOpenGridForm",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data, status) {

            if (status == 'success') window.location = data.d;
        }
    });
}