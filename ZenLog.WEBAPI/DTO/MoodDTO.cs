namespace ZenLogWEBAPI.DTO
{
    public class MoodDTO
    {
        public int Id { get; set; }
        public string Emoji { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Color { get; set; }
    }
}