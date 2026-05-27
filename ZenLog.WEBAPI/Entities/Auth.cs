using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZenLogWEBAPI.Entities
{
    [Table("Auth")]
    public class Auth
    {
        [Key]
        [Required]
        public string Email { get; set; }= String.Empty;
        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }
    }
}
