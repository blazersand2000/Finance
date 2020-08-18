using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FinanceApi.Models
{
   public class QuoteResponse
   {
      [JsonPropertyName("companyName")]
      public string CompanyName { get; set; }
      [JsonPropertyName("latestPrice")]
      public decimal LatestPrice { get; set; }
      [JsonPropertyName("symbol")]
      public string Symbol { get; set; }
   }
}
