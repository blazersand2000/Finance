using Newtonsoft.Json;

namespace FinanceApi.Models.ApiModels
{
   public class Position
   {
      [JsonProperty("symbol")]
      public string Symbol { get; set; }
      [JsonProperty("quantity")]
      public int Quantity { get; set; }
      [JsonProperty("costBasis")]
      public decimal CostBasis { get; set; }
      [JsonProperty("currentValue")]
      public decimal CurrentValue { get; set; }
   }
}
