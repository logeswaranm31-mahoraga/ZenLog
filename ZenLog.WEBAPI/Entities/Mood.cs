using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ZenLogWEBAPI.Entities
{
    [Table("Mood")]
    public class MoodEntity
    {
        [Key] 
        public int Id { get; set; }
        public string Emoji { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Color { get; set; }
    }
}
