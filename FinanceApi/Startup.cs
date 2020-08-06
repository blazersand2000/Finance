using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceApi.Data;
using FinanceApi.Identity;
using FinanceApi.Repositories;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;


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

         services.AddDbContext<FinanceContext>(options =>
           options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

         services.AddIdentity<AppUser, IdentityRole>()
           .AddEntityFrameworkStores<FinanceContext>();
         var identityBuilder = services.AddIdentityCore<AppUser>(o =>
         {
            // configure identity options
            o.Password.RequireDigit = false;
            o.Password.RequireLowercase = false;
            o.Password.RequireUppercase = false;
            o.Password.RequireNonAlphanumeric = false;
            o.Password.RequiredLength = 6;
         });

         services.AddScoped<IUserRepository, UserRepository>();

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
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         app.UseCors();

         if (env.IsDevelopment())
         {
            app.UseDeveloperExceptionPage();
         }

         app.UseHttpsRedirection();

         app.UseRouting();

         app.UseAuthorization();

         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
         });

         using (var serviceScope = app.ApplicationServices.GetService<IServiceScopeFactory>().CreateScope())
         {
            var context = serviceScope.ServiceProvider.GetRequiredService<FinanceContext>();
            context.Database.Migrate();
         }

         FirebaseApp.Create(new AppOptions()
         {
            Credential = GoogleCredential.FromFile(@"C:\Users\Andrew\Downloads\cs50-finance-9582e-firebase-adminsdk-i9npe-c3f1fe9022.json"),
         });

      }
   }
}
