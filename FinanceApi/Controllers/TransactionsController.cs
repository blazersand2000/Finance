using Microsoft.AspNetCore.Mvc;
using FinanceApi.Repositories;
using FinanceApi.Models;
using FirebaseAdmin.Auth;
using System.Threading.Tasks;
using FinanceApi.Authentication;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class TransactionsController : ControllerBase
   {
      private readonly IMainRepository _mainRepository;
      private readonly IUserResolver _userResolver;

      public TransactionsController(IMainRepository mainRepository, IUserResolver userResolver)
      {
         _mainRepository = mainRepository;
         _userResolver = userResolver;
      }

      [HttpGet]
      public async Task<IActionResult> GetTransactionsAsync(string auth)
      {
         return Ok(_mainRepository.GetTransactions(await _userResolver.GetUserIdFromTokenAsync(auth)));
      }

      [HttpPost]
      public async Task<IActionResult> TransactAsync(Transaction transaction, string auth)
      {
         transaction.UId = await _userResolver.GetUserIdFromTokenAsync(auth);
         _mainRepository.Transact(transaction);
         return Ok();
      }

   }
}
