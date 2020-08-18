using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FinanceApi.Models
{
   public class Transaction
   {
      [JsonPropertyName("symbol")]
      public string Symbol { get; set; }
      [JsonPropertyName("quantity")]
      public int Quantity { get; set; }
      [JsonPropertyName("stockPrice")]
      public decimal StockPrice { get; set; }
      [JsonPropertyName("timestamp")]
      public long Timestamp { get; set; }
   }
}
