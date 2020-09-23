using Newtonsoft.Json;

namespace FinanceApi.Models
{
   public class QuoteResponse
   {
      [JsonProperty("companyName")]
      public string CompanyName { get; set; }
      [JsonProperty("latestPrice")]
      public decimal LatestPrice { get; set; }
      [JsonProperty("symbol")]
      public string Symbol { get; set; }
   }
}
