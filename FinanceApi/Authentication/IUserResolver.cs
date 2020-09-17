using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Authentication
{
   public interface IUserResolver
   {
      Task<string> GetUserIdFromTokenAsync(string token);
   }
}
