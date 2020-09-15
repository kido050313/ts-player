import App from './app';
import './app.css';

let list = document.querySelectorAll('#list li');

for(let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function() {
        let {url, title } = this.dataset;
        console.log(url, title)
    })
}