using System.Collections.Generic;
using FinanceApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class QuoteController : ControllerBase
   {
      private readonly IMainRepository _mainRepository;

      public QuoteController(IMainRepository mainRepository)
      {
         _mainRepository = mainRepository;
      }

      [HttpGet()]
      [Route("{symbol}")]
      public IActionResult GetQuote(string symbol)
      {
         return Ok(_mainRepository.GetQuote(symbol));
      }

      [HttpGet()]
      public IActionResult GetQuotes([FromBody] IEnumerable<string> symbols)
      {
         return Ok(_mainRepository.GetQuotes(symbols));
      }
   }
}
