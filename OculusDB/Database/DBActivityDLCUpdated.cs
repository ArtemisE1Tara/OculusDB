﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using OculusGraphQLApiLib.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace OculusDB.Database
{
    public class DBActivityDLCUpdated
    {
        [BsonIgnore]
        public string __id
        {
            get
            {
                return _id;
            }
        }
        /// <summary>
        /// Scraping node ID
        /// </summary>
        public string __sn { get; set; } = "";
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string _id { get; set; }
        public string __lastEntry { get; set; } = null;
        public string __OculusDBType { get; set; } = DBDataTypes.ActivityDLCUpdated;
        public DateTime __lastUpdated { get; set; } = DateTime.Now;
        public string id { get; set; } = "";
        public string displayName { get; set; } = "";
        public string displayShortDescription { get; set; } = "";
        public string priceFormatted
        {
            get
            {
                return AppStoreOfferPrice.GetFormattedPrice(priceOffsetNumerical, currency);
            }
        }
        public string priceOffset { get; set; } = "0";
        public string latestAssetFileId { get; set; } = "";
        public long priceOffsetNumerical
        {
            get
            {
                return Convert.ToInt64(priceOffset);
            }
            set
            {
                priceOffset = value.ToString();
            }
        }
        public string currency { get; set; } = "";

        public ParentApplication parentApplication { get; set; } = new ParentApplication();
    }
}
