import bcrypt from 'bcrypt';

console.log(await bcrypt.hash('password', 10));