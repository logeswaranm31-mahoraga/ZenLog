using Microsoft.EntityFrameworkCore;
using ZenLogWEBAPI.DTO;
using static System.Net.Mime.MediaTypeNames;

namespace ZenLogWEBAPI.Repository
{

    public class JournalRepository: IJournalRepository
    {
    private readonly Data.AppDbContext _context;
        public JournalRepository(Data.AppDbContext context)
        { 
            _context = context; 
        }

        public async Task<DTO.PaginatedResponseDTO<DTO.JournalEntryDTO>> GetAllJournals(int userId, int offset = 0, int limit = 10, int? month = null, int? year = null, DateTime? specificDate = null)
        {
            var query = _context.Journals.Where(j => j.UserId == userId);

            // Filter by specific date
            if (specificDate.HasValue)
            {
                query = query.Where(j => j.EntryDate.Date == specificDate.Value.Date);
            }

            // Filter by month and/or year
            if (month.HasValue)
            {
                query = query.Where(j => j.EntryDate.Month == month.Value);
            }

            if (year.HasValue)
            {
                query = query.Where(j => j.EntryDate.Year == year.Value);
            }
            var totalCount = await query.CountAsync();
            var journals = await query
                .OrderByDescending(j => j.EntryDate)   // latest first
                .Skip(offset)
                .Take(limit)
                .Join(_context.Moods, j => j.MoodId, m => m.Id, (j, m) => new DTO.JournalEntryDTO
                {
                    Id = j.Id,
                    Content = j.Content,
                    EntryDate = j.EntryDate,
                    Title = j.Title,
                    MoodId = j.MoodId,
                    Mood = m.Emoji

                }).ToArrayAsync();
            var data = new PaginatedResponseDTO<DTO.JournalEntryDTO>
            {
                Data = journals,
                TotalCount = totalCount,
                HasMore = (offset + limit) < totalCount,
                NextOffset = offset + limit
            };
            return data;
        }

        public async Task<DTO.MoodDTO[]> GetMoods()
        {
            var moods = await _context.Moods.Select(m => new DTO.MoodDTO()
            {
                Id = m.Id,  
                Emoji = m.Emoji,
                Name = m.Name,
                Color = m.Color,
            }).ToArrayAsync();
            return moods;
        }

        public async Task<DTO.JournalDTO> AddOrUpdateJournal(DTO.JournalDTO journal)
        {
            if (journal.Id == 0)
            {
                Entities.Journal journalData = new Entities.Journal()
                {
                    Title = journal.Title,
                    Content = journal.Content,
                    EntryDate = journal.EntryDate,
                    MoodId = journal.MoodId,
                    UserId = journal.UserId
                };
                await _context.Journals.AddAsync(journalData);
                await _context.SaveChangesAsync();
                return journal;
            }
            else
            {
                var data = await _context.Journals.FirstOrDefaultAsync(item => item.Id == journal.Id);
                if (data != null)
                {
                    data.Title = journal.Title;
                    data.Content = journal.Content;
                    data.EntryDate = journal.EntryDate;
                    data.MoodId = journal.MoodId;
                    await _context.SaveChangesAsync();
                }
                return journal;
            }
        }

        public async Task<bool> DeleteJournal(int id)
        {
            var data = await _context.Journals.FirstOrDefaultAsync(a => a.Id == id);
            if (data!=null)
            {
                _context.Journals.Remove(data);
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
