using FinanceApi.Exceptions;
using FirebaseAdmin.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Authentication
{
   public class FirebaseUserResolver : IUserResolver
   {
      public async Task<string> GetUserIdFromTokenAsync(string token)
      {
         try
         {
            FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token);
            return decodedToken.Uid;
         }
         catch (Exception)
         {
            throw new BadRequestException("Could not resolve user");
         }

      }
   }
}
