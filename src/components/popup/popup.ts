// import './popup.css'/
const styles = require("./popup.css");
// import styles from './popup.css';

// 组件配置接口
interface Ipopup {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    content?: () => void;
}

// 模版接口,规范组件开发
interface Icomponent {
    tempContainer: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}

function popup(options: Ipopup) {
    return new Popup(options);
}

class Popup implements Icomponent {
    tempContainer;
    // 将形参转成对象属性: public || private 类修饰符
    constructor( private settings: Ipopup ) {
        this.settings = Object.assign({
            width: '100%',
            height: '100%',
            title: '',
            pos: 'center',
            mask: true,
            content: function() {}
        }, this.settings);
        this.init();
    }
    // 初始化
    init() {
        this.template();
    }
    // 创建模版
    template() {
        this.tempContainer = document.createElement('div');
        this.tempContainer.innerHTML = `
            <h1 class="${styles.popup}">hello</h1>
        `;
        document.body.appendChild(this.tempContainer);
    }
    // 事件操作
    handle() {

    }

}

export default popup