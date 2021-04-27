var token, reportedBy = "", ccoResult, LifePlanId, zipCode, QueryStringLifeplanId, clientId, blankLifePlanId, emptyLifePlan = false,
    approvalStatus, age, _companyID, _authorizedFlag = false, _detailCircleAndSupport, _MemberName, autoPopulate = false,
    _section2Service, _section3Service, _section4Service, _section5Service, _section6Service, _allRecordFromJson, _circleSupport;
var additionalData = [{ Provider: "CCO", AuthorizedService: "CCO", Location: "CCO" }, { Provider: "Self", AuthorizedService: "Self", Location: "Self" }, { Provider: "Natural Support", AuthorizedService: "Natural Support", Location: "Natural Support" }];
var _DocumentMainTable;
$(document).ready(function () {
    $(window).resize(function () {
        getZoomValues();
        AdjustPaddingResize();
    });

    BindLifePlanDropdowns();
    BindCareManager();
    BindRepresentativeName();
    $(".select2").select2();
    CloseErrorMeeage();
    InitalizeDateControls();
    InitilaizeSectionDataTables();
    AdjustPaddingResize();
    $("#BtnAddMeeting").hide();
    $("#BtnAddIndividualSafe").hide();
    $("#OutcomesSupportStrategies").hide();
    $("#btnModelHCBSWaiver").hide();
    $("#btnModelModaRepresentative").hide();
    $("#btnModelFundalNaturalCommunity").hide();
    $("#btnModelNotifications").hide();
    $('.DocumentTitle .lookup').attr("style", "pointer-events: none");
    $('.addModal-3').click(function () {
        $('.collapse').removeClass('show');
    });
    bindDropdownFromJson();

    EpinSignatureValidation();
    $("#btnCancelOutcomes").click(function () {
        $("#outcomeSourceModal").removeClass('show');
        $("#outcomeSourceModal").addClass('hide');
        $('.modal-backdrop').remove();

    });
    $('.btn-link').click(function (e) {
        var id = this.dataset.target;
        if ($(id).hasClass('show')) {
            $('.collapse').removeClass('show');
            $(id).removeClass('show');
            $(id).addClass('hide');
        }
        else {
            $('.collapse').removeClass('show');
            $(id).removeClass('hide');
            $(id).addClass('show');
        }
    });
    //BindContactAndSupports();
    $("#OutcomesSupportStrategies").click(function () {
        $('#exampleModa2').modal('show');
        $('.modal-backdrop').remove();

    });
    $("input[name='select_all']").click(function () {

        if ($("input[name='select_all']:checked").length > 0) {
            $("#tblStrategiesOutcomesSupportStrategies input[name='RadioSuggestedSupportStrategie']").prop('checked', true);
        }
        else {
            $("#tblStrategiesOutcomesSupportStrategies input[name='RadioSuggestedSupportStrategie']").prop('checked', false);
        }
    });
    $("input[name='select_all_meeting']").click(function () {

        if ($("input[name='select_all_meeting']:checked").length > 0) {
            $("#tblMeetingHistoryExported input[name='RadioMeetingHistory']").prop('checked', true);
        }
        else {
            $("#tblMeetingHistoryExported input[name='RadioMeetingHistory']").prop('checked', false);
        }
    });


    $('#DropDownAuthorizedService').on('select2:select', function (e) {
        var dropDownText = e.params.data;
        var tableProvider = $('#tblProvider').DataTable();
        $.getJSON("JsonDataToDropdown.json", function (data) {

            var sectionName = "Section4";
            var SectionServiceType = $.grep(data, function (e) {
                return e.CompanyName === sectionName;
            });
            if (SectionServiceType != undefined) {
                for (i = 0; i < SectionServiceType[0].Data.length; i++) {
                    if (SectionServiceType[0].Data[i].ServiceTypeName == dropDownText.text) {
                        $("#TextBoxDuration").val("");
                        $("#TextBoxUnitOfMeasure").val("");
                        $("#TextBoxDuration").val(SectionServiceType[0].Data[i].Duration);
                        $("#TextBoxUnitOfMeasure").val(SectionServiceType[0].Data[i].UnitOfMeasure);
                    }
                }
            }
        });
        if (_detailCircleAndSupport.length > 0) {

            var SectionServiceType = $.grep(_detailCircleAndSupport, function (e) {
                return e.ServiceType === dropDownText.text;
            });
            $("#exampleModa4 #DropDownProvider").text('select');
            $("#exampleModa4 #TextBoxLocation").val('');
            if (SectionServiceType.length > 0) {
                for (i = 0; i < SectionServiceType.length; i++) {

                    tableProvider.row.add([
                        SectionServiceType[i].OrganizationName,
                        SectionServiceType[i].ProgramName
                    ]).draw(false);
                }

            }
            else {
                tableProvider.clear().draw();
                showErrorMessage('No Record Found')
            }

        }

    });

    // $("#btnMemberRepresentativeApprovalClose").click(function () {
    //     cleartextMemberRepresentativeApproval();
    // });
    $("#imuMeetingHistory .clearBtn").on('click', function () {
        clearMeetingHistorytext();
    });
    $("#lfuFromOutcomesStrategies .clearBtn").on('click', function () {
        cleartextOutcomesStrategies();
    });
    $("#imuIndividualSafe .clearBtn").on('click', function () {
        clearIndividualSavetext();
    });
    $("#lfuFromFundalNaturalCommunityResources .clearBtn").on('click', function () {
        cleartextFundalNaturalCommunityResources();
    });

    $("#lfuFromHCBSWaiver .clearBtn").on('click', function () {
        cleartextHCBSWaiver();
    });
    $("#lfuNotifications .clearBtn").on('click', function () {
        cleartextLifePlanNotifications();
    });

    $("#lfuDocuments .clearBtn").on('click', function () {
        $("#exampleDocuments").modal("hide");
    });
    $(".submitReviewModal .clearBtn").on('click', function () {
        clearsubmitReviewModal();
    });


    $(".meetingAttendance").hide();

    $('#TextBoxFundalResourcesZip').on("change", function () {
        if ($(this).val() != "") {
            $.ajax({
                type: "GET",
                data: { "ZipCode": $(this).val() },
                url: Cx360URL + "/api/Incident/GetZipDetails",
                headers: {
                    'Token': token,
                },
                success: function (response) {
                    if (response.length > 0) {
                        $("#TextBoxFundalCity").val(response[0].City);
                        $("#TextBoxFundalState").val(response[0].State);
                    }
                    else {
                        $("#TextBoxFundalCity").val("");
                        $("#TextBoxFundalState").val("");
                    }
                },
                error: function (xhr) { HandleAPIError(xhr) }
            });
        }
    });

    $("#TextBoxEffectiveTo").focus(function () {
        if ($("#TextBoxEffectiveFrom").val() == null || $("#TextBoxEffectiveFrom").val() == "") {
            $("#TextBoxEffectiveTo").val("");
            $('#TextBoxEffectiveFrom').focus();
            showErrorMessage("Please Select Effective From Date ");
        }
    });

    $("#TextBoxEffectiveToDate").focus(function () {
        if ($("#TextBoxEffectiveFromDate").val() == null || $("#TextBoxEffectiveFromDate").val() == "") {
            $("#TextBoxEffectiveToDate").val("");
            $('#TextBoxEffectiveFromDate').focus();
            showErrorMessage("Please Select Effective From Date ");
        }
    });

    QueryStringLifeplanId = GetParameterValues('LifePlanId');
    var DocumentVersionId = GetParameterValues('DocumentVersionId');
    if (QueryStringLifeplanId > 0 && DocumentVersionId > 0) {
        ManageExistingLifePlan(QueryStringLifeplanId, DocumentVersionId);
    }
    else {
        $(".loader").hide();
        $(".hide-lifeplan-btn").addClass("hidden");
        $("#btnPrintPDf").hide();
        $("#labelLifePlanStatus, #labelDocumentVersion").val("");
        $("#btnAssessmentNarrativesummary").hide();
        $("#btnMember").hide();
    }

    $("#btnModelModaRepresentative").click(function () {
        if ($(".model").hasClass("show")) {
            $("#collapseRepresentative").addClass('show');
        }
        else {
            $("#collapseRepresentative").removeClass("show");
        }
    });

    $("#btnModelNotifications").click(function () {
        if ($(".model").hasClass("show")) {
            $("#collapseNotifications").addClass('show');
        }
        else {
            $("#collapseNotifications").removeClass("show");
        }
    });

    var table = $('#tblProvider').DataTable();
    $('#tblProvider tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    $('#BtnProviderOK').click(function () {

        // table.row('.selected').data()[1];
        $("#TextBoxAgencyOrganizationName").val("");
        $("#exampleModa4 #TextBoxLocation").val("");
        $("#exampleModa4 #DropDownProvider").text(table.row('.selected').data()[0]);
        $("#exampleModa4 #TextBoxLocation").val(table.row('.selected').data()[1]);
        closeModalProvider();

    });
    $('#BtnNotificationProviderOK').click(function () {
        var table = $("#tblNotificationProvider").DataTable();
        // table.row('.selected').data()[1];
        $("#TextBoxNotificationProvider").text("");
        $("#TextBoxNotificationProvider").text(table.row('.selected').data()[0]);
        closeModalNotification();

    });
    //BindChildTableOFMeetingHistory();


    $.getJSON("JsonDataToDropdown.json", function (data) {
        _allRecordFromJson = data;
    });
    callAPICircleAndSupport(clientId);
    AllServiceType("Section2");
    AllServiceType("Section3");
    AllServiceType("Section5");
    AllServiceType("Section6");
    AllServiceType("Section4");
    BindMainDocumentSection();

});



