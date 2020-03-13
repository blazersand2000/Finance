using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApi.Data;
using FinanceApi.Models.ApiModels;
using FinanceApi.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
   [Authorize]
   [ApiController]
   [Route("api/[controller]")]
   public class UsersController : ControllerBase
   {
      private readonly IUserRepository _userRepository;

      public UsersController(IUserRepository userRepository)
      {
         _userRepository = userRepository;
      }

      [AllowAnonymous]
      [HttpGet]
      public IActionResult Users()
      {
         var allUsers = _userRepository.GetAllUsers();
         return Ok(allUsers);
      }

      [AllowAnonymous]
      [HttpPost]
      public IActionResult AddUser([FromBody] UserLogin model)
      {
         if (!ModelState.IsValid)
         {
            return BadRequest("Model invalid");
         }
         if (!_userRepository.AddUser(model))
         {
            return BadRequest("Error adding user");
         }
         return Ok();
      }

      //public IActionResult Authenticate({ "password" })
      //{
      //   return View();
      //}
   }
}