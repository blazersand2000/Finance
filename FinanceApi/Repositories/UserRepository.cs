using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApi.Data;
using FinanceApi.Identity;
using FinanceApi.Models.ApiModels;
using Microsoft.AspNetCore.Identity;

namespace FinanceApi.Repositories
{
   public class UserRepository : IUserRepository
   {
      private readonly UserManager<AppUser> _userManager;
      private readonly SignInManager<AppUser> _signInManager;
      private readonly FinanceContext _dbContext;

      public UserRepository(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, FinanceContext dbContext)
      {
         _userManager = userManager;
         _signInManager = signInManager;
         _dbContext = dbContext;
      }

      public bool AddUser(UserLogin user)
      {
         var result = _userManager.CreateAsync(new AppUser() { Email = user.Email, UserName = user.Email }, user.Password).Result;
         return result.Succeeded;
      }

      public UserAuthentication Authenticate(UserLogin credentials)
      {
         throw new NotImplementedException();
      }

      public List<AppUser> GetAllUsers()
      {
         return _dbContext.Users.ToList();
      }
   }
}
