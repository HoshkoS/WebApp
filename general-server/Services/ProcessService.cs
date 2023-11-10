using Microsoft.EntityFrameworkCore;
using WebServer.Models;
using System.Diagnostics;

namespace WebServer.Services
{
    public interface IProcessService
    {
        Task StartProcess(long? taskId, CancellationToken cancel);
    }
    public class ProcessService : IProcessService
    {
        private readonly ApiDbContext _context;
        private int _result;
        private int _prev_result;
        private float _percentage;
        public ProcessService(ApiDbContext context)
        {
            _context = context;
            _prev_result = 0;
            _result = 1;
            _percentage = 0;
        }
        public Task StartProcess(long? taskId, CancellationToken cancel)
        {
            if (taskId != null)
            {
                var task = _context.ProcessTasks.FirstOrDefault(i => i.Id == taskId);
                if (task?.percentage < 100)
                {
                    task.startDate = DateTime.Now;
                    task.active = true;
                    _context.SaveChanges();
                    if (task?.percentage > 0)
                    {
                        _percentage = (int)task.percentage;
                        _prev_result = (int)task.previousResult;
                        _result = (int)task.result;
                    }

                    for (int i = 1 + (int)(_percentage / 100 * task.index); i < task.index; i++)
                    {
                        if (!cancel.IsCancellationRequested && task?.active == true && task?.percentage < 100)
                        {
                            Task.Delay(5000).Wait();
                            int help = _result + _prev_result;
                            _prev_result = _result;
                            _result = help;
                            task.percentage += 100.0 / task.index;
                            task.result = _result;
                            task.previousResult = _prev_result;
                            _context.SaveChanges();
                        }
                        else
                        {
                            task.active = false;
                            _context.SaveChanges();
                            return Task.CompletedTask;
                        }
                    }
                    Task.Delay(5000).Wait();

                    task.percentage = 100;
                    task.active = false;
                    task.endDate = DateTime.Now;
                    task.result = _result;
                    task.previousResult = _prev_result;
                    _context.SaveChanges();
                }
            }
            return Task.CompletedTask;
        }
    }
}
