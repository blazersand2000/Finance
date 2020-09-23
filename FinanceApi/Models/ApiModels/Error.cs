using Newtonsoft.Json;
using System.Net;
using System.Text.Json.Serialization;

namespace FinanceApi.Models.ApiModels
{
   public class Error
   {
      [JsonProperty("httpStatusCode")]
      public HttpStatusCode HttpStatusCode { get; set; }
      [JsonProperty("message")]
      public string Message { get; set; }
   }
}
