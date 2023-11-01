using Microsoft.EntityFrameworkCore;
using WebServer.Models;

namespace WebServer.Services
{
    public interface IProcessService
    {
        Task StartProcess(long? taskId);
    }
    public class ProcessService : IProcessService
    {
        private readonly ApiDbContext _context;
        private int _result;
        private int _prev_result;
        public ProcessService(ApiDbContext context)
        {
            _context = context;
            _prev_result = 0;
            _result = 1;
        }
        public async Task StartProcess(long? taskId)
        {
            if (taskId != null)
            {
                var task = await _context.ProcessTasks.FirstOrDefaultAsync(i => i.Id == taskId);
                if (task?.percentage != 100)
                {
                    task.startDate = DateTime.Now;
                    task.active = true;
                    await _context.SaveChangesAsync();

                    for (int i = 1; i < task.index; i++)
                    {
                        await Task.Delay(5000);
                        int help = _result + _prev_result;
                        _prev_result = _result;
                        _result = help; 
                        task.percentage += 100/task.index;
                        task.result = _result;
                        task.previousResult = _prev_result;
                        await _context.SaveChangesAsync();
                    }
                    await Task.Delay(5000);

                    task.percentage = 100;
                    task.active = false;
                    task.endDate = DateTime.Now;
                    task.result = _result;
                    task.previousResult = _prev_result;
                    await _context.SaveChangesAsync();

                    await Task.CompletedTask;
                }
            }
        }
    }
}
