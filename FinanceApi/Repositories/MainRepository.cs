using System.Collections.Generic;
using System.Linq;
using FinanceApi.Models;
using FinanceApi.Models.ApiModels;
using System.IO;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using FinanceApi.Exceptions;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Net;
using System.Text;
using System;

namespace FinanceApi.Repositories
{
   public class MainRepository : IMainRepository
   {
      private const string TRANSACTION_ENDPOINT = @"https://cs50-finance-9582e.firebaseio.com/transactions.json";
      private const string DEPOSIT_SYMBOL = "DEPOSIT";

      private readonly IHttpClientFactory _clientFactory;
      private readonly HttpClient client;

      public MainRepository(IHttpClientFactory clientFactory)
      {
         _clientFactory = clientFactory;
         client = _clientFactory.CreateClient();
      }

      public IEnumerable<Transaction> GetTransactions(string uid)
      {
         var request = new HttpRequestMessage(HttpMethod.Get, $"{TRANSACTION_ENDPOINT}?orderBy=\"uid\"&equalTo=\"{uid}\"");
         var response = SendRequestAsync(request).Result;

         if (response.IsSuccessStatusCode)
         {
            var jsonObject = JObject.Parse(ReadHttpContentAsync(response.Content).Result);
            var results = new JArray(jsonObject.Children().Select(p => new JObject(p.Values())));
            var transactions = results.ToObject<IEnumerable<Transaction>>();
            return transactions;
         }
         else
         {
            throw new BadRequestException("Could not fetch transactions.");
         }
      }

      public IEnumerable<Position> GetPositions(string uid)
      {
         var transactions = GetTransactions(uid);

         var quotes = GetQuotes(transactions.Where(t => t.Symbol.ToUpper() != DEPOSIT_SYMBOL).Select(t => t.Symbol).Distinct());

         var portfolio = transactions
            .GroupBy(g => g.Symbol)
            .Select(g => new Position()
            {
               Symbol = g.Key,
               Quantity = g.Sum(q => q.Quantity),
               CostBasis = g.Sum(c => c.Quantity * c.StockPrice),
               CurrentValue = g.Key.ToUpper() == DEPOSIT_SYMBOL ? g.Sum(v => v.StockPrice) - transactions.Where(t => t.Symbol.ToUpper() != DEPOSIT_SYMBOL).Sum(s => s.Quantity * s.StockPrice)
               : g.Sum(q => q.Quantity) * quotes.FirstOrDefault(q => q.Symbol.ToUpper() == g.Key.ToUpper()).LatestPrice
            })
            .Where(s => s.Quantity != 0);

         return portfolio;
      }

      public QuoteResponse GetQuote(string symbol)
      {
         var request = new HttpRequestMessage(HttpMethod.Get, $"https://cloud-sse.iexapis.com/stable/stock/{symbol}/quote?token=pk_e6e13c11832440cabe357ff621e7f404");
         var response = SendRequestAsync(request).Result;

         if (response.IsSuccessStatusCode)
         {
            var content = ReadHttpContentAsync(response.Content).Result;
            return JsonConvert.DeserializeObject<QuoteResponse>(content);
         }
         else if (response.StatusCode == HttpStatusCode.NotFound)
         {
            throw new NotFoundException("Symbol not found.");
         }
         else
         {
            throw new BadRequestException("Could not get quote information.");
         }
      }

      public IEnumerable<QuoteResponse> GetQuotes(IEnumerable<string> symbols)
      {
         if (symbols == null || symbols.Count() == 0)
         {
            return new List<QuoteResponse>();
         }

         symbols = symbols.Select(s => s.ToUpper());
         
         var request = new HttpRequestMessage(HttpMethod.Get, $"https://cloud-sse.iexapis.com/stable/stock/market/batch?types=quote&symbols={string.Join(',', symbols)}&token=pk_e6e13c11832440cabe357ff621e7f404");
         var response = SendRequestAsync(request).Result;

         if (response.IsSuccessStatusCode)
         {
            var jsonObject = JObject.Parse(ReadHttpContentAsync(response.Content).Result);
            var quotes = jsonObject.Properties().Select(p => (p.Value as JObject).Properties().Single().Value.ToObject<QuoteResponse>());

            var notFoundSymbols = symbols.Except(quotes.Select(s => s.Symbol.ToUpper()));

            if (notFoundSymbols.Count() > 0)
            {
               throw new NotFoundException($"Symbol(s) not found: {string.Join(", ", notFoundSymbols)}");
            }

            return quotes;
         }
         else
         {
            throw new BadRequestException("Could not get quote information.");
         }
      }

      public void Transact(Transaction transaction)
      {
         if (transaction.Quantity == 0)
         {
            throw new BadRequestException("Cannot transact 0 shares.");
         }

         var portfolio = GetPositions(transaction.UId);
         transaction.StockPrice = GetQuote(transaction.Symbol).LatestPrice;

         //buying
         if (transaction.Quantity > 0)
         {
            if (!portfolio.Any(p => p.Symbol.ToUpper() == DEPOSIT_SYMBOL) || portfolio.First(p => p.Symbol.ToUpper() == DEPOSIT_SYMBOL).CurrentValue < (transaction.StockPrice * transaction.Quantity))
            {
               throw new BadRequestException("User cannot afford.");
            }
         }
         //selling
         if (transaction.Quantity < 0)
         {
            if (!portfolio.Any(p => p.Symbol == transaction.Symbol))
            {
               throw new BadRequestException($"User does not own any shares of {transaction.Symbol.ToUpper()}.");
            }
            var ownedQuantity = portfolio.First(p => p.Symbol == transaction.Symbol).Quantity;
            if (ownedQuantity < Math.Abs(transaction.Quantity))
            {
               throw new BadRequestException($"Cannot sell {Math.Abs(transaction.Quantity)} shares of {transaction.Symbol.ToUpper()}; user only owns {ownedQuantity} shares.");
            }
         }



         transaction.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
         
         var request = new HttpRequestMessage(HttpMethod.Post, TRANSACTION_ENDPOINT);
         request.Content = new StringContent(JsonConvert.SerializeObject(transaction));

         var response = SendRequestAsync(request).Result;

         if (!response.IsSuccessStatusCode)
         {
            throw new BadRequestException("Could not save transaction.");
         }
      }

      private async Task<HttpResponseMessage> SendRequestAsync(HttpRequestMessage request)
      {
         return await client.SendAsync(request);
      }

      private async Task<string> ReadHttpContentAsync(HttpContent content)
      {
         using var responseStream = await content.ReadAsStreamAsync();
         using var streamReader = new StreamReader(responseStream);
         return streamReader.ReadToEnd();
      }
   }
}
