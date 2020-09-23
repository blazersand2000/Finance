using Newtonsoft.Json;

namespace FinanceApi.Models
{
   public class Transaction
   {
      [JsonProperty("symbol")]
      public string Symbol { get; set; }
      [JsonProperty("quantity")]
      public int Quantity { get; set; }
      [JsonProperty("stockPrice")]
      public decimal StockPrice { get; set; }
      [JsonProperty("timestamp")]
      public long Timestamp { get; set; }
      [JsonProperty("uid")]
      public string UId { get; set; }
   }
}
