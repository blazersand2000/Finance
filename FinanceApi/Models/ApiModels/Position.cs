using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FinanceApi.Models.ApiModels
{
   public class Position
   {
      [JsonPropertyName("symbol")]
      public string Symbol { get; set; }
      [JsonPropertyName("quantity")]
      public int Quantity { get; set; }
      [JsonPropertyName("costBasis")]
      public decimal CostBasis { get; set; }
      [JsonPropertyName("currentValue")]
      public decimal CurrentValue { get; set; }
   }
}
