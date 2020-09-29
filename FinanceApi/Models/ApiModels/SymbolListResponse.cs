using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Models.ApiModels
{
   public class SymbolListResponse
   {
      [JsonProperty("timestamp")]
      public long Timestamp { get; set; }

      [JsonProperty("symbols")]
      public IEnumerable<SymbolDetail> Symbols { get; set; }
   }
}
