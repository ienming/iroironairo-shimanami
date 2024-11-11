import { writeFile } from 'node:fs';

function callback() {
    console.log('success');
}

writeFile('message.txt', 'Hello Node.js', 'utf8', callback); 