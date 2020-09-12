using Microsoft.AspNetCore.Mvc;
using FinanceApi.Repositories;
using FinanceApi.Models;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class TransactionsController : ControllerBase
   {
      private readonly IMainRepository _mainRepository;

      public TransactionsController(IMainRepository mainRepository)
      {
         _mainRepository = mainRepository;
      }

      [HttpGet]
      public IActionResult GetTransactions()
      {
         return Ok(_mainRepository.GetTransactions());
      }

      [HttpPost]
      public IActionResult Transact(Transaction transaction)
      {
         _mainRepository.Transact(transaction);
         return Ok();
      }

   }
}
