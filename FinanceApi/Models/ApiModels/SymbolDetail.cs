using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Models.ApiModels
{
   public class SymbolDetail
   {
      [JsonProperty("symbol")]
      public string Symbol { get; set; }

      [JsonProperty("companyName")]
      public string CompanyName { get; set; }

   }
}
