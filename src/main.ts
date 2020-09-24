import App from './app';
import './app.css';
import popup from './components/popup/popup';
import video from './components/video/video';

let list = document.querySelectorAll('#list li');

for(let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function() {
        let {url, title } = this.dataset;
        console.log(url, title)
        popup({
            width: '880px',
            height: '556px',
            title,
            pos: 'center',
            mask: true,
            closeMask: false,
            content(elem) {
                console.log(elem)
                video({
                    url,
                    elem,
                    autoplay: true
                })
            }
        });
    })
}