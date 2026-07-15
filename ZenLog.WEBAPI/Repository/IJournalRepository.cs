using Microsoft.AspNetCore.Mvc;

namespace ZenLogWEBAPI.Repository
{
    public interface IJournalRepository
    {
        public Task<DTO.PaginatedResponseDTO<DTO.JournalEntryDTO>> GetAllJournals(int userId, int offset = 0,int limit = 10, int? month = null, int? year = null, DateTime? specificDate = null);
        public Task<DTO.MoodDTO[]> GetMoods();
        public Task<DTO.JournalDTO> AddOrUpdateJournal(DTO.JournalDTO journal);
        public Task<bool> DeleteJournal(int id);
    }
}
