using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;
using System.Text;

namespace WebServer.Utils
{
    public static class Hashing
    {
        public static string getHash(string text)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(text));
                return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
            }
        }
    }
}
