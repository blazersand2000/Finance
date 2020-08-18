using FinanceApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
   [Route("api/[controller]")]
   [ApiController]
   public class PortfolioController : ControllerBase
   {
      private readonly IMainRepository _mainRepository;

      public PortfolioController(IMainRepository mainRepository)
      {
         _mainRepository = mainRepository;
      }

      [HttpGet]
      public IActionResult GetPortfolio()
      {
         return Ok(_mainRepository.GetPositions());
      }

   }
}
