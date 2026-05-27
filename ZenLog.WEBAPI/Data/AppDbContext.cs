using Microsoft.EntityFrameworkCore;

namespace ZenLogWEBAPI.Data
{
    public class AppDbContext: DbContext
    {
       public AppDbContext(DbContextOptions<AppDbContext> option) : base(option)
        {

        }

        public DbSet<Entities.Journal> Journals { get; set; }
        public DbSet<Entities.MoodEntity> Moods { get; set; }
        public DbSet<Entities.User> Users { get; set; }
        public DbSet<Entities.Auth> Auths { get; set; }


    }
}
