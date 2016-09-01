﻿using System.Linq;
using System.Web.Mvc;
using CmsData;
using CmsWeb.MobileAPI;
using CmsWeb.Models;
using Newtonsoft.Json;

namespace CmsWeb.Areas.Public.Controllers
{
    public class MobileAPIListController : Controller
    {
        public ActionResult Countries(string data)
        {
            var countries = from e in DbUtil.Db.Countries
                            orderby e.Id
                            select new MobileCountry
                            {
                                id = e.Id,
                                code = e.Code,
                                description = e.Description
                            };

            BaseMessage br = new BaseMessage();
            br.error = 0;
            br.count = countries.Count();
            br.data = JsonConvert.SerializeObject(countries.ToList());

            return br;
        }

        public ActionResult States(string data)
        {
            var states = from e in DbUtil.Db.StateLookups
                         orderby e.StateCode
                         select new MobileState
                         {
                             code = e.StateCode,
                             name = e.StateName
                         };

            BaseMessage br = new BaseMessage();
            br.error = 0;
            br.count = states.Count();
            br.data = JsonConvert.SerializeObject(states.ToList());

            return br;
        }

        public ActionResult MaritalStatuses(string data)
        {
            var statuses = from e in DbUtil.Db.MaritalStatuses
                           orderby e.Id
                           select new MobileMaritalStatus
                           {
                               id = e.Id,
                               code = e.Code,
                               description = e.Description
                           };

            BaseMessage br = new BaseMessage();
            br.error = 0;
            br.count = statuses.Count();
            br.data = JsonConvert.SerializeObject(statuses.ToList());

            return br;
        }

        public ActionResult HomeActions(string data)
        {
            BaseMessage dataIn = BaseMessage.createFromString(data);

            var actions = from p in DbUtil.Db.MobileAppActions
                          join i in DbUtil.Db.MobileAppIcons on p.Id equals i.ActionID
                          join s in DbUtil.Db.MobileAppIconSets on i.SetID equals s.Id
                          where p.Enabled == true
                          where s.Active == true
                          where p.Api <= dataIn.version
                          where p.Rebranded == dataIn.rebranded
                          orderby p.Order
                          select new MobileHomeAction
                          {
                              type = p.Type,
                              title = p.Title,
                              option = p.Option,
                              data = p.Data,
                              icon = i.Url,
                              loginType = p.LoginType,
                              roles = p.Roles
                          };

            BaseMessage br = new BaseMessage();
            br.error = 0;
            br.count = actions.Count();
            br.data = JsonConvert.SerializeObject(actions.ToList());

            return br;
        }

        public ActionResult MapInfo(string data)
        {
            var campuses = from p in DbUtil.Db.MobileAppBuildings
                           where p.Enabled
                           orderby p.Order
                           select new MobileCampus
                           {
                               id = p.Id,
                               name = p.Name
                           };

            var campusList = campuses.ToList();

            foreach (MobileCampus campus in campusList)
            {
                var floors = from p in DbUtil.Db.MobileAppFloors
                             where p.Enabled
                             where p.Campus == campus.id
                             orderby p.Order
                             select new MobileFloor
                             {
                                 id = p.Id,
                                 name = p.Name,
                                 image = p.Image,
                             };

                var floorList = floors.ToList();

                foreach (MobileFloor floor in floorList)
                {
                    var rooms = from p in DbUtil.Db.MobileAppRooms
                                where p.Enabled
                                where p.Floor == floor.id
                                orderby p.Room
                                select new MobileRoom
                                {
                                    name = p.Name,
                                    room = p.Room,
                                    x = p.X,
                                    y = p.Y
                                };

                    floor.rooms = rooms.ToList();
                }

                campus.floors = floorList;
            }

            BaseMessage br = new BaseMessage();
            br.error = 0;
            br.count = campusList.Count();
            br.data = JsonConvert.SerializeObject(campusList);

            return br;
        }
    }
}
