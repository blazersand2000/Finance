﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceApi.Data;
using FinanceApi.Models;
using System.Net.Http;
using System.Text.Json;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class TransactionsController : ControllerBase
   {
      private readonly IHttpClientFactory _clientFactory;
      private readonly HttpClient client;

      public TransactionsController(IHttpClientFactory clientFactory)
      {
         _clientFactory = clientFactory;
         client = _clientFactory.CreateClient();
      }

      // GET: api/Transactions
      [HttpGet]
      public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetTransactions()
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

            //var results = json.Select(p => p.First);
            //var str = results.ToString();
            //var results = json.Children().AsEnumerable().Select<JToken, JToken>(token => (JToken)token.Values());
            return Ok(transactions);
            //return Ok();
         }
         else
         {
            return BadRequest();
         }
      }

   }
}
