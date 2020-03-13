using FinanceApi.Identity;
using FinanceApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FinanceApi.Data
{
  public class FinanceContext : IdentityDbContext<AppUser>
  {
    public FinanceContext(DbContextOptions<FinanceContext> options) : base(options)
    {
    }

    public DbSet<Transaction> Transactions { get; set; }
  }
}
