using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApi.Authentication;
using FinanceApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SymbolsController : ControllerBase
    {
      private readonly IMainRepository _mainRepository;
      private readonly IUserResolver _userResolver;


      public SymbolsController(IMainRepository mainRepository, IUserResolver userResolver)
      {
         _mainRepository = mainRepository;
         _userResolver = userResolver;
      }

      [HttpGet]
      public async Task<IActionResult> GetSymbolsAsync(string auth)
      {
         return Ok(_mainRepository.GetSymbols());
      }
   }
}