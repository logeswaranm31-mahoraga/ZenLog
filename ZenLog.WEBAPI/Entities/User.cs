using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZenLogWEBAPI.Entities
{
    [Table("ZenLogUser")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; } = String.Empty;
        [Required]
        public string Email { get; set; } = String.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
