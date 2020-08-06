using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FinanceApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class PortfolioController : ControllerBase
   {
      private readonly IHttpClientFactory _clientFactory;
      private readonly HttpClient client;

      public PortfolioController(IHttpClientFactory clientFactory)
      {
         _clientFactory = clientFactory;
         client = _clientFactory.CreateClient();
      }

      [HttpGet]
      public async Task<ActionResult> GetPortfolio()
      {
         var request = new HttpRequestMessage(HttpMethod.Get, $"https://cs50-finance-9582e.firebaseio.com/transactions.json");
         var response = await client.SendAsync(request);

         if (response.IsSuccessStatusCode)
         {
            using var responseStream = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(responseStream);
            var jsonString = JObject.Parse(streamReader.ReadToEnd());
            var results = new JArray(jsonString.Children().Select(p => new JObject(p.Values())));
            var transactions = results.ToObject<IEnumerable<TransactionResponse>>();

            var portfolio = transactions
               .GroupBy(g => g.Symbol)
               .Select(g => new
               {
                  symbol = g.Key,
                  quantity = g.Sum(q => q.Quantity),
                  costBasis = g.Sum(c => c.Quantity * c.CostBasis)
               })
               .Where(s => s.quantity != 0);

            //var results = json.Select(p => p.First);
            //var str = results.ToString();
            //var results = json.Children().AsEnumerable().Select<JToken, JToken>(token => (JToken)token.Values());
            return Ok(portfolio);
            //return Ok();
         }
         else
         {
            return BadRequest();
         }
      }





      //// GET: api/Portfolio
      //[HttpGet]
      //public IEnumerable<string> Get()
      //{
      //    return new string[] { "value1", "value2" };
      //}

      //// GET: api/Portfolio/5
      //[HttpGet("{id}", Name = "Get")]
      //public string Get(int id)
      //{
      //    return "value";
      //}

      //// POST: api/Portfolio
      //[HttpPost]
      //public void Post([FromBody] string value)
      //{
      //}

      //// PUT: api/Portfolio/5
      //[HttpPut("{id}")]
      //public void Put(int id, [FromBody] string value)
      //{
      //}

      //// DELETE: api/ApiWithActions/5
      //[HttpDelete("{id}")]
      //public void Delete(int id)
      //{
      //}
   }
}
