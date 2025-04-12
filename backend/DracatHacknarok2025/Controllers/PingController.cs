using Microsoft.AspNetCore.Mvc;

namespace DracatHacknarok2025.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get(string? data)
        {
            data ??= "Pong!";
            return Ok(data);
        }
    }
}
