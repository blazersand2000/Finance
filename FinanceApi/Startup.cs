using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApi.Authentication;
using FinanceApi.Repositories;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace FinanceApi
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         services.AddControllers();

         services.AddSingleton<IUserResolver, FirebaseUserResolver>();

         services.AddHttpClient();

         services.AddCors(options =>
         {
            options.AddDefaultPolicy(
                builder =>
                {
                   builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader();
                });
         });

         services.AddMvc().AddNewtonsoftJson();

         services.AddTransient<IMainRepository, MainRepository>();
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         //https://stackoverflow.com/questions/38630076/asp-net-core-web-api-exception-handling/55166404#55166404
         app.UseExceptionHandler("/api/error");
         
         app.UseCors();

         if (env.IsDevelopment())
         {
            //app.UseDeveloperExceptionPage();
         }

         app.UseHttpsRedirection();

         app.UseRouting();

         app.UseAuthorization();

         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
         });


         FirebaseApp.Create(new AppOptions()
         {
            Credential = GoogleCredential.FromFile(Configuration["FirebaseKey"])
         });

      }
   }
}
