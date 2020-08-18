using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FinanceApi.Models.ApiModels
{
   public class Error
   {
      [JsonPropertyName("httpStatusCode")]
      public HttpStatusCode HttpStatusCode { get; set; }
      [JsonPropertyName("message")]
      public string Message { get; set; }
   }
}
