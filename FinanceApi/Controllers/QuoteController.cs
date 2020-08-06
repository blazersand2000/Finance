using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using FinanceApi.Models.ApiModels;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class QuoteController : ControllerBase
   {
      private readonly IHttpClientFactory _clientFactory;
      private readonly HttpClient client;

      public QuoteController(IHttpClientFactory clientFactory)
      {
         _clientFactory = clientFactory;
         client = _clientFactory.CreateClient();
      }

      // GET: api/Quote/MSFT
      [HttpGet("{symbol}", Name = "GetAsync")]
      public async Task<IActionResult> GetAsync(string symbol)
      {
         var request = new HttpRequestMessage(HttpMethod.Get, $"https://cloud-sse.iexapis.com/stable/stock/{symbol}/quote?token=pk_e6e13c11832440cabe357ff621e7f404");
         var response = await client.SendAsync(request);

         if (response.IsSuccessStatusCode)
         {
            using var responseStream = await response.Content.ReadAsStreamAsync();
            return Ok(await JsonSerializer.DeserializeAsync<QuoteResponse>(responseStream));
         }
         else if (response.StatusCode == HttpStatusCode.NotFound)
         {
            return StatusCode((int)HttpStatusCode.NotFound);
         }
         else
         {
            return BadRequest();
         }
      }
   }
}
