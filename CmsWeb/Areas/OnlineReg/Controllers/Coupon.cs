using System;
using System.Linq;
using System.Web.Mvc;
using CmsData;
using CmsWeb.Models;
using UtilityExtensions;
using CmsWeb.Areas.Manage.Controllers;
using System.Text;

namespace CmsWeb.Areas.OnlineReg.Controllers
{
    public partial class OnlineRegController
    {
        [HttpPost]
        public ActionResult ApplyCoupon(PaymentForm pf)
        {
			OnlineRegModel m = null;
			if (pf.PayBalance == false)
			{
				var ed = DbUtil.Db.ExtraDatas.SingleOrDefault(e => e.Id == pf.DatumId);
				m = Util.DeSerialize<OnlineRegModel>(ed.Data);
				m.ParseSettings();
			}

        	if (!pf.Coupon.HasValue())
                return Json(new { error = "empty coupon" });
            string coupon = pf.Coupon.ToUpper().Replace(" ", "");
            string admincoupon = DbUtil.Db.Setting("AdminCoupon", "ifj4ijweoij").ToUpper().Replace(" ", "");
            if (coupon == admincoupon)
                return Json(new { confirm = "/onlinereg/Confirm/{0}?TransactionID=Coupon(Admin)".Fmt(pf.DatumId) });

            var c = DbUtil.Db.Coupons.SingleOrDefault(cp => cp.Id == coupon);
            if (c == null)
                return Json(new { error = "coupon not found" });

			if (pf.OrgId != c.OrgId)
				return Json(new {error = "coupon and org do not match"});
        	if (c.Used.HasValue && c.Id.Length == 12)
                return Json(new { error = "coupon already used" });
            if (c.Canceled.HasValue)
                return Json(new { error = "coupon canceled" });

			var ti = pf.CreateTransaction(DbUtil.Db);
			if (m != null)
				m.TranId = ti.OriginalId;

			var tid = "Coupon({0:n2})".Fmt(Util.fmtcoupon(coupon));

			ConfirmDuePaidTransaction(ti, tid, c.Amount ?? 0);
			var msg = "<i class='red'>Your coupon for {0:n2} has been applied, your balance is now {1:n2}</i>."
				.Fmt(c.Amount, ti.Amtdue );
			if (pf.PayBalance)
				msg += "You can stop now, or proceed with an additional payment on the balance.";
			else if(ti.Amt < pf.AmtToPay)
				msg += "You still must complete this transaction with a payment";
				
			if (m != null)
				m.UseCoupon(ti.TransactionId);
			else
				c.UseCoupon(ti.FirstTransactionPeopleId(), ti.Amtdue ?? 0);
            DbUtil.Db.SubmitChanges();

			pf.AmtToPay -= ti.Amt;
			if (pf.AmtToPay == 0 && pf.PayBalance == false)
				return Json( new { confirm = "/OnlineReg/Confirm/{0}?TransactionId={1}".Fmt(pf.DatumId, "zero paid") });
            return Json(new { tiamt = pf.AmtToPay, amtdue=ti.Amtdue, amt=pf.AmtToPay.ToString2("N2"), msg });
        }
        [HttpPost]
        public ActionResult PayWithCoupon(int id, string Coupon)
        {
            if (!Coupon.HasValue())
                return Json(new { error = "empty coupon" });
            var ed = DbUtil.Db.ExtraDatas.SingleOrDefault(e => e.Id == id);
            var m = Util.DeSerialize<OnlineRegModel>(ed.Data);
            m.ParseSettings();
            string coupon = Coupon.ToUpper().Replace(" ", "");
            string admincoupon = DbUtil.Db.Setting("AdminCoupon", "ifj4ijweoij").ToUpper().Replace(" ", "");
            if (coupon == admincoupon)
                return Json(new { confirm = "/onlinereg/Confirm/{0}?TransactionID=Coupon(Admin)".Fmt(id) });
            var c = DbUtil.Db.Coupons.SingleOrDefault(cp => cp.Id == coupon);
            if (c == null)
                return Json(new { error = "coupon not found" });
            if (m.divid.HasValue)
            {
                if (c.DivId != m.divid)
                    return Json(new { error = "coupon division not match" });
            }
            else if (m.orgid != c.OrgId)
                return Json(new { error = "coupon org not match" });
            if (DateTime.Now.Subtract(c.Created).TotalHours > 24)
                return Json(new { error = "coupon expired" });
            if (c.Used.HasValue)
                return Json(new { error = "coupon already used" });
            if (c.Canceled.HasValue)
                return Json(new { error = "coupon canceled" });
            return Json(new
            {
                confirm = "/onlinereg/confirm/{0}?TransactionID=Coupon({1})"
                    .Fmt(id, Util.fmtcoupon(coupon))
            });
        }
        [HttpPost]
        public ActionResult PayWithCoupon2(int id, string Coupon, decimal Amount)
        {
            if (!Coupon.HasValue())
                return Json(new { error = "empty coupon" });
            var ti = DbUtil.Db.Transactions.SingleOrDefault(tt => tt.Id == id);
            string coupon = Coupon.ToUpper().Replace(" ", "");
            string admincoupon = DbUtil.Db.Setting("AdminCoupon", "ifj4ijweoij").ToUpper().Replace(" ", "");
            if (coupon == admincoupon)
                return Json(new { confirm = "/onlinereg/ConfirmDuePaid/{0}?TransactionID=Coupon(Admin)&Amount={1}".Fmt(id, Amount) });
            var c = DbUtil.Db.Coupons.SingleOrDefault(cp => cp.Id == coupon);
            if (c == null)
                return Json(new { error = "coupon not found" });
            if (ti.OrgId != c.OrgId)
                return Json(new { error = "coupon org not match" });
            if (DateTime.Now.Subtract(c.Created).TotalHours > 24)
                return Json(new { error = "coupon expired" });
            if (c.Used.HasValue)
                return Json(new { error = "coupon already used" });
            if (c.Canceled.HasValue)
                return Json(new { error = "coupon canceled" });
            return Json(new
            {
                confirm = "/onlinereg/ConfirmDuePaid/{0}?TransactionID=Coupon({1})&Amount={2}"
                    .Fmt(id, Util.fmtcoupon(coupon), Amount)
            });
        }
        [HttpPost]
        public ActionResult PayWithCouponOld(int id, string Coupon, decimal Amount)
        {
            if (!Coupon.HasValue())
                return Json(new { error = "empty coupon" });
            var ed = DbUtil.Db.ExtraDatas.SingleOrDefault(e => e.Id == id);
            var ti = Util.DeSerialize<TransactionInfo>(ed.Data.Replace("CMSWeb.Models", "CmsWeb.Models"));
            string coupon = Coupon.ToUpper().Replace(" ", "");
            string admincoupon = DbUtil.Db.Setting("AdminCoupon", "ifj4ijweoij").ToUpper().Replace(" ", "");
            if (coupon == admincoupon)
                return Json(new { confirm = "/onlinereg/Confirm2/{0}?TransactionID=Coupon(Admin)&Amount={1}".Fmt(id, Amount) });
            var c = DbUtil.Db.Coupons.SingleOrDefault(cp => cp.Id == coupon);
            if (c == null)
                return Json(new { error = "coupon not found" });
            if (ti.orgid != c.OrgId)
                return Json(new { error = "coupon org not match" });
            if (DateTime.Now.Subtract(c.Created).TotalHours > 24)
                return Json(new { error = "coupon expired" });
            if (c.Used.HasValue)
                return Json(new { error = "coupon already used" });
            if (c.Canceled.HasValue)
                return Json(new { error = "coupon canceled" });
            return Json(new
            {
                confirm = "/onlinereg/Confirm2/{0}?TransactionID=Coupon({1})&Amount={2}"
                    .Fmt(id, Util.fmtcoupon(coupon), Amount)
            });
        }
    }
}
