using Microsoft.AspNetCore.Mvc;

namespace DracatHacknarok2025.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PingController : ControllerBase
    {
        private const int MaxLength = 200;
        
        [HttpGet]
        public IActionResult Get(string? data)
        {
            data ??= "Pong!";
            
            if(data.Length > MaxLength)
                return BadRequest("Data length exceeds 5 characters.");
            
            return Ok(data);
        }
    }
}
