function RebindMemberGrids(){$.updateTable($("#Members-tab form")),$.updateTable($("#Inactive-tab form")),$.updateTable($("#Pending-tab form")),$.updateTable($("#Priors-tab form")),$.updateTable($("#Visitors-tab form")),$("#memberDialog").dialog("close")}function CloseAddDialog(){$("#memberDialog").dialog("close")}function UpdateSelectedUsers(n){$.post("/Organization/UpdateNotifyIds",{id:$("#OrganizationId").val(),topid:n},function(n){$("#notifylist").html(n),$("#usersDialog").dialog("close")})}function UpdateSelectedOrgs(n){$.post("/Organization/UpdateOrgIds",{id:$("#OrganizationId").val(),list:n},function(n){$("#orgpickdiv").html(n).ready(function(){$("#orgpickdiv a[target='otherorg']").length>0?$("#tabfees,#tabquestions").hide():$("#tabfees,#tabquestions").show()}),$("#orgsDialog").dialog("close")})}onload=function(){var n=document.getElementById("refreshed");n.value=="no"?n.value="yes":(n.value="no",location.reload())},$(function(){$("#Settings-tab").tabs();var n=$("#main-tab").tabs();$("#deleteorg").click(function(n){n.preventDefault();var t=$(this).attr("href");return confirm("Are you sure you want to delete?")&&($.blockUI({message:"deleting org"}),$.post(t,null,function(n){n!="ok"?($.blockUI({message:n}),$(".blockOverlay").attr("title","Click to unblock").click($.unblockUI)):($.blockUI({message:"org deleted"}),$(".blockOverlay").attr("title","Click to unblock").click(function(){$.unblockUI(),window.location="/"}))})),!1}),$(".bt").button(),$("#buttondiv bt").css("width","100%"),$("#DivisionsList").delegate("#DivisionsList","change",function(){return $.getTable($("#Members-tab form")),!1}),$("form table.grid > tbody > tr:even").addClass("alt"),$(".CreateAndGo").click(function(n){return n.preventDefault(),confirm($(this).attr("confirm"))&&$.post($(this).attr("href"),null,function(n){window.location=n}),!1}),$("#memberDialog").dialog({title:"Add Members Dialog",bgiframe:!0,autoOpen:!1,width:750,height:700,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src","")}}),$("#AddFromTag").dialog({title:"Add From Tag",bgiframe:!0,autoOpen:!1,width:750,height:650,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src",""),RebindMemberGrids()}}),$("a.addfromtag").live("click",function(n){n.preventDefault();var t=$("#AddFromTag");$("iframe",t).attr("src",this.href),t.dialog("option","title","Add Members From Tag"),t.dialog("open")}),$("#LongRunOp").dialog({bgiframe:!0,autoOpen:!1,width:600,height:400,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src",""),RebindMemberGrids(),$.updateTable($("#Meetings-tab form"))}}),$("#RepairTransactions").live("click",function(n){n.preventDefault();var t=$("#LongRunOp");$("iframe",t).attr("src",this.href),t.dialog("option","title","Repair Transactions"),t.dialog("open")}),$(".delmeeting").live("click",function(n){if(n.preventDefault(),confirm("delete meeting for sure?")){var t=$("#LongRunOp");$("iframe",t).attr("src",this.href),t.dialog("option","title","Delete Meeting"),t.dialog("open")}return!1}),$("a.addmembers").live("click",function(n){n.preventDefault();var t=$("#memberDialog");$("iframe",t).attr("src",this.href),t.dialog("option","title","Add Members"),t.dialog("open")}),$("a.memberdialog").live("click",function(n){n.preventDefault();var i,t=$("#memberDialog");$("iframe",t).attr("src",this.href),t.dialog("option","title",this.title||"Edit Member Dialog"),t.dialog("open")}),$("#inactive-link").click(function(){$.showTable($("#Inactive-tab form"))}),$("#pending-link").click(function(){$.showTable($("#Pending-tab form"))}),$("#priors-link").click(function(){$.showTable($("#Priors-tab form"))}),$("#visitors-link").click(function(){$.showTable($("#Visitors-tab form"))}),$("#meetings-link").click(function(){$.showTable($("#Meetings-tab form"))}),$.maxZIndex=$.fn.maxZIndex=function(n){var i={inc:10,group:"*"},t;return($.extend(i,n),t=0,$(i.group).each(function(){var n=parseInt($(this).css("z-index"));t=n>t?n:t}),!this.jquery)?t:this.each(function(){t+=i.inc,$(this).css("z-index",t)})},$.initDatePicker=function(n){$(".datepicker",n).datepicker({dateFormat:"m/d/yy",changeMonth:!0,changeYear:!0,beforeShow:function(){$("#ui-datepicker-div").maxZIndex()}}),$(".timepicker",n).timepicker({ampm:!0,stepHour:1,stepMinute:5,timeOnly:!0}),$(".datetimepicker",n).datetimepicker({ampm:!0,stepHour:1,stepMinute:15,timeOnly:!1})},$.initDatePicker(),$("a.displayedit,a.displayedit2").live("click",function(n){n.preventDefault();var t=$(this).closest("form");return $.post($(this).attr("href"),null,function(n){$(t).html(n).ready(function(){var n={minChars:3,matchContains:1};$.initDatePicker(t),$(".submitbutton,.bt",t).button(),$(".roundbox select",t).css("width","100%"),$("#DivisionsList",t).multiSelect(),$("#schedules",t).sortable({stop:$.renumberListItems}),$("#editor",t),$.regsettingeditclick(t),$(".helptip").tooltip({showBody:"|"})})}),!1}),$(".helptip").tooltip({showBody:"|"}),$("form.DisplayEdit a.submitbutton").live("click",function(n){var t,i;return(n.preventDefault(),t=$(this).closest("form"),!$(t).valid())?!1:(i=t.serialize(),$.post($(this).attr("href"),i,function(n){$(t).html(n).ready(function(){$(".submitbutton,.bt").button(),$.regsettingeditclick(t)})}),!1)}),$("#future").live("click",function(){var n=$(this).closest("form"),t=n.serialize();$.post($(n).attr("action"),t,function(t){$(n).html(t),$(".bt",n).button()})}),$("form.DisplayEdit").submit(function(){return $("#submitit").val()?!0:!1}),$("a.taguntag").live("click",function(n){return n.preventDefault(),$.post("/Organization/ToggleTag/"+$(this).attr("pid"),null,function(t){$(n.target).text(t)}),!1}),$.validator.addMethod("time",function(n,t){return this.optional(t)||/^\d{1,2}:\d{2}\s(?:AM|am|PM|pm)/.test(n)},"time format h:mm AM/PM"),$.validator.setDefaults({highlight:function(n){$(n).addClass("ui-state-highlight")},unhighlight:function(n){$(n).removeClass("ui-state-highlight")}}),$("#settingsForm").validate({rules:{"org.SchedTime":{time:!0},"org.OnLineCatalogSort":{digits:!0},"org.Limit":{digits:!0},"org.NumCheckInLabels":{digits:!0},"org.NumWorkerCheckInLabels":{digits:!0},"org.FirstMeetingDate":{date:!0},"org.LastMeetingDate":{date:!0},"org.RollSheetVisitorWks":{digits:!0},"org.GradeAgeStart":{digits:!0},"org.GradeAgeEnd":{digits:!0},"org.Fee":{number:!0},"org.Deposit":{number:!0},"org.ExtraFee":{number:!0},"org.ShirtFee":{number:!0},"org.ExtraOptionsLabel":{maxlength:50},"org.OptionsLabel":{maxlength:50},"org.NumItemsLabel":{maxlength:50},"org.GroupToJoin":{digits:!0},"org.RequestLabel":{maxlength:50},"org.DonationFundId":{number:!0}}}),$("a.filtergroupslink").live("click",function(n){n.preventDefault();var t=$(this).closest("form");return $("#FilterGroups").dialog({title:"Filter by Name, Small Groups",width:"300px",buttons:{Ok:function(){var n=$("#FilterGroups form").serialize();$.getTable(t,n),$("#FilterGroups").dialog("close")}}}),!1}),$("#addsch").live("click",function(n){n.preventDefault();var t=$(this).closest("form");$.post("/Organization/NewSchedule",null,function(n){$("#schedules",t).append(n).ready(function(){$.renumberListItems(),$.initDatePicker(t)})})}),$("a.deleteschedule").live("click",function(n){n.preventDefault(),$(this).parent().remove(),$.renumberListItems()}),$.renumberListItems=function(){i=1,$(".renumberMe").each(function(){$(this).val(i),i++})},$("#NewMeetingDialog").dialog({autoOpen:!1,width:488,height:350,modal:!0}),$("#RollsheetLink").live("click",function(n){n.preventDefault(),$("#grouplabel").text("By Group");var t=$("#NewMeetingDialog");t.dialog("option","buttons",{Ok:function(){var t=$.GetMeetingDateTime(),n;if(!t.valid)return!1;n="?org=curr&dt="+t.date+" "+t.time,$("#altnames").is(":checked")&&(n+="&altnames=true"),$("#group").is(":checked")&&(n+="&bygroup=1&sgprefix="),window.open("/Reports/Rollsheet/"+n),$(this).dialog("close")}}),t.dialog("open")}),$("#NewMeeting").live("click",function(n){n.preventDefault(),$("#grouplabel").text("Group Meeting");var t=$("#NewMeetingDialog");return t.dialog("option","buttons",{Ok:function(){var n=$.GetMeetingDateTime(),t;if(!n.valid)return!1;t="?d="+n.date+"&t="+n.time+"&group="+($("#group").is(":checked")?"true":"false"),$.post("/Organization/NewMeeting",{d:n.date,t:n.time,AttendCredit:$("#AttendCreditList").val(),group:$("#group").is(":checked")},function(n){n.startsWith("error")||(window.location=n)}),$(this).dialog("close")}}),t.dialog("open"),!1}),$("#ScheduleList").change(function(){var n=$(this).val().split(",");$("#NewMeetingDate").val(n[0]),$("#NewMeetingTime").val(n[1]),$("#AttendCreditList").val(n[2])}),$.GetMeetingDateTime=function(){var r=/^ *(\d{1,2}):[0-5][0-9] *(a|p|A|P)(m|M) *$/,u=/^(0?[1-9]|1[012])[\/-](0?[1-9]|[12][0-9]|3[01])[\/-]((19|20)?[0-9]{2})$/i,i=$("#NewMeetingDate").val(),t=$("#NewMeetingTime").val(),n=!0;return r.test(t)||($.growlUI("error","enter valid time"),n=!1),u.test(i)||($.growlUI("error","enter valid date"),n=!1),{date:i,time:t,valid:n}},$("a.joinlink").live("click",function(n){return n.preventDefault(),$.post("/Organization/Join/",{id:this.id},function(n){n=="ok"?RebindMemberGrids():alert(n)}),!1}),$("#usersDialog").dialog({title:"Select Users Dialog",bgiframe:!0,autoOpen:!1,width:750,height:700,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src","")}}),$("#divisionsDialog").dialog({title:"Select Divisions Dialog",bgiframe:!0,autoOpen:!1,width:690,height:650,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src","");var n=$("#orginfoform");$.post("/Organization/OrgInfo/"+$("#OrganizationId").val(),null,function(t){$(n).html(t).ready(function(){$(".submitbutton,.bt").button()})})}}),$("#divisionlist").live("click",function(n){n.preventDefault();var t=$("#divisionsDialog");$("iframe",t).attr("src",this.href),t.dialog("open")}),$("#orgsDialog").dialog({title:"Select Orgs Dialog",bgiframe:!0,autoOpen:!1,width:690,height:650,modal:!0,overlay:{opacity:.5,background:"black"},close:function(){$("iframe",this).attr("src","")}}),$("#orgpicklist").live("click",function(n){n.preventDefault();var t=$("#orgsDialog");$("iframe",t).attr("src",this.href),t.dialog("open")}),$("#orgpickdiv a[target='otherorg']").length>0&&$("#tabfees,#tabquestions").hide(),$.extraEditable=function(){$(".editarea").editable("/Organization/EditExtra/",{type:"textarea",submit:"OK",rows:5,width:200,indicator:'<img src="/images/loading.gif">',tooltip:"Click to edit..."}),$(".editline").editable("/Organization/EditExtra/",{indicator:"<img src='/images/loading.gif'>",tooltip:"Click to edit...",style:"display: inline",width:200,height:25,submit:"OK"})},$.extraEditable(),$("#newvalueform").dialog({autoOpen:!1,buttons:{Ok:function(){var i=$("#multiline").is(":checked"),n=$("#fieldname").val(),t=$("#fieldvalue").val();n&&$.post("/Organization/NewExtraValue/"+$("#OrganizationId").val(),{field:n,value:t,multiline:i},function(n){n.startsWith("error")?alert(n):($("#extras > tbody").html(n),$.extraEditable()),$("#fieldname").val("")}),$(this).dialog("close")}}}),$("#newextravalue").live("click",function(n){n.preventDefault();var t=$("#newvalueform");t.dialog("open")}),$("a.deleteextra").live("click",function(n){return n.preventDefault(),confirm("are you sure?")&&$.post("/Organization/DeleteExtra/"+$("#OrganizationId").val(),{field:$(this).attr("field")},function(n){n.startsWith("error")?alert(n):($("#extras > tbody").html(n),$.extraEditable())}),!1})})