using FinanceApi.Identity;
using FinanceApi.Models.ApiModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Repositories
{
   public interface IUserRepository
   {
      UserAuthentication Authenticate(UserLogin credentials);
      List<AppUser> GetAllUsers();
      bool AddUser(UserLogin user);
   }
}
