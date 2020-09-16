import App from './app';
import './app.css';
import popup from './components/popup/popup';

let list = document.querySelectorAll('#list li');

for(let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function() {
        let {url, title } = this.dataset;
        console.log(url, title)
        popup({});
    })
}