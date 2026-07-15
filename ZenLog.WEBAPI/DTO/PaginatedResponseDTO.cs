namespace ZenLogWEBAPI.DTO
{
    public class PaginatedResponseDTO<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public bool HasMore { get; set; }
        public int NextOffset { get; set; }
    }
}
