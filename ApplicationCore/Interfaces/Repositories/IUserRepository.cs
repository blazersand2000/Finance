using ApplicationCore.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace ApplicationCore.Interfaces.Repositories
{
   public interface IUserRepository
   {
      UserAuthentication Authenticate(string email, string password);
   }
}
