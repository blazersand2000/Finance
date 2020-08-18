using System.Net;
using FinanceApi.Exceptions;
using FinanceApi.Models.ApiModels;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace FinanceApi.Controllers
{
   [ApiExplorerSettings(IgnoreApi = true)]
   [ApiController]
   [Route("api/[controller]")]
   public class ErrorController : Controller
   {
      public Error GetError()
      {
         var context = HttpContext.Features.Get<IExceptionHandlerFeature>();
         var exception = context?.Error;

         switch (exception)
         {
            case BadRequestException _:
               Response.StatusCode = (int)HttpStatusCode.BadRequest;
               return new Error() { HttpStatusCode = HttpStatusCode.BadRequest, Message = exception.Message };
            case NotFoundException _:
               Response.StatusCode = (int)HttpStatusCode.NotFound;
               return new Error() { HttpStatusCode = HttpStatusCode.NotFound, Message = exception.Message };
            default:
               Response.StatusCode = (int)HttpStatusCode.InternalServerError;
               return new Error() { HttpStatusCode = HttpStatusCode.InternalServerError, Message = "An unknown error occured." };
         }
      }
   }
}