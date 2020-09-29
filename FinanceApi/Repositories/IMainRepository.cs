using FinanceApi.Models;
using FinanceApi.Models.ApiModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Repositories
{
   public interface IMainRepository
   {
      IEnumerable<Transaction> GetTransactions(string uid);
      IEnumerable<Position> GetPositions(string uid);
      QuoteResponse GetQuote(string symbol);
      IEnumerable<QuoteResponse> GetQuotes(IEnumerable<string> symbols);
      void Transact(Transaction transaction);
      SymbolListResponse GetSymbols();
   }
}
