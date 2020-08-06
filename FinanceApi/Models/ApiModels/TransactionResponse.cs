using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FinanceApi.Models
{
   public class TransactionResponse
   {
      [JsonPropertyName("symbol")]
      public string Symbol { get; set; }
      [JsonPropertyName("quantity")]
      public int Quantity { get; set; }
      [JsonPropertyName("costBasis")]
      public decimal CostBasis { get; set; }
      [JsonPropertyName("timestamp")]
      public long Timestamp { get; set; }
   }
}
