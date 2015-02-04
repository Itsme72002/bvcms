using System;
using System.Collections.Generic;
using System.Linq;
using ImageData;
using IronPython.Modules;
using UtilityExtensions;
using System.Text;
using System.Web;

namespace CmsData.View
{
    public partial class OrgPerson
    {
        public string CityStateZip
        {
            get { return Util.FormatCSZ4(City,St,Zip); }
        }

        public HtmlString AddressBlock
        {
            get
            {
                var sb = new StringBuilder();
                if (Address.HasValue())
                    sb.Append(Address);
                if (Address2.HasValue())
                {
                    if (sb.Length > 0)
                        sb.Append("<br>");
                    sb.Append(Address2);
                }
                var csz = CityStateZip;
                if (csz.HasValue())
                {
                    if (sb.Length > 0)
                        sb.Append("<br>");
                    sb.Append(csz);
                }
                if (sb.Length > 0)
                {
                    sb.Insert(0, "<div>");
                    sb.Append("</div>");
                }
                return new HtmlString(sb.ToString());
            } 
        }

        public string BirthDate
        {
            get { return Util.FormatBirthday( BirthYear, BirthMonth, BirthDay); }
        }

        public IEnumerable<string> Phones
        {
            get
            {
                var phones = new List<string>();
                if(CellPhone.HasValue())
                    phones.Add(CellPhone.FmtFone("C"));
                if(HomePhone.HasValue())
                    phones.Add(HomePhone.FmtFone("H"));
                if(WorkPhone.HasValue())
                    phones.Add(WorkPhone.FmtFone("W"));
                return phones;
            }
        }

        public long? LastAttendedTicks
        {
            get
            {
                if(LastAttended.HasValue)
                    return LastAttended.Value.Ticks;
                return null;
            }
        }
    }
}