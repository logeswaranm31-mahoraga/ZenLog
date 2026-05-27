using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZenLogWEBAPI.DTO;
using ZenLogWEBAPI.Entities;

namespace ZenLogWEBAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalController : ControllerBase
    {
        private readonly Data.AppDbContext _context;
        public JournalController(Data.AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("GetAllJournals/{userId}")]
        public async Task<IActionResult> GetAllJournals(int userId)
        {
            var journals = await _context.Journals.Where(j => j.UserId == userId).Join(_context.Moods, j => j.MoodId, m => m.Id, (j, m) => new JournalEntryDTO
            {
                Id = j.Id,
                Content = j.Content,
                EntryDate = j.EntryDate,
                Title = j.Title,
                MoodId = j.MoodId,
                Mood = m.Emoji
            }).ToArrayAsync();
            return Ok(journals);
        }

        [HttpGet("GetMoods")]
        public async Task<IActionResult> GetMoods()
        {
            var moods = await _context.Moods.ToListAsync();
            return Ok(moods);
        }

        [HttpPost("AddOrUpdateJournal")]
        public async Task<IActionResult> AddOrUpdateJournal(JournalDTO journal)
        {
            if (journal.Id == 0)
            {
                Journal journalData = new Journal()
                {
                    Title = journal.Title,
                    Content = journal.Content,
                    EntryDate = journal.EntryDate,
                    MoodId = journal.MoodId,
                    UserId = journal.UserId
                };
                await _context.Journals.AddAsync(journalData);
                await _context.SaveChangesAsync();
                return Ok(journal);

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
                    return Ok(journal);

                }
                else
                {
                    return BadRequest("Data not Found");                
                }

            }
        }
    }
}
