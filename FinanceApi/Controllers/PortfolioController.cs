using FinanceApi.Authentication;
using FinanceApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class PortfolioController : ControllerBase
   {
      private readonly IMainRepository _mainRepository;
      private readonly IUserResolver _userResolver;


      public PortfolioController(IMainRepository mainRepository, IUserResolver userResolver)
      {
         _mainRepository = mainRepository;
         _userResolver = userResolver;
      }

      [HttpGet]
      public async Task<IActionResult> GetPortfolioAsync(string auth)
      {
         return Ok(_mainRepository.GetPositions(await _userResolver.GetUserIdFromTokenAsync(auth)));
      }

   }
}