function ManageExistingLifePlan(QueryStringLifeplanId, DocumentVersionId) {

    $.ajax({
        type: "POST",
        data: { TabName: "LifePlanMasterPage", LifePlanId: QueryStringLifeplanId, Json: "", ReportedBy: _userId, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLELIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (response) {
            if (response.Success == true) {
                setTimeout(function () {
                    $(".loader").fadeOut("slow");
                    FillLifePlanPage(response);
                }, 9000

                );

            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}


function BindLifePlanDropdowns() {

    token = _token;
    reportedBy = _userId;

    BindDropDowns();
    BindCCOControls();
    GetScreenRolePermissions();
    BindUserDefinedCodes("#DropDownTypeOfMeeting", "NoteType");

    BindUserDefinedCodes("#DropDownNotificationReason", "UDO_DocumentTracker_NotificationReason");
    BindUserDefinedCodes("#DropDownReviewStatus", "ISPStatus");
    BindUserDefinedCodes("#DropDownNotificationType", "ContactMethod");
    BindUserDefinedCodes("#DropDownSubmitStatus", "SubmissionStatus");
    BindAllStaff("#DropDownSubmittedTo");
}

function GetScreenRolePermissions() {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Common/UserFormAccess',
        data: { 'FormName': "Client Profile" },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindUserRolePermissions(result);

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindUserRolePermissions(result) {
    var array = [];
    if (result != null) {
        $.each(result, function (key, value) {
            array.push(value.Action);
        });
    }
    if (QueryStringLifeplanId == undefined || emptyLifePlan == true) {
        AddingNewRecord(array);
    }
    else {
        if (array.includes("View")) {
            ViewPermissionLifePlan();
        }
        else {
            window.location.href = 'PermissionDenied.html';
        }
        if (array.includes("Edit")) {
            EditViewPermissionLifePlan();
        }
        if (array.includes("Print")) {
            ViewPdfPermissionLifePlan();
        }
    }

}
function AddingNewRecord(array) {
    if (!array.includes("View")) {
        window.location.href = 'PermissionDenied.html';
    }

    else if (array.includes("Add")) {
        $("#btnLifePlan").text("Ok");
        $("#btnLifePlan").show();
    }
    else {
        $(".editRecord").hide();
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');
    }
    if (array.includes("Print")) {
    }
}
function FillLifePlanPage(response) {
    if (response.LifPlanDetailsData != null || response.LifPlanDetailsData != undefined) {
        var DBO = new Date(response.LifPlanDetailsData[0].DateOfBirth).toLocaleDateString()
        _age = DBO;

        $('#TextBoxLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxDocumentVersionId').val(response.LifPlanDetailsData[0].DocumentVersionId);
        $('#labelLifePlanStatus').val(response.LifPlanDetailsData[0].DocumentStatus);
        $('#labelDocumentVersion').val(response.LifPlanDetailsData[0].DocumentVersion);
        $('#DropDownClientId').select2('val', [response.LifPlanDetailsData[0].ClientId]);
        $("#DropDownLifePlanType").select2('val', [response.LifPlanDetailsData[0].LifePlanType]);
        var clentName = $('#DropDownClientId ').find(':selected').text();
        $('#TextBoxMemberName').val(clentName);
        $("#TextBoxIndividualName").val(clentName);

        $('#TextBoxDateOfBirth').val(DBO);
        $('#TextBoxMemberAddress1').val(response.LifPlanDetailsData[0].MemberAddress1);
        $('#TextBoxMemberAddress2').val(response.LifPlanDetailsData[0].MemberAddress2);
        $('#TextBoxCity').val(response.LifPlanDetailsData[0].AddressCCO);
        $('#TextBoxPhone').val(response.LifPlanDetailsData[0].Phone);

        $('#TextBoxMedicaid').val(response.LifPlanDetailsData[0].Medicaid);
        $('#TextBoxMedicare').val(response.LifPlanDetailsData[0].Medicare);
        $('#TextBoxEnrollmentDate').val(new Date(response.LifPlanDetailsData[0].EnrollmentDate).toLocaleDateString());
        $('#TextBoxWillowbrookMember').val(response.LifPlanDetailsData[0].WillowbrookMember);
        $('#TextBoxEffectiveFromDate').val(new Date(response.LifPlanDetailsData[0].EffectiveFromDate).toLocaleDateString());
        $('#TextBoxEffectiveToDate').val(new Date(response.LifPlanDetailsData[0].EffectiveToDate).toLocaleDateString());
        $('#TextBoxAddressCCO').val(response.LifPlanDetailsData[0].AddressCCO);
        $('#TextBoxPhoneCCO').val(response.LifPlanDetailsData[0].PhoneCCO);
        $('#TextBoxFaxCCO').val(response.LifPlanDetailsData[0].Fax);
        $('#TextBoxProviderID').val(response.LifPlanDetailsData[0].ProviderID);
        $('#TextMBoxLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxOutcomesStrategiesLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextIBoxLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxHCBSLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxFundalResourcesLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextAreaLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $("#TextBoxLifePlanId").val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxMRLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        $('#TextBoxCareManagerFirstName').val(response.LifPlanDetailsData[0].CareManagerFirstName);
        $('#TextBoxCareManagerLastName').val(response.LifPlanDetailsData[0].CareManagerLastName);
        $('#TextBoxCareManagerPhone').val(response.LifPlanDetailsData[0].CareManagerPhone);
        $('#TextBoxCareManagerEmail').val(response.LifPlanDetailsData[0].CareManagerEmail);
        $('#TextBoxCareManagerSupervisorFirstName').val(response.LifPlanDetailsData[0].CareManagerSupervisorFirstName);
        $('#TextBoxCareManagerSupervisorLastName').val(response.LifPlanDetailsData[0].CareManagerSupervisorLastName);
        $('#TextBoxCareManagerSupervisorPhone').val(response.LifPlanDetailsData[0].CareManagerSupervisorPhone);
        $('#TextBoxCareManagerSupervisorEmail').val(response.LifPlanDetailsData[0].CareManagerSupervisorEmail);
        $('.lfuMember #TextBoxLifePlanId').val(response.LifPlanDetailsData[0].LifePlanId);
        if (response.LifPlanDetailsData[0].IncludeMedications == "Y") {
            $("input[name='CheckboxIncludeMedications']").prop('checked', true);
        }
        if (response.LifPlanDetailsData[0].IncludeAllergies == "Y") {
            $("input[name='CheckboxIncludeAllergies']").prop('checked', true);
        }
        if (response.LifPlanDetailsData[0].IncludeDiagnosis == "Y") {
            $("input[name='CheckboxIncludeDiagnosis']").prop('checked', true);
        }
        if (response.LifPlanDetailsData[0].IncludeDurableMediEquipment == "Y") {
            $("input[name='CheckboxIncludeDurableMediEquipment']").prop('checked', true);
        }
        clientId = response.LifPlanDetailsData[0].ClientId;
        $(".DocumentTitle .lookup").removeAttr('style');

        //CurrentClientVerisoning
        $('#MinorVersion').val(response.LifPlanDetailsData[0].MinorVersion);
        $('#MinorVersionStatus').val(response.LifPlanDetailsData[0].MinorVersionStatus);
        $('#MajorVersion').val(response.LifPlanDetailsData[0].MajorVersion);
        $('#MajorVersionStatus').val(response.LifPlanDetailsData[0].MajorVersionStatus);

        $('#TextBoxProvider').val(response.LifPlanDetailsData[0].Provider);
        $('#TextBoxLocation').val(response.LifPlanDetailsData[0].Location);
        // BindLocation("#DropDownProviderLocation");
        // BindLocation("#IndividualProviderLocation");
        //  BindGetList("#DropDownFacilityName", "Network Provider List", clientId);
        //  BindGetList("#DropDownAuthorizedService", "Services", clientId);
        //BindLocation("#DropDownNotificationProvider");

        BindAuthorizeService("#DropDownAuthorizedService", "Section4");
        BindAuthorizeService("#DropDownServicesTypeIPOP", "Section3");
        BindAuthorizeService("#DropDownServicesType", "Section2");
        GetAssessmentNarrativeSummaryTabDetails();
        GetMeetingHistoryTabDetails();
        GetLifePlanDocument();
        GetIndividualSafeTabDetails();
        autoPopulate = false;
        GetHCBSWaiverTabDetails();
        GetMemberRepresentativeApprovalTabDetails();
        $("#btnMemberRepresentativeApprovalOK").text('Edit');
        //  GetMemberRightDetails();
        GetFundalNaturalCommunityResourcesTabDetails();
        GetLifePlanAcknowledgementTabDetails();

        ShowHideButtons(response.LifPlanDetailsData[0].DocumentStatus, response.LifPlanDetailsData[0].LatestVersion, response.LifPlanDetailsData[0].Status);

        GetSuggestedOutcomesStrategiesTabDetails(clientId);
        GetDefaultMeetingHistoryDetails(clientId);
        BindUserDefinedCodes("#DropDownCqlPomsGoal", "ValuedOutcomes_CQLPOMSGoal", _age);
        GetOutcomesStrategiesTabDetails();

        // BindAuthorizedServiceGrid();
    }
    else {
        $("#btnPublishVersion").addClass("hidden");
        $("#btnSaveAsNew").addClass("hidden");
        $("#btnPrintPDf").hide();
        $("#labelLifePlanStatus, #labelDocumentVersion").val("");
        $("#DropDownClientId").prop("disabled", false);
        $("#btnLifePlan").show();
        $("#btnLifePlan").text("Ok");
        $("#imuLifePlan .LifePlanEnable").prop("disabled", false);
        $("#btnAssessmentNarrativesummary").hide();
        emptyLifePlan = true;
    }
}
function GetClientCircleSupport(clientId) {
    $.ajax({
        type: "GET",
        url: Cx360URL + "/api/Incident/GetContactsandCircleofSupport?ClientID=3",
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            _circleSupport = result;
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function ShowHideButtons(status, version, submitStatus) {

    if (status == "Finalized" && version == true) {
        $("#btnSaveAsNew").removeClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").addClass("hidden");
        $("#btnAcknowledgeAndAgreed").removeClass("hidden");
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');


        $(".editRecord").hide();

        $("#btnModelNotifications").show();
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").hide();
        $(".section8 .greencolor").prop("disabled", false);
        $(".section8 .redcolor").prop("disabled", false);
        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
            $(".section8 .greencolor").prop("disabled", false);
            $(".section8 .redcolor").prop("disabled", false);
        }, 2000);
        $(".form-control").prop("disabled", true);
        $(".section8 .form-control").prop("disabled", false);
    }
    else if (status == "Acknowledged and Agreed" && version == true) {
        $("#btnSaveAsNew").removeClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").addClass("hidden");
        $("#btnAcknowledgeAndAgreed").addClass("hidden");
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');


        $(".editRecord").hide();

        $("#btnModelNotifications").hide();
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").hide();
        $(".section8 .greencolor").prop("disabled", false);
        $(".section8 .redcolor").prop("disabled", false);
        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
            $(".section8 .greencolor").prop("disabled", false);
            $(".section8 .redcolor").prop("disabled", false);
        }, 2000);
    }
    else if (status == "Finalized" && version == false) {
        $("#btnSaveAsNew,  #btnPublishVersion").addClass("hidden");
        $("#btnAcknowledgeAndAgreed").addClass("hidden");
        $("#btnPrintPDf").show();
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');
        $(".editRecord").hide();

        $("#btnModelNotifications").show();
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").hide();
        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
            $(".section8 .greencolor").prop("disabled", false);
            $(".section8 .redcolor").prop("disabled", false);
        }, 2000);
        $(".form-control").prop("disabled", true);
    }
    else if (status == "Acknowledged and Agreed" && version == false) {
        $("#btnSaveAsNew,  #btnPublishVersion").addClass("hidden");
        $("#btnAcknowledgeAndAgreed").addClass("hidden");
        $("#btnPrintPDf").show();
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');
        $(".editRecord").hide();

        $("#btnModelNotifications").hide();
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").hide();
        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
            $(".section8 .greencolor").prop("disabled", false);
            $(".section8 .redcolor").prop("disabled", false);
        }, 2000);
        $(".form-control").prop("disabled", true);
    }


    else if (status == "Draft") {
        $("#btnSaveAsNew").addClass("hidden");
        $("#btnSaveAsMajor").addClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").removeClass("hidden");
        $("#btnAcknowledgeAndAgreed").addClass("hidden");
        $(".editRecord").text("Edit");
        $(".editRecord").show();
        $(".addModal-2").show();
        $(".addModal-3").show();

        $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').prop("disabled", true);
        $('#lfuFromAssessmentNarrativeSummary .form-control').prop("disabled", true);

        $('#imuLifePlan .LifePlanEnable').prop("disabled", true);
        $('#lfuMember .memberEnable').prop("disabled", true);
        $("#btnSubmitApproval").show();
        ShowHideSubmitReviewButton(submitStatus);
        setTimeout(function () {
            $(".greencolor").prop("disabled", false);
            $(".redcolor").prop("disabled", false);
        }, 2000);
    }
}


function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");

    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
}
function InitilaizeSectionDataTables() {
    var table2 = $('#tblIndividualSafety').dataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });
    var table4 = $('#tblOutcomesSupportStrategies').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });


    var table3 = $('#tblMeetingHistory').dataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });
    var table1 = $('#tblHCBSWaiver').DataTable({ "aoColumnDefs": [{ "bVisible": false, "aTargets": [6] }], "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });
    var table = $('#tblFundalNaturalCommunityResources').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });
    var table5 = $('#tblLifeplanNotifications').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });

    var tableMemberRepresentative = $('#tblMemberRepresentativeApproval').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });
    var table = $('#tblMember').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });

    _DocumentMainTable = $('#tblPopUpDocument').DataTable({ "aoColumnDefs": [{ "bVisible": false, "aTargets": [7] }], "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });
    var tableNotification = $('#tblNotificationProvider').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });

    var tableDocument = $('#tbldocument').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], pageLength: 0, searching: true, paging: true, info: true });
    var tableSection3 = $('#tblLookUpServiceSection3').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });
    var tableSection2 = $('#tblLookUpServiceSection2').DataTable({ "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]], searching: true, paging: true, info: true });


    $('#tblPopUpDocument tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            _DocumentMainTable.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
    $('#tblLookUpServiceSection3 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSection3.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

    });
    $('#tblLookUpServiceSection2 tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSection2.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

    });

    $('#tblNotificationProvider tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableNotification.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

    });

    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');

}
function BindDropDowns() {

    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetClientDetails',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownIndividualName(result);

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

    clientId = GetParameterValues('ClientId');
    if (clientId != undefined) {
        $("select[id$=DropDownClientId]").val(clientId);



        var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
        var parse = jQuery.parseJSON(jsonObject);
        var res = $.grep(parse, function (IndividualNmae) {
            return IndividualNmae.ClientID == clientId;
        });
        var DBO = (res[0].BirthDate);
        if (DBO != null) {
            DBO = DBO.slice(0, getDateOnly(DBO));
        }


        var EnrollmentDate = (res[0].EnrollmentDate);
        if (EnrollmentDate != null) {
            EnrollmentDate = EnrollmentDate.slice(0, getDateOnly(EnrollmentDate));

        }
        _MemberName = res[0].LastName + ", " + res[0].FirstName;
        _age = DBO;
        $("#TextBoxIndividualName").val(res[0].LastName + ", " + res[0].FirstName);
        $("#TextBoxMemberName").val(res[0].LastName + ", " + res[0].FirstName);
        $("#TextBoxDateOfBirth").val(DBO);
        $("#TextBoxMemberAddress1").val(res[0].Address1);
        $("#TextBoxMemberAddress2").val(res[0].Address2);
        $("#TextBoxCity").val(res[0].City);
        $("#TextBoxState").val(res[0].State);
        $("#TextBoxZipCode").val(res[0].ZipCode);
        $('#TextBoxPhone').val(formatPhoneNumberClient(res[0].Phone));
        $("#TextBoxMedicaid").val(res[0].MedicaidNumber);
        $("#TextBoxMedicare").val(res[0].MedicareNumber);
        $("#TextBoxEnrollmentDate").val(EnrollmentDate);
        $("#TextBoxWillowbrookMember").val(res[0].WillowBrook);

        //BindLocation("#DropDownNotificationProvider");
        BindAuthorizeService("#DropDownAuthorizedService", "Section4");
        BindAuthorizeService("#DropDownServicesTypeIPOP", "Section3");
        BindAuthorizeService("#DropDownServicesType", "Section2");
        GetClientCircleSupport(clientId);
        GetSuggestedOutcomesStrategiesTabDetails(clientId);
        GetDefaultMeetingHistoryDetails(clientId);
        BindUserDefinedCodes("#DropDownCqlPomsGoal", "ValuedOutcomes_CQLPOMSGoal", _age);


    }

}
function FillClientDetails(object) {

    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownClientId").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (IndividualNmae) {
        return IndividualNmae.ClientID == selectedValue;
    });
    var DBO = (res[0].BirthDate);
    if (DBO != null) {

        DBO = DBO.slice(0, 10).split('-');
        DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
    }
    var EnrollmentDate = (res[0].EnrollmentDate);
    if (EnrollmentDate != null) {
        EnrollmentDate = EnrollmentDate.slice(0, 10).split('-');
        EnrollmentDate = EnrollmentDate[1] + '/' + EnrollmentDate[2] + '/' + EnrollmentDate[0];
    }

    $("#TextBoxDateOfBirth").val(DBO);//.val(res[0].BirthDate)
    $("#TextBoxMemberAddress1").val(res[0].Address1);
    $("#TextBoxMemberAddress2").val(res[0].Address2);
    $("#TextBoxCity").val(res[0].City);
    $("#TextBoxState").val(res[0].State);
    $("#TextBoxZipCode").val(res[0].ZipCode);
    //$("#TextBoxPhone").val(res[0].Phone)
    $('#TextBoxPhone').val(formatPhoneNumberClient(res[0].Phone));
    $("#TextBoxMedicaid").val(res[0].MedicaidNumber);
    $("#TextBoxMedicare").val(res[0].MedicareNumber);
    $("#TextBoxEnrollmentDate").val(EnrollmentDate);
    $("#TextBoxWillowbrookMember").val(res[0].WillowBrook);

}
function BindCCOControls() {

    //get all clients
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetCompanyDetails',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            $("#TextBoxAddressCCO").val(result[0].Address1);
            $("#TextBoxAddress2CCO").val(result[0].Address2);
            $("#DropDownCityCCO").val(result[0].City);
            $("#DropDownStateCCO").val(result[0].State);
            $("#TextBoxZipCodeCCO").val(result[0].Zipcode);
            $("#TextBoxPhoneCCO").val(result[0].Phone);
            $("#TextBoxFaxCCO").val(result[0].Fax);

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyLifePlan() {
    if ($("#btnLifePlan").text() == "Edit") {
        $("#btnLifePlan").text("Ok");
        $('#imuLifePlan .LifePlanEnable').attr("disabled", false);
        $("#btnLifePlan").text("Ok");
        return;
    }
    if (!validateLifePlanTab()) return;
    zipCode = $("#TextBoxZipCode").val();
    blankLifePlanId = $("#TextBoxLifePlanId").val();
    var json = [],
        item = {},
        tag;
    $('#imuLifePlan .LifePlan-control').each(function () {
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
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "LifePlan", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                LifePlanTabSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function validateLifePlanTab() {
    var checked = null;
    var startDate = $("#TextBoxEffectiveFromDate").val();
    var endDate = $("#TextBoxEffectiveToDate").val();

    if ((Date.parse(startDate) >= Date.parse(endDate))) {
        //alert("End date should be greater than Start date");
        showErrorMessage("Effective To Date should be greater than Effective From Date");
        $("#TextBoxEffectiveToDate").val("");
        $('#TextBoxEffectiveToDate').focus();
        checked = false;
        return checked;
    }

    $("#imuLifePlan .req_feild").each(function () {
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
function LifePlanTabSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.AllTab[0].ValidatedRecord == false) {
            showErrorMessage("Life plan already exists in Draft for client");
            return;
        }
        else {
            if (result.AllTab[0].LifePlanId > -1) {
                $("#TextBoxLifePlanId").val(result.AllTab[0].LifePlanId);
                showRecordSaved('Record Saved');
                $("#TextBoxDocumentVersionId").val(result.AllTab[0].DocumentVersionId);
                if (result.AllTab[0].DocumentVersion != "") {
                    $("#labelLifePlanStatus").val(result.AllTab[0].DocumentStatus);
                    $("#labelDocumentVersion").val(result.AllTab[0].DocumentVersion);
                }
                CheckLifePlanPageDetailBeforeAdd();
                ShowHideSubmitReviewButton(result.AllTab[0].Status);
                $("#btnSaveAsNew").addClass("hidden");
                $("#btnPublishVersion").removeClass("hidden");
                $("#btnPrintPDf").show();
                $('#imuLifePlan .LifePlan-control').attr("disabled", true);
                if ($("#btnLifePlan").text() == "Ok") {
                    $("#btnLifePlan").text("Edit");
                }
                $("#TextMBoxLifePlanId").val(result.AllTab[0].LifePlanId);
                $("#TextIBoxLifePlanId").val(result.AllTab[0].LifePlanId);
                $("#TextBoxHCBSLifePlanId").val(result.AllTab[0].LifePlanId);
                $("#TextBoxFundalResourcesLifePlanId").val(result.AllTab[0].LifePlanId);
                $("#TextAreaLifePlanId").val(result.AllTab[0].LifePlanId);
                $("#TextBoxOutcomesStrategiesLifePlanId").val(result.AllTab[0].LifePlanId);
                changeLifePlanURL(result.AllTab[0].LifePlanId, result.AllTab[0].DocumentVersionId);
                $(".DocumentTitle .lookup").removeAttr('style');

                if (blankLifePlanId < 1) {
                    BindAuthorizedServiceGrid();
                    BindSupportServiceProviders();
                }
            }



        }


    }
}
function CheckLifePlanPageDetailBeforeAdd() {
    if ($("#TextBoxLifePlanId").val() != null) {
        $("#BtnAddMeeting").show();
        $("#btnModelModaRepresentative").show();
        $("#BtnAddIndividualSafe").show();
        $("#OutcomesSupportStrategies").show();
        $("#btnModelHCBSWaiver").show();
        $("#btnModelFundalNaturalCommunity").show();
        $("#btnAssessmentNarrativesummary").show();
        $("#btnModelNotifications").show();
        $("#btnMember").show();
    }
}
function changeLifePlanURL(lifePlanId, documentVersionId) {
    if (blankLifePlanId < 1) {
        var currentURL = window.location.href.split('?')[0];
        var newURL = currentURL + "?LifePlanId=" + lifePlanId + "&DocumentVersionId=" + documentVersionId;
        history.pushState(null, 'Life Plan Template', newURL);
    }
}
function ShowHideSubmitReviewButton(status) {
    if (isEmpty(status) || status == "Correction Requested") {
        $("#btnSubmitApproval").show();
        $("#btnReviewApproval").hide();
    }
    else if (status == "Submitted") {
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").show();
    }
    else {
        $("#btnSubmitApproval").hide();
        $("#btnReviewApproval").hide();
    }
}
//#endregion

//#region MeetingHistory
function InsertModifyMeetingHistory() {
    if (!validateMeetingHistoryTab()) return;
    var json = [],
        item = {},
        tag;
    $('#imuMeetingHistory .MH-control').each(function () {
        tag = $(this).attr('name').replace("TextMBox", "").replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
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
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "MeetingHistory", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                $("#TextBoxMeetingId").val("");
                if ($("#TextBoxMeetingId").val() == null || $("#TextBoxMeetingId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }

                GetMeetingHistoryTabDetails();
                clearMeetingHistorytext();
                $("#meetingHistoryModal").modal("hide");
                $("#btnDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertModifyMeetingHistoryExported() {

    if (!valiateMeetingHistoryExported()) return;
    var JsonMeetingExported = [];

    if ($('#tblMeetingHistoryExported input[name="RadioMeetingHistory"]:checked').length >= 1) {
        var checkedRowLength = $('#tblMeetingHistoryExported input[type="checkbox"]:checked').length;
        $('#tblMeetingHistoryExported input[name="RadioMeetingHistory"]:checked').each(function () {
            var meetingHistory = {};

            meetingHistory["NoteType"] = $("#tblMeetingHistoryExported tbody tr:eq(" + $(this).val() + ") td:eq(1)").text();
            meetingHistory["EventDate"] = $("#tblMeetingHistoryExported tbody tr:eq(" + $(this).val() + ") td:eq(2)").text();
            meetingHistory["Subject"] = $("#tblMeetingHistoryExported tbody tr:eq(" + $(this).val() + ") td:eq(3)").text();
            meetingHistory["MeetingReason"] = $("#tblMeetingHistoryExported tbody tr:eq(" + $(this).val() + ") td:eq(4)").text();
            meetingHistory["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
            meetingHistory["LifePlanId"] = $("#TextBoxLifePlanId").val();
            meetingHistory["NoteID"] = $("#TextBoxNoteID").val();
            JsonMeetingExported.push(meetingHistory);
        });

    }
    $.ajax({
        type: "POST",
        data: { TabName: "MeetingHistory", Json: JSON.stringify(JsonMeetingExported), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxMeetingId").val() == null || $("#TextBoxMeetingId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                GetMeetingHistoryTabDetails();
                $("#exampleModal").modal('hide');
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
// function validateMeetingHistoryTab() {
//     if (($("#DropDownTypeOfMeeting").val() == "" && $("#TextBoxPlanerReviewDate").val() == "" && $("#TextBoxMeetingReason").val() == "" && $("#TextBoxMemberAttendance").val() == "" && $("#TextBoxInformationPresented").val() == "" && $("#TextBoxInformationDiscussed").val() == "")) {
//         showErrorMessage("Please enter atleast single meeting history value.")
//         return false;
//     }
//     return true;
// }
function valiateMeetingHistoryExported() {
    if ($('#tblMeetingHistoryExported input[name="RadioMeetingHistory"]:checked').length < 1) {
        showErrorMessage("Please select atleast on checkbox.");
        return false;
    }
    return true;
}
function GetMeetingHistoryTabDetails() {
    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextMBoxLifePlanId").val() != "") {
        item[tag] = $("#TextMBoxLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetMeetingHistory", LifePlanId: $("#TextMBoxLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEMEETINGTAIL"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {

                if (result.Success == true && result.MeetingHistorySummaryTab != null) {
                    var jsonStringyfy = JSON.stringify(result.MeetingHistorySummaryTab) == "null" ? "{}" : JSON.stringify(result.MeetingHistorySummaryTab);
                    $('#tblMeetingHistory').DataTable({
                        'destroy': true,
                        "paging": true,
                        "searching": true,
                        "autoWidth": false,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": JSON.parse(jsonStringyfy),
                        "columns": [{ "data": "NoteType" }, { "data": "EventDate" }, { "data": "Subject" }, { "data": "MeetingReason" }, { "data": "Actions" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
                // else {
                //     showErrorMessage(result.Message);
                // }
            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }

}

function createBtnMeeting(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditMeetingHistoryTabDetails(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteMeetingHistoryRecords(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
function clearMeetingHistorytext() {

    $("#TextBoxPlanerReviewDate").val("");
    $("#TextBoxMeetingReason").val("");
    $("#TextBoxMemberAttendance").val("");

    $("#TextBoxInformationPresented").val("");
    $("#TextBoxInformationDiscussed").val("");
    // $("#DropDownTypeOfMeeting").val(null).trigger('change');

}
function DeleteMeetingHistoryRecords(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetMeetingHistory", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEMEETINGTAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {

            showRecordSaved('Record Deleted');
            GetMeetingHistoryTabDetails();


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
//#endregion


//#region IndividualSafety
function InsertModifyIndividualSafe() {
    if (!validateIndividualSafeTab()) return;
    if (!validateDropDown('section3')) return;
    var json = [],
        item = {},
        tag;
    $('#imuIndividualSafe .IndividualSafe-control').each(function () {
        tag = $(this).attr('name').replace("TextIBox", "").replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required") && $(this).hasClass("lookup") != true) {
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
            else if ($(this).hasClass("lookup") == true && $(this).text().trim() != 'select') {

                item[tag] = $(this).text();
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "IndividualSafe", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                $("#TextBoxIndividualPlanOfProtectionID").val("");
                if ($("#TextBoxIndividualPlanOfProtectionID").val() == null || $("#TextBoxIndividualPlanOfProtectionID").val() == "") {
                    cleartext();
                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                clearIndividualSavetext();
                GetIndividualSafeTabDetails();

                $("#exampleModa3").modal("hide");
                $("#btnDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function validateIndividualSafeTab() {
    var checked = null;
    $("#imuIndividualSafe .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if (($(this).attr("name") == "TextBoxServicesTypeIPOP")) {

            if ($(this).text() == "select") {
                $(this).siblings("span.errorMessage").removeClass("hidden");
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
function GetIndividualSafeTabDetails() {
    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextIBoxLifePlanId").val() != "") {
        item[tag] = $("#TextIBoxLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetIndividualSafe", LifePlanId: $("#TextIBoxLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEINDIVIDUALSAFERECORDS"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {

                if (result.Success == true) {
                    var jsonStringyfy = JSON.stringify(result.IndividualSafeSummaryTab) == "null" ? "{}" : JSON.stringify(result.IndividualSafeSummaryTab);
                    $('#tblIndividualSafety').DataTable({
                        "stateSave": true,
                        "bDestroy": true,
                        "paging": true,
                        "searching": true,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": JSON.parse(jsonStringyfy),
                        "columns": [{ "data": "GoalValuedOutcome" }, { "data": "ProviderAssignedGoal" }, { "data": "Provider" }, { "data": "Location" }, { "data": "ServicesTypeIPOP" }, { "data": "Frequency" }, { "data": "Quantity" },
                        { "data": "TimeFrame" }, { "data": "SpecialConsiderations" }, { "data": "Actions" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
                else {
                    showErrorMessage(result.Message);
                }

            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }


}
function createBtnISafe(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditIndividualSafeTabDetails(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteIndividualSafeRecords(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
function EditIndividualSafeTabDetails(e, id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetIndividualSafe", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLEINDIVIDUALSAFERECORDS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true && result.IndividualSafeSummaryTab != null) {
                if (result.IndividualSafeSummaryTab.length > 0) {
                    // $(".section3 #TextBoxGoalValuedOutcome").val(result.IndividualSafeSummaryTab[0].GoalValuedOutcome);
                    //$(".section3 #TextBoxProviderAssignedGoal").val(result.IndividualSafeSummaryTab[0].ProviderAssignedGoal);
                    // $(".section3 #IndividualProviderLocation").select2('val', [result.IndividualSafeSummaryTab[0].ProviderLocation]);
                    $(".section3 #TextBoxServicesTypeIPOP").text(result.IndividualSafeSummaryTab[0].ServicesTypeIPOP == null ? 'Select' : result.IndividualSafeSummaryTab[0].ServicesTypeIPOP);
                    $(".section3 #TextBoxProvider").val(result.IndividualSafeSummaryTab[0].Provider);
                    $(".section3 #TextBoxLocation").val(result.IndividualSafeSummaryTab[0].Location);


                    $(".section3 #DropDownFrequencyIPOP").select2('val', [result.IndividualSafeSummaryTab[0].Frequency]);
                    $(".section3 #DropDownQuantityIPOP").select2('val', [result.IndividualSafeSummaryTab[0].Quantity]);
                    $(".section3 #DropDownTimeFrameIPOP").select2('val', [result.IndividualSafeSummaryTab[0].TimeFrame]);
                    $(".section3 #TextBoxSpecialConsiderations").val(result.IndividualSafeSummaryTab[0].SpecialConsiderations);
                    $(".section3 #TextBoxIndividualPlanOfProtectionID").val(result.IndividualSafeSummaryTab[0].IndividualPlanOfProtectionID);


                    $(".section3 #TextBoxOtherGoal").val(result.IndividualSafeSummaryTab[0].OtherGoal);
                    $(".section3 #TextBoxOtherProviderAssignedGoal").val(result.IndividualSafeSummaryTab[0].OtherProviderAssignedGoal);
                    $(".section3 #DropDownType").val(result.IndividualSafeSummaryTab[0].Type).trigger("change");
                    $(".section3 #DropDownGoalValuedOutcome").val(result.IndividualSafeSummaryTab[0].GoalValuedOutcome).trigger("change");
                    $(".section3 #DropDownProviderAssignedGoal").val(result.IndividualSafeSummaryTab[0].ProviderAssignedGoal).trigger("change");
                    if (result.IndividualSafeSummaryTab[0].GoalValuedOutcome == 1) {
                        $('.GoalValuedOutcome1Class').removeAttr('hidden');
                        $('.GoalValuedOutcome1Class').show();
                    }
                    if (result.IndividualSafeSummaryTab[0].ProviderAssignedGoal == 1) {
                        $('.ProviderAssignedGoal1Class').removeAttr('hidden');
                        $('.ProviderAssignedGoal1Class').show();
                    }

                    $(".section3 #exampleModa3").modal("show");
                }
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function DeleteIndividualSafeRecords(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetIndividualSafe", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEINDIVIDUALSAFERECORDS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {

            showRecordSaved('Record Deleted');
            GetIndividualSafeTabDetails();


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function clearIndividualSavetext() {
    $(".section3 #DropDownGoalValuedOutcome").val("").trigger('change');
    $(".section3 #DropDownProviderAssignedGoal").val("").trigger('change');
    // $(".section3 #IndividualProviderLocation").val(null).trigger('change');
    $(".section3 #DropDownServicesTypeIPOP").val(null).trigger('change');
    $(".section3 #DropDownFrequencyIPOP").val(null).trigger('change');
    $(".section3 #DropDownQuantityIPOP").val(null).trigger('change');
    $(".section3 #DropDownTimeFrameIPOP").val(null).trigger('change');
    $(".section3 #TextBoxSpecialConsiderations").val("");
    $(".section3 #TextBoxIndividualPlanOfProtectionID").val("");
    $(".section3 #DropDownType").val("");
    $(".section3 #DropDownProviderAssignedGoal").val("");
    $(".section3 #TextBoxOtherProviderAssignedGoal").val("");

    $(".section3 #DropDownGoalValuedOutcome").val("");
    $(".section3 #TextBoxOtherGoal").val("");
    $(".section3 .GoalValuedOutcome1Class").hide();
    $(".section3 .ProviderAssignedGoal1Class").hide();
    $(".section3 #TextBoxServicesTypeIPOP").text("select");
    $(".section3 #TextBoxProvider").val("");
    $(".section3 #TextBoxLocation").val("");



}
//#endregion

//#region AssessmentNarrativeSummary
function validateAssessmentNarrativeSummary() {
    if (($("#TextAreaMyHome").val() == "" && $("#TextAreaTellYouAboutMyDay").val() == "" && $("#TextAreaMyHealthAndMedication").val() == "" && $("#TextAreaMyRelationships").val() == "")) {
        showErrorMessage("Please enter atleast single assessment narrative summary value.")
        return false;
    }
    return true;
}
function GetAssessmentNarrativeSummaryTabDetails() {

    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextAreaLifePlanId").val() != null || $("#TextAreaLifePlanId").val() != "") {
        item[tag] = $("#TextAreaLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetAssessmentNarrativeSummaryTab", LifePlanId: $("#TextAreaLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEASSESSMENTNARRATIVESUMMARY"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {
                if (result.Success == true) {
                    if (result.AssessmentNarrativeSummaryTab != null) {
                        if (result.AssessmentNarrativeSummaryTab.length == 1) {
                            $("#TextAreaMyHome").val(result.AssessmentNarrativeSummaryTab[0].MyHome);
                            $("#TextAreaTellYouAboutMyDay").val(result.AssessmentNarrativeSummaryTab[0].TellYouAboutMyDay);
                            $("#TextAreaMyHealthAndMedication").val(result.AssessmentNarrativeSummaryTab[0].MyHealthAndMedication);
                            $("#TextAreaMyRelationships").val(result.AssessmentNarrativeSummaryTab[0].MyRelationships);
                            $("#TextBoxAssessmentNarrativeSummaryId").val(result.AssessmentNarrativeSummaryTab[0].AssessmentNarrativeSummaryId);
                            $("#TextAreaIntroducingMe").val(result.AssessmentNarrativeSummaryTab[0].IntroducingMe);
                            $("#TextAreaMyHappiness").val(result.AssessmentNarrativeSummaryTab[0].MyHappiness);
                            $("#TextAreaMySchool").val(result.AssessmentNarrativeSummaryTab[0].MySchool);
                        }
                    }
                }
                else {
                    showErrorMessage(result.Message);
                }


            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }
}
function createBtn(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditAssessmentNarrativeSummary(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteSectionOneRecord(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
function InsertModifyAssessmentNarrativeSummaryTab() {
    if ($("#btnAssessmentNarrativesummary").text() == "Edit") {
        $("#btnAssessmentNarrativesummary").text("OK");
        $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", false);
        return;
    }
    if (!validateAssessmentNarrativeSummary()) return;
    var json = [],
        item = {},
        tag;
    $('#lfuFromAssessmentNarrativeSummary .gen-control').each(function () {
        tag = $(this).attr('name').replace("TextArea", "").replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBoxx", "");
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
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "AssessmentNarrativeSummary", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#btnAssessmentNarrativesummary").text() != "Edit") {
                    if ($("#TextBoxAssessmentNarrativeSummaryId").val() == null || $("#TextBoxAssessmentNarrativeSummaryId").val() == "") {

                        showRecordSaved("Record Saved.");
                    }
                    else {
                        showRecordSaved("Record Updated.");
                    }
                }
                GetAssessmentNarrativeSummaryTabDetails();
                if ($("#btnAssessmentNarrativesummary").text() == "Edit") {
                    $("#btnAssessmentNarrativesummary").text("OK");
                    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", false);

                }
                else {

                    $("#btnAssessmentNarrativesummary").text("Edit");
                    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);


                }
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function cleartext() {
    if ($("#btnAssessmentNarrativesummary").text() == "Ok") {
        $(".assessmentNarrativeSummary").val("");
    }
    $("#collapseEight").removeClass("collapse show").addClass("collapse");
}
function hideSections(Id) {

    $("#" + Id).removeClass("collapse show").addClass("collapse");
}
//#endregion

//#region OutcomesStrategies
function validateOutcomesStrategies() {
    var checked = null;
    $("#lfuFromOutcomesStrategies .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if (($(this).attr("name") == "TextBoxServicesType")) {

            if ($(this).text() == "select") {
                $(this).siblings("span.errorMessage").removeClass("hidden");
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
function validateSupportOutcomesStrategies() {
    if ($('#tblStrategiesOutcomesSupportStrategies input[name="RadioSuggestedSupportStrategie"]:checked').length < 1) {
        showErrorMessage("Please select atleast on checkbox.");
        return false;
    }
    return true;
}
function GetOutcomesStrategiesTabDetails() {

    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextBoxOutcomesStrategiesLifePlanId").val() != "" || $("#TextBoxOutcomesStrategiesLifePlanId").val() != null) {

        item[tag] = $("#TextBoxOutcomesStrategiesLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetOutcomesSupportStrategies", LifePlanId: $("#TextBoxOutcomesStrategiesLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEOUTCOMESSTRATEGIES"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",

                'source': _companyID
            },
            success: function (result) {
                if (result.OutcomesSupportStrategiesTab != null) {
                    for (i = 0; i < result.OutcomesSupportStrategiesTab.length; i++) {
                        if (result.OutcomesSupportStrategiesTab[i].CqlPomsGoal.includes('People') == true && getAge(result.OutcomesSupportStrategiesTab[0].ClientDateOfBirth) < 18) {
                            var newValue = result.OutcomesSupportStrategiesTab[i].CqlPomsGoal.replace('People', 'Children and their families');
                            result.OutcomesSupportStrategiesTab[i].CqlPomsGoal = newValue;
                        }
                    }
                }

                if (result.Success == true) {
                    var jsonStringyfy = JSON.stringify(result.OutcomesSupportStrategiesTab) == "null" ? "{}" : JSON.stringify(result.OutcomesSupportStrategiesTab);

                    $('#tblOutcomesSupportStrategies').DataTable({
                        "stateSave": true,
                        "bDestroy": true,
                        "paging": true,
                        "searching": true,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": JSON.parse(jsonStringyfy),
                        "columns": [{ "data": "CqlPomsGoal" }, { "data": "CcoGoal" }, { "data": "ProviderAssignedGoal" }, { "data": "ProviderOfOutcomes" }, { "data": "LocationOfOutcomes" }, { "data": "ServicesType" }, { "data": "Frequency" },
                        { "data": "Quantity" }, { "data": "TimeFrame" }, { "data": "SpecialConsiderations" }, { "data": "Actions" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
                else {
                    showErrorMessage(result.Message);
                }

            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }


}
function EditOutcomesStrategies(e, id) {

    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetOutcomesSupportStrategies", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLEOUTCOMESSTRATEGIES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.OutcomesSupportStrategiesTab.length == 1) {
                    $("#DropDownCqlPomsGoal").select2('val', [result.OutcomesSupportStrategiesTab[0].CqlPomsGoal]);
                    $("#DropDownCcoGoal").select2('val', [result.OutcomesSupportStrategiesTab[0].CcoGoal]);
                    $("#DropDownProviderAssignedGoal").select2('val', [result.OutcomesSupportStrategiesTab[0].ProviderAssignedGoal]);

                    // $("#TextBoxProviderAssignedGoal").val(result.OutcomesSupportStrategiesTab[0].ProviderAssignedGoal);
                    // $("#DropDownProviderLocation").select2('val', [result.OutcomesSupportStrategiesTab[0].ProviderLocation]);

                    $("#DropDownType").val(result.OutcomesSupportStrategiesTab[0].Type);
                    $("#TextBoxServicesType").text(result.OutcomesSupportStrategiesTab[0].ServicesType);
                    $("#TextBoxProviderOfOutcomes").val(result.OutcomesSupportStrategiesTab[0].ProviderOfOutcomes);
                    $("#DropDownProviderAssignedGoal").select2('val', [result.OutcomesSupportStrategiesTab[0].ProviderAssignedGoal]);
                    $("#TextBoxLocationOfOutcomes").val(result.OutcomesSupportStrategiesTab[0].LocationOfOutcomes);
                    $("#DropDownServicesType").select2('val', [result.OutcomesSupportStrategiesTab[0].ServicesType]);
                    $("#DropDownFrequency").select2('val', [result.OutcomesSupportStrategiesTab[0].Frequency]);
                    $("#DropDownQuantity").select2('val', [result.OutcomesSupportStrategiesTab[0].Quantity]);
                    $("#DropDownTimeFrame").select2('val', [result.OutcomesSupportStrategiesTab[0].TimeFrame]);
                    $("#TextBoxSpecialConsiderations").val(result.OutcomesSupportStrategiesTab[0].SpecialConsiderations);
                    $("#TextBoxSupportStrategieId").val(result.OutcomesSupportStrategiesTab[0].SupportStrategieId);
                    $("#outcomeSourceModal #TextBoxProviderOtherCCOGoal").val(result.OutcomesSupportStrategiesTab[0].ProviderOtherCCOGoal);
                    $("#outcomeSourceModal #TextBoxProviderOtherProviderAssignedGoal").val(result.OutcomesSupportStrategiesTab[0].ProviderOtherProviderAssignedGoal);
                    //  $("#outcomeSourceModal #DropDownType").val(result.OutcomesSupportStrategiesTab[0].Type);
                    $('#outcomeSourceModal #DropDownType').val(result.OutcomesSupportStrategiesTab[0].Type).trigger("change");
                    $("#outcomeSourceModal #DropDownCcoGoal").val(result.OutcomesSupportStrategiesTab[0].CcoGoal).trigger("change");
                    $("#outcomeSourceModal #DropDownProviderAssignedGoal").val(result.OutcomesSupportStrategiesTab[0].ProviderAssignedGoal).trigger("change");

                    if (result.OutcomesSupportStrategiesTab[0].CcoGoal == 1) {
                        $('.ccoGoalClass').removeAttr('hidden');
                        $('.ccoGoalClass').show();
                    }
                    if (result.OutcomesSupportStrategiesTab[0].ProviderAssignedGoal == 1) {
                        $('.ProviderAssignedGoalClass').removeAttr('hidden');
                        $('.ProviderAssignedGoalClass').show();
                    }
                }
                $("#outcomeSourceModal").modal("show");
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function InsertModifyOutcomesStrategiesExported() {
    if (!validateSupportOutcomesStrategies()) return;
    var JsonFirstTable = [];

    if ($('#tblStrategiesOutcomesSupportStrategies input[name="RadioSuggestedSupportStrategie"]:checked').length >= 1) {
        var checkedRowLength = $('#tblStrategiesOutcomesSupportStrategies input[type="checkbox"]:checked').length;
        // for (i = 0; i < checkedRowLength; i++) {
        $('#tblStrategiesOutcomesSupportStrategies input[name="RadioSuggestedSupportStrategie"]:checked').each(function () {
            //var row = $(this).closet("tr")[0];
            var firstTable = {};
            //  firstTable["MedicalDiagnosisId"] = $("#MedicalDiagnosis tbody tr:eq(" + i + ") td:eq(0)").text();
            firstTable["CqlPomsGoal"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(14)").text();
            firstTable["CcoGoal"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(2)").text();
            firstTable["ProviderAssignedGoal"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(3)").text();
            firstTable["ProviderLocation"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(15)").text();
            firstTable["ServicesType"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(10)").text();
            firstTable["Frequency"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(11)").text();
            firstTable["Quantity"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(12)").text();
            firstTable["TimeFrame"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(13)").text();
            firstTable["SpecialConsiderations"] = $("#tblStrategiesOutcomesSupportStrategies tbody tr:eq(" + $(this).val() + ") td:eq(9)").text();
            firstTable["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
            firstTable["LifePlanId"] = $("#TextBoxLifePlanId").val();
            firstTable["SupportStrategieId"] = $("#TextBoxSupportStrategieId").val();
            JsonFirstTable.push(firstTable);
            // }

        });

    }
    $.ajax({
        type: "POST",
        data: { TabName: "InsertOutcomesSupportStrategies", Json: JSON.stringify(JsonFirstTable), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxSupportStrategieId").val() == null || $("#TextBoxSupportStrategieId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                cleartextOutcomesStrategies();
                GetOutcomesStrategiesTabDetails();
                $("#exampleModa2").modal("hide");
                $("#btnDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function InsertModifyOutcomesStrategiesTab() {
    if (!validateOutcomesStrategies()) return;
    if (!validateDropDown('section2')) return;
    var json = [],
        item = {},
        tag;

    $('#lfuFromOutcomesStrategies .gen-control').each(function () {
        tag = $(this).attr('name').replace("TextBoxOutcomesStrategies", "").replace("TextBox1", "").replace("TextArea", "").replace("TextBox", "").replace("DropDown", "").replace("Checkbox", "").replace("Radio", "");
        if ($(this).hasClass("req_feild")) {
            if ($(this).val() == "" && $(this).text() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                if ($(this).hasClass("lookup") == true && $(this).text().trim() != 'select') {

                    item[tag] = $(this).text();
                } else {
                    item[tag] = $(this).val();
                }

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
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "InsertOutcomesSupportStrategies", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxSupportStrategieId").val() == null || $("#TextBoxSupportStrategieId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                cleartextOutcomesStrategies();
                GetOutcomesStrategiesTabDetails();
                $("#outcomeSourceModal").modal("hide");
                $("#btnDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function DeleteOutcomesStrategiesRecord(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetOutcomesSupportStrategies", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEOUTCOMESSTRATEGIES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {

            GetOutcomesStrategiesTabDetails();
            showRecordSaved("Record Deleted.");


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function cleartextOutcomesStrategies() {
    $(".section2 #DropDownCqlPomsGoal").val(null).trigger('change');  //$('#mySelect2').val(null).trigger('change');
    $(".section2 #DropDownServicesType").val(null).trigger('change');
    $(".section2 #DropDownFrequency").val(null).trigger('change');
    $(".section2 #DropDownQuantity").val(null).trigger('change');
    $(".section2 #DropDownTimeFrame").val(null).trigger('change');
    $(".section2 #DropDownCcoGoal").val(null).trigger('change');
    $(".section2 #DropDownProviderAssignedGoal").val(null).trigger('change');
    $(".section2 #DropDownType").val("");

    //$(".section2 #TextBoxCcoGoal").val("");
    // $(".section2 #TextBoxProviderAssignedGoal").val("");
    $(".section2 #TextBoxProviderOtherCCOGoal").val("");
    $(".section2 #TextBoxProviderOtherProviderAssignedGoal").val("");
    // $(".section2 #DropDownProviderLocation").val(null).trigger('change');
    $(".section2 #TextBoxSpecialConsiderations").val("");
    $(".section2 #TextBoxSupportStrategieId").val("");
    $(".section2 #TextBoxServicesType").text("select");
    $(".section2 #DropDownType").val("");
    $(".section2 #TextBoxProviderOfOutcomes").val("");
    $(".section2 #TextBoxLocationOfOutcomes").val("");
    $(".section2 .ccoGoalClass").hide();
    $(".section2 .ProviderAssignedGoalClass").hide();

}
function createBtnOutcomesStrategies(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditOutcomesStrategies(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteOutcomesStrategiesRecord(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
//#endregion

//#region  HCBSWaiver
function validateHCBSWaiver() {
    var checked = null;
    var startDate = $("#TextBoxEffectiveFrom").val();
    var endDate = $("#TextBoxEffectiveTo").val();

    if ((Date.parse(startDate) >= Date.parse(endDate))) {
        //alert("End date should be greater than Start date");
        showErrorMessage("End date should be greater than Start date");
        $("#TextBoxEffectiveTo").val("");
        checked = false;
        return checked;
    }
    $("#lfuFromHCBSWaiver .req_feild").each(function () {
        if ((($(this).val() == "" && $(this).hasClass('lookup') != true) || ($(this).text().trim() == "select" && $(this).hasClass('lookup') == true) || $(this).val() == "-1") && ($(this).attr("type") != "checkbox" && $(this).attr("type") != "radio")) {
            $(this).siblings("span.errorMessage").removeClass("hidden");
            $(this).siblings("span.errorMessage").show();
            $(this).focus();
            checked = false;
            return checked;
        }
        else if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if (($(this).val() == "" || $(this).val() == "-1") && $(this).hasClass('lookup') != true) {
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
function GetHCBSWaiverTabDetails() {

    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextBoxHCBSLifePlanId").val() != "") {
        item[tag] = $("#TextBoxHCBSLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetMedicaidStatePlanAuthorizedServies", LifePlanId: $("#TextBoxHCBSLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEHCBSWaiver"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {
                if (result.Success == true && result.HCBSWaiverTab != null) {
                    var jsonStringyfy = JSON.stringify(result.HCBSWaiverTab) == "null" ? "{}" : JSON.stringify(result.HCBSWaiverTab);
                    $('#tblHCBSWaiver').DataTable({
                        "stateSave": true,
                        "bDestroy": true,
                        "paging": true,
                        "searching": true,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": JSON.parse(jsonStringyfy),
                        "aoColumnDefs": [{ "bVisible": false, "aTargets": [6] }],

                        "aoColumns": [{ "mData": "AuthorizedService" }, { "data": "Provider" }, { "mData": "CombinedDate" }, { "mData": "UnitOfMeasure" }, { "mData": "Comments" }, { "mData": "Actions" }, { "mData": "Location" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
                else {
                    showErrorMessage(result.Message);
                }
                populateNotificationGrid(JSON.parse(jsonStringyfy));
                if (autoPopulate == true) {
                    PopulateMatcheRecord(JSON.parse(jsonStringyfy));
                }
            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }


}
function EditHCBSWaiver(e, id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetMedicaidStatePlanAuthorizedServies", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLEHCBSWaiver"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.HCBSWaiverTab.length > 0) {
                    InitalizeDateControls();
                    $(".section4 #DropDownAuthorizedService").select2('val', [result.HCBSWaiverTab[0].AuthorizedService]);
                    $(".section4 #TextBoxUnitOfMeasure").val(result.HCBSWaiverTab[0].UnitOfMeasure);
                    $(".section4 #DropDownProvider").text(result.HCBSWaiverTab[0].Provider);
                    $(".section4 #TextBoxEffectiveFrom").val(result.HCBSWaiverTab[0].EffectiveFrom);
                    $(".section4 #TextBoxEffectiveTo").val(result.HCBSWaiverTab[0].EffectiveTo);
                    $(".section4 #TextAreaSpecialInstructions").val(result.HCBSWaiverTab[0].SpecialInstructions);
                    $(".section4 #TextAreaComments").val(result.HCBSWaiverTab[0].Comments);
                    $(".section4 #TextBoxMedicaidStatePlanAuthorizedServiesId").val(result.HCBSWaiverTab[0].MedicaidStatePlanAuthorizedServiesId);
                    $(".section4 #TextBoxLocation").val(result.HCBSWaiverTab[0].Location);
                    $(".section4 #TextBoxAuthorizationStatus").val(result.HCBSWaiverTab[0].AuthorizationStatus);
                    $(".section4 #TextBoxQuantity").val(result.HCBSWaiverTab[0].Quantity);
                    $(".section4 #TextBoxInitialEffectiveDateOfService").val(result.HCBSWaiverTab[0].InitialEffectiveDateOfService);
                    $(".section4 #DropDownPer").select2('val', [result.HCBSWaiverTab[0].Per]);
                    $(".section4 #TextBoxTotalUnits").val(result.HCBSWaiverTab[0].TotalUnits);
                    $(".section4 #TextBoxDuration").val(result.HCBSWaiverTab[0].Duration);
                    $(".section4 #DropDownSelfDirectedService").select2('val', [result.HCBSWaiverTab[0].SelfDirectedService]);
                    $(".section4 #DropDownAuthorizationStatus").select2('val', [result.HCBSWaiverTab[0].AuthorizationStatus]);
                    var data = $('#DropDownAuthorizedService').select2('data');

                    var tableProvider = $('#tblProvider').DataTable();
                    if (_detailCircleAndSupport.length > 0) {

                        var SectionServiceType = $.grep(_detailCircleAndSupport, function (e) {
                            return e.ServiceType === data[0].text;
                        });

                        if (SectionServiceType.length > 0) {
                            for (i = 0; i < SectionServiceType.length; i++) {

                                tableProvider.row.add([
                                    SectionServiceType[i].OrganizationName,
                                    SectionServiceType[i].ProgramName
                                ]).draw(false);
                            }

                        }
                        else {
                            tableProvider.clear().draw();
                            showErrorMessage('No Record Found')
                        }

                    }
                }

                $("#exampleModa4").modal("show");
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function InsertModifyHCBSWaiverTab() {

    if (!validateHCBSWaiver()) return;
    var json = [],
        item = {},
        tag;

    $('#lfuFromHCBSWaiver .gen-control').each(function () {
        tag = $(this).attr('name').replace("TextBoxHCBS", "").replace("TextBox1", "").replace("TextArea", "").replace("TextBox", "").replace("DropDown", "").replace("Checkbox", "").replace("Radio", "");
        if ($(this).hasClass("req_feild") && $(this).hasClass("lookup") != true) {
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
            else if ($(this).hasClass("lookup") == true && $(this).text().trim() != 'select') {

                item[tag] = $(this).text();
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "InsertHCBSWaiver", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxMedicaidStatePlanAuthorizedServiesId").val() == null || $("#TextBoxMedicaidStatePlanAuthorizedServiesId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }

                cleartextHCBSWaiver();
                GetHCBSWaiverTabDetails();
                $("#exampleModa4").modal("hide");
                $("#btnHCBSDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }



        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function DeleteHCBSWaiverRecord(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetMedicaidStatePlanAuthorizedServies", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEHCBSWaiver"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {

            GetHCBSWaiverTabDetails();
            showRecordSaved("Record Deleted.");


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function cleartextHCBSWaiver() {

    $(".section4 #DropDownAuthorizedService").val(null).trigger('change');
    $(".section4 #TextBoxUnitOfMeasure").val("");
    $(".section4 #DropDownProvider").text('select');
    $(".section4 #TextBoxEffectiveFrom").val("");
    $(".section4 #TextBoxEffectiveTo").val("");
    $(".section4 #TextAreaSpecialInstructions").val("");
    $(".section4 #TextAreaComments").val("");
    $(".section4 #TextBoxMedicaidStatePlanAuthorizedServiesId").val("");
    $(".section4 #TextBoxAgencyOrganizationName").val("");
    $(".section4 #TextBoxLocation").val("");
    $(".section4 #TextBoxInitialEffectiveDateOfService").val("");
    $(".section4 #TextBoxAuthorizationStatus").val("");
    $(".section4 #TextBoxQuantity").val("");
    $(".section4 #TextBoxInitialEffectiveDateOfService").val("");
    $(".section4 #DropDownPer").val(null).trigger('change');
    $(".section4 #TextBoxTotalUnits").val("");
    $(".section4 #TextBoxDuration").val("");
    $(".section4 #DropDownSelfDirectedService").val(null).trigger('change');
    $(".section4 #DropDownAuthorizationStatus").val(null).trigger('change');

}
function createBtnHCBSWaiver(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditHCBSWaiver(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteHCBSWaiverRecord(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
//#endregion


//#region Fundal&NaturalCommunityResources
function validateInsertModifyFundalNaturalCommunityResources() {
    var checked = null;
    $("#lfuFromFundalNaturalCommunityResources .req_feild").each(function () {
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
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}
function GetFundalNaturalCommunityResourcesTabDetails() {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = 0;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetFundalNaturalCommunityResources", LifePlanId: $("#TextBoxLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
        dataType: 'json',
        url: GetAPIEndPoints("HANDLEFUNDALNATURALCOMMUNITYRESOURCES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true && result.fundalNaturalCommunityResourcesTab != null) {
                var jsonStringyfy = JSON.stringify(result.fundalNaturalCommunityResourcesTab) == "null" ? "{}" : JSON.stringify(result.fundalNaturalCommunityResourcesTab);
                $('#tblFundalNaturalCommunityResources').DataTable({
                    "stateSave": true,
                    "bDestroy": true,
                    "paging": true,
                    "searching": true,
                    "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                    "aaData": JSON.parse(jsonStringyfy),
                    //"aoColumnDefs": [{ "bVisible": false, "aTargets": [6] }],

                    "aoColumns": [{ "mData": "ContactType" }, { "data": "Relationship" }, { "mData": "Name" }, { "mData": "Organization" }, { "mData": "ServiceType" }, { "mData": "Actions" }]
                });
                jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
            }
            // else {
            //     showErrorMessage(result.Message);
            // }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });



}
function EditFundalNaturalCommunityResources(e, id) {

    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetFundalNaturalCommunityResources", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLEFUNDALNATURALCOMMUNITYRESOURCES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.fundalNaturalCommunityResourcesTab.length > 0) {
                    $(".section5 #TextBoxFundalResourcesFirstName").val(result.fundalNaturalCommunityResourcesTab[0].FirstName);
                    $(".section5 #TextBoxFundalResourcesLastName").val(result.fundalNaturalCommunityResourcesTab[0].LastName);
                    $(".section5 #TextBoxRole").val(result.fundalNaturalCommunityResourcesTab[0].Role);
                    $(".section5 #TextBoxFundalResourcesPhone").val(result.fundalNaturalCommunityResourcesTab[0].Phone);
                    $(".section5 #TextAreaAddressOne").val(result.fundalNaturalCommunityResourcesTab[0].AddressOne);
                    $(".section5 #TextAreaAddressTwo").val(result.fundalNaturalCommunityResourcesTab[0].AddressTwo);
                    $(".section5 #TextBoxFundalCity").val(result.fundalNaturalCommunityResourcesTab[0].City);
                    $(".section5 #TextBoxFundalState").val(result.fundalNaturalCommunityResourcesTab[0].State);
                    $(".section5 #TextBoxFundalResourcesZip").val(result.fundalNaturalCommunityResourcesTab[0].Zip);
                    $(".section5 #TextBoxFundalNaturalCommunityResourcesId").val(result.fundalNaturalCommunityResourcesTab[0].FundalNaturalCommunityResourcesId);
                }

                $("#exampleModa5").modal("show");
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function InsertModifyFundalNaturalCommunityResourcesTab() {
    if (!validateInsertModifyFundalNaturalCommunityResources()) return;
    var json = [],
        item = {},
        tag;

    $('#lfuFromFundalNaturalCommunityResources .gen-control').each(function () {
        tag = $(this).attr('name').replace("TextBoxFundalResources", "").replace("DropDownFundal", "").replace("TextArea", "").replace("TextBox", "").replace("DropDown", "").replace("Checkbox", "").replace("Radio", "");
        if ($(this).hasClass("req_feild")) {
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
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "InsertFundalNaturalCommunityResources", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxFundalNaturalCommunityResourcesId").val() == null || $("#TextBoxFundalNaturalCommunityResourcesId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                //cleartextFundalNaturalCommunityResources();
                GetFundalNaturalCommunityResourcesTabDetails();
                $("#exampleModa5").modal("hide");
                $("#btnDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function DeleteFundalNaturalCommunityResourcesRecord(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetFundalNaturalCommunityResources", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEFUNDALNATURALCOMMUNITYRESOURCES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            GetFundalNaturalCommunityResourcesTabDetails();
            showRecordSaved("Record Deleted.");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function cleartextFundalNaturalCommunityResources() {

    $(".section5 #TextBoxFundalResourcesFirstName").val("");
    $(".section5 #TextBoxFundalResourcesLastName").val("");
    $(".section5 #TextBoxRole").val("");
    $(".section5 #TextBoxFundalResourcesPhone").val("");
    $(".section5 #TextAreaAddressOne").val("");
    $(".section5 #TextAreaAddressTwo").val("");
    $(".section5 #TextBoxFundalCity").val("");
    $(".section5 #TextBoxFundalState").val("");
    $(".section5 #TextBoxFundalResourcesZip").val("");
    $(".section5 #TextBoxFundalNaturalCommunityResourcesId").val("");

}
function createBtnFundalNaturalCommunityResources(text) {
    let td = $("<td/>").addClass("td-actions");
    let updateBtn = $("<button/>").addClass("btn btn- sm greenColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'EditFundalNaturalCommunityResources(event,' + text + ');');
    $(updateBtn).val(text).html('<i class="fa fa-pencil"  aria-hidden="true"></i>');
    let deleteBtn = $("<button/>").addClass("btn btn-sm redColor").attr("type", "button").attr("aria-hidden", true).attr("onclick", 'DeleteFundalNaturalCommunityResourcesRecord(' + text + ');');
    $(deleteBtn).val(text).html('<i class="fa fa-trash-o" aria-hidden="true"></i>');
    $(td).append(updateBtn);
    $(td).append(deleteBtn);
    return td;
}
//#endregion

//#region SaveDraftRegion
function SaveDraft(mode) {
    if ($('#MinorVersionStatus').val() == 'Draft' && mode == 'minor') {
        return showErrorMessage('Minor Version Already in Draft !!')
    }
    else if ($('#MajorVersionStatus').val() == 'Draft' && mode == 'major') {
        return showErrorMessage('Major Version Already in Draft !!')
    }
    if (!ValidateDraft()) return;
    var json = [],
        item = {};
    $.ajax({
        type: "POST",
        data: { TabName: "CreateNewVersion", LifePlanId: $("#TextBoxLifePlanId").val(), DocumentVersionId: $("#TextBoxDocumentVersionId").val(), ReportedBy: reportedBy, Mode: mode },
        url: GetAPIEndPoints("HANDLELIFEPLANVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {

                NewVersioncreated(result, mode);
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function NewVersioncreated(response, mode) {
    if (response.Success == true) {
        if (response.AllTab[0].LifePlanId > 0) {
            showRecordSaved("New version created successfully");
            $('#TextBoxLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextBoxDocumentVersionId').val(response.AllTab[0].DocumentVersionId);
            $('#labelLifePlanStatus').val(response.AllTab[0].DocumentStatus);
            $('#labelDocumentVersion').val(response.AllTab[0].DocumentVersion);
            $('#TextMBoxLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextBoxOutcomesStrategiesLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextIBoxLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextBoxHCBSLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextBoxFundalResourcesLifePlanId').val(response.AllTab[0].LifePlanId);
            $('#TextAreaLifePlanId').val(response.AllTab[0].LifePlanId);
            $("#TextBoxLifePlanId").val(response.AllTab[0].LifePlanId);

            $("#btnSaveAsMinor").parent().addClass("hidden");
            $("#btnSaveAsMajor").parent().addClass("hidden");
            if (response.AllTab[0].DocumentStatus == 'Draft' && mode == 'minor') {
                $("#btnSaveAsMajor").show();
            }
            else {
                $("#btnSaveAsMajor").parent().addClass("hidden");
            }

            $("#btnSaveAsNew").addClass("hidden");
            $("#btnPrintPDf").show();
            $("#btnPublishVersion").show();
            $('#imuLifePlan .LifePlan-control').attr("disabled", true);
            $(".editRecord").text("Edit");
            $(".editRecord").show();
            $(".addModal-2").show();
            $(".addModal-3").show();
            $(".greenColor").prop("disabled", false);
            $(".redColor").prop("disabled", false);
            $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
            $('#lfuFromAssessmentNarrativeSummary .form-control').attr("disabled", true);
            $('#lfuMember .memberEnable').attr("disabled", true);
            $('#btnAcknowledgeAndAgreed').addClass('hidden');
            ShowHideSubmitReviewButton(response.AllTab[0].Status);
            GetAssessmentNarrativeSummaryTabDetails();
            GetMeetingHistoryTabDetails();
            GetIndividualSafeTabDetails();
            GetLifePlanDocument();
            GetOutcomesStrategiesTabDetails();
            autoPopulate = false;
            GetHCBSWaiverTabDetails();
            GetMemberRepresentativeApprovalTabDetails();
            GetFundalNaturalCommunityResourcesTabDetails();
            GetLifePlanAcknowledgementTabDetails();
            //GetMemberRightDetails();
            changeNewURLParameters(response);
        }

    }
}
function changeNewURLParameters(response) {
    var currentURL = $(location).attr("href");
    if (currentURL.indexOf('?') > -1) {
        var newURL = new URL(currentURL),
            changeLifePlanId = newURL.searchParams.set("LifePlanId", response.AllTab[0].LifePlanId),
            changeDocumentVersionId = newURL.searchParams.set("DocumentVersionId", response.AllTab[0].DocumentVersionId);
        history.pushState(null, 'Life Plan Template', newURL.href);
    }
}
function ValidateDraft() {
    if ($("#ExistingDraft").text() != "") {
        showErrorMessage("Already a draft exists for the life plan.");
        return false;
    }
    return true;
}
//#endregion


//#region CreatePublishVersion
function CreatePublishVersion(mode) {
    if (!validateFinalizedConditions()) return;
    $.ajax({
        type: "GET",
        url: Cx360URL + "/api/Client/GetLifePlansDocumentPath",
        headers: {
            'TOKEN': token,
        },
        success: function (result) {
            //if (result.length > 0) {
                PublishVersionAfterPathResponse(result, mode);
            //}
            // else {
            //     showErrorMessage(result.Message);
            // }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function PublishVersionAfterPathResponse(result, mode) {
    var data = {
        //FilePath: result[0].FilePath, 
        TabName: "PublishLifePlanVersion", LifePlanId: $(".lifePlanId").val(), DocumentVersionId: $("#TextBoxDocumentVersionId").val(), IndividualName: $("#DropDownClientId").find("option:selected").text(), AddressLifePlan: $('#TextBoxCity').val() + ' ' + $('#TextBoxState').val() + ' ' + $('#TextBoxZipCode').val(),
        DateOfBirth: $("#TextBoxDateOfBirth").val(), AddressCCO: $('#TextBoxAddress2CCO').val() + ' ' + $('#DropDownCityCCO').val() + ' ' + $('#DropDownStateCCO').val() + ' ' + $('#TextBoxZipCodeCCO').val(), ReportedBy: reportedBy, Mode: mode

    };

    $.ajax({
        type: "POST",
        data: data,
        url: GetAPIEndPoints("HANDLELIFEPLANVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {

                InsertDocumentPath(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertDocumentPath(result) {
    var data = {
        ClientID: result.AllTab[0].ClientId, DocumentName: result.AllTab[0].Documentname, DocumentFileName: result.AllTab[0].Documentname, Comments: "test"
    };
    $.ajax({
        type: "POST",
        url: Cx360URL + '/api/Client/SaveClientDocument?' + jQuery.param(data),
        headers: {
            TOKEN: token,
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (!isEmpty(result) && result.MessageCode == "200") {
                showRecordSaved(result.Message);
                location.href = "../../../MyPage/MyPage.aspx";
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function DownloadPDFLifePlan() {
    var jsonData = [{
        "meetingAttendanceId": 248,
        "ContactName": "Name 1",
        "RelationshipToMember": "Relation 1",
        "Method": "Method 1"
    },
    {
        "meetingAttendanceId": 248,
        "ContactName": "Name 2",
        "RelationshipToMember": "Relation 2",
        "Method": "Method 2"
    }, {
        "meetingAttendanceId": 248,
        "ContactName": "Name 3",
        "RelationshipToMember": "Relation 3",
        "Method": "Method 3"
    },
    {
        "meetingAttendanceId": 249,
        "ContactName": "Name 11",
        "RelationshipToMember": "Relation 11",
        "Method": "Method 11"
    },
    {
        "meetingAttendanceId": 249,
        "ContactName": "Name 22",
        "RelationshipToMember": "Relation 22",
        "Method": "Method 22"
    }, {
        "meetingAttendanceId": 249,
        "ContactName": "Name 33",
        "RelationshipToMember": "Relation 33",
        "Method": "Method 33"
    }, {
        "meetingAttendanceId": 247,
        "ContactName": "Name 111",
        "RelationshipToMember": "Relation 111",
        "Method": "Method 111"
    },
    {
        "meetingAttendanceId": 247,
        "ContactName": "Name 222",
        "RelationshipToMember": "Relation 222",
        "Method": "Method 222"
    }, {
        "meetingAttendanceId": 247,
        "ContactName": "Name 333",
        "RelationshipToMember": "Relation 333",
        "Method": "Method 333"
    }];
    var data = {
        TabName: "LifePlanPDF", LifePlanId: $(".lifePlanId").val(), IndividualName: $("#DropDownClientId").find("option:selected").text(), AddressLifePlan: $('#TextBoxCity').val() + ' ' + $('#TextBoxState').val() + ' ' + $('#TextBoxZipCode').val(),
        DateOfBirth: $("#TextBoxDateOfBirth").val(), AddressCCO: $('#TextBoxAddress2CCO').val() + ' ' + $('#DropDownCityCCO').val() + ' ' + $('#DropDownStateCCO').val() + ' ' + $('#TextBoxZipCodeCCO').val(),
        JSONData: jsonData

    };

    fetch(GetAPIEndPoints("FILLABLELIFEPLANPDF"), {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
    })
        .then(response => response.blob())
        .then(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "lifeplan_1_" + $(".lifePlanId").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })

}
function fillFacilityCode(object) {
    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownAuthorizedService").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    // var res = $.grep(parse, function (FacilityName) {
    //     return FacilityName.UD_ExternalStaffAssignmentID == selectedValue;
    // });
    // if (res.length > 0) {
    //     $("#TextBoxFacilityCode").val(selectedValue);
    //     $(".section4 #TextBoxFirstName").val(res[0].FirstName)
    //     $(".section4 #TextBoxLastName").val(res[0].LastName);
    // }

}
//#endregion

//#region get default lifeplan sections data
function GetSuggestedOutcomesStrategiesTabDetails(clientId) {

    var json = [],
        item = {},
        tag = "LifePlanId";
    // if ($("#TextBoxSuggestedSupportStrategieId").val() != "" || $("#TextBoxSuggestedSupportStrategieId").val() != null) {

    item[tag] = $("#TextBoxSuggestedSupportStrategieId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetSuggestedOutcomesSupportStrategies", ClientId: clientId, Json: JSON.stringify(json), ReportedBy: reportedBy },
        dataType: 'json',
        url: GetAPIEndPoints("SUGGESTEDOUTCOMESSTRATEGIES"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {


            if (result.Success == true) {

                var jsonStringyfy = JSON.stringify(result.suggestedOutcomesSupportStrategiesTab) == "null" ? "{}" : JSON.stringify(result.suggestedOutcomesSupportStrategiesTab);
                var table = $('#tblStrategiesOutcomesSupportStrategies').DataTable({
                    "stateSave": true,
                    "bDestroy": true,
                    "paging": true,
                    "searching": true,
                    'columnDefs': [
                        {
                            'targets': 0,
                            'checkboxes': {
                                'selectRow': true
                            },
                            "render": function (data, type, full, meta) {
                                return '<input type="checkbox" name="RadioSuggestedSupportStrategie" value="' + $('<div/>').text(meta.row).html() + '">';
                            }
                        }, {
                            'targets': 10,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        }, {
                            'targets': 11,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        }, {
                            'targets': 12,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        }, {
                            'targets': 13,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        }, {
                            'targets': 14,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        },
                        {
                            'targets': 15,
                            'createdCell': function (td, cellData, rowData, row, col) {
                                $(td).attr('class', 'hidden');
                            }
                        }
                    ],
                    'select': {
                        'style': 'multi'
                    },
                    'order': [[1, 'asc']],


                    "aaData": JSON.parse(jsonStringyfy),
                    "columns": [{ "data": "CqlPomsGoal" }, { "data": "CqlPomsGoal" }, { "data": "CcoGoal" }, { "data": "ProviderAssignedGoal" }, { "data": "ProviderLocation" }, { "data": "ServicesType" }, { "data": "Frequency" },
                    { "data": "Quantity" }, { "data": "TimeFrame" }, { "data": "SpecialConsiderations" }, { "data": "ServicesTypeId" }, { "data": "FrequencyId" }, { "data": "QuantityId" }, { "data": "TimeFrameId" }, { "data": "CqlPomsGoalId" }, { "data": "ProviderLocationId" }]
                });
                jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                //table.columns([10, 11, 12, 13]).visible(false);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
    //  }



}
function GetDefaultMeetingHistoryDetails(clientId) {

    var json = [],
        item = {},
        tag = "LifePlanId";
    item[tag] = $("#TextBoxNoteID").val();
    json.push(item);
    $.ajax({
        type: "GET",
        dataType: 'json',
        url: Cx360URL+"/api/Incident/GetMeetingDetails?ClientID=3",
        headers: { 'Token': _token },
        success: function (result) {


            var jsonStringyfy = JSON.stringify(result) == "null" ? "{}" : JSON.stringify(result);
            var table = $('#tblMeetingHistoryExported').DataTable({
                "stateSave": true,
                "bDestroy": true,
                "paging": true,
                "searching": true,
                'columnDefs': [
                    {
                        'targets': 0,
                        'checkboxes': {
                            'selectRow': true
                        },
                        "render": function (data, type, full, meta) {
                            return '<input type="checkbox" name="RadioMeetingHistory" value="' + $('<div/>').text(meta.row).html() + '">';
                        }
                    },

                ],
                'select': {
                    'style': 'multi'
                },
                'order': [[1, 'asc']],

                "aaData": JSON.parse(jsonStringyfy),
                "columns": [{ "data": "NoteType" }, { "data": "NoteType" }, { "data": "EventDate" }, { "data": "Subject" }, { "data": "MeetingReason" }]
            });
            jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function OpenDefaultOutComeModal(closeModal, openModal) {
    $("#tblStrategiesOutcomesSupportStrategies input[type=checkbox]").prop('checked', false);
    $("#" + openModal).modal("show");
}
function CloseOutComeModal(closeModal) {
    $('.modal-backdrop').remove();

}
function OpenDefaMeetingModal(closeModal, openModal) {
    $("#tblMeetingHistoryExported input[type=checkbox]").prop('checked', false);
}

function cleartextLifePlanNotifications() {

    $(".section8 #TextBoxNotificationDate").val("");
    $(".section8 select").val("");
    $(".section8 #TextBoxNotificationProvider").text("select");
    $(".section8 #DropDownNotificationContCircSup").select2(null).trigger('change');
    $(".section8 #DropDownNotificationReason").select2(null).trigger('change');
    $(".section8 #DropDownNotificationType").select2(null).trigger('change');
    $(".section8 #DropDownNotificationAckAgreeStatus").select2(null).trigger('change');
    $(".section8 #TextBoxNotificationComments").val("");
    $(".section8 #TextBoxAcknowledgementAndAgreementId").val("");
    $(".section8 #TextBoxAcknowledgeAndAgreeDate").val("");
    $(".section8 #DropDownAcknowledgeAndAgreeMethod").select2(null).trigger('change');
    $(".section8 .SupportingDocumentReceived").prop('checked', false);
    $(".section8 #TextBoxLastName").val("");
    $(".section8 #TextBoxFirstName").val("");
}
function FillLifePlanNotificationTable(result) {
    if (result.Success == true & result.AllTab != null) {
        result = result.AllTab[0].JSONData;
        $('#tblLifeplanNotifications').DataTable().clear().draw();
        $('#tblLifeplanNotifications').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": true,
            "searching": true,
            "autoWidth": false,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "aaData": JSON.parse(result),
            "columns": [{ "data": "NotificationDate" }, { "data": "NotificationProvider" }, { "data": "NotificationReason" }, { "data": "NotificationType" }, { "data": "AcknowledgeAndAgreeDate" }, { "data": "AcknowledgeAndAgreeMethod" }, { "data": "SupportingDocumentReceived" }, { "data": "Actions" }]
        });
        jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
    }

}
function GetLifePlanAcknowledgementTabDetails() {
    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextBoxLifePlanId").val() != "") {
        item[tag] = $("#TextBoxLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetLifePlanTabDetails", LifePlanId: $("#TextBoxLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLELIFEPLANNOTIFICATIONS"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {
                if (result.Success == true) {
                    FillLifePlanNotificationTable(result);
                }
                else {
                    showErrorMessage(result.Message);
                }

            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }
}
function DeleteLifeplanNotifications(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetLifePlanNotifications", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLELIFEPLANNOTIFICATIONS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                FillLifePlanNotificationTable(result);
                showRecordSaved("Record Deleted.");
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function EditLifePlanNotifications(e, id) {

    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetLifePlanNotifications", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLELIFEPLANNOTIFICATIONS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.AllTab[0].JSONData.length > 0) {
                    result = JSON.parse(result.AllTab[0].JSONData);
                    $(".section8 #TextBoxNotificationDate").val(result[0].NotificationDate);
                    $(".section8 #TextBoxNotificationProvider").text(result[0].NotificationProvider == "" ? "Select" : result[0].NotificationProvider);
                    // $(".section8 #DropDownNotificationContCircSup").select2('val', [result[0].NotificationContCircSupId == "" ? null : result[0].NotificationContCircSupId]);
                    $(".section8 #DropDownNotificationReason").select2('val', [result[0].NotificationReasonId == "" ? null : result[0].NotificationReasonId]);
                    $(".section8 #DropDownNotificationType").select2('val', [result[0].NotificationTypeId == "" ? null : result[0].NotificationTypeId]);
                    $(".section8 #DropDownNotificationAckAgreeStatus").select2('val', [result[0].NotificationAckAgreeStatus == "" ? null : result[0].NotificationAckAgreeStatus]);
                    // $(".section8 #DropDownNotificationAckAgreeStatus").select2('val', [result[0].NotificationAckAgreeStatusId == "" ? null : result[0].NotificationAckAgreeStatusId]);
                    $(".section8 #TextBoxNotificationComments").val(result[0].NotificationComments);
                    $(".section8 #TextBoxAcknowledgementAndAgreementId").val(result[0].AcknowledgementAndAgreementId);
                    $(".section8 #TextBoxAcknowledgeAndAgreeDate").val(result[0].AcknowledgeAndAgreeDate);
                    $(".section8 #DropDownAcknowledgeAndAgreeMethod").select2('val', [result[0].AcknowledgeAndAgreeMethod == "" ? null : result[0].AcknowledgeAndAgreeMethod]);
                    if (result[0].SupportingDocumentReceived == 'Y') {
                        $(".section8 input[name='CheckboxSupportingDocumentReceived']").prop('checked', true);
                    }
                    else {
                        $(".section8 input[name='CheckboxSupportingDocumentReceived']").prop('checked', true);
                    }
                    $(".section8 #TextBoxLastName").val(result[0].LastName);
                    $(".section8 #TextBoxFirstName").val(result[0].FirstName);
                    // $(".section8 #TextBoxAcknowledgementAndAgreementId").val(result[0].AcknowledgementAndAgreementId);


                }
                // var tableProvider = $('#tblNotificationProvider').DataTable();

                // if (_detailCircleAndSupport != undefined || _detailCircleAndSupport.length > 0) {

                //     var SectionServiceType = $.grep(_detailCircleAndSupport, function (e) {
                //         return e.ServiceType === data[0].text;
                //     });
                //     if (SectionServiceType.length > 0) {
                //         for (i = 0; i < SectionServiceType.length; i++) {

                //             tableProvider.row.add([
                //                 SectionServiceType[i].OrganizationName,
                //             ]).draw(false);
                //         }

                //     }
                //     else {
                //         tableProvider.clear().draw();
                //         showErrorMessage('No Record Found')
                //     }
                // }
                // InActiveCircleOfSupport(result);
                $("#exampleNotifications").modal("show");
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}

function SetDropDownAndParentValue(DropDownObject, GlobalCodeId, CodeName) {

    var opt = document.createElement("Option");
    opt.textContent = RTrim(CodeName);
    opt.value = GlobalCodeId;
    opt.addClass = "inactive";
    DropDownObject[0].appendChild(opt);
    opt.selected = true;


}
function BindContactControlsDropDown(result) {
    $("#DropDownNotificationContCircSup").empty();

    $.each(result, function (data, value) {
        $("#DropDownNotificationContCircSup").append($("<option></option>").val(value.FundalNaturalCommunityResourcesId).html(value.LastName + " , " + value.FirstName + " , " + value.Role));
    });
    $("#DropDownNotificationContCircSup").prepend("<option value='' selected='selected'>--Select--</option>");
}
//#endregion
//#region submit and review approval
function OpenApproval(approval) {

    if (!validateOpenApprovalConditions()) return;
    if (approval == "SubmitApproval") {
        var date = new Date();
        $('#TextBoxReviewDate').val(formatDate(date, 'MM/dd/yyyy'));
        $(".review-aprroval-status").hide();
        $(".submit-aprroval-submittedto").show();
        $(".submit-aprroval-status").show();
        $(".changelabeltxt").text("Submittion Message");
        $("#DropDownSubmitStatus option:contains(Submitted)").prop('selected', true);
        $("#DropDownSubmitStatus").prop('disabled', true);

        $("#btnSubmitReview").addClass("btnSubmit");
        $("#btnSubmitReview").removeClass("btnApproval");
    }
    else {
        var date = new Date();
        $('#TextBoxReviewDate').val(formatDate(date, 'MM/dd/yyyy'));
        $(".submit-aprroval-submittedto").hide();
        $(".submit-aprroval-status").hide();
        $(".review-aprroval-status").show();
        $(".changelabeltxt").text("Comments");
        $("#btnSubmitReview").addClass("btnApproval");
        $("#btnSubmitReview").removeClass("btnSubmit");

    }
    $("#submitReviewModal").modal("show");
}

function EpinSignatureValidation() {

    $('#TextBoxElectronicSignature').on("change", function () {
        if ($(this).val() != "") {
            $.ajax({
                type: "GET",
                data: { "EPIN": $(this).val() },
                url: Cx360URL + "/api/Client/ValidateEPIN",
                headers: {
                    'Token': token,
                },
                success: function (response) {
                    if (response.length > 0) {
                        var date = new Date();
                        $("#TextBoxStaffName").val(response[0].FirstName + " , " + response[0].LastName);
                        $("#TextBoxStaffTitle").val(response[0].Title);
                        $("#TextBoxElectronicSignature_SignedOn").val(formatDate(date, 'MM/dd/yyyy hh:mm a'));
                    }
                    else {
                        $("#TextBoxStaffName").val("");
                        $("#TextBoxStaffTitle").val("");
                        $("#TextBoxElectronicSignature_SignedOn").val("");
                    }
                },
                error: function (xhr) {
                    HandleAPIError(xhr); $('#TextBoxElectronicSignature').val("");
                    $("#TextBoxStaffName").val("");
                    $("#TextBoxStaffTitle").val("");
                    $("#TextBoxElectronicSignature_SignedOn").val("");
                }

            });
        }
    });
}
function ValidateApprovalForm(elem) {
    if ($(elem).hasClass("btnSubmit")) {
        if ($("#DropDownSubmittedTo").val() == "-1" || $("#DropDownSubmittedTo").val() == "") {
            $("#DropDownSubmittedTo").siblings("span.errorMessage").removeClass("hidden");
            $("#DropDownSubmittedTo").focus();
            return false;
        }
        else if ($("#DropDownSubmitStatus").val() == "-1" || $("#DropDownSubmitStatus").val() == "") {
            $("#DropDownSubmitStatus").siblings("span.errorMessage").removeClass("hidden");
            $("#DropDownSubmitStatus").focus();
            return false;
        }
        else if ($("#TextBoxElectronicSignature").val() == "") {
            $("#TextBoxElectronicSignature").siblings("span.errorMessage").removeClass("hidden");
            $("#TextBoxElectronicSignature").focus();
            return false;
        }
        else if ($("#TextBoxReviewDate").val() == "") {
            $("#TextBoxReviewDate").siblings("span.errorMessage").removeClass("hidden");
            $("#TextBoxReviewDate").focus();
            return false;
        }
    }
    else {
        if ($("#TextBoxReviewDate").val() == "") {
            $("#TextBoxReviewDate").siblings("span.errorMessage").removeClass("hidden");
            $("#TextBoxReviewDate").focus();
            return false;
        }
        else if ($("#DropDownReviewStatus").val() == "-1" || $("#DropDownReviewStatus").val() == "") {
            $("#DropDownReviewStatus").siblings("span.errorMessage").removeClass("hidden");
            $("#DropDownReviewStatus").focus()
            return false;
        }
        else if ($("#TextBoxElectronicSignature").val() == "") {
            $("#TextBoxElectronicSignature").siblings("span.errorMessage").removeClass("hidden");
            $("#TextBoxElectronicSignature").focus();
            return false;
        }
    }
    return true;
}
function InsertModifySubmitReviewNotification(elem) {
    var data = "";
    if ($(elem).hasClass("btnSubmit")) {
        if (!ValidateApprovalForm(elem)) return;
        approvalStatus = $("#DropDownSubmitStatus option:selected").text();
        data = {
            UD_SubmissionDecisionFormID: "", FormName: "Life Plan", ClientID: clientId, KeyFieldID: $("#TextBoxLifePlanId").val(), Status: $("#DropDownSubmitStatus").val(),
            SubmissionMessage: $("#TextBoxSubmissionMessage").val(), TabName: "SubmitApproval", SubmittedTo: $("#DropDownSubmitStatus").val(),
            ElectronicSignature: $("#TextBoxElectronicSignature").val(), ElectronicSignature_SignedOn: $("#TextBoxElectronicSignature_SignedOn").val(),
            SubmittedOn: $("#TextBoxReviewDate").val(), StaffTitle: $("#TextBoxStaffTitle").val(), StaffName: $("#TextBoxStaffName").val(), ReportedBy: reportedBy
        }
    }
    else {
        if (!ValidateApprovalForm(elem)) return;
        approvalStatus = $("#DropDownReviewStatus option:selected").text();
        data = {
            UD_SubmissionDecisionFormID: "", FormName: "Life Plan", ClientID: clientId, KeyFieldID: $("#TextBoxLifePlanId").val(), Status: $("#DropDownReviewStatus").val(),
            SubmissionMessage: $("#TextBoxSubmissionMessage").val(), TabName: "ReviewApproval", SubmittedTo: "",
            ElectronicSignature: $("#TextBoxElectronicSignature").val(), ElectronicSignature_SignedOn: $("#TextBoxElectronicSignature_SignedOn").val(),
            SubmittedOn: $("#TextBoxReviewDate").val(), StaffTitle: $("#TextBoxStaffTitle").val(), StaffName: $("#TextBoxStaffName").val(), ReportedBy: reportedBy
        }
    }
    $.ajax({
        type: "POST",
        url: GetAPIEndPoints("INERTMODIFYSUBMISSIONFORM"),
        data: data,
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (response) {
            if (response.Success == true) {
                showRecordSaved("show record saved");
                $("#submitReviewModal").modal("hide");
                $("#btnDataDismiss").click();
                clearsubmitReviewModal();
                ShowHideSubmitReviewButton(JSON.parse(response.AllTab[0].JSONData)[0].Status);

            }
            else {
                showErrorMessage(response.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function clearsubmitReviewModal() {
    $(".submitReviewModal select").val("");
    $(".submitReviewModal #DropDownSubmittedTo").select2(null).trigger('change');
    $(".submitReviewModal input").val("");
    $(".submitReviewModal textarea").val("");
    $(".submitReviewModal #btnSubmitReview").removeClass("btnApproval");
    $(".submitReviewModal #btnSubmitReview").removeClass("btnSubmit");
}
//#endregion
function AdjustPaddingResize() {
    if (Number(actualZoom) <= 1) {
        $(".screenZoom").addClass("setNormalZoomPading").removeClass("setMaxZoomPading");
    } else {
        $(".screenZoom").addClass("setMaxZoomPading").removeClass("setNormalZoomPading");
    }
}


function BindUserDefinedCodes(DropDown, Category, _age) {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetUserDefinedOptionByCategory',
        data: { 'CateegoryName': Category, },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            // BindDropDownOptions(result, DropDown, "UDID", "UDDescription");
            var val = "UDID", options = "UDDescription";
            if (Category == 'ValuedOutcomes_CQLPOMSGoal' && getAge(_age) >= 18) {
                $.each(result, function (data, value) {
                    $(DropDown).append($("<option></option>").val(value[val]).html(value[options]));
                });
            }
            else {
                $.each(result, function (data, value) {
                    $(DropDown).append($("<option></option>").val(value[val]).html(value[options].replace('People', 'Children and their families')));
                });
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function InsertModifyMemberRepresentativeApprovalTab() {
    if ($("#btnMemberRepresentativeApprovalOK").text() == "Edit") {
        $("#btnMemberRepresentativeApprovalOK").text("OK");
        $('#lfuMemberRepresentative .form-control').attr("disabled", false);
        return;
    }
    var json = [],
        item = {},
        tag;
    if (!validateMemberApprovalSection()) return;
    $('#lfuMemberRepresentative .gen-control').each(function () {
        tag = $(this).attr('name').replace("TextBoxMR", "").replace("TextArea", "").replace("TextBox", "").replace("DropDown", "").replace("Checkbox", "").replace("Radio", "");
        if ($(this).hasClass("req_feild")) {
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
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    item["LifePlanId"] = $('#TextBoxLifePlanId').val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "InsertMemberRepresentative", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxMemberRepresentativeApprovalId").val() == null || $("#TextBoxMemberRepresentativeApprovalId").val() == "") {
                    $("#TextBoxMemberRepresentativeApprovalId").val(result.AllTab[0].MemberRepresentativeApprovalId);
                    showRecordSaved("Record Saved.");
                }
                else {
                    showRecordSaved("Record Updated.");
                }

                // cleartextMemberRepresentativeApproval();
                GetMemberRepresentativeApprovalTabDetails();
                if ($("#btnMemberRepresentativeApprovalOK").text() == "Edit") {
                    $("#btnMemberRepresentativeApprovalOK").text("OK");
                    $('#lfuMemberRepresentative .form-control').attr("disabled", false);

                }
                else {
                    $("#btnMemberRepresentativeApprovalOK").text("Edit");
                    $('#lfuMemberRepresentative .form-control').attr("disabled", true);
                }
            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function GetMemberRepresentativeApprovalTabDetails() {
    var json = [],
        item = {},
        tag = "LifePlanId";
    if ($("#TextBoxMRLifePlanId").val() != "") {
        item[tag] = $("#TextBoxMRLifePlanId").val();
        json.push(item);
        $.ajax({
            type: "POST",
            data: { TabName: "GetMemberRepresentative", LifePlanId: $("#TextBoxMRLifePlanId").val(), Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "select" },
            dataType: 'json',
            url: GetAPIEndPoints("HANDLEMemberRepresentative"),
            headers: {
                'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                'source': _companyID
            },
            success: function (result) {
                if (result.Success == true && result.MemberRepresentativeTab != null) {
                    if (result.MemberRepresentativeTab.length > 0) {
                        $("#TextBoxMemberRepresentativeApprovalId").val(result.MemberRepresentativeTab[0].MemberRepresentativeApprovalId);
                        // $('TextBoxMemberName').val(result.MemberRepresentativeTab[0].MemberName=='');
                        $("#TextBoxMemberApprovalDate").val(result.MemberRepresentativeTab[0].MemberApprovalDate);
                        $("#DropDownRepresentative1Name").select2('val', [result.MemberRepresentativeTab[0].Representative1Name]);
                        $("#DropDownRepresentative2Name").select2('val', [result.MemberRepresentativeTab[0].Representative2Name]);
                        $("#TextBoxRepresentative1ApprovalDate").val(result.MemberRepresentativeTab[0].Representative1ApprovalDate);
                        $("#TextBoxRepresentative2ApprovalDate").val(result.MemberRepresentativeTab[0].Representative2ApprovalDate);
                        $("#TextBoxCommitteeApprover").val(result.MemberRepresentativeTab[0].CommitteeApprover);
                        $("#TextBoxCommitteeApprovalDate").val(result.MemberRepresentativeTab[0].CommitteeApprovalDate);
                        $("#TextBoxComments").val(result.MemberRepresentativeTab[0].Comments);
                    }

                }
                // else {
                //     showErrorMessage(result.Message);
                // }

            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }

}

function EditMemeberRepresentative(e, id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetMemberRepresentative", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "selectById" },
        url: GetAPIEndPoints("HANDLEMemberRepresentative"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.MemberRepresentativeTab.length > 0) {
                    InitalizeDateControls();
                    $(".section7 #TextBoxMemberRepresentativeApprovalId").val(result.MemberRepresentativeTab[0].MemberRepresentativeApprovalId);
                    $(".section7 #DropDownRepresentative1Name").select2('val', [result.MemberRepresentativeTab[0].Representative1Name]);
                    $(".section7 #DropDownRepresentative2Name").select2('val', [result.MemberRepresentativeTab[0].Representative2Name]);
                    $(".section7 #TextBoxMemberName").val(result.MemberRepresentativeTab[0].MemberName);
                    $(".section7 #TextBoxMemberApprovalDate").val(result.MemberRepresentativeTab[0].MemberApprovalDate);
                    $(".section7 #TextBoxRepresentative1ApprovalDate").val(result.MemberRepresentativeTab[0].Representative1ApprovalDate);
                    $(".section7 #TextBoxRepresentative2ApprovalDate").val(result.MemberRepresentativeTab[0].Representative2ApprovalDate);

                    $(".section7 #TextBoxCommitteeApprover").val(result.MemberRepresentativeTab[0].CommitteeApprover);
                    $(".section7 #TextBoxCommitteeApprovalDate").val(result.MemberRepresentativeTab[0].CommitteeApprovalDate);
                    $(".section7 #TextBoxComments").val(result.MemberRepresentativeTab[0].Comments);
                }

                $("#exampleModaRepresentative").modal("show");
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function DeleteMemeberRepresentative(id) {
    var json = [],
        item = {},
        tag = "Id";

    item[tag] = id;
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetMemberRepresentative", LifePlanId: "", Json: JSON.stringify(json), ReportedBy: reportedBy, Mode: "deleteById" },
        url: GetAPIEndPoints("HANDLEMemberRepresentative"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {

            GetMemberRepresentativeApprovalTabDetails();
            showRecordSaved("Record Deleted.");


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function showOtherDescription(sectionId, dropdownId, className) {
    var newClass = className.replace('Class', '')
    if ($('#' + sectionId + ' #' + dropdownId + ' option:selected').text().trim() == "Other") {
        $('.' + className).removeAttr('hidden');
        $('.' + className).show();
        $('.' + newClass).addClass('req_feild');

    }
    else {
        $('.' + className).attr('hidden');
        $('.' + className).hide();
        $('.' + newClass).val('');
        $('.' + newClass).removeClass('req_feild');
    }
}


function openModal() {
    $("#exampleDocuments").modal("show");

}
function showVersioningBtn(className) {
    $('.' + className).removeAttr('hidden');
    $('.' + className).show();
    $('#btnSaveAsNew').hide();
}
function bindDropdownFromJson() {
    $.getJSON("JsonDataToDropdown.json", function (data) {

        // var companyName = sessionStorage.getItem('customerCode');
        var companyName = "TCC";
        var companyRecord = $.grep(data, function (e) {
            return e.CompanyName === companyName;
        });
        if (companyRecord.length > 0) {
            for (i = 0; i < companyRecord[0].Data[0].SectionII_CCOGoal_ValuedOutcome.length; i++) {
                $('.lfuFromOutcomesStrategies #DropDownCcoGoal').append('<option value="' + companyRecord[0].Data[0].SectionII_CCOGoal_ValuedOutcome[i].Value + '">' + companyRecord[0].Data[0].SectionII_CCOGoal_ValuedOutcome[i].Value + '</option>');
            }
            for (i = 0; i < companyRecord[0].Data[0].SectionII_ProviderAssignedGoal.length; i++) {
                $('.lfuFromOutcomesStrategies #DropDownProviderAssignedGoal').append('<option value="' + companyRecord[0].Data[0].SectionII_ProviderAssignedGoal[i].Value + '">' + companyRecord[0].Data[0].SectionII_ProviderAssignedGoal[i].Value + '</option>');
            }
            for (i = 0; i < companyRecord[0].Data[0].SectionIII_Goal_Valued_Outcome.length; i++) {
                $('.imuIndividualSafe #DropDownGoalValuedOutcome').append('<option value="' + companyRecord[0].Data[0].SectionIII_Goal_Valued_Outcome[i].Value + '">' + companyRecord[0].Data[0].SectionIII_Goal_Valued_Outcome[i].Value + '</option>');
            }
            for (i = 0; i < companyRecord[0].Data[0].SectionIII_ProviderAssignedGoal.length; i++) {
                $('.imuIndividualSafe #DropDownProviderAssignedGoal').append('<option value="' + companyRecord[0].Data[0].SectionIII_ProviderAssignedGoal[i].Value + '">' + companyRecord[0].Data[0].SectionIII_ProviderAssignedGoal[i].Value + '</option>');
            }
        }

    }).fail(function () {
        console.log("An error has occurred.");
    });
}

function validateMemberApprovalSection() {

    var memberName = $("#TextBoxMemberName").val();
    var memberApprovalDate = $("#TextBoxMemberApprovalDate").val();
    var representative1Name = $("#DropDownRepresentative1Name").val();
    var representative1ApprovalDate = $("#TextBoxRepresentative1ApprovalDate").val();
    var committeeApprover = $("#TextBoxCommitteeApprover").val();
    var committeeApprovalDate = $("#TextBoxCommitteeApprovalDate").val();


    if (memberName != '' && memberApprovalDate == '') {
        showErrorMessage("Please Fill the Member Approval Date.");
        return false;
    }
    else if (memberName == '' && memberApprovalDate != '') {
        showErrorMessage("Please Fill the Member Name.");
        return false;
    }


    if (representative1Name != '' && representative1ApprovalDate == '') {
        showErrorMessage("Please Fill the Representative 1 Approval Date.");
        return false;
    }
    else if (representative1Name == '' && representative1ApprovalDate != '') {
        showErrorMessage("Please Fill the Representative 1 Name.");
        return false;
    }

    if (committeeApprover != '' && committeeApprovalDate == '') {
        showErrorMessage("Please Fill the Committee Approval Date.");
        return false;
    }
    else if (committeeApprover == '' && committeeApprovalDate != '') {
        showErrorMessage("Please Fill the Committee Approver.");
        return false;
    } else if ((committeeApprover == '' && committeeApprovalDate == '') && (representative1Name == '' && representative1ApprovalDate == '') && (memberName == '' && memberApprovalDate == '')) {
        showErrorMessage("Please insert atleast one field 'Member Name and Member Approval Data, Representative Name and Representative Approval Date, CommitteeApprover and committee Approval Date'");
        return false;
    }
    return true;
}

function openModalProvider() {
    $("#exampleModal2").modal("show");
    $("#exampleModa4").modal("hide");
}
function openModalNotificationProvider() {
    $("#exampleNotifications").modal("hide");
    $("#notificationProviderModal").modal("show");

}
function closeModalProvider() {
    $("#exampleModal2").modal("hide");
    $("#exampleModa4").modal("show");

}
function closeModalNotificationProvider() {
    $("#exampleNotifications").modal("show");

}
function closeModalNotification() {
    $("#exampleNotifications").modal("show");
    $("#notificationProviderModal").modal("hide");

}


function validateOpenApprovalConditions() {
    var outcomeSupportStrategies = $('#tblOutcomesSupportStrategies').DataTable().rows().count();
    var totalRowIndividualSafety = $('#tblIndividualSafety').DataTable().rows().count();
    //  var totalRowsHCBS = $('#tblHCBSWaiver').DataTable().rows().count();

    //if ($("input[name='CheckboxRightsUnderAmericansDisabilitiesAct']:checked").length <= 0 && $("input[name='CheckboxReasonableAccommodations']:checked").length <= 0 && $("input[name='CheckboxGrievanceAppeal']:checked").length <= 0) {
    //    showErrorMessage("Complete the Member Rights section before submitting the Life Plan record for approval");
    //    return false;
    //}
    //if ($("#TextBoxMemberRepresentativeApprovalId").val() == "") {
    //    showErrorMessage("Complete the Member Rights section before submitting the Life Plan record for approval");
    //    return false;
    //}
    if (outcomeSupportStrategies < 2) {
        showErrorMessage("A minimum of 2 CQL/POMS are required before submitting the Life Plan record for approval");
        return false;
    }
    if (totalRowIndividualSafety < 3) {
        showErrorMessage("A minimum of 3 Goals are required before submitting the Life Plan record for approval");
        return false;
    }
    //if (totalRowsHCBS < 1) {
    //    showErrorMessage("A minimum of 1 POM per HCBS Waiver service is required before submitting the Life Plan record for approval");
    //    return false;
    //}
    return true;
}



function validateDropDown(sectionClass) {

    var rowExists = false;
    if (sectionClass == 'section3') {
        var tableColumnValue = $('#tblIndividualSafety').DataTable().columns(0).data();
        var tableData = $('#tblIndividualSafety').DataTable().data();
        // var index=table.length;
        currentRowId = $("#TextBoxIndividualPlanOfProtectionID").val();

        if (tableData.length > 0) {
            var record = $.grep(tableData, function (data) {
                return data.IndividualPlanOfProtectionID != currentRowId;
            });
            if (record != null) {
                for (var k = 0; k < record.length; k++) {
                    if (record[k].GoalValuedOutcome.includes($('.section3 #DropDownGoalValuedOutcome').val())) {
                        rowExists = true;
                        break;
                    }
                }
                if (rowExists) {
                    showErrorMessage('Goal Valued Outcome option already exist in table');
                    return false;
                }
            }

        }

    }
    else if (sectionClass == 'section2') {
        var tableColumnValue = $('#tblOutcomesSupportStrategies').DataTable().columns(0).data();
        var tableData = $('#tblOutcomesSupportStrategies').DataTable().data();
        // var index=table.length;
        currentRowId = $("#TextBoxSupportStrategieId").val();

        if (tableData.length > 0) {
            var record = $.grep(tableData, function (data) {
                return data.SupportStrategieId != currentRowId;
            });
            if (record != null) {
                for (var k = 0; k < record.length; k++) {
                    if (record[k].CqlPomsGoal.includes($('.section2 #DropDownCqlPomsGoal :selected').text())) {
                        rowExists = true;
                        break;
                    }
                }
                if (rowExists) {
                    showErrorMessage('Cql Poms Goal option already exist in table');
                    return false;
                }
            }

        }

    }

    return true;
}
function validateFinalizedConditions() {
    //  var tableMemberRepresentativeApproval = $('#tblMemberRepresentativeApproval').DataTable().row().count();
    //if (tableMemberRepresentativeApproval < 1) {
    //    showErrorMessage("Complete the Member/Representative Approval section before marking the Life Plan record as ‘Finalized'");
    //    return false;
    //}
    if ($("#TextBoxMemberRepresentativeApprovalId").val() == "") {
        showErrorMessage("Complete the Member/Representative Approval section before marking the Life Plan record as ‘Finalized'");
        return false;
    }
    return true;
}

function ValidateApprovedAdndAgreedSection() {

    var table = $('#tblLifeplanNotifications').DataTable().columns(4).data();
    var index = table.length;
    var rowExists = false;
    for (k = 0; k < index; k++) {
        if (table[0][k].indexOf('Acknowledged and Agreed') <= -1) {
            rowExists = true;
            break;
        }
    }
    if (rowExists) {
        showErrorMessage('All records from ‘Section 6 - Acknowledgements and Agreements’ section must be ‘Acknowledged and Agreed’ before marking the Life Plan record as ‘Acknowledged and Agreed’');
        return false;
    }
    CreatePublishVersion('Acknowledged and Agreed');
    return true;
}

function BindChildTableOFMeetingHistory() {
    $('#tblMeetingHistory tbody').on('click', 'tr', function () {

        var meetingAttendanceId = $('#tblMeetingHistory').DataTable().row(this).data().MeetingId;
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            $('#tblMeetingHistory').DataTable().$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        $('#tblMeetingAttendance').DataTable().destroy();
        if ($('#tblMeetingHistory').DataTable().$('tr.selected').length > 0) {
            $('.meetingAttendance').show();
            $.ajax({
                type: "GET",
                url: "../../test.json",
                dataType: "json",

                success: function (response) {
                    if (response.length > 0) {
                        var memberAttendanceRecord = $.grep(response, function (memberAttendanceData) {
                            return memberAttendanceData.meetingAttendanceId === meetingAttendanceId;
                        });

                        $('#tblMeetingAttendance').DataTable({
                            "aaData": memberAttendanceRecord,
                            "columns": [
                                { "data": "ContactName" },
                                { "data": "RelationshipToMember" },
                                { "data": "Method" }
                            ]
                        });
                    }
                    else {
                        $('#tblMeetingAttendance').hide();
                    }
                },
                error: function (xhr) { HandleAPIError(xhr) }
            });
        }
        else {
            $('.meetingAttendance').hide();
        }

    });
}


function ViewPermissionLifePlan() {
    $('#imuLifePlan .LifePlan-control').attr("disabled", true);
    $(".editRecord").hide();
    $(".printDoc").hide();
    $(".addModal-2").addClass('hidden');
    $(".addModal-3").addClass('hidden');
    $(".greenColor").attr("disabled", true);
    $(".redColor").attr("disabled", true);
    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
}
function EditViewPermissionLifePlan() {
    $('#imuLifePlan .LifePlan-control').attr("disabled", true);
    $(".editRecord").text("Edit");
    $(".printDoc").hide();
    $(".addModal-2").removeClass('hidden');
    $(".addModal-3").removeClass('hidden');
    $(".greenColor").attr("disabled", false);
    $(".redColor").attr("disabled", false);
    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
    $('#lfuMemberRepresentative .form-control').attr("disabled", true);
}
function ViewPdfPermissionLifePlan() {
    $('#imuLifePlan .LifePlan-control').attr("disabled", true);
    $(".editRecord").hide();
    $(".printDoc").show();
    $(".addModal-2").addClass('hidden');
    $(".addModal-3").addClass('hidden');
    $(".greenColor").attr("disabled", true);
    $(".redColor").attr("disabled", true);
    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
    $('#lfuMemberRepresentative .form-control').attr("disabled", true);
}
function AllPermissionLifePlan() {
    $('#imuLifePlan .LifePlan-control').attr("disabled", true);
    $(".editRecord").text("Edit");
    $(".printDoc").show;
    $(".addModal-2").removeClass('hidden');
    $(".addModal-3").removeClass('hidden');
    $(".greenColor").attr("disabled", false);
    $(".redColor").attr("disabled", false);
    $('#lfuFromAssessmentNarrativeSummary .LifePlanEnable').attr("disabled", true);
    $('#lfuMemberRepresentative .form-control').attr("disabled", true);
}
//#endregion
function getDateOnly(date) {
    var limit = date.indexOf(' ');
    return limit;
}


function GetTokenFromSessionStorage() {
    _companyID = sessionStorage.getItem('customerCode');
}

function BindAuthorizedServiceGrid() {
    var json = [];
    $.ajax({
        type: "GET",
        url: Cx360URL + "/api/Incident/GetContactsandCircleofSupport?ClientID=3",
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            if (result != null && result != undefined) {
                $.each(result, function (index, value) {
                    if (value.ContactType == 'Professional') {

                        item = {};

                        var response = getfilterJsonRecord('Section4');
                        if (response.length > 0 && response != undefined) {
                            for (i = 0; i < response[0].Data.length; i++) {
                                if (response[0].Data[i].ServiceTypeName == value.ServiceType) {
                                    item['Duration'] = response[0].Data[i].Duration;
                                    item['UnitOfMeasure'] = response[0].Data[i].UnitOfMeasure;
                                }
                            }
                        }
                        else {
                            item['Duration'] = "";
                            item['UnitOfMeasure'] = "";
                        }
                        var section4ServiceType;
                        if (_section4Service.length > 0 && _section4Service != undefined) {
                            section4ServiceType = $.grep(_section4Service, function (e) {
                                return e.UDDescription === value.ServiceType;
                            });
                            if (section4ServiceType != undefined && section4ServiceType.length > 0) {
                                item['AuthorizedService'] = section4ServiceType[0].UDID;
                            }
                        }
                        else {

                        }

                        //  item['AuthorizedService'] = value.ServiceType;
                        // item['AuthorizedService'] = 1;
                        item['Provider'] = value.OrganizationName;
                        item['EffectiveFrom'] = value.EffectiveFrom;
                        item['EffectiveTo'] = value.EffectiveTo;
                        item['AuthorizationStatus'] = 'Approved';
                        item['TotalUnits'] = 5;
                        item['Location'] = value.Location;
                        item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
                        item['MedicaidStatePlanAuthorizedServiesId'] = $("#TextBoxMedicaidStatePlanAuthorizedServiesId").val();
                        item['LifePlanId'] = $("#TextBoxLifePlanId").val();
                        json.push(item);
                    }
                });

                insertDataIntoSectionFour(json);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindSupportServiceProviders() {
    var json = [];
    if (_circleSupport != null || _circleSupport.length > 0) {
        $.each(_circleSupport, function (index, value) {
            // if (value.ContactType === 'Professional') {
            //    for (i = 0; i < _section5Service.length; i++) {
            //  if (_section5Service[i].UDDescription == value.ServiceType) {
            var item = {};
            item['CircleSupportId'] = 1;
            item['ContactType'] = value.ContactType;
            item['Relationship'] = value.Relationship;
            item['Name'] = value.LastName + ', ' + value.FirstName;
            item['Organization'] = value.OrganizationName;
            item['ServiceType'] = value.ServiceType;
            item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
            item['LifePlanId'] = $("#TextBoxLifePlanId").val();
            json.push(item);
            // }
            //  }
            // }
        });
    }

    $.ajax({
        type: "POST",
        data: { TabName: "InsertFundalNaturalCommunityResources", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success === true) {
                GetFundalNaturalCommunityResourcesTabDetails();

            }
            else {
                showErrorMessage("Record No Found");
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function insertDataIntoSectionFour(circleAnsSupportData) {
    $.ajax({
        type: "POST",
        data: { TabName: "InsertHCBSWaiver", Json: JSON.stringify(circleAnsSupportData), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxMedicaidStatePlanAuthorizedServiesId").val() == null || $("#TextBoxMedicaidStatePlanAuthorizedServiesId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }

                cleartextHCBSWaiver();
                autoPopulate = true;
                GetHCBSWaiverTabDetails();
                $("#exampleModa4").modal("hide");
                $("#btnHCBSDataDismiss").click();
            }
            else {
                showErrorMessage(result.Message);
            }



        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function PopulateMatcheRecord(providers) {
    debugger;
    var json = [];
    var notificationReason=0;
      $("#DropDownNotificationReason option").each(function () {
        if ($(this).text() == "Approval Required") {
            notificationReason= $(this).val();
        }
    });

    if (providers !== null || providers.length > 0) {
        $.each(providers, function (index, value) {
            //for (i = 0; i < _section6Service.length; i++) {
            //    if (_section5Service[i] === value.ServiceType) {
            var item = {};
            item['NotificationDate'] = "";
            item['NotificationProvider'] = value.Provider;
            item['NotificationReason'] = notificationReason;
            item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
            item['LifePlanId'] = $("#TextBoxLifePlanId").val();
            json.push(item);
            //    }
            //}
        });
    }

    $.ajax({
        type: "POST",
        data: { TabName: "InsertLifePlanNotifications", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success === true) {
                showRecordSaved("Record Saved");
                GetLifePlanAcknowledgementTabDetails();

            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function populateNotificationGrid(providers) {
    var tableProvider = $('#tblNotificationProvider').DataTable();

    if (providers !== undefined || providers.length > 0) {
        $.each(providers, function (index, value) {
            //for (i = 0; i < _section6Service.length; i++) {
            // if (_section5Service[i] === value.ServiceType) {

            tableProvider.row.add([
                value.Provider
            ]).draw(false);
            //    }
            //}

        });
    }
    else {
        tableProvider.clear().draw();
        showErrorMessage('No Record Found')
    }
}
function callAPICircleAndSupport(id) {
    $.ajax({
        type: "GET",
        url: Cx360URL + "/api/Incident/GetContactsandCircleofSupport?ClientID=3",
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            if (result != null && result != undefined) {
                _detailCircleAndSupport = result;
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function getfilterJsonRecord(companyName) {
    var allRecords;

    allRecords = $.grep(_allRecordFromJson, function (e) {
        return e.CompanyName === companyName;
    });

    return allRecords;
}

function AllServiceType(SectionName) {
    var text = SectionName.toString().replace(/\\"/g, '"').replace(/"/g, '\\"');
    var apiUrl = Cx360URL + "/api/Incident/GetAuthorizedServices?SectionID=" + text;
    apiUrl = apiUrl.replace(/"/g, '');
    $.ajax({
        type: "GET",
        url: apiUrl,
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            if (result != null && result != undefined && result.length > 0) {
                if (SectionName == 'Section2') {
                    _section2Service = result;
                }
                else if (SectionName == 'Section3') {
                    _section3Service = result;
                }
                else if (SectionName == 'Section4') {
                    _section4Service = result;
                }
                else if (SectionName == 'Section5') {
                    _section5Service = result;
                }
                else if (SectionName == 'Section6') {
                    _section6Service = result;
                }
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function BindMainGridDocumentSection() {
    var documentData = $('#tblPopUpDocument').DataTable().rows('.selected').data();
    var json = [],
        item = {};
    item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
    item['LifePlanDocumentId'] = "";
    item['LifePlanId'] = $("#TextBoxLifePlanId").val();
    item['DocumentDate'] = documentData[0][0];
    item['DocumentOwner'] = documentData[0][1];
    item['DocumentType'] = documentData[0][2];
    item['DocumentValidFrom'] = documentData[0][3];
    item['DocumentValidTo'] = documentData[0][4];
    item['DocumentTitle'] = documentData[0][5];
    item['AttachDocument'] = documentData[0][6];
    item['DocumentId'] = documentData[0][7];
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "LifePlanDocument", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                showRecordSaved("Record Saved");
            }
            else {
                //  showErrorMessage();
            }
            $('#tblDocument').DataTable().clear();
            GetLifePlanDocument();
            $('#tblPopUpDocument').DataTable().$('tr.selected').removeClass('selected');
            $("#exampleDocuments").modal("hide");
        }
    });

}

function GetLifePlanDocument() {
    var json = [],
        item = {};
    item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
    item['LifePlanId'] = $("#TextBoxLifePlanId").val();
    item['Mode'] = 'select';
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetLifePlanDocumentDetails", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                var tableDocument = $('#tblDocument').DataTable();
                tableDocument.clear();
                if (result.LifePlanDocument != null) {
                    for (i = 0; i < result.LifePlanDocument.length; i++) {
                        tableDocument.row.add([
                            result.LifePlanDocument[i].DocumentDate,
                            result.LifePlanDocument[i].DocumentOwner,
                            result.LifePlanDocument[i].DocumentType,
                            result.LifePlanDocument[i].DocumentValidFrom,
                            result.LifePlanDocument[i].DocumentValidTo,
                            result.LifePlanDocument[i].DocumentTitle,
                            result.LifePlanDocument[i].AttachDocument,
                            result.LifePlanDocument[i].Actions,
                            result.LifePlanDocument[i].DocumentId
                        ]).draw(false);
                    }

                }

            }
            else {
            }


        }
    });

}

function ServicesOFSection3() {

    var service = [];

    if (_section3Service.length > 0) {
        var table = $('#tblHCBSWaiver').DataTable();
        var tblHCBSData = table.rows().data();
        for (let i = 0; i < tblHCBSData.length; i++) {
            for (let j = 0; j < _section3Service.length; j++) {
                var serviceType = [];
                if (tblHCBSData[i].AuthorizedService == _section3Service[j].UDDescription) {
                    var serviceType = tblHCBSData[i];
                    service.push(serviceType);
                }

            }
        }
    }
    for (i = 0; i < additionalData.length; i++) {
        service.push(additionalData[i]);
    }
    if (service.length > 0) {
        $('#tblLookUpServiceSection3').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": true,
            "searching": true,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "aaData": service,
            "columns": [{ "data": "AuthorizedService" }, { "data": "Provider" }, { "data": "Location" }]
        });
    }


    $("#exampleModa3").modal("hide");
    $('.bodyWrapper').addClass('backDropLayer');
    $("#servicelookupsection3").modal("show");
}
function ServicesOFSection2() {

    var service = [];
    var serviceType;
    if (_section2Service.length > 0) {
        var table = $('#tblHCBSWaiver').DataTable();
        var tblHCBSData = table.rows().data();
        for (let i = 0; i < tblHCBSData.length; i++) {
            for (let j = 0; j < _section2Service.length; j++) {

                if (tblHCBSData[i].AuthorizedService == _section2Service[j].UDDescription) {
                    serviceType = tblHCBSData[i];
                    service.push(serviceType);
                }


            }
        }
    }
    if (additionalData.length > 0) {
        for (i = 0; i < additionalData.length; i++) {
            service.push(additionalData[i]);
        }
    }

    if (service.length > 0) {
        $('#tblLookUpServiceSection2').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": true,
            "searching": true,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "aaData": service,
            "columns": [{ "data": "AuthorizedService" }, { "data": "Provider" }, { "data": "Location" }]
        });
    }

    $("#outcomeSourceModal").modal("hide");
    $('.bodyWrapper').addClass('backDropLayer');
    $("#servicelookupsection2").modal("show");
}

function DeleteLifePlanDocument(id) {
    var json = [],
        item = {};
    item['DocumentVersionId'] = $("#TextBoxDocumentVersionId").val();
    item['LifePlanId'] = $("#TextBoxLifePlanId").val();
    item['DocumentId'] = id;
    item['Mode'] = 'deleteById';
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "GetLifePlanDocumentDetails", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
            'source': _companyID
        },
        success: function (result) {
            var table = $('#tblDocument').DataTable();
            table.destroy();
            GetLifePlanDocument();
            showRecordSaved("Record Deleted.");
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindAuthorizeService(DropDown, SectionName) {
    text = SectionName.toString().replace(/\\"/g, '"').replace(/"/g, '\\"');
    apiUrl = Cx360URL + "/api/Incident/GetAuthorizedServices?SectionID=" + text;
    apiUrl = apiUrl.replace(/"/g, '');
    $.ajax({
        type: "GET",
        url: apiUrl,
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            if (result != null && result != undefined) {
                $.each(result, function (data, value) {
                    $(DropDown).append($("<option></option>").val(value['UDID']).html(value['UDDescription']));
                });
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindContactAndSupports() {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetContactsandCircleofSupport?ClientID=3',
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            BindFundalNaturalCommunityResourcesTable(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindFundalNaturalCommunityResourcesTable(result) {
    if (result.length > 0) {
        $('#tblFundalNaturalCommunityResources').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": true,
            "searching": true,
            "autoWidth": false,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "aaData": result,
            "columns": [{ "data": "ContactType" }, { "data": "Relationship" }, { "data": "LastName" }, { "data": "OrganizationName" }]
        });
        jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
    }


}


function BindfieldSection3() {
    var documentData = $('#tblLookUpServiceSection3').DataTable().rows('.selected').data();

    $("#exampleModa3 #TextBoxServicesTypeIPOP").text(documentData[0].AuthorizedService);
    $("#exampleModa3 #TextBoxProvider").val(documentData[0].Provider);
    $("#exampleModa3 #TextBoxLocation").val(documentData[0].Location);

    $("#servicelookupsection3").modal("hide");
    $("#exampleModa3").modal("show");

}
function BindfieldSection2() {
    var documentData = $('#tblLookUpServiceSection2').DataTable().rows('.selected').data();

    $("#outcomeSourceModal #TextBoxServicesType").text(documentData[0].AuthorizedService);
    $("#outcomeSourceModal #TextBoxProviderOfOutcomes").val(documentData[0].Provider);
    $("#outcomeSourceModal #TextBoxLocationOfOutcomes").val(documentData[0].Location);

    $("#servicelookupsection2").modal("hide");
    $("#outcomeSourceModal").modal("show");

}
//#region lifeplan notifications
function InsertModifyLifeplanNotifications() {
    var json = [],
        item = {},
        tag;

    $('.lfuNotifications .AcknowledgeMent').each(function () {
        tag = $(this).attr('name').replace("TextArea", "").replace("TextBox", "").replace("DropDown", "").replace("Checkbox", "").replace("Radio", "");
        if ($(this).hasClass("req_feild") && $(this).hasClass("lookup") != true) {
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
            }
            else if ($(this).hasClass("lookup") == true && $(this).text().trim() != 'select') {

                item[tag] = $(this).text();
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["DocumentVersionId"] = $("#TextBoxDocumentVersionId").val();
    item["LifePlanId"] = $("#TextBoxLifePlanId").val();
    json.push(item);
    $.ajax({
        type: "POST",
        data: { TabName: "InsertLifePlanNotifications", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLIFEPLANDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                if ($("#TextBoxLifeplanNotifiactionId").val() == null || $("#TextBoxLifeplanNotifiactionId").val() == "") {

                    showRecordSaved("Record Saved.");

                }
                else {
                    showRecordSaved("Record Updated.");

                }
                cleartextLifePlanNotifications();
                GetLifePlanAcknowledgementTabDetails();
                $("#exampleNotifications").modal("hide");
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function cleartextLifePlanNotifications() {

    $(".section6 #TextBoxNotificationDate").val("");
    $(".section6 #TextBoxNotificationProvider").text('select');
    $(".section6 #DropDownNotificationContCircSup").select2(null).trigger('change');
    $(".section6 #DropDownNotificationReason").select2(null).trigger('change');
    $(".section6 #DropDownNotificationType").select2(null).trigger('change');
    $(".section6 #DropDownNotificationAccptAckwStatus").select2(null).trigger('change');
    $(".section6 #TextBoxNotificationComments").val("");
    $(".section6 #TextBoxLifePlanNotifiactionId").val("");
}


function BindMainDocumentSection(){
    $.ajax({
        type: "GET",
        url: "https://staging-api.cx360.net/api/Incident/GetDocumentTrackingLog?ClientID=2",
        headers: {
            'Token': _token
        },
        success: function (result) {
            debugger;

                if (result != null) {
                    for (i = 0; i < result.length; i++) {
                        _DocumentMainTable.row.add([
                            result[i].DocumentDate== null ?'':result[i].DocumentDate,
                            result[i].Owner== null ?'':result[i].Owner,
                            result[i].DocumentType== null ?'':result[i].DocumentType,
                            result[i].DocumentValidFrom== null ?'':result[i].DocumentValidFrom,
                            result[i].DocumentValidTo== null ?'':result[i].DocumentValidTo,
                            "",
                            "",
                            ""
                            // result[i].DocumentTitle,
                            // result[i].AttachDocument,
                        ]).draw(false);
                    }

                }
        }
    });
}
function BindCareManager() {
    
    clientId = GetParameterValues('ClientId');
    $.ajax({

        type:'Get',
        url: 'https://staging-api.cx360.net/api/Incident/GetCareManager?ClientID='+clientId+'',
        headers: {
            'TOKEN': token

        },
        success: function (result) {

            if (result.length>0) {
            $("#TextBoxCareManagerFirstName").val(result[0]['Care Manager First Name']);
            $("#TextBoxCareManagerLastName").val(result[0]['Care Manager Last Name']);
            $("#TextBoxCareManagerPhone").val(result[0]['Care Manager Phone']);
            $("#TextBoxCareManagerEmail").val(result[0]['Care Manager Email']);
            $("#TextBoxCareManagerSupervisorFirstName").val(result[0]['Care Manager Supervisor First Name']);
            $("#TextBoxCareManagerSupervisorLastName").val(result[0]['Care Manager Supervisor Last Name']);
            $("#TextBoxCareManagerSupervisorPhone").val(result[0]['Care Manager Supervisor Phone']);
            $("#TextBoxCareManagerSupervisorEmail").val(result[0]['Care Manager Supervisor Email']);
            }
                 
        }

    });
}

function BindRepresentativeName() {
    debugger;
    $.ajax({

        type:'Get',
        url:'https://staging-api.cx360.net/api/Incident/GetContactsandCircleofSupport?ClientID='+clientId+'',
        headers: {
            'TOKEN': '5nbcWSMDrRJjsdyjrACopeL67Bk6SjhFbo9jGVeCjIlKvmLiA0dlTYERs6hrhC8PCu7Tyr/YzB1XTdc3Of6w6A=='

        },
        success:function (result) {
            
            if(result.length>0){

                for (let i = 0; i < result.length; i++) {
                   
                    if (result[i]['ContactType']=='Personal') {
                                       
                        $('#DropDownRepresentative1Name').append('<option value="' + result[i]['LastName'] +' '+ result[i]['FirstName'] + '">'+ result[i]['LastName'] + ' ' + result[i]['FirstName'] + '</option>');
                        $('#DropDownRepresentative2Name').append('<option value="' + result[i]['LastName'] +' '+ result[i]['FirstName'] + '">' + result[i]['LastName'] + ' ' + result[i]['FirstName'] + '</option>');

                    }
                }
                
            }
        }

    });
    
}