using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Models
{
  public class Transaction
  {
    public int Id { get; set; }
    public string Symbol { get; set; }
    public int Shares { get; set; }
    public decimal PricePerShare { get; set; }
    public DateTime TransactionTime { get; set; }
  }
}
