using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZenLogWEBAPI.DTO;
using ZenLogWEBAPI.Entities;
using ZenLogWEBAPI.Repository;

namespace ZenLogWEBAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalController : ControllerBase
    {
        private readonly IJournalRepository _journalRepository;
        public JournalController(IJournalRepository journalRepository)
        {
            _journalRepository = journalRepository;
        }

        /// <summary>
        /// Get Journal data by users and with filters 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="month"></param>
        /// <param name="year"></param>
        /// <param name="specificDate"></param>
        /// <returns></returns>
        [HttpGet("GetAllJournals/{userId}")]
        public async Task<IActionResult> GetAllJournals(
        int userId,
        [FromQuery] int offset = 0,
        [FromQuery] int limit = 10,
        [FromQuery] int? month = null,
        [FromQuery] int? year = null,
        [FromQuery] DateTime? specificDate = null)
        {
            var journals = await _journalRepository.GetAllJournals(userId, offset, limit, month, year, specificDate);
            return Ok(journals);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetMoods")]

        public async Task<IActionResult> GetMoods()
        {
            var moods = await _journalRepository.GetMoods();
            return Ok(moods);
        }

        /// <summary>
        /// Add or update journal
        /// </summary>
        /// <param name="journal"></param>
        /// <returns></returns>

        [HttpPost("AddOrUpdateJournal")]
        public async Task<IActionResult> AddOrUpdateJournal(JournalDTO journal)
        {
            var data = await _journalRepository.AddOrUpdateJournal(journal);
            return Ok(data);
        }

        [HttpDelete("DeleteJournal")]
        public async Task<IActionResult> DeleteJournal(int id)
        {
            var data = await _journalRepository.DeleteJournal(id);
            if (data)
            {
                return Ok(  );
            }
            return BadRequest(" delete data not found");
        }
    }
 
}
