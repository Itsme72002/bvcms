$(function(){$("#applydonation").click(function(n){return n.preventDefault(),!1}),$("a.submitbutton, a.submitlink, input.submitbutton.ajax").click(function(n){n.preventDefault();var i=$(this).closest("form"),t=i.serialize();return $.post($(this).attr("href"),t,function(n){n.error?$("#validatecoupon").text(n.error):n.amt?($("#validatecoupon").text(""),$("#amt").text(n.amt),$("#pf_AmtToPay").val(n.tiamt),$("#pf_Amtdue").val(n.amtdue),$("#pf_Coupon").val(""),$("td.coupon").html(n.msg)):window.location=n.confirm}),!1}),$("#pf_Coupon").showPassword(),$("#findidclick").click(function(){$("#findid").dialog({width:400})}),$("form").submit(function(){return $("#Submit").val()?($("#Submit").attr("disabled","true"),!0):!1}),$("#Terms").dialog({autoOpen:!1}),$("#displayterms").click(function(){$("#Terms").dialog("open")}),$("#IAgree").attr("id")&&($("#Submit").attr("disabled","disabled"),$("a.submitbutton").attr("disabled","disabled")),$("#IAgree").click(function(){var n=this.checked;n==!0?($("#Submit").removeAttr("disabled"),$("a.submitbutton").removeAttr("disabled")):($("#Submit").attr("disabled","disabled"),$("a.submitbutton").attr("disabled","disabled"))}),$.ShowPaymentInfo=function(n){$(".Card").hide(),$(".Bank").hide(),$("#Submit").removeAttr("disabled"),n==="C"?$(".Card").show():n==="B"&&$(".Bank").show(),n?$("#Submit").removeAttr("disabled"):$("#Submit").attr("disabled","true")},$("input[name=Type]").live("change",function(){var n=$("input[name=Type]:checked").val();$("#pf_Type").val(n),$.ShowPaymentInfo(n)}),$("#allowcc").val()&&$.ShowPaymentInfo($("#pf_Type").val()),$.validator.setDefaults({highlight:function(n){$(n).addClass("ui-state-highlight")},unhighlight:function(n){$(n).removeClass("ui-state-highlight")}}),$("form").validate({rules:{"pf.Name":{required:!0,maxlength:50},"pf.Address":{required:!0,maxlength:50},"pf.City":{required:!0,maxlength:50},"pf.State":{required:!0,maxlength:4},"pf.Zip":{required:!0,maxlength:15},"pf.Email":{required:!0,maxlength:80},"pf.Phone":{maxlength:50},"pf.CreditCard":{digits:!0},"pf.CCV":{digits:!0,maxlength:4},"pf.Expires":{digits:!0,maxlength:4}}})})