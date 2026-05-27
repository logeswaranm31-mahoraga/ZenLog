namespace ZenLogWEBAPI.DTO
{
    public class JournalDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime EntryDate { get; set; }
        public int MoodId { get; set; }
    }
}
