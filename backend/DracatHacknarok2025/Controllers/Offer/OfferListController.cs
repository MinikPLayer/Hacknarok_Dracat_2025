using DracatHacknarok2025.DB;
using DracatHacknarok2025.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DracatHacknarok2025.Controllers.Offer;

[ApiController]
[Route("/Offer/List")]
public class OfferListController(OfferDbContext offerDbContext) : ControllerBase
{
    private const int PageSize = 10;
    
    [HttpGet]
    public async Task<IActionResult> Get(int page = 1)
    {
        if (page < 1)
            return BadRequest("Page number must be greater or equal than 1.");
        
        var offerList = await offerDbContext.OfferEntries.Skip((page - 1) * PageSize).Take(PageSize).ToListAsync();
        if (offerList.Count == 0)
            return NotFound("No offers found.");
        
        return Ok(offerList);
    }
}